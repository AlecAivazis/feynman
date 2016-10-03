###
    The missing SVG.toDataURL library for your SVG elements.
    originally by Samuli Kaipiainen ; edited and translated to coffeescript by Alec Aivazis

    Usage: SVGElement.toDataURL( type, { options } )

    Returns: the data URL, except when using native PNG renderer (needs callback).

    type    MIME type of the exported data.
            Default: image/svg+xml.
            Must support: image/png.
            Additional: image/jpeg.

    options is a map of options: {
        callback: function(dataURL)
            Callback function which is called when the data URL is ready.
            This is only necessary when using native PNG renderer.
            Default: undefined.

        [the rest of the options only apply when type="image/png" or type="image/jpeg"]

        renderer: "native"|"canvg"
            PNG renderer to use. Native renderer¹ might cause a security exception.
            Default: canvg if available, otherwise native.

        keepNonSafe: true|false
            Export non-safe (image and foreignObject) elements.
            This will set the Canvas origin-clean property to false, if this data is transferred to Canvas.
            Default: false, to keep origin-clean true.
            NOTE: not currently supported and is just ignored.

        keepOutsideViewport: true|false
            Export all drawn content, even if not visible.
            Default: false, export only visible viewport, similar to Canvas toDataURL().
            NOTE: only supported with canvg renderer.
    }

    See original paper¹ for more info on SVG to Canvas exporting.

    ¹ http://svgopen.org/2010/papers/62-From_SVG_to_Canvas_and_Back/#svg_to_canvas
###


jQuery = require('jquery')
_ = require('underscore')

# redefine original function as a jquery plugin
( ($) ->

    # define the function to compute the data string
    $.fn.toDataURL = (type, options) ->
        # add the given options to the default ones
        options = $.extend {}, $.fn.toDataURL.defaults, options

        # save a reference to the svg element
        _svg = this[0]

        ## secondary functions

        # how to handle debug messages
        debug = (string) ->
            # console.log "toDataURL: #{string}"


        # how to handle error messages
        error = (string) ->
            console.log "toDataURL ERROR : #{string} "


        # export the svg element to a data URL
        exportSVG = ->
            # serialize the svg element into an xml format
            xml = XMLSerialize(_svg)
            # convert the xml into the dataURL
            dataURL = base64dataURLencode(xml)
            # log the sucess
            debug("#{type} length: #{dataURL.length}")

            # if there is a defined callback
            if options.callback
                # call it
                options.callback(dataURL)

            # return the dataURL
            return dataURL


        # serialze an svg element into xml
        XMLSerialize = (svg) ->
            # define a helper function for IE9 where there is no XMLSerializer not
            # appropriate helper in the svg element....
            XMLSerializerForIE = (element) ->
                # the output
                out = ""
                # start the opening tag
                out += "<#{element.nodeName}"

                # for each attribute of the element
                for n in [0..element.attributes.length]
                    # add the necessary line to encode the attribute
                    out += " #{element.attributes[n].name}='#{element.attributes.value}'"

                # finish the opening tag
                out += ">\n"

                # if the element has children
                if element.hasChildNodes()
                    # add a new line to separate the parent from its children
                    for n in [0..element.childNodes.length]
                        # serialize the child and add it to the output
                        out += XMLSerializerForIE(element.childNodes[n])

                    # close the opening tag to encompass the children
                    out += "</#{element.nodeName}>"

                # return the output
                return out

            # if the window knows how to serialize the svg element
            if window.XMLSerializer
                # log that we are using the native serializer
                debug("using standard XMLSerializer.serializeToString")
                # serialize the svg element using the native serializer
                return (new XMLSerializer()).serializeToString(svg)
            # otherwise the window does not know how to serialize the svg element
            else
                # log that we are using our custom serializer
                debug("using custom XMLSerializerForIE")
                # serialize the svg element using the custom serializer
                return XMLSerializerForIE(svg)


        # encode a string in base64
        base64dataURLencode = (string) ->
            # the output starts with the header for base64 images
            b64 = "data:image/svg+xml;base64,"

            # if the window can do the conversion for us
            if window.btoa
                # log that we are converting to base64 using the native implementation
                debug("using window.btoa for base64 encoding")
                # add to the output
                b64 += btoa(string)
            # otherwise the browser does not support native base 64 encoding
            else
                # log that we are using a custom encoding
                debug("using custom base64 encoder")
                #  add the encoding to the output
                b64 += Base64.encode(string)


        # export the image to a raster version
        exportImage = (type) ->
            # grab a new canvas
            canvas = document.createElement("canvas")
            # and its context
            ctx = canvas.getContext('2d')

            # TODO: if (options.keepOutsideViewport), do some translation magic?
            # create an image to store the svg
            img = new Image()
            # serialize the svg
            xml = new XMLSerializer().serializeToString(_svg)
            # set the source of the image to the serial xml
            img.src = base64dataURLencode(xml)

            # when the image loads
            img.onload = ->
                # log that we have exported the image
                debug("exported image size: #{img.width}, #{img.height}")
                canvas.width = img.width
                canvas.height = img.height

                ctx.drawImage(img, 0, 0)

                # SECURITY_ERR WILL HAPPEN NOW
                dataurl = canvas.toDataURL(type)
                # register that it happened by displaying the length of the image
                debug("#{type} length: #{dataurl.length}")
                # if there is a callback, call it
                if (options.callback)
                    options.callback( dataurl )
                # otherwise tell them they just wasted our time
                else error("WARNING: no callback set, so nothing happens.")


            # if there is an error
            img.onerror = ->
                console.log(
                    "Can't export! Maybe your browser doesn't support " +
                    "SVG in img element or SVG input for Canvas drawImage?\n" +
                    "http://en.wikipedia.org/wiki/SVG#Native_support"
                )

            # NOTE: will not return anything
            return

        # export the svg element to an image using canvg
        exportImageCanvg = (type) ->

            # create an empty canvas to hold the image
            canvas = document.createElement("canvas")
            # grab its context in a 2d space
            ctx = canvas.getContext('2d')
            # serialize the svg element
            xml = XMLSerialize(_svg)

            # compare the two dimensions of the canvas to ensure that they are equal
            # NOTE: canvg gets the SVG element dimensions incorrectly if not specified as attributes
            debug("detected svg dimensions #{_svg.clientWidth}, #{_svg.clientHeight}")
            debug("canvas dimensions #{canvas.width}, #{canvas.height}")
            # save a local value of the option to keep elements outside the viewport
            keepBB = options.keepOutsideViewport
            # if it is true
            if (keepBB)
                debug("using a custom bounding box")
                # the padding for the bounding box
                padding = options.padding
                # save a reference to the bounding box
                width = parseInt($(_svg).attr('width')) - (2 * padding)
                height = parseInt($(_svg).attr('height')) - (2 * padding)
                x1 = parseInt($(_svg).attr('x1')) - padding
                y1 = parseInt($(_svg).attr('y1')) - padding

            # render the svg element using canvg
            # NOTE: this canvg call is synchronous and blocks
            canvg canvas, xml,
                ignoreMouse: true, ignoreAnimation: true
                offsetX: if keepBB then -x1 else undefined
                offsetY: if keepBB then -y1 else undefined
                scaleWidth: if keepBB then width else undefined
                scaleHeight: if keepBB then height else undefined
                useCORS: true
                renderCallback: () ->
                    debug("exported image dimensions #{canvas.width}, #{canvas.height}")
                    png_dataurl = canvas.toDataURL(type)
                    debug("#{type} length: #{png_dataurl.length}")

                    if (options.callback)
                        options.callback(png_dataurl)

            # return dataURL in addition to performing callback
            return canvas.toDataURL(type)


        ## main

        # if keepNonSafe is true then
        if (options.keepNonSafe)
            # tell them its not supported
            debug("NOTE: keepNonSafe is NOT supported and will be ignored!")
        # if they set keepOutsideViewport to true
        if (options.keepOutsideViewport)
            # warn that keepOutsideViewport is only supprted with canvg
            debug("NOTE: keepOutsideViewport is only supported with canvg exporter.")

        # perform the correct action for the designated type
        switch type
            # if they asked for svg
            when "image/svg+xml"
                return exportSVG()
            # if they asked for a raster image
            when "image/png", "image/jpeg"
                # if there is no renderer designated
                if not options.renderer
                    # use canvg if the window knows about it
                    if (window.canvg)
                        options.renderer = "canvg"
                    # otherwise use the native solutions
                    else
                        options.renderer="native"
                # perform the correct action depending on the designated renderer
                switch options.renderer
                    # if they specified canvg
                    when "canvg"
                        # log that we are using the canvg renderer to export the image
                        debug("using canvg renderer for png export")
                        # export the image using canvg
                        return exportImageCanvg(type)
                    # if they specified to use the native solution
                    when "native"
                        # log that we are using the native solution to render the image
                        debug("using native renderer for png export. THIS MIGHT FAIL.")
                        # export the image using the native solution
                        return exportImage(type)
                    # if they specified an unkown type
                    else
                        # log an error message
                        error("unknown png renderer given, doing noting (#{options.renderer})")
            # if they asked to export as an unknown type
            else
                # log an error message
                error("exporting as '" + type + "' is not supported!")


    # the default option values
    $.fn.toDataURL.defaults =
        type: "image/svg+xml"
        callback: undefined
        keepNonSafe: false
        keepOutsideViewport: false
        padding: 15
) jQuery

# end of file
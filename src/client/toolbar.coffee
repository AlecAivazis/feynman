# this file describes the angular app the runs alongside the snap.svg application
# to draw feynman diagrams
#
# author: alec aivazis

# external imports
angular = require('angular')
$ = require('jquery')
_ = require('underscore')
Cookie = require('js-cookie')
Handlebars = require("handlebars")
# local imports
Anchor = require('./Anchor')
CircularConstraint = require('./CircularConstraint')
Line = require('./Line')
Text = require('./Text')
UndoEntry = require('./UndoEntry')
UndoMulti = require('./UndoMulti')
overlay = require('./overlay').overlay

# create the angular module 
app = angular.module 'feynman', [ 'ui.slider', 'undo', 'feynman.colorpicker']

# define the controller for the properties menu
app.controller 'sidebar', ['$scope',  '$rootScope', '$timeout', ($scope, $rootScope, $timeout, $cookies) ->

  # load the cookie value
  $rootScope.showStartingPatterns = Cookie.get('feynmanCanvas_showStartingPatterns') == "true"

  # add event handler for element selection
  $(document).on 'selectedElement', (event, element) ->
    # clear the previous selection
    $(document).trigger('clearSelection')
    # and add the class to the selected element
    element.element.addClass('selectedElement')
  
    # figure out the type of the element
    if element.element.anchor
      type = 'anchor'
    else if element.element.line
      type = 'line'
    else if element.element.constraint
      type = 'circle'
    else if element.element.text
      type = 'text'

    # load the type of element
    $scope.type = type
    # load type specific attributes
    switch type
      when 'line'
        $scope.width = element.width
        $scope.labelDistance = element.labelDistance
        $scope.labelLocation = element.labelLocation
      when 'anchor'
        $scope.radius = element.radius
      when 'circle'
        $scope.radius = element.radius
      when 'text'
        $scope.text = element.text
    # load the type independent attributes
    $scope.color = element.color
    $scope.selectedElement = element
    # apply the change in angular since this is done in the jquery environment
    $scope.$apply()


  # add event handler for group selection
  $(document).on 'selectedGroup', (event, elements) ->
    $scope.selectedElements = elements
    $scope.$apply()


  # add event handle for clear selection
  $(document).on 'clearSelection', ->
    $scope.clearSelection()

  # add the event handler for deleting elements
  $(document).on 'removeSelectedElements', =>
    $scope.removeSelectedElements()


  # when the window resizes
  $(window).resize ->
    # refresh the grid
    refreshCanvas()


  refreshCanvas = ->
    $(document).attr('canvas').refresh()

  # prevent the inputs from triggering other keybindings
  $('input').on 'keyup', (event) ->
    # don't do anything else
    event.stopPropagation()
    # unless its a space
    if event.which == 32
      # then clear the state variable
      $(document).attr('canvas').spacebarPressed = false
    

  # store an object for the palette data
  paletteData = {}
    
  console.log('assinging')
  # load the canvas atrributes when snap is done loading
  $(document).on 'doneWithInit', ->
    console.log('done with init')
    canvas = $(document).attr 'canvas'
    $scope.gridSize = canvas.gridSize
    $scope.snapToGrid = canvas.snapToGrid
    $scope.showDiagramProperties = true
    $scope.hideAnchors = canvas.hideAnchors
    $scope.hideGrid = canvas.hideGrid
    $rootScope.title = canvas.title

    refreshCanvas()

    console.log('should be draggable')

    # add the drag handlers to the items on the pallet
    $('.paletteItem').draggable
      # use the image as the element that is dragged
      helper: 'clone'
      # at the beginning of the drag
      start: ->
        # compute the offset of the toolbar once
        paletteData.toolbarOffset = $('#toolbar').offset()
        paletteData.placedElement = false

        # save a reference to the element were dragging
        paletteData.draggedElement = $('.ui-draggable-dragging').eq(0)
        # figure out its type
        paletteData.type = paletteData.draggedElement.attr('element')
        # prevent the function from returning anything
        return
      # while the user is dragging
      drag: (event) ->
        # when the element gets outside of the toolbar
        if event.pageX < paletteData.toolbarOffset.left
          # if its the first time we have been past the toolbar
          if not paletteData.placedElement
            # grab the paper object from the canvas
            paper = $(document).attr('canvas').paper
            # compute the offset of the dragged element
            offset = paletteData.draggedElement.offset()
            
            # handle each type independently
            switch paletteData.type
              # when it is a line style
              when "fermion", "electroweak", "gluon", "dashed"
                # compute the lower left coordinates of the bounding box
                lowerLeft = canvas.getCanvasCoordinates(
                   offset.left - paletteData.draggedElement.width() - $('#sidebar').width(),
                   offset.top + paletteData.draggedElement.height() )
                # make an anchor at the lower left corner
                anchor1 = new Anchor(paper, lowerLeft.x, lowerLeft.y)
                # draw the anchor
                anchor1.draw()

                # compute the upper right coordinates of the bounding box
                upperRight = canvas.getCanvasCoordinates( offset.left - $('#sidebar').width() , offset.top )
                # create an anchor at the upper right coordinates
                anchor2 = new Anchor(paper, upperRight.x, upperRight.y)

                # make a line joining the two anchors with the appropriate style
                line = new Line(paper, anchor1, anchor2, style: paletteData.type)
              
                # draw the second anchor
                anchor2.draw()

                # select the newly created line
                $(document).trigger 'selectedElement', line
                paletteData.selectedElement = line
                # store the necessary data
                paletteData.anchor1 = anchor1
                paletteData.anchor2 = anchor2
                paletteData.anchor1_origin = lowerLeft
                paletteData.anchor2_origin = upperRight
                paletteData.mouse_origin =
                  x: event.pageX
                  y: event.pageY

              when 'text'
                # compute the coordinates on the canvas
                paletteData.origin = canvas.getCanvasCoordinates(
                     offset.left - $("#sidebar").width() - ( paletteData.draggedElement.width() / 2 ),
                     offset.top + (paletteData.draggedElement.height() / 2 ) )
                # create the text object at the appropriate coordinates
                paletteData.selectedElement = new Text(paper, paletteData.origin.x,
                                                              paletteData.origin.y, 'text!')
                # draw the text field
                paletteData.selectedElement.draw()

                # select the object
                $(document).trigger 'selectedElement', paletteData.selectedElement
              
              when 'circle'
                # compute the coordinates on the canvas
                paletteData.origin = canvas.getCanvasCoordinates(
                     offset.left - $("#sidebar").width() - ( paletteData.draggedElement.width() / 2 ),
                     offset.top + (paletteData.draggedElement.height() / 2 ) )
                paletteData.selectedElement = new CircularConstraint(paper,paletteData.origin.x,
                                                                           paletteData.origin.y,
                                                                           paletteData.draggedElement.height()/2)
                # draw the constraint
                paletteData.selectedElement.draw()
                # select the object
                $(document).trigger 'selectedElement', paletteData.selectedElement
                
            # prevent future drags from creating new elements
            paletteData.placedElement = true

          # move the selected element
          switch paletteData.type
            # when it is a line style
            when "fermion", "electroweak", "gluon", "dashed"
              # compute the change in mouse coordinates
              dx = (event.pageX - paletteData.mouse_origin.x)/canvas.zoomLevel
              dy = (event.pageY - paletteData.mouse_origin.y)/canvas.zoomLevel
              # move the first anchor by the same amount as the mouse moved
              paletteData.anchor1.handleMove(paletteData.anchor1_origin.x + dx,
                                             paletteData.anchor1_origin.y + dy)
              # move the second anchor by the same amount as the mouse moved
              paletteData.anchor2.handleMove(paletteData.anchor2_origin.x + dx,
                                             paletteData.anchor2_origin.y + dy)
            # when its an element by itself
            when "text", "circle"
              # move the selected element
              mouseCoords = canvas.getCanvasCoordinates(event.pageX - $('#canvas').offset().left , event.pageY)
              paletteData.selectedElement.handleMove(mouseCoords.x, mouseCoords.y)

          # hide the dragged element past the toolbar
          paletteData.draggedElement.hide()

        # the cursor is inside the toolbar
        else
          # if there is a selected element
          if paletteData.selectedElement
            # when its a line
            if paletteData.type in ["fermion", "electroweak", "gluon", "dashed"]
              # remove the two anchors
              paletteData.selectedElement.anchor1.remove()
              paletteData.selectedElement.anchor2.remove()

            # remove the selected element
            paletteData.selectedElement.remove()
            # clear the palette data associated with the created element
            paletteData.placedElement = false
            paletteData.selectedElement = undefined
            # clear the selection 
            $(document).trigger('clearSelection')

          # show the element from the toolbar
          paletteData.draggedElement.show()
  
          
      # the dragging of an element from the palette has stopped
      stop: (event) ->
        # if we let go with an element selected
        if paletteData.selectedElement
          # leave an appropriate undo element
          switch paletteData.type
            # when it is a line 
            when "fermion", "electroweak", "gluon", "dashed"
              # create an undo entry for this action
              undo = new UndoMulti('added line from palette')
              # save references to the selected data
              selectedElement = paletteData.selectedElement

              # perform the appropriate merges on both anchors and fill the undo entry
              performAnchorMergesFromPalette(selectedElement.anchor1, undo)
              performAnchorMergesFromPalette(selectedElement.anchor2, undo)

              # add the bits that happen regardless of potential merges
    
              # forward stack ressurects the line and draws both anchors to update the diagram
              undo.addToForwards selectedElement, (line) ->
                line.ressurect()
                line.draw()
      
              # backward stack removes the line and two anchors to finalize the undo
              undo.addToBackwards selectedElement , (line) ->
                line.remove()

              # save the entry to the stack
              undo.save()

            # when its a text field
            when 'text'
              new UndoEntry false,
                title: 'Added a text field to the canvas'
                data:
                  element: paletteData.selectedElement
                forwards: ->
                  @data.element.draw()
                backwards: ->
                  @data.element.remove()

            # when its a circular constraint
            when "circle"
              # check if any anchors needs to be constrained
              constrained = $(document).attr('canvas').checkAnchorsForConstraint(paletteData.selectedElement)
              # if any anchors were there
              if constrained.length > 0
                # go over each of the constrained anchors
                _.each constrained, (anchor) ->
                  # apply the constrain
                  anchor.addConstraint(paletteData.selectedElement)
                  # draw the anchor with the new constrain
                  anchor.draw()
                # register the new constraint with the undo stack
                new UndoEntry false,
                  title: 'created constraint for anchors'
                  data:
                    constraint: paletteData.selectedElement
                    anchors: constrained
                  backwards: ->
                    @data.constraint.remove()
                    # remove the constraint from the anchors
                    _.each @data.anchors, (anchor) ->
                      anchor.removeConstraint()
                      # draw the anchor with the updated constraint
                      anchor.draw()
                  forwards: ->
                    constraint = @data.constraint
                    constraint.ressurect()
                    constraint.draw()
                    # add the constraint to the anchors
                    _.each @data.anchors, (anchor) ->
                      anchor.addConstraint(constraint)
                      # draw the anchor with the new constraint
                      anchor.draw()

              # no anchors need constraining
              else
                # register the free constraint with the undo stack
                new UndoEntry false,
                  title: 'Added a circular constraint to the canvas'
                  data:
                    element: paletteData.selectedElement
                  forwards: ->
                    @data.element.draw()
                  backwards: ->
                    @data.element.remove()
        
        # clear the palette data so the next drag is fresh
        paletteData = {}

    # apply the changes we made
    $scope.$apply()



  # perform the necessary actions to merge an anchor and add them to an instance of UndoMulti
  performAnchorMergesFromPalette = (anchor, undo) ->
    # save a reference to the canvas
    canvas = $(document).attr('canvas')
    # check the anchor for merges
    onAnchor = canvas.isAnchorOnAnchor(anchor) 
    onLine = canvas.isAnchorOnLine(anchor) 
    onConstraint = canvas.isAnchorOnConstraint(anchor) 

    # if the anchor is not on a line (ie it was not replaced by something else)
    if not onLine
      # before we do anything else the forward action needs to ressurect the anchor
      undo.addToForwards anchor , (element) ->
        element.ressurect()
  
    # go through the checks and apply the necessary actions
    #
    # these actions should include a backwards function that undoes the
    # specific action but does not remove the anchors themselves and a
    # forwards function that applies the action in an undo safe way
              
    # check for potential anchor merges first 
    if onAnchor
      # merge anchor1 onto the other
      anchor = anchor.merge(onAnchor)

    else if onLine
      # split the line and merge anchor1 onto the split anchor
      split = onLine.split(anchor.x, anchor.y, false, anchor)
      # backwards action is to undo the merge and then the split
      undo.addToBackwards split, (data) ->
        data.originalLine.replaceAnchor(data.anchor, data.otherAnchor)
        data.otherAnchor.addLine(data.originalLine)
        data.line.remove()
        data.otherAnchor.draw()
        data.anchor.remove()

      # the forwards action is to perform the split with the elements
      undo.addToForwards split, (data) ->
        data.anchor.ressurect()
        data.originalLine.replaceAnchor(data.otherAnchor, data.anchor)
        data.otherAnchor.removeLine(data.originalLine)
        data.anchor.addLine(data.originalLine)
        data.line.ressurect()

      anchor = split.anchor

    else if onConstraint
      # apply the constraint to the anchor
      anchor.addConstraint(onConstraint)
      # draw the anchor with the new constraint
      anchor.draw()

      # the forwards action 
      undo.addToForwards
        anchor: anchor
        constraint: onConstraint
      # applies the constraint to the anchor
      , (data) ->
        data.anchor.addConstraint(data.constraint)

    # if the anchor was not replaced by one that already existed
    if not onAnchor
      # the backwards action 
      undo.addToBackwards anchor , (element) ->
        # removes the anchor from the canvas
        element.remove()

    # the forwards action 
    undo.addToForwards anchor, (element) ->
      # draws the anchor
      element.draw()

  
  # clear the selection
  $scope.clearSelection = ->
    # find every selected element
    _.each Snap.selectAll('.selectedElement'), (element) ->
      # only for anchors (ignore lines)
      if element.anchor
        # clear the group move flag
        element.anchor.moveAsGroup = false
      # and deselect it
      element.removeClass('selectedElement')

    # deselect the arrows
    _.each Snap.selectAll('.selectedArrow'), (element) ->
      element.removeClass("selectedArrow")

    # deselect the patterns aswell
    _.each Snap.selectAll('.selectedPattern'), (element) ->
      element.removeClass('selectedPattern')

    # deselect arrows
    _.each Snap.selectAll('.selectedArrow'), (element) ->
      element.removeClass('selectedArrow')
      
    # clear the angular selection
    $scope.selectedElement = false
    $scope.selectedElements = false
    # apply these changes to angular
    $scope.type = undefined
    # apply the changes to the angular application
    $scope.$apply()

  console.log('handlers-assigned')
  $(document).trigger('handlers-assigned')


  # align event element in the selected group align the given direction
  $scope.alignGroup = (direction) ->
    # grab the selected anchors
    selected = $scope.selectedElements.anchor
    # if they asked for a vertical alignment
    if direction == 'vertical'
      # that corresponds to aligning along the x axis
      attr = 'x'
    # if they asked for a horizontal alignment
    else if direction == 'horizontal'
      # that corresponds to aligning along the y axis
      attr = 'y'

    # compute the sum over the appropriate attribute
    sum = _.reduce selected, (runningTotal, element) ->
      return runningTotal + parseFloat(element[attr])
    , 0
    # the average is the total sum divided by the number of entries
    avg = sum / selected.length

    # store the origin so we can move back
    translate_data = []
    for element in selected
      translate_data.push
        element: element
        x: element.x
        y: element.y

    # perform the alignment in its own apply block
    $timeout ->
      new UndoEntry true,
        title: 'aligned vertices ' + direction + 'ly'
        data: [translate_data, attr, avg]
        forwards: ->
          _.each @data[0], (anchor) =>
            anchor.element.translate(@data[1], @data[2], false)
        backwards: ->
          _.each @data[0], (anchor) =>
            anchor.element.handleMove(anchor.x, anchor.y, false)
    , 0


  # go over every selected element and delete it along with creating an appropriate undo entry
  $scope.removeSelectedElements = ->

    # create an undo entry to accompany this action
    undo = new UndoMulti('removed element from canvas')

    # sort the selected elements so the ressurects maintain constraints
    selected = _.sortBy $(document).attr('canvas').getSelectedElements(), (element) ->
      # remove constraints before anchors so their references to anchors are maintained
      if element.constraint
        return 0
      else if element.anchor
        return 1
      else if element.line
        return 2

    # for each selected element
    _.each selected, (element) ->
      # if the element is an anchor
      if element.anchor
        # build the object for the undo actions
        undoData =
          anchor: element.anchor
          lines: element.anchor.lines

        # remove all of the lines
        _.each undoData.lines, (line) ->
          line.remove()
        # and the anchor
        undoData.anchor.remove()

        # add the necessary undo actions
        undo.addToBackwards undoData, (data) ->
          # ressurect the anchor
          data.anchor.ressurect()
          # ressurect each of the lines
          _.each data.lines, (line) ->
            line.ressurect()
          # draw the anchor
          data.anchor.draw()

        # add the necessary backwards action
        undo.addToForwards undoData, (data) ->
          # remove all of the lines
          _.each data.lines, (line) ->
            line.remove()
          # remove the anchor
          data.anchor.remove()

      # otherwise if its a constraint
      else if element.constraint
        # save the data that's necessary for the undo
        undoData =
          constraint: element.constraint
          anchors: element.constraint.anchors

        # remove the constraint from all of the anchors
        _.each undoData.anchors, (anchor) ->
          anchor.removeConstraint()
          # draw the anchor with the lack of constraint
          anchor.draw()
        # remove the constraint from the canvas
        undoData.constraint.remove()

        # the backwards action needs to ressurect the constraint and apply it to the anchors
        undo.addToBackwards undoData, (data) ->
          # ressurect the constraint
          data.constraint.ressurect()
          data.constraint.draw() 

          # go over all of the anchors
          _.each data.anchors, (anchor) ->
            # apply the constraint
            anchor.addConstraint(data.constraint)
            # draw the anchor with the new constraint
            anchor.draw()

        # the forwards action needs to remove the constraint and redraw the anchors
        undo.addToForwards undoData, (data) ->
          # remove the constraint from the anchors
          _.each data.anchors, (anchor) ->
            anchor.removeConstraint()
            # draw the anchors with the lack of constraint
            anchor.draw()
          # remove the constraint from the canvas
          data.constraint.remove()
          

      # otherwise if its a line
      else if element.line
        # save a reference to the line
        line = element.line
        # remove the line
        line.remove()

        # the forwards action needs to delete the line
        undo.addToForwards line, (element) ->
          element.remove()

        # the backwards action needs to ressurect the line and draw it
        undo.addToBackwards line, (element) ->
          element.ressurect()
          element.draw()
  
    # if the undo actually performs an action
    if undo.isValid()
      # apply it to the stack
      undo.save()

    # clear the selection
    $timeout ->
      $(document).trigger 'clearSelection'
    , 0


  # export the diagram in the designated format
  $scope.exportDiagram = (format) ->

    # save a reference to the svg element
    diagram = $('#canvas').clone()
    # remove the anchors and grid from the diagram
    $(diagram).find('.anchor, .grid').remove()

    # grab the bounding box of the document
    bb = $(document).attr('canvas').getDiagramBoundingBox()
    # set the dimensions of the svg element
    $(diagram).attr('width', bb.width)
    $(diagram).attr('height', bb.height)
    # set the offset variables of the svg element
    $(diagram).attr('x1', bb.x1)
    $(diagram).attr('y1', bb.y1)


    # export the diagram to the requested format
    switch format
      # if they asked for a png
      when "png"
        # convert the diagram to a png data url
        $(diagram).toDataURL "image/png",
          keepOutsideViewport: true
          callback: (data) ->
            # and save it as a named blob
            saveAs dataURLtoBlob(data), "diagram.png"
      # if they asked for the latex 
      when "latex"

        origin = 
          x: bb.x1
          y: bb.y1 + bb.height

        # save a copy of the grid size
        gridSize =  $(document).attr('canvas').gridSize

        doc = "\\begin{feynman}"

        # for each line in the diagram
        _.each $(document).attr('canvas').paper.lines, (line) ->
          # compute the location of anchor1 relative to the origin
          anchor1 = 
            x: (line.anchor1.x - origin.x)/50
            y: (line.anchor1.y - origin.y)/50

          # compute the location of anchor2 relative to the origin
          anchor2 = 
            x: (line.anchor2.x - origin.x)/50
            y: (line.anchor2.y - origin.y)/50

          defaultUnit = 
            label: "in"
            pt_value: 72.27

          # create the configuration parameters
          configuration = 
            color: line.color.substring(1).toUpperCase()
            endcaps: line.drawEndCaps
            flip: line.loopDirection == -1
            label: line.label
            labelDistance: (line.labelDistance/defaultUnit.pt_value).toFixed(2)
            labelLocation: line.labelLocation.toFixed(2)
            showArrow: line.drawArrow
            lineWidth: parseInt(line.width).toFixed(2) / 1.4


          # create the configuration line for the latex package
          config = [" #{entry[0]}=#{entry[1]}" for entry in _.pairs(configuration)].join(',').substring(1)
          # build the latex command to draw this element
          latexString = "<div class='exportLine'>&nbsp;&nbsp;&nbsp;&nbsp;\\#{line.style}[#{config}]{#{anchor1.x}, #{-anchor1.y}}{#{anchor2.x}, #{-anchor2.y}}</div>"
          # add the propagator to the latex document
          doc += latexString

        # close the latex diagram tag
        doc += "\\end{feynman}"

        # render the template for the latex view
        template = Handlebars.compile $('#exportLatex_template').html()
        # display the result in an overlay
        overlay template(docString: doc)

      # if they asked for an 
      when "svg"
        # convert the diagram to a png data url
        $(diagram).toDataURL "image/svg+xml",
          keepOutsideViewport: true
          callback: (data) ->
            console.log dataURLtoBlob(data)
            # and save it as a named blob
            #saveAs dataURLtoBlob(data), "diagram.svg"


  # update the properties of the appropriate element when we change the selectedElements 
  # the only reason to do this is because some attributes are not settable with foo.bar = 2
  # or we need to call the appropriate draw after the variable is reset

  $rootScope.$watch 'title', (newVal, oldVal) ->
    if $(document).attr 'canvas'
      $(document).attr('canvas').title = newVal

  $rootScope.$watch 'showStartingPatterns', (newVal, oldVal) ->
    Cookie.set('feynmanCanvas_showStartingPatterns', newVal)

  $scope.$watch 'snapToGrid', (newVal, oldVal) ->
    # grab the canvas
    canvas = $(document).attr 'canvas'
    # if it exists
    if $(document).attr 'canvas'
      # change the value of the object
      $(document).attr('canvas')['snapToGrid'] = newVal
      # redraw the canvas
      $(document).attr('canvas').draw()

  $scope.$watch 'gridSize', (newVal, oldVal) ->
    # grab the canvas
    canvas = $(document).attr 'canvas'
    # if it exists
    if $(document).attr 'canvas'
      # change the value of the object
      $(document).attr('canvas').gridSize = parseInt(newVal)
      # redraw the canvas
      $(document).attr('canvas').draw()

  $scope.$watch 'hideAnchors', (newVal, oldVal) ->
    if $(document).attr 'canvas'
      $(document).attr('canvas').hideAnchors = newVal
      $(document).attr('canvas').draw()
    
  $scope.$watch 'hideGrid', (newVal, oldVal) ->
    if $(document).attr 'canvas'
      $(document).attr('canvas').hideGrid = newVal
      $(document).attr('canvas').draw()

  $scope.$watch 'color', (newVal, oldVal) ->
    if $scope.selectedElement
      $scope.selectedElement.color = newVal
      if $scope.type in ['line', 'anchor', 'circle']
        $scope.selectedElement.draw()

  $scope.$watch 'groupAnchorColor', (newVal, oldVal) ->
    if $scope.selectedElements.anchor
      # if its the default value
      if parseInt(newVal) == -1
        return

      _.each $scope.selectedElements.anchor, (element) ->
        element.color = newVal
        element.draw()

  $scope.$watch 'groupSize', (newVal, oldVal) ->
    # go over every line
    if $scope.selectedElements.line
      # check that its a valid value
      if parseInt(newVal) == -1
        return
      # go over each of the lines
      _.each $scope.selectedElements.line, (element) ->
        # set the width
        element.width = parseInt(newVal)
        # draw the element
        element.draw()
      
  $scope.$watch 'groupLineColor', (newVal, oldVal) ->
    if $scope.selectedElements.line
      # if its the default value
      if parseInt(newVal) == -1
        return

      _.each $scope.selectedElements.line, (element) ->
        element.color = newVal
        element.draw()

  $scope.$watch 'groupCircleColor', (newVal, oldVal) ->
    if $scope.selectedElements.circle
      # if its the default value
      if parseInt(newVal) == -1
        return

      _.each $scope.selectedElements.circle, (element) ->
        element.color = newVal
        element.draw()

  $scope.$watch 'groupCircleRadius', (newVal, oldVal) ->
    if $scope.selectedElements.circle
      # if its the default value
      if parseInt(newVal) == -1
        return

      _.each $scope.selectedElements.circle, (element) ->
        element.radius = newVal
        element.draw()
        
  $scope.$watch 'radius', (newVal, oldVal) ->
    if $scope.selectedElement and $scope.type in ['anchor' ,'circle']
      $scope.selectedElement.radius = newVal
      $scope.selectedElement.draw()

  $scope.$watch 'selectedElement.text', (newVal, oldVal) ->
    if $scope.selectedElement and $scope.type == 'text'
      $scope.selectedElement.draw()


  $scope.$watch 'groupAnchorRadius', (newVal, oldVal) ->

    if parseFloat(newVal) < 0 or isNaN newVal
      return

    if $scope.selectedElements.anchor
      _.each $scope.selectedElements.anchor, (sAnchor) ->
        sAnchor.radius = newVal
        sAnchor.draw()

  $scope.$watch 'width', (newVal, oldVal) ->
    if $scope.selectedElement
      $scope.selectedElement.width = parseFloat(newVal)
      $scope.selectedElement.draw()

  $scope.$watch 'selectedElement.label', (newVal, oldVal) ->
    # we need to tell the element to redraw by hand to incorporate the new label 
    if $scope.selectedElement
      $scope.selectedElement.drawLabel()

  $scope.$watch 'selectedElement.style', (newVal, oldVal) ->
    if $scope.selectedElement
      $scope.selectedElement.draw()

  $scope.$watch 'selectedElement.loopDirection', (newVal, oldVal) ->
    if $scope.selectedElement
      $scope.selectedElement.draw()

  $scope.$watch 'selectedElement.labelPosition', (newVal, oldVal) ->
    if $scope.selectedElement and $scope.type == 'line'
      $scope.selectedElement.drawLabel()

  $scope.$watch 'selectedElement.drawArrow', (newVal, oldVal) ->
    if $scope.selectedElement and $scope.type == 'line'
      $scope.selectedElement.draw()

  $scope.$watch 'selectedElement.flipArrow', (newVal, oldVal) ->
    if $scope.selectedElement and $scope.type == 'line'
      $scope.selectedElement.draw()

  $scope.$watch 'selectedElement.drawEndCaps', (newVal, oldVal) ->
    if $scope.selectedElement
      $scope.selectedElement.draw()

  $scope.$watch 'labelDistance', (newVal, oldVal) ->
    if $scope.selectedElement and $scope.type == 'line'
      $scope.selectedElement.labelDistance = newVal
      $scope.selectedElement.drawLabel()

  $scope.$watch 'labelLocation', (newVal, oldVal) ->
    if $scope.selectedElement and $scope.type == 'line'
      $scope.selectedElement.labelLocation = parseFloat(newVal)
      $scope.selectedElement.drawLabel()

  $scope.$watch 'selectedElement.fixed', (newVal, oldVal) ->
    if $scope.selectedElement and $scope.type == 'anchor'
      $scope.selectedElement.draw()
    

]


# create a javascript blob out of the given dataURL
dataURLtoBlob = (dataURL) ->
    # the string indicating base 64
    BASE64_MARKER = ';base64,'
    # if the dataURL is not in base64
    if (dataURL.indexOf(BASE64_MARKER) == -1) 
        # splite the url into the various parts
        parts = dataURL.split(',')
        # grab the content type
        contentType = parts[0].split(':')[1]
        # and the raw data
        raw = decodeURIComponent(parts[1])
        # create a blob out of the data with thet appropriate content type
        return new Blob([raw], {type: contentType})
    
    # grab the parts of the base64 string
    parts = dataURL.split(BASE64_MARKER)
    # save a reference to the content type
    contentType = parts[0].split(':')[1]
    # decode the string
    raw = window.atob(parts[1])
    # save the string's length
    rawLength = raw.length
    # make a bit array for the string
    uInt8Array = new Uint8Array(rawLength)
    for i in [0..rawLength]
        # copy the character into the bit array
        uInt8Array[i] = raw.charCodeAt(i)

    # return a blob made out of the bit array
    return new Blob([uInt8Array], {type: contentType});


module.exports = toolbar
# end of file

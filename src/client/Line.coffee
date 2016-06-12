# this file describes a line object that is drawn between two Anchors
#
# author: alec aivazis

# external impotrs
$ = require('jquery')
_ = require('underscore')
# local imports
Anchor = require('./Anchor')
UndoEntry = require('./UndoEntry')

class Line

  element = null

  constructor: (@paper, @anchor1, @anchor2, style={}) ->
    @anchor1.addLine this
    @anchor2.addLine this
    # add this line to the papers list
    @paper.lines.push this

    # default values
    @style = if style.style then style.style else 'fermion'
    @width = if style.width then style.width else 2
    @color = if style.color then style.color else '#000000'
    @loopDirection = if style.loopDirection then style.loopDirection else  1
    @labelDistance = if style.labelDistance then style.labelDistance else  30
    @labelLocation = if style.labelLocation then style.labelLocation else  .5
    @drawArrow = if style.drawArrow then style.drawArrow else  false
    @drawEndCaps = if style.drawEndCaps then style.drawEndCaps else  true
    @flipArrow = if style.flipArrow then style.flipArrow else  false
    @label = if style.label then style.label else undefined

    @line = this


  # clone the anchor's settings to a new line attached to the given anchors
  clone: (anchor1, anchor2) =>
    line = new Line(@paper, anchor2, anchor1)
    # set the values for tgghge clone
    line.style = @style
    line.labelPosition = @labelPosition
    line.width = @width
    line.color = @color
    line.loopDirection = @loopDirection
    line.labelDistance = @labelDistance
    line.labelLocation = @labelLocation
    line.drawArrow = @drawArrow
    line.drawEndCaps = @drawEndCaps
    line.flipArrow = @flipArrow
    # return the clone
    return line


  # bring this element from the graveyard (undo  delete)
  ressurect: =>
    @anchor1.addLine this
    @anchor2.addLine this
    @paper.lines.push this
    return this


  # remove all references to this element
  remove: =>
    # hide this element
    @hide()
    # remove both of the references
    @anchor1.removeLine this
    @anchor2.removeLine this
    # remove this line from the paper's list
    @paper.lines =  _.without @paper.lines, this
    # remove the arrow as well
    @removeArrow()
    # and the label
    @removeLabel()


  # safely remove any elements on the DOM associated with this line
  hide: =>
    # if this line has already been drawn
    if @element
      # remove it
      @element.remove()
    # remove the label
    @removeLabel


  # remove this lines label from the DOM
  removeLabel: =>
    # if this line has a label
    if @labelElement
      @labelElement.remove()


  # delete all references to this object
  delete: =>
    @anchor1.removeLine this
    @anchor2.removeLine this
    @remove()


  # remove the arrow decoration
  removeArrow: =>
    # if the element exists
    if @arrow
      # remove it
      @arrow.remove()


  # draw the arrow decoration
  drawArrowElement: =>
    # remove the previously drawn arrow
    @removeArrow()

    # scale factor for the arrow
    A = 6 * @width/1.4

    # save a reference to the coordiantes of the first anchor
    anchor1 = @anchor1.getCoordinates()
    [x1, y1] = [anchor1.x, anchor1.y]
    # save a reference to the coordiantes of the second anchor
    anchor2 = @anchor2.getCoordinates()
    [x2, y2] = [anchor2.x, anchor2.y]

    # compute the lengths between the anchors
    dx = x1 - x2
    dy = y1 - y2
    # calculate the midpoint
    midx = (x1 + x2 ) / 2
    midy = (y1 + y2 ) / 2
    # store the common geometric factors in memory
    halfHeight = A * Math.sqrt(3) / 2
    halfBase = 3 * A / 4

    # create an svg element for the arrow at the origin
    @arrow = @paper.polygon([midx , midy-halfHeight,
                             midx+halfBase , midy+halfHeight,
                             midx-halfBase , midy+halfHeight ])
    # set the arrow to the same color as the line
    @arrow.attr
      fill: @color

    # add it to the diagram
    $(document).attr('canvas').addToDiagram @arrow

    # figure out the angle that this line needs to take
    # compute the alignment angle in degrees
    angle = Math.atan(dy/dx) * 180/Math.PI

    # check if we need to flip the arrow for consistency
    if dx >= 0
      # if we do then flip it
      angle += 180

    # add a little bit to accomodate the triangle's original orientation
    angle += 90

    # check if they want the arrow flipped
    if @flipArrow
      angle += 180

    # create a rotation matrix through that angle
    rotation = new Snap.Matrix().rotate(angle, midx, midy)
    # apply the transformation
    @arrow.transform(rotation)


    # add event handlers to the arrow element
    @arrow.drag @onDrag, @dragStart, @dragEnd
    # add the click event handler
    @arrow.node.onclick = (event)=>
      event.stopPropagation()
      $(document).trigger 'selectedElement', this


  # calculate the location for the label and then draw it
  drawLabel: =>

    # remove the previous label
    @removeLabel()

    # if theres no label defined
    if not @label
      # do nothing
      return

    # grab the label coordinates
    labelCoords = @getLabelCoordinates()
    # encode the label so we don't lose any characters
    labelEncoded = encodeURIComponent(@label)
    # create the element
    @labelElement = @paper.image("/latex?equation=#{labelEncoded}", labelCoords.x, labelCoords.y)
    # add it to the diagram
    $(document).attr('canvas').addToDiagram @labelElement

    # add the drag event handlers
    @labelElement.drag @labelDrag, @labelDragStart


  # prevent the drag event from propagating
  labelDragStart: (x , y, event) =>
    # prevent the drag event from propagating
    event.stopPropagation()
    # get the coordinsteas for the label
    @labelOrigin = @getLabelCoordinates()


  # move the label as you drag it around
  labelDrag: (deltaX, deltaY, x, y, event) =>
    event.stopPropagation()

    # grab the new coordinates for the label
    labelCoords =
      x: @labelOrigin.x + deltaX
      y: @labelOrigin.y + deltaY

    # compute the distance between the label and first anchor
    dx = labelCoords.x - @anchor1.x
    dy = labelCoords.y - @anchor1.y
    r = Math.sqrt(dx*dx + dy*dy)
    # save a reference to the distances between anchors
    anchorDx = @anchor2.x - @anchor1.x
    anchorDy = @anchor1.y - @anchor2.y
    m = anchorDy / anchorDx
    # compute the angle formed by the lengths
    theta = Math.atan2(dy, dx) + Math.atan2(anchorDy, anchorDx)
    if anchorDx < 0 or (anchorDx == 0 and anchorDy < 0)
      theta *= -1

    # set the label distance attributes
    @labelDistance = -1 * r * Math.sin(theta)
    #@labelLocation = r * Math.cos(theta) / (@anchor2.x - @anchor1.x)
    @labelLocation = r * Math.cos(theta) / Math.sqrt(anchorDx*anchorDx + anchorDy*anchorDy)

    # redraw the label at the new location
    @drawLabel()


  # map the local coordinate system to the catesian plane of the canvas
  getLabelCoordinates: =>
    # get the visual coordinates of the first anchor
    anchor1 = @anchor1.getCoordinates()
    [x1, y1] = [anchor1.x, anchor1.y]
    # get the visual coordinates of the second anchor
    anchor2 = @anchor2.getCoordinates()
    [x2, y2] = [anchor2.x, anchor2.y]

    # the distance to be from the line
    r = @labelDistance

    # calculate the midpoint
    midx = x1 + @labelLocation * (x2 - x1)
    midy = y1 + @labelLocation * (y2 - y1)

    # find the slope of the perpendicular line
    # m' = -1/m
    m = -(x1 - x2)/(y1 - y2)

    # the points that are perpedicular to the line a distance r away satisfy
    # y = mx
    # x^2 + y^2 = r

    x = Math.sqrt(r*r / (1 + (m*m)))
    y = m*x
    # add these values to the mid point for the appropriate center of the label
    # CAREFUL: these signs take into account the possible minus sign from midx/y calculation
    if m >= 0
      labelx = if r > 0 then midx - x else midx + x
      labely = if r > 0 then midy - y else midy + y
    else
      labelx = if r > 0 then midx + x else midx - x
      labely = if r > 0 then midy + y else midy - y

    # checked against horizontal lines
    if isNaN(labely)
      labely = midy - r

    coords =
      x: labelx
      y: labely


  # align an element along the line connecting the two anchors
  # assumes the element is horizontal before align for the purposes for scaling
  align: (element, width) =>

    # current x loc for path generation
    anchor1 = @anchor1.getLocation()
    x1 = anchor1.x
    y1 = anchor1.y
    anchor2 = @anchor2.getLocation()
    x2 = anchor2.x
    y2 = anchor2.y

    # compute the lengths between the anchors
    dx = x2 - x1
    dy = y2 - y1
    length = Math.sqrt(dx*dx + dy*dy)

    # figure out the angle that this line needs to take
    angle = Math.atan2(dy, dx) * 180/Math.PI

    # create the alignment matrix by scaling it to match the width
    # and then rotating it along the line joining the two anchors
    alignment = new Snap.Matrix().scale(length/width, length/width, x1, y1)
                                 .rotate(angle, x1, y1)

    # apply the transform and return the element
    element.transform(alignment)


  # replace instances of one anchor with another
  replaceAnchor: (replaced, replaces) =>
    if @anchor1 == replaced
      @anchor1 = replaces
    else if @anchor2 == replaced
      @anchor2 = replaces


  drawAsLine: =>
    # add the line to the dom
    anchor1 = @anchor1.getLocation()
    x1 = anchor1.x
    y1 = anchor1.y
    anchor2 = @anchor2.getLocation()
    x2 = anchor2.x
    y2 = anchor2.y
    @paper.path('M' + x1 + ',' + y1 + ' L' + x2 + ',' + y2)


  drawAsDashedLine: =>
    # do the same thing as the solid line
    @drawAsLine().attr
      # but with a dash array
      strokeDasharray: '10 '


  drawAsGluon: =>
    # the coordinates of the anchors
    anchor1 = @anchor1.getLocation()
    x1 = anchor1.x
    y1 = anchor1.y
    anchor2 = @anchor2.getLocation()
    x2 = anchor2.x
    y2 = anchor2.y
    # compute the length of the line
    dx = x1 - x2
    dy = y1 - y2
    length = Math.sqrt(dx*dx + dy*dy)

    # the width of the pattern
    scale = 10
    # the height of the pattern
    amplitude = if dx < 0 then scale else - scale

    # find the closest whole number of full periods
    loops = Math.round(length / scale / 2)
    # compute the length of the chain
    # do not modify because its passed to align
    chainLength = 2 * scale * loops

    # the current location
    cx = x1
    cy = y1
    # the top and bottom limits for the pattern
    ymin = cy
    ymax = cy - 2 * @loopDirection * amplitude
    # each segments advances the current location by this much
    dx = scale

    # start the path at the current x,y location
    pathString = "M #{cx} #{cy} "

    # if you asked for at least one loop
    if loops > 0
        # first half of the loop
        pathString += "C #{cx+2*scale} #{ymin} #{cx+2*scale} #{ymax} #{cx+dx} #{ymax} "
        # update the dx counter
        cx += dx
        # second half of the loop
        pathString += "S #{cx-scale} #{ymin} #{cx+dx} #{ymin} "
        # update the dx counter
        cx += dx
    # the distance was too short for a loop
    else
      # so draw it as a line instead
      return @drawAsLine()

    # the rest of the loops
    for cycle in [1...loops]
        # first half of the loop
        pathString += "S #{cx+2*scale} #{ymax} #{cx+dx} #{ymax} "
        # update the dx counter
        cx += dx
        # second half of the loop
        pathString += "S #{cx-scale} #{ymin} #{cx+dx} #{ymin} "
        # update the dx counter
        cx += dx

    # create the svg element
    element = @paper.path(pathString)
    # align along the line created by the anchors and return it
    @align(element, chainLength)


  drawAsGluonWithEndCaps: =>
    # the coordinates of the anchors
    anchor1 = @anchor1.getLocation()
    x1 = anchor1.x
    y1 = anchor1.y
    anchor2 = @anchor2.getLocation()
    x2 = anchor2.x
    y2 = anchor2.y

    # compute the length of the line
    dx = x1 - x2
    dy = y1 - y2
    length = Math.sqrt(dx*dx + dy*dy)

    # the width of the pattern
    scale = 10
    # keep the loops facing the right direction
    amplitude = if dx <= 0 then scale else - scale


    # find the closest whole number of full periods
    loops = Math.round(length / scale / 2) - 1
    # compute the length of the chain
    # do not modify because its passed to align
    chainLength = 2 * scale * (loops + 1)

    # the current location
    cx = x1
    cy = y1
    # the top and bottom limits for the pattern
    ymin = cy + @loopDirection * amplitude
    ymax = cy - @loopDirection * amplitude
    # each segments advances the current location by this much
    dx = scale

    # start the path at the current x,y location
    pathString = "M #{cx} #{cy} "

    # draw the left endcap
    pathString += "C #{cx+dx} #{cy} #{cx} #{ymin} #{cx+dx} #{ymin} "
    # update the dx counter
    cx += dx

    # if you asked for at least one loop
    if loops > 0
        # first half of the loop
        pathString += "C #{cx+2*scale} #{ymin} #{cx+2*scale} #{ymax} #{cx+dx} #{ymax} "
        # update the dx counter
        cx += dx
        # second half of the loop
        pathString += "S #{cx-scale} #{ymin} #{cx+dx} #{ymin} "
        # update the dx counter
        cx += dx
    # the distance was too short for a loop
    else
      # so draw it as a line instead
      return @drawAsLine()

    # the rest of the loops
    for cycle in [1...loops]
        # first half of the loop
        pathString += "S #{cx+2*scale} #{ymax} #{cx+dx} #{ymax} "
        # update the dx counter
        cx += dx
        # second half of the loop
        pathString += "S #{cx-scale} #{ymin} #{cx+dx} #{ymin} "
        # update the dx counter
        cx += dx

    # draw the right endcap
    pathString += "C #{cx+dx} #{ymin} #{cx} #{cy} #{cx+dx} #{cy} "

    # create the svg element
    element = @paper.path(pathString)
    # align along the line created by the anchors and return it
    @align(element, chainLength)


  drawAsGluino: =>
    # a gluino line is made up of a super imposed gluon and straight line
    # create the compound element as an svg group
    group = @paper.group()

    # draw the gluon element
    if @drawEndCaps
      group.add(@drawAsGluonWithEndCaps())
    else
      group.add(@drawAsGluon())

    # draw the straight line
    group.add(@drawAsLine())


  drawAsSfermion: =>
    # a sfermion is an em propagator superimposed on a straight line
     @paper.group(@drawAsEW(), @drawAsLine())


  drawAsEW: =>
    # the width of the pattern
    scale = 20
    # the height of the pattern
    amplitude = 3*scale/2
    # the coordinates of the anchors
    anchor1 = @anchor1.getLocation()
    x1 = anchor1.x
    y1 = anchor1.y
    anchor2 = @anchor2.getLocation()
    x2 = anchor2.x
    y2 = anchor2.y
    # compute the length of the line
    dx = x1 - x2
    dy = y1 - y2
    length = Math.sqrt dx*dx + dy*dy

    # find the closest whole number of full periods
    # do not modify because it is passed to align()
    loops = Math.round length/scale

    # the current x location
    cx = x1
    cy = y1
    # the upper and lower y coordinates for the anchors
    ymin = cy - @loopDirection * amplitude
    ymax = cy + @loopDirection * amplitude
    # start the path at the current (x,y) location
    pathString = "M #{cx} #{cy}"
    pathString += " C #{cx+scale/2} #{ymin} #{cx+scale/2} #{ymax} #{cx+scale} #{cy}"

    for i in [1...loops]
        cx += scale
        pathString += " S #{cx+scale/2} #{ymax} #{cx+scale} #{cy}"

    # create the svg element
    element = @paper.path(pathString)
    # align along the line created by the anchors
    @align(element, loops * scale)


  # draw the line on the DOM
  draw: =>
    # if this element was previously selected
    if @element and @element.hasClass('selectedElement')
      isSelected = true

    # if we're supposed to draw the arrow element
    if @drawArrow and @style in ['fermion', 'dashed']
      # do so
      @drawArrowElement()
      # if the line is selected
      if isSelected
        # add the appropriate class
        @arrow.addClass('selectedArrow')
    # we're not supposed to draw the arrow
    else
      @removeArrow()

    # clear any previous DOM elements
    @hide()
    # what is drawn changes on the style attribute
    switch @style
      when "fermion" then @element = @drawAsLine()
      when "dashed" then @element = @drawAsDashedLine()
      when "gluino" then @element = @drawAsGluino()
      when "electroweak" then @element = @drawAsEW()
      when "sfermion" then @element = @drawAsSfermion()
      when "gluon"
        @element = if @drawEndCaps then @drawAsGluonWithEndCaps() else @drawAsGluon()

    # apply the correct styling
    @element.attr
      stroke: @color
      strokeWidth: @width
      fill: 'none'

    # save a reference to the FC Line class wrapping it
    @element.line = this
    # add it to the diagram
    $(document).attr('canvas').addToDiagram @element

    if isSelected
      @element.addClass('selectedElement')

    # add the default line class
    @element.addClass('line')

    # on drag move
    @element.drag @onDrag, @dragStart, @dragEnd

    # add the click event handler
    @element.node.onclick = (event)=>
      event.stopPropagation()
      $(document).trigger 'selectedElement', this

    # draw the lines label
    @drawLabel()


  # when you start dragging a line
  dragStart: (x , y, event) =>
    event.stopPropagation()

    # not sure why you need this, should investigate
    @newAnchor = undefined

    selected = $(document).attr("canvas").getSelectedElements()

    # check if the alt key is being pressed
    if event.altKey

      # split the line at those coordinates
      splitx = if event.offsetX then event.offsetX else event.clientX - $(event.target).offset().left
      splity = if event.offsetY then event.offsetY else event.clientY - $(event.target).offset().top

      # create a node off of this one
      @newAnchor = @split(splitx, splity, true)

      # set the origin for the drag event
      @newAnchor.origin_x = @newAnchor.x
      @newAnchor.origin_y = @newAnchor.y

      # do nothing else
      return

    # if there were no elements selected before this or the element was not previously selected
    if selected.length == 0 or not @element.hasClass('selectedElement')
      # select this element
      $(document).trigger 'selectedElement', this

      @anchor1.origin_x = @anchor1.x
      @anchor1.origin_y = @anchor1.y
      @anchor2.origin_x = @anchor2.x
      @anchor2.origin_y = @anchor2.y
    else
      @isGroupMove = true
      $(document).trigger 'startMove'

    # remove the label of the line we are moving
    @removeLabel()


  onDrag: (dx, dy, x, y, event) =>
    event.stopPropagation()

    # if we made a new anchor with this mode
    if @newAnchor
      # move it
      @newAnchor.handleMove(@newAnchor.origin_x + dx, @newAnchor.origin_y + dy)
      # do nothing else
      return

    # if there is more than one selected element
    if @isGroupMove
      # tell the app to move all of the selected elements
      $(document).trigger 'moveSelectedElements', [dx, dy]
    else
      # we did not make a new anchor this drag
      # move the two anchors associated with this line
      @anchor1.handleMove(@anchor1.origin_x + dx, @anchor1.origin_y + dy)
      @anchor2.handleMove(@anchor2.origin_x + dx, @anchor2.origin_y + dy)


  dragEnd: =>
    @drawLabel()
    # check if we made a new anchor this drag
    if @newAnchor

      # grab the line before we merge
      newLine = @newAnchor.lines[0]

      # merge this anchor with
      onAnchor = $(document).attr('canvas').isAnchorOnAnchor(@newAnchor)
      # check if the new anchor was merged
      if onAnchor
        # merge the two anchors
        merged = @newAnchor.merge(onAnchor)
        # we can figure out the split anchor
        splitAnch = if newLine == @newAnchor then newLine.anchor2 else newLine.anchor1
        # the other line is the only line left if you remove me from the lines of the split anchor
        otherLine = _.without(splitAnch.lines, this)[0]
        # get the anchor from otherLine that isn't the splitAnch
        otherAnch = if otherLine.anchor1 == splitAnch then otherLine.anchor2 else otherLine.anchor1
        # get the anchor that is connected to this
        thisAnch = if this.anchor1 == splitAnch then this.anchor2 else this.anchor1

        # register the internal branch with the undo stack
        new UndoEntry false,
          title: 'created internal propagator as a branch'
          data: [merged, newLine, splitAnch, otherLine, otherAnch, this, thisAnch]
          # the forward action is to create a line branching off of this
          forwards: ->
            # remove this from the other anchor
            @data[4].removeLine @data[5]
            # resurrect the split anchor
            @data[2].ressurect()
            # while were doing it replace the otherAnch with the one we just made
            @data[5].replaceAnchor @data[4], @data[2]
            # ressurect the other line
            @data[3].ressurect()
            # ressurect the new line
            @data[1].ressurect()
            # draw the new anchor
            @data[2].draw()

          # the backwards action is to remove the line and undo the split
          backwards: ->
            # remove the elements that were created in the branch
            @data[1].remove()
            @data[2].remove()
            @data[3].remove()
            # before removing the midAnch, lets replace it with the otherAnch
            @data[5].replaceAnchor @data[2], @data[4]
            @data[4].addLine @data[5]
            @data[4].draw()

      # otherwise it was not merged
      else

        # we can figure out the split anchor
        splitAnch = if newLine == @newAnchor then newLine.anchor2 else newLine.anchor1
        # the other line is the only line left if you remove me from the lines of the split anchor
        otherLine = _.without(splitAnch.lines, this)[0]
        # get the anchor from otherLine that isn't the splitAnch
        otherAnch = if otherLine.anchor1 == splitAnch then otherLine.anchor2 else otherLine.anchor1
        # get the anchor that is connected to this
        thisAnch = if this.anchor1 == splitAnch then this.anchor2 else this.anchor1

        # check if the newAnchor was made on a constraint
        onConstraint = $(document).attr('canvas').isAnchorOnConstraint(@newAnchor)
        # if such a constraint exists
        if onConstraint
          # apply the constraint to the anchor
          @newAnchor.addConstraint(onConstraint)
          # draw the new anchor with the updated constraint
          @newAnchor.draw()
          # register this with the undo stack
          new UndoEntry false,
            title: 'added internal constrained propagator'
           data:
              newAnchor: @newAnchor
              constraint: onConstraint
              newLine: newLine
              splitAnchor: splitAnch
              otherLine: otherLine
              otherAnchor: otherAnch
              originalLine: this
              originalAnchor: thisAnch
            backwards: ->
              @data.newAnchor.removeConstraint()
              @data.otherLine.remove()
              @data.newAnchor.remove()
              @data.newLine.remove()
              @data.splitAnchor.remove()
              @data.otherAnchor.removeLine(@data.otherLine)
              @data.originalLine.replaceAnchor(@data.splitAnchor, @data.otherAnchor)
              @data.otherAnchor.addLine(@data.originalLine)
              @data.originalAnchor.draw()
            forwards: ->
              @data.newAnchor.ressurect()
              @data.newAnchor.draw()
              @data.otherAnchor.removeLine(@data.originalLine)
              @data.splitAnchor.ressurect()
              @data.originalLine.replaceAnchor(@data.otherAnchor, @data.splitAnchor)
              @data.splitAnchor.addLine(@data.originalLine)
              @data.otherLine.ressurect()
              @data.newLine.ressurect()
              @data.splitAnchor.draw()


        else
          # check if the newAnchor was made on a line
          onLine = $(document).attr('canvas').isAnchorOnLine(@newAnchor)
          # if such a line exists
          if onLine
            # save a reference to the internal line
            internalLine = @newAnchor.lines[0]
            # split the line at the anchor's location
            split = onLine.split(@newAnchor.x, @newAnchor.y)
            # merge the newAnchor with the one created by the split
            splitAnchor = split.anchor.merge(@newAnchor)
            splitLine = split.line

            # get the information for the anchor that was created first
            anchor1 =
              originalLine: this
              splitAnchor: if internalLine.anchor1 == splitAnchor then internalLine.anchor2 else internalLine.anchor1
              otherLine: otherLine
              otherAnchor: otherAnch

            anchor2 =
              originalLine: onLine
              splitAnchor: splitAnchor
              otherLine: splitLine
              otherAnchor: if splitLine.anchor1 == splitAnchor then splitLine.anchor2 else splitLine.anchor1

            # regsiter the double split with the undo stack
            new UndoEntry false,
              title: 'added internal propagator as a branch'
              data:
                anchor1: anchor1
                anchor2: anchor2
                line: internalLine
              backwards: ->
                @data.line.remove()
                # undo the split surrounding the split anchor created first
                @data.anchor1.originalLine.replaceAnchor(@data.anchor1.splitAnchor,
                                                         @data.anchor1.otherAnchor)
                @data.anchor1.otherAnchor.removeLine(@data.anchor1.otherLine)
                @data.anchor1.otherAnchor.addLine(@data.anchor1.originalLine)
                @data.anchor1.splitAnchor.remove()
                @data.anchor1.otherLine.remove()
                @data.anchor1.otherAnchor.draw()
                # do the same for anchor2
                @data.anchor2.originalLine.replaceAnchor(@data.anchor2.splitAnchor,
                                                         @data.anchor2.otherAnchor)
                @data.anchor2.otherAnchor.removeLine(@data.anchor2.otherLine)
                @data.anchor2.otherAnchor.addLine(@data.anchor2.originalLine)
                @data.anchor2.splitAnchor.remove()
                @data.anchor2.otherLine.remove()
                @data.anchor2.otherAnchor.draw()

              forwards: ->
                # redo the split
                @data.anchor1.splitAnchor.ressurect()
                @data.anchor1.originalLine.replaceAnchor(@data.anchor1.otherAnchor,
                                                         @data.anchor1.splitAnchor)
                @data.anchor1.splitAnchor.addLine(@data.anchor1.originalLine)
                @data.anchor1.otherLine.ressurect()
                # same thing for the second line
                @data.anchor2.splitAnchor.ressurect()
                @data.anchor2.originalLine.replaceAnchor(@data.anchor2.otherAnchor,
                                                         @data.anchor2.splitAnchor)
                @data.anchor2.splitAnchor.addLine(@data.anchor2.originalLine)
                @data.anchor2.otherLine.ressurect()
                # bring the internal line back
                @data.line.ressurect()
                # draw the two anchors
                @data.anchor1.splitAnchor.draw()
                @data.anchor2.splitAnchor.draw()

          # the anchor was not made on a line
          else
            # regsiter the creation of the branch with the undo stack
            new UndoEntry false,
              title: 'added branch to propagator'
              data: [@newAnchor, newLine, splitAnch, otherLine, otherAnch, this, thisAnch]
              # the forwards action is to fake the branch by bringing back the old elements
              forwards: ->
                # remove this from the other anchor
                @data[4].removeLine @data[5]
                # ressurect the newAnchor
                @data[0].ressurect()
                # ressurect the splitAnchor
                @data[2].ressurect()
                # while were at it replace other anchor with split anch in me
                @data[5].replaceAnchor @data[4], @data[2]
                # ressurect the newLine
                @data[1].ressurect()
                # ressurect the other anchorr
                @data[3].ressurect()
                # draw the anchors
                @data[0].draw()
                @data[2].draw()
                @data[4].draw()
              # the backwards removes everything and makes this back to what it was
              backwards: ->
                # remove the intermediate elements
                @data[0].remove()
                @data[1].remove()
                @data[2].remove()
                @data[3].remove()
                # before removing the midAnch, lets replace it with the otherAnch
                @data[5].replaceAnchor @data[2], @data[4]
                @data[4].addLine @data[5]
                @data[4].draw()

    # a new anchor was not created during this drag
    else
      # only continue if it was an actual move
      if @anchor1.x == @anchor1.origin_x and @anchor1.y == @anchor1.origin_y
        return

      if @isGroupMove
        # clean up the move
        $(document).trigger 'finalizeMove'
        # save a list of the selected elements
        selected = $(document).attr('canvas').getSelectedElements()
        # build the position data for the group of elements
        element_data = []
        # go over every selected element
        for selectedElement in selected
          if selectedElement.anchor
            feynElement = selectedElement.anchor
          else if selectedElement.constraint
            feynElement = selectedElement.constraint

          if not feynElement
            continue

          # check that we actually went somewhere
          if feynElement.x == feynElement.origin.x and feynElement.y == feynElement.origin.y
            return

          # save the important data
          element_data.push
            element: feynElement
            x: feynElement.x
            y: feynElement.y
            origin_x: feynElement.origin.x
            origin_y: feynElement.origin.y

        # register the move with the undo stack but do not waste the time performing it again
        new UndoEntry false,
          title: 'moved elements as a group'
          data: element_data
          # the forward action is to move the group to its current location
          forwards: ->
            _.each @data, (entry) ->
              if entry.element.anchor
                entry.element.anchor.handleMove entry.x, entry.y
              else
                entry.element.handleMove entry.x, entry.y
            $(document).attr('canvas').draw()
          # the backwards action is to move the group to the origin as defined when the drag started
          backwards: ->
            _.each @data, (entry) ->
              if entry.element.anchor
                entry.element.anchor.handleMove entry.origin_x, entry.origin_y
              else
                entry.element.handleMove entry.origin_x, entry.origin_y
            $(document).attr('canvas').draw()

      else
        # register the move on the undo stack
        new UndoEntry false,
          title: 'moved propagator'
          data: [@anchor1, @anchor1.x, @anchor1.origin_x, @anchor1.y, @anchor1.origin_y,
                 @anchor2, @anchor2.x, @anchor2.origin_x, @anchor2.y, @anchor2.origin_y]
        # the forwards action is to move both anchors to the stored location
          forwards: ->
            @data[0].handleMove(@data[1], @data[3])
            @data[5].handleMove(@data[6], @data[8])
          backwards: ->
            @data[0].handleMove(@data[2], @data[4])
            @data[5].handleMove(@data[7], @data[9])

    @newAnchor = undefined


  # return if the given coordiantes fall on the line joining the two anchors
  isLocationBetweenAnchors: (x, y) =>
    # compute the bounds of the rectangle
    lowerx = if @anchor1.x > @anchor2.x then @anchor2.x else @anchor1.x
    upperx = if @anchor1.x > @anchor2.x then @anchor1.x else @anchor2.x
    lowery = if @anchor1.y > @anchor2.y then @anchor2.y else @anchor1.y
    uppery = if @anchor1.y > @anchor2.y then @anchor1.y else @anchor2.y

    # check that the coordinates are within the bounds
    if x < lowerx or x > upperx or y < lowery or y > uppery
      return false

    # compute the slope of the line
    m = ( @anchor2.y - @anchor1.y ) / (@anchor2.x - @anchor1.x)

    # the distance from a point to a line is given by
    distance = Math.abs(m * x - y - m * @anchor1.x + @anchor1.y) / Math.sqrt(m*m + 1)

    # a point should be considered on the line if the distance is less than snapRange
    return distance <= @width + 3


  # create an anchor at the given coordinates and
  split: (x, y, createAttachedNode = false, mergeAnchor = undefined) =>

    # if the line is vertical
    if @anchor1.x == @anchor2.x
        anchorX = @anchor1.x
        anchorY = y
    # otherwise the line is not vertical
    else
        # find the closest point on the line to the requested point
        m = ( @anchor2.y - @anchor1.y ) / (@anchor2.x - @anchor1.x)
        anchorX = ( m * y + x + m * (m * @anchor1.x - @anchor1.y) ) / ( m*m + 1 )
        anchorY = ( m * ( x + m * y ) - (m * @anchor1.x - @anchor1.y) ) / (m*m + 1)

    # create the new elements
    AnchorClass = require("./Anchor")
    anch = new AnchorClass(@paper, anchorX, anchorY)
    # l = new Line(@paper, anch, @anchor1) # anchor1 is arbitrary
    l = @clone(anch, @anchor1) # anchor1 is arbitrary
    # remove this line from anchor1
    @anchor1.removeLine this
    # draw the other anchor to get the new line
    @anchor1.draw()
    # replace the other anchor with the newly created one
    @anchor1 = anch
    # add this line to the new anchor
    anch.addLine this
    # redraw me and the new anchor
    anch.draw()
    @draw()
    # if they told us to create a node off of the new one
    if createAttachedNode
      # split the created node with a line between
      return anch.split(true)
    # if they didn't tell use to create a new node
    else
      # return the newly created elements
      anchor: if mergeAnchor then anch.merge(mergeAnchor) else anch
      line: l
      originalLine: this
      otherAnchor: if l.anchor1 == anch then l.anchor2 else l.anchor1


  makeSelected: =>
    # add the selected element to the line
    @element.addClass('selectedElement')
    # if the arrow is being displayed
    if @arrow
      # add the selected class to it
      @arrow.addClass('selectedArrow')


module.exports = Line
# end of file
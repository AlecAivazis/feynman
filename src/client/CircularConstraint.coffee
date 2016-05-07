# this file represents a circular constraint object
# a circular constraint is a map from R2 to R2 that places (x,y) on
# the nearest point to a circle with r = {radius}
#
# author: alec aivazis

# external imports
$ = require('jquery')
_ = require('underscore')
# local imports
Anchor = require('./Anchor')
UndoEntry = require('./UndoEntry')

class CircularConstraint

  constructor: (@paper, @x, @y, @radius) ->
    @paper.constraints.push this
    @anchors = []
    @color = '#000000'
    @style = 'parton'


  draw: =>

    # if this element was previously selected
    if @element and @element.hasClass('selectedElement')
      isSelected = true

    # hide previous elements
    @hide()

    # draw the appropriate styled circle
    switch @style
      when 'parton' then @element = @drawAsParton(isSelected)
      # default behavior
      else
        @element = @drawAsParton(isSelected)


    # add the select event handler to the circle
    @element.node.onclick = (event)=>
      event.stopPropagation()
      $(document).trigger 'selectedElement', this

    # if the element was selected before redrawing
    if isSelected
      # add the class to the new element
      @element.addClass('selectedElement')

    @element.addClass('circle')

    # add the universal styles
    @element.attr
      stroke: @color
      strokeWidth: 2

    # set the back reference to this object
    @element.constraint = this

    # add it to the diagram group aswell
    $(document).attr('canvas').addToDiagram(@element)

    # add the event handlers
    @element.drag @onDrag, @dragStart, @dragEnd

    # draw each of the anchors
    _.each @anchors, (anchor) ->
      anchor.draw()
      # draw each of the anchors lines
      _.each anchor.lines, (line) ->
        line.draw()


  drawAsParton: (selected) =>
    # make the pattern
    @patternElement = pattern = @paper.path("M10-5-10,15M15,0,0,15M0-5-20,15").attr
        fill: "none"
        strokeWidth: 2

    # add the appropriate css class
    pattern.addClass('partonLines')
    # if the element was originally selected 
    if selected
      # add the appropriate class
        pattern.addClass('selectedPattern')

    # define the pattern from the path
    @pattern = pattern.pattern(0,0, 10, 10)

    # draw a regular circle centerd at the location
    element = @paper.circle(@x, @y, @radius)
    # style the circle
    element.attr
      fill: @pattern

    return element
    


  handleMove: (x, y) =>
    # set the instance variables
    @x = x
    @y = y
    # redraw
    @draw()


  constrain: (x , y) =>
    # compute the distances between the point and the center
    dx = x - @x
    dy = y - @y
    # and the slope of the line joining the two
    m = dy/dx 
    # calculate the distances from the origin
    translate =
      x: Math.sqrt(@radius*@radius / (1 + (m*m)))
      y: m * Math.sqrt(@radius*@radius / (1 + (m*m)))
    # apply the right translations in the appropriate quadrant
    if dx > 0 
      x: @x + translate.x
      y: @y + translate.y
    else if dx < 0
      x: @x - translate.x
      y: @y - translate.y
    else
      x: @x
      y: if dy >0 then @y + @radius else @y - @radius


  isPointInside: (x, y) =>
    dx = x - @x
    dy = y - @y
    return Math.sqrt(dx*dx + dy*dy) < @radius


  onDrag: (deltaX, deltaY, x, y, event) =>
    # compute the coordinates with the canvas transforms
    zoom = $(document).attr('canvas').zoomLevel
    # if the alt key was held
    if event.altKey 
      @targetAnchor.handleMove(@origin.x + deltaX/zoom, @origin.y + deltaY/zoom)
    # nothing was held down
    else
      $(document).trigger 'moveSelectedElements', [deltaX, deltaY] 


  dragStart: (x, y, event) =>
    # stop propagation
    event.stopPropagation()

    # grab the selected elements  
    selected = $(document).attr('canvas').getSelectedElements()

    # check if the alt key was held down
    if event.altKey
      coords = $(document).attr('canvas').getCanvasCoordinates(x - $("#canvas").offset().left, y)
      # create an anchor at the coordiantes
      @newAnchor = new Anchor(@paper, coords.x, coords.y)
      # constrain the anchor to the constraint
      @newAnchor.addConstraint(this)
      # draw the anchor with the new constraint
      @newAnchor.draw()
      # make a second anchor connected to this one
      @targetAnchor = @newAnchor.split(true)
      # set the origin
      @origin =
        x: coords.x
        y: coords.y

    # if there were no elements selected before this or the element was not previously selected
    if selected.length == 0 or not @element.hasClass('selectedElement')
      $(document).trigger 'selectedElement', this

    # go set up whatever we need for the move
    $(document).trigger 'startMove'
      

  dragEnd: =>
    # check if we are targetting an anchor
    if @targetAnchor
      # check for merges with other anchors
      onAnchor = $(document).attr('canvas').isAnchorOnAnchor(@targetAnchor)
      # if such a merge happened
      if onAnchor
        merged = @targetAnchor.merge(onAnchor)
        line = @targetAnchor.lines[0]
        # register it with the undo stack
        new UndoEntry false,
          title: 'created internal branch off of circular constraint'
          data:
            constraint: this
            otherAnchor: if line.anchor1 == merged then line.anchor2 else line.anchor1
            line: @targetAnchor.lines[0]
            newAnchor: merged
          backwards: ->
            @data.otherAnchor.remove()
            @data.line.remove()

          forwards: ->
            @data.otherAnchor.ressurect()
            @data.line.ressurect()
            @data.otherAnchor.draw()

      # no such merge happened
      else
        # check if the target anchor is on a line or constraint
        onLine = $(document).attr('canvas').isAnchorOnLine(@targetAnchor)
        onConstraint = $(document).attr('canvas').isAnchorOnConstraint(@targetAnchor)
        # if there is such a line
        if onLine
          # split the line at the anchor's location
          split = onLine.split(@targetAnchor.x, @targetAnchor.y)
          # merge the newly created anchor with the one we created earlier
          splitAnchor = split.anchor.merge(@targetAnchor)
          # save references to the other elements
          splitLine = split.line
          otherAnchor = if splitLine.anchor2 == splitAnchor then splitLine.anchor1 else splitLine.anchor2
          newLine = @targetAnchor.lines[0]
          # regsiter the line split with the undo stack
          new UndoEntry false,
            title: 'added a constrained branch'
            data:
              constraint: this
              constrainedAnchor: if newLine.anchor1 == splitAnchor then newLine.anchor2 else newLine.anchor1
              splitLine: splitLine
              otherAnchor: otherAnchor
              originalLine: onLine
              splitAnchor: splitAnchor
              newLine: newLine 
            backwards: ->
              @data.originalLine.replaceAnchor(@data.splitAnchor, @data.otherAnchor)
              @data.otherAnchor.addLine(@data.originalLine)
              @data.newLine.remove()
              @data.constrainedAnchor.remove()
              @data.splitAnchor.remove()
              @data.splitLine.remove()
              @data.otherAnchor.draw()
            forwards: ->
              @data.originalLine.replaceAnchor(@data.otherAnchor, @data.splitAnchor)
              @data.splitAnchor.ressurect()
              @data.splitAnchor.addLine(@data.originalLine)
              @data.splitLine.ressurect()
              @data.constrainedAnchor.ressurect()
              @data.newLine.ressurect()
              @data.splitAnchor.draw()
              @data.constrainedAnchor.draw()

        # if there is such a constraint
        else if onConstraint
          # add the new constraint to the anchor
          @targetAnchor.addConstraint(onConstraint)
          # draw the anchor with the new constraint
          @targetAnchor.draw()
          # grab a reference to the created line
          newLine = @targetAnchor.lines[0]
          # register the internal line with the undo stack
          new UndoEntry false,
            title: 'created internal propagator'
            data:
              constraint1: this
              constraint2: onConstraint
              anchor1: if newLine.anchor1 == @targetAnchor then newLine.anchor2 else newLine.anchor1
              anchor2: @targetAnchor
              line: newLine
            backwards: ->
              @data.anchor1.remove()
              @data.anchor2.remove()
              @data.line.remove()
            forwards: ->
              @data.anchor1.ressurect()
              @data.anchor1.draw()
              @data.anchor2.ressurect()
              @data.anchor2.draw()
              @data.line.ressurect()
              @data.line.draw()

        else
          # register the free branch with the undo stack
          new UndoEntry false,
          title: 'added branch to circular constraint'
          data:
            constraint: this
            line: @targetAnchor.lines[0]
            newAnchor: @targetAnchor
            otherAnchor: if @targetAnchor.lines[0].anchor2 == @targetAnchor then  @targetAnchor.lines[0].anchor1 else @targetAnchor.lines[0].anchor2
          backwards: ->
            @data.newAnchor.remove()
            @data.line.remove()
            @data.otherAnchor.removeConstraint()
            @data.otherAnchor.remove()
          forwards: ->
            @data.otherAnchor.ressurect()
            @data.newAnchor.ressurect()
            @data.line.ressurect()
            @data.otherAnchor.draw()
            @data.newAnchor.draw()


      # clear the anchor reference
      @targetAnchor = undefined
      return

    # see if any anchors need to be constrained
    constrained = $(document).attr('canvas').checkAnchorsForConstraint(this)
    constraint = this
    # if there are anchors that we constrained
    if constrained.length > 0
      # go over each of them
      _.each constrained, (anchor) ->
        # add the constraint
        anchor.addConstraint(constraint)
        # draw with the updated constraint
        anchor.draw()
      # register the move and constrain with the undo stack
      new UndoEntry false,
        title: 'moved circular constraint on top of anchors'
        data:
          anchors: constrained
          constraint: constraint
          origin: @origin
          newLoc:
            x: @x
            y: @y
        backwards: ->
          constraint = @data.constraint
          # go over each anchor
          _.each @data.anchors, (anchor) ->
            # remove the constraint
            anchor.removeConstraint(constraint)
            # draw without the constraint
            anchor.draw()
          # move the constraint back to the origin
          @data.constraint.handleMove(@data.origin.x, @data.origin.y)
        forwards: ->
          constraint = @data.constraint
          # move to the new location
          @data.constraint.handleMove(@data.newLoc.x, @data.newLoc.y)
          # go over each of the anchors
          _.each @data.anchors, (anchor) ->
            # apply the constraint
            anchor.addConstraint(constraint)
            # draw with the new constraint
            anchor.draw()
            

    else
      # save a list of the selected elements
      selected = $(document).attr('canvas').getSelectedElements()
      # if there is more than one element selected
      if selected.length > 0
        # clean up the move
        $(document).trigger 'finalizeMove'
       # build the position data for the group of elements
        element_data = []
        # go over every selected element
        for selectedElement in selected
          # save a reference to the appropriate element
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
          
      # check that we actually moved somewhere
      else if @x != @origin.x and @y != @origin.y
        # register the drag with the undo stack
        new UndoEntry false,
          title: "moved circular constraint"
          data:
            constraint: this
            origin: @origin
            newLoc:
              x: @x
              y: @y
          forwards: ->
            @data.constraint.handleMove(@data.newLoc.x, @data.newLoc.y)
          backwards: ->
            @data.constraint.handleMove(@data.origin.x, @data.origin.y)


  remove: =>
    # if the element exists on the canvas
    if @element
      # remove it
      @element.remove()
  
    @paper.constraints = _.without @paper.constraints, this


  # implement a ressurect function to conform to other element implementation
  ressurect: =>
    @paper.constraints.push this


  # remove svg elements associated with this constraint
  hide: =>
    # if there is an element element
    if @element
      # remove it
      @element.remove()
    # if there is a pattern
    if @pattern
      # remove it
      @pattern.remove()


  # add the necessary classes to make the element seemed selected
  makeSelected: =>
    @element.addClass('selectedElement')
    @patternElement.addClass('selectedPattern')


  # move the constraint to a specified location
  handleMove: (x,y) =>
    @x = x 
    @y = y
    @draw()


module.export = CircularConstraint

# end of file

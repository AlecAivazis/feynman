# this file describes the anchor class as needed by the online feynman diagram tool
# the anchor acts as the main structural element by providing two ends to connect
#
# author: alec aivazis

class Anchor

  element = null
  
  constructor: (@paper, @x, @y, @radius = 5, @snapRange = 5) ->
    @lines = []
    @paper.anchors.push this

    console.log @x, @y

    # default values
    @color = '#000000'
    @fixed = false


  # add a line to the list of connected elements
  addLine: (lines) =>
    # if they gave us an array
    if lines.length 
      for line in lines
        @lines.push line
    else
      @lines.push lines


  getLocation: =>
    if @constraint
      @constraint.constrain(@x, @y)
    else
      x: @x
      y: @y


  # update the anchor element on the user interface
  draw: =>
    # default status is not selected
    isSelected = false
    
    # if a element was previously defined
    if @element
      # and its selected
      if @element.hasClass('selectedElement')
        isSelected = true

      # remove it
      @element.remove()

    x = @x
    y = @y

    if @constraint
      coords = @constraint.constrain(@x, @y)
      x = coords.x
      y = coords.y

    # add the circle at the appropriate location with the on move event handler
    @element = @paper.circle(x, y, @radius).attr
      fill: if @color then @color else 'black'

    @element.anchor = this
    @element.addClass('anchor')
    # add the fixed class if necessary
    if @fixed
      @element.addClass('fixed')
    # if it was previously selected
    if isSelected
      # add the appropriate class
      @element.addClass('selectedElement')

    # if we're supposed to hide the anchors
    if $(document).attr('canvas').hideAnchors
      # add the hidden class
      @element.addClass('hidden')

    # set the drag handlers
    @element.drag @dragMove, @dragStart, @dragEnd
    # add the element to the diagram group
    $(document).attr('canvas').addToDiagram @element

    # when you click on the circle
    @element.node.onclick = =>
      event.stopPropagation()
      $(document).trigger 'selectedElement', this

    # update the associated lines after drawing the anchor
    _.each @lines, (line) ->
      line.draw()

      
  # at the end of the drag
  dragEnd: (x, y, event) =>
    # if we were making a new anchor
    if @newAnchor
      # then we are dragging it so target the new Anchor
      targetAnchor = @newAnchor
    # otherwise
    else
      # we are dragging this so target me
      targetAnchor = this

    # grab the lines before we potentially remove them by merging
    lines = targetAnchor.lines
    # check for merges around the targetAnchor 
    onAnchor = $(document).attr('canvas').isAnchorOnAnchor(targetAnchor)
    # if such an anchor exists
    if onAnchor
      # merge the two anchors
      merged = targetAnchor.merge(onAnchor)
      # grab the lines associated with the target anchor
      if @newAnchor
        # regsiter it with the undo stack
        new UndoEntry false,
          title: 'added internal propagator'
          data: [lines[0], this]
          # the forwards action is to show the line that was created
          forwards: ->
            @data[0].ressurect()
            @data[1].draw()
          # the backwards action is the hide that line
          backwards: ->
            @data[0].remove()

        # take away the newAnchor definition
        @newAnchor = undefined
      # there was no new anchor defined 
      else
        # we are merging a pre-existing anchor - register it with the undo stack
        new UndoEntry false,
          title: 'merged two vertices together'
          data: [targetAnchor, merged, lines, @origin.x, @origin.y]
          # the forwards action is to merge target anchor with compare
          forwards: ->
            @data[0].merge @data[1]
          # the backwards action is to remove all of targetAnchors lines from compare
          # and ressurect targetAnchor
          backwards: ->
            @data[1].removeLine(@data[2])

            # bring back the anchor 
            @data[0].ressurect()
            # add the lines back to it
            @data[0].addLine(@data[2])
            # go to each line
            _.each @data[2], (line) =>
              # change the anchor assignment back to targetAnchor
              line.replaceAnchor(@data[1], @data[0])

            # move the anchor back to its original place (ignoring the grid)
            @data[0].handleMove(@data[3], @data[4], false)
      @newAnchor = undefined
      return

    onConstraint = $(document).attr('canvas').isAnchorOnConstraint(targetAnchor)
    # if i am supposed to be a new anchor
    if @newAnchor == targetAnchor
      # check if there is a line under this anchor
      onLine = $(document).attr('canvas').isAnchorOnLine(@newAnchor)
      # if such a line exists
      if onLine
        # save a reference to the joining line for the new anchor
        newLine = @newAnchor.lines[0]
        # split that line at the location
        split = onLine.split(@newAnchor.x, @newAnchor.y)
        # and merge the new anchor with the one created
        splitAnchor = @newAnchor.merge(split.anchor)
        splitLine = split.line
        # save a reference to the other anchor
        otherAnchor = if splitLine.anchor2 == splitAnchor then splitLine.anchor1 else splitLine.anchor2
        # register the line creation and split with the undo stack
        new UndoEntry false,
          title: 'added internal propgator as a branch'
          data:
            originalLine: onLine
            splitAnchor: splitAnchor
            splitLine: splitLine
            otherAnchor: otherAnchor
            newLine: newLine
          forwards: ->
            @data.otherAnchor.removeLine @data.originalLine
            @data.originalLine.replaceAnchor @data.otherAnchor, @data.splitAnchor
            @data.splitAnchor.ressurect()
            @data.splitLine.ressurect()
            @data.newLine.ressurect()
            @data.splitAnchor.draw()
          backwards: ->
            @data.newLine.remove()
            @data.originalLine.replaceAnchor @data.splitAnchor, @data.otherAnchor
            @data.otherAnchor.addLine @data.originalLine
            @data.splitAnchor.remove()
            @data.splitLine.remove()
            @data.otherAnchor.draw()

      # if the anchor was created onto a constraint
      else if onConstraint
        # add the constraint to the anchor
        @newAnchor.addConstraint(onConstraint)
        # update the new anchor with the constraint
        @newAnchor.draw()
        # register it with the undo stack
        new UndoEntry false,
          title: 'created vertex constrained to circle'
          data:
            anchor: targetAnchor
            line: lines[0]
            constraint: onConstraint
          forwards: ->
            @data.anchor.ressurect()
            @data.line.ressurect()
            @data.anchor.draw()
          backwards: ->
            @data.anchor.remove()
            @data.line.remove()
      

      # otherwise this anchor was not created onto a line
      else
        # add the entry in the undo stack
        new UndoEntry false,
          title: 'created vertex at ' + targetAnchor.x + ',' +  targetAnchor.y
          data: [@paper, this, targetAnchor, lines[0]]
          forwards: ->
            # resurrect the anchor
            @data[2].ressurect()
            # resurrect the line
            @data[3].ressurect()
            # draw the anchor/line
            @data[2].draw()
            @data[3].draw()
          # backwards action is to remove the anchor and the line
          backwards: ->
            # remove the anchor
            @data[2].remove()
            # remove the line
            @data[3].remove()
  
    # grab the selected elements  
    selected = _.union(Snap.selectAll('.selectedElement.anchor').items,
                       Snap.selectAll('.selectedElement.circle').items)

    @newAnchor = undefined


    # make sure there is an element selected
    if selected.length == 0
      return

    # if there is only one anchor selected
    if selected.length == 1

      # check that we actually moved it
      if @x == @origin.x and @y == @origin.y
        return

      # check if the anchor was moved onto a line
      onLine = $(document).attr('canvas').isAnchorOnLine(this)
      if onLine

        split = onLine.split(@x, @y)
        # merge the split anchor with this one
        split.anchor.merge(this)
        splitLine = split.line
        otherAnchor = if splitLine.anchor2 == splitAnchor then splitLine.anchor1 else splitLine.anchor2

        new UndoEntry false,
          title: 'merged anchor with propagator'
          data:
            anchor: this
            originalLine: onLine
            splitLine: splitLine
            otherAnchor: otherAnchor
            splitAnchor: split.anchor
            coords:
              x: @x
              y: @y
            origin:
              x: @origin_x
              y: @origin_y
          forwards: ->
            @data.originalLine.replaceAnchor @data.otherAnchor, @data.anchor
            @data.splitLine.ressurect()
            @data.anchor.addLine @data.originalLine
            @data.anchor.handleMove(@data.coords.x, @data.coords.y)
          backwards: ->
            @data.originalLine.replaceAnchor @data.anchor, @data.otherAnchor
            @data.anchor.removeLine @data.splitLine
            @data.anchor.removeLine @data.originalLine
            @data.splitLine.remove()
            @data.anchor.handleMove(@data.origin.x, @data.origin.y)
            @data.otherAnchor.addLine @data.originalLine
            @data.otherAnchor.draw()

      # otherwise if the anchor was moved on a constraint
      else if onConstraint
        # add the constraint to the new target
        targetAnchor.addConstraint(onConstraint)
        # draw with the target with the new constraint
        targetAnchor.draw()
        # register the move with the undo stack
        new UndoEntry false,
          title: 'constrained vertex to circle'
          data:
            constraint: onConstraint
            anchor: targetAnchor
            origin:
              x: targetAnchor.origin_x
              y: targetAnchor.origin_y
            newLoc:
              x: targetAnchor.x
              y: targetAnchor.y
          backwards: ->
            # remove the constraint
            @data.anchor.removeConstraint()
            # move the anchor back to the origin
            @data.anchor.handleMove(@data.origin.x, @data.origin.y)
          forwards: ->
            # move the anchor
            @data.anchor.handleMove(@data.newLoc.x, @data.newLoc.y)
            #add the constraint
            @data.anchor.addConstraint(@data.constraint)
            # draw the anchor with the new constraint
            @data.anchor.draw()
        
      # otherwise the moved anchor was not on a line or constraint
      else
        # register the move with the undo stack but do not waste the time performing it again
        new UndoEntry false,
          title: 'moved vertex' 
          data: [@paper, targetAnchor, targetAnchor.x, targetAnchor.y,
                         targetAnchor.origin.x, targetAnchor.origin.y]
          # the forward action is to move to the current location
          forwards: ->
            @data[1].handleMove(@data[2], @data[3], false)
            # update various labels
            $(document).attr('canvas').draw()
          # the backwards action is to move to the origin as defined when the drag started
          backwards: ->
            @data[1].handleMove(@data[4], @data[5], false)
            # update various labels
            $(document).attr('canvas').draw()
        
    # there is more than one selected element
    else
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
        data: [element_data]
        # the forward action is to move the group to its current location
        forwards: ->
          _.each @data[0], (entry) ->
            if entry.element.anchor
              entry.element.anchor.handleMove entry.x, entry.y
            else
              entry.element.handleMove entry.x, entry.y

          # update the canvas
          $(document).attr('canvas').draw()

        # the backwards action is to move the group to the origin as defined when the drag started
        backwards: ->
          _.each @data[0], (entry) ->
            if entry.element.anchor
              entry.element.anchor.handleMove entry.origin_x, entry.origin_y
            else
              entry.element.handleMove entry.origin_x, entry.origin_y

          # update the canvas
          $(document).attr('canvas').draw()

    # draw any labels that need to be
    _.each _.compact(@lines), (line)->
      line.drawLabel()


  dragStart: (x, y, event) =>
    # check if there are multiple selected
    event.stopPropagation()

    # record the location before the drag
    @origin =
      x: @x
      y: @y

    # if the user is holding alt
    if event.altKey
      # clear the selection so we can eventually select the new anchor
      $(document).trigger 'clearSelection'
      # then create a new anchor attached to this one
      @newAnchor = @split true
      # and do nothing ele
      return
      
    # user is not holding alt
    
    # get a list of all of the selected elements
    selected = $(document).attr('canvas').getSelectedElements()

    # if there were no elements selected before this or the element was not previously selected
    if selected.length == 0 or not @element.hasClass('selectedElement')
      $(document).trigger 'selectedElement', this

    $(document).trigger 'startMove'


  dragMove: (dx, dy, mouse_x, mouse_y, event) =>
    event.stopPropagation()

    # if they are holding down the alt key
    if event.altKey
      # if a new anchor was created at the beginning
      if @newAnchor
        @newAnchor.handleMove @origin.x + dx, @origin.y + dy
      # the user pressed alt in the middle of the drag
      else
        @newAnchor = @split true
      
    # default case
    else
      $(document).trigger 'moveSelectedElements', [ dx, dy, event]


  # merge with another anchor by replacing all of my references with other
  merge: (other) =>
    # if were told to merge something with itself then our job is done
    if this == other
      return

    # go over all of the lines of the anchor
    _.each @lines, (line) =>
      # if the replaced anchor was anchor1 for this line
      if line.anchor1 == this
        # become anchor1
        line.anchor1 = other
      # if the replaced anchor was anchor2
      if line.anchor2 == this
        # assume the position
        line.anchor2 = other

      # add the line to their list
      other.addLine line

    # remove me from the DOM 
    @remove()
    # update all of their lines
    other.draw()
    # return the merged anchor
    return other


  remove: =>
    @element.remove()
    # remove this element from the papers list
    @paper.anchors =  _.without @paper.anchors, this
    # @lines = []
    if @constraint
      # save a reference to the constraint we were attached to
      @constrained = @constraint
      # remove the constraint
      @removeConstraint()


  ressurect: =>
    # add this anchor to the papers list
    @paper.anchors.push this
    # if the anchor was constrained when we removed it
    if @constrained
      # add the constraint to the anchor
      @addConstraint(@constrained)
    # @lines = []
    return this


  removeLine: (lines) =>
    # if they gave us a list
    if lines.length
      # go over every element in it
      for line in lines
        # and remove the line from the list
        @lines =  _.without @lines, line
    else
      @lines =  _.without @lines, lines


  # move in a single direction
  translate:  (attr, value, useGrid = true) =>
    if attr == 'x'
      @handleMove(value, @y, useGrid) 
    else if attr == 'y'
      @handleMove(@x, value, useGrid) 


  # snap the anchor to the nearest grid point
  snapToGrid: =>
    # move it to its current location using the grid
    @handleMove(@x, @y)


  addConstraint: (constraint) =>
    @constraint = constraint
    constraint.anchors.push this


  removeConstraint: =>
    @constraint.anchors = _.without @constraint.anchors, this
    @constraint = undefined


  handleMove: (x, y, useGrid = true) =>
    # if its fixed
    if @fixed
      # dont do anything
      return
       
    # grab the canvas grid size
    gridSize = $(document).attr('canvas').gridSize
    # if they want to snap everything to a grid
    if gridSize > 0 and not @constraint and useGrid
      # find the nearest point on the grid
      @x = Math.round(x/gridSize)*gridSize
      @y = Math.round(y/gridSize)*gridSize
    # if there is grid size
    else
      @x = x
      @y = y

    # update the ui element
    @draw()


  split: (connected) =>
    # create a new Anchor at this location
    anchor = new Anchor @paper, @x, @y
    anchor.draw()

    # if they wanted them to be connected
    if connected
      # create a line attached to the two anchors
      line = new Line @paper, this, anchor
      line.draw()

    # return the new anchor
    return anchor
  
     
  makeSelected: =>
    @element.addClass('selectedElement')


  # return the displayed coordinates of the anchor
  getCoordinates: =>
    # if there is a constraint 
    if @constraint
      # return the constrained coordinates
      @constraint.constrain(@x, @y)
    # otherwise there is no constraint
    else
      # return the unconstrained coordinates
      x: @x        
      y: @y


# end of file

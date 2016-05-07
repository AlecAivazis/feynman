# this file describes a customizable text field 
#
# author: alec aivazis

# external imports
$ = require('jquery')
# local imports
UndoEntry = require('./UndoEntry')

class Text

  constructor: (@paper, @x, @y, @text) ->
    

  draw: =>
    # if this element was previously selected
    if @element and @element.hasClass('selectedElement')
      isSelected = true

    # if the element was drawn before
    if @element
      # remove the element
      @remove()
      # if there is a selection box
      if @border
        # remove it
        @border.remove()
    
    # use an image from codecogs public api
    @element = @paper.image("/latex?isMath=False&equation=#{@text}" , @x, @y)
    # add it to the diagram group
    $(document).attr('canvas').addToDiagram(@element)

    # if the text object was previously selected
    if isSelected
      # add the appropriate class to the element
      @element.addClass('selectedElement')

    # add the select event handler to the circle
    @element.node.onclick = (event)=>
      event.stopPropagation()
      $(document).trigger 'selectedElement', this

    @element.addClass('text')

    # add the event handlers
    @element.drag @onDrag, @dragStart, @onDragEnd

    # add a reference to the text object
    @element.text = this


  handleMove: (x, y) =>
    # set the instance variables
    @x = x
    @y = y
    # redraw
    @draw()

  
  remove: =>
    # if an element has been created
    if @element  
      # remove the element if it exists
      @element.remove()

    # clear the element reference
    @element = undefined


  dragStart: (x, y, event) =>
    # stop propagation
    event.stopPropagation()
    # save the original location
    @origin =
      x: @x
      y: @y

    # select this element
    $(document).trigger 'selectedElement', this


  onDrag: (deltaX, deltaY, x, y, event) =>
    # compute the coordinates with the canvas transforms
    coords = $(document).attr('canvas').getCanvasCoordinates(@origin.x + deltaX,
                                                             @origin.y + deltaY)
    # move the text to the new coordinates
    @handleMove(coords.x, coords.y)


  onDragEnd: =>
    # check that we actually moved somewhere
    if @x != @origin.x and @y != @origin.y
      # register the drag with the undo stack
      new UndoEntry false,
        title: "moved text" 
        data:
          element: this
          origin: @origin
          newLoc:
            x: @x
            y: @y
        forwards: ->
          @data.element.handleMove(@data.newLoc.x, @data.newLoc.y)
        backwards: ->
          @data.element.handleMove(@data.origin.x, @data.origin.y)

module.exports = Text
# end of file

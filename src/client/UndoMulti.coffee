# this file represents an undo entry whose forward/backwards function traverses an array of 
# functions allowing for the dynamic construction of undo entries for the feynman diagram app
#
# author: alec aivazis

# external imports
$ = require('jquery')
_ = require('underscore')

class UndoMulti


  # take an object as an agrument to pass attribute values in a clean way
  constructor: (@title, @transparent = false) ->
    # instantiate the method stacks
    @forwardStack = []
    @backwardStack = []


  # finalize the undo transcation and add it to the stack
  save: =>
    # add the entry to the undo stack
    $(document).trigger 'addEntryToUndo', [@transparent, this]


  # add the specified function and its data to the forward stack
  addToForwards: (data, func) =>
    @forwardStack.push
      function: func
      data: data


  # add the specified function and its data to the backward stack
  addToBackwards: (data, func) =>
    @backwardStack.push
      function: func
      data: data


  # call all of the methods in the forwards stack
  forwards: =>
    # go over each entry in the stack
    _.each @forwardStack, (entry) ->
      entry.function(entry.data)


  # call all of the methods in the forwards stack
  backwards: =>
    # go over each entry in the stack
    _.each @backwardStack, (entry) ->
      entry.function(entry.data)


  # check wether or not both of the stacks have contents
  isValid: =>
    return @forwardStack.length > 0 and @backwardStack.length > 0


module.exports = UndoMulti
# end of file

# this file describes a class that provides scope for various undo actions in
# the feynman diagram drawing applcation
#
# author: alec aivazis

class UndoEntry

  # take an object as the argument and uses that for data then automatically
  # submit the entry to the undo stack
  constructor: (transparent, info = {}) ->
    # grab the data from the dictionary
    @backwards = info.backwards if info.backwards?
    @data = info.data if info.data?
    @forwards = info.forwards if info.forwards?
    @title = info.title if info.title?

    # add the entry to the undo stack
    $(document).trigger 'addEntryToUndo', [transparent, this]

# end of file

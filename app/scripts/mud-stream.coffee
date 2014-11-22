
class @MudStream

  constructor: ->
    @pushLineHookFunctions = []
    @childMudStreams = []

  pushLine: (clearTextLine, domLine) ->
    hookFunction clearTextLine, domLine for hookFunction in @pushLineHookFunctions
    child.pushLine clearTextLine, domLine for child in @childMudStreams
    null

  # hookFunction must have the same signature as pushLine()
  onPushLine: (hookFunction) ->
    @pushLineHookFunctions.add hookFunction
    null

  offPushLine: (hookFunction) ->
    @pushLineHookFunctions.delete hookFunction
    null

  addChild: (mudStream) ->
    @childMudStreams.add mudStream
    null

  removeChild: (mudStream) ->
    @childMudStreams.delete mudStream
    null

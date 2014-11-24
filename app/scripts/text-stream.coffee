
class @TextStream

  constructor: ->
    @pushLineHookFunctions = []
    @childTextStreams = []

  pushLine: (clearTextLine, domLine) ->
    hookFunction clearTextLine, domLine for hookFunction in @pushLineHookFunctions
    child.pushLine clearTextLine, domLine for child in @childTextStreams
    null

  # hookFunction must have the same signature as pushLine()
  onPushLine: (hookFunction) ->
    @pushLineHookFunctions.push hookFunction
    null

  offPushLine: (hookFunction) ->
    hookFunctionIndex = @pushLineHookFunctions.indexOf hookFunction
    @pushLineHookFunctions.splice hookFunctionIndex, 1 if hookFunctionIndex > -1
    null

  addChild: (textStream) ->
    @childTextStreams.push textStream
    null

  removeChild: (textStream) ->
    textStreamIndex = @childTextStreams.indexOf textStream
    @childTextStreams.splice textStreamIndex, 1 if textStreamIndex > -1
    null

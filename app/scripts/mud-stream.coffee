
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
    @pushLineHookFunctions.push hookFunction
    null

  offPushLine: (hookFunction) ->
    hookFunctionIndex = @pushLineHookFunctions.indexOf hookFunction
    @pushLineHookFunctions.splice hookFunctionIndex, 1 if hookFunctionIndex > -1
    null

  addChild: (mudStream) ->
    @childMudStreams.push mudStream
    null

  removeChild: (mudStream) ->
    mudStreamIndex = @childMudStreams.indexOf mudStream
    @childMudStreams.splice mudStreamIndex, 1 if mudStreamIndex > -1
    null

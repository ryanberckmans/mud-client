
class @BufferStream extends TextStream

  # Params - hash -
  #   Required. outputElement - the DOM element serving as a buffer to display stream contents
  constructor: (params={}) ->
    super
    @outputElement = params.outputElement
    @onPushLine @appendToBuffer.bind(this)

  appendToBuffer: (clearTextLine, domLine) ->
    @outputElement.appendChild domLine
    @outputElement.scrollTop = @outputElement.scrollHeight
    null


class @Lineizer
  unterminatedAnsiCodeRegex: /\x1B[^m]*$/
  
  constructor: ->
    @lines = []
    @buffer = null # if previous input contained a non-terminated Ansi code, it's stored here and will be prepended on the next input. By definition, buffer =~ /^\x1B[^m]*$/ or null

  # @param {String} rawText - expects to be utf8 encoded, newlines are '\n', no telnet codes, DOES contain ansi codes
  push: (rawText) ->
    newLines = rawText.split '\n'

    throw "expected newLines to be non-empty" if newLines.length < 1

    # @buffer is the tail-end of the previous rawText and must be prepended onto the first line
    if @buffer
      newLines[0] = @buffer + newLines[0]
      @buffer = null

    lastNewLine = newLines.pop()

    @lines.push newLine for newLine in newLines

    if lastNewLine.match @unterminatedAnsiCodeRegex
      @buffer = lastNewLine
    else
      @lines.push lastNewLine
    
    null

  # Returns the next complete line of input or null if there's no complete line available
  popLine: ->
    @lines.shift() # TODO - shift() is slow, @lines should be a Queue instead of Array

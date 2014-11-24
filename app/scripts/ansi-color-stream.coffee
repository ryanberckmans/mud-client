
class @AnsiColorStream extends TextStream
  
  # Params - hash -
  #     Required. renderClearTextLine - the function(String)->String to use for rendering one clearText line
  #     Required. renderDOMLine       - the function(String)->String to use for rendering one DOM line
  #     Required. ansiColorState      - the AnsiColorState object to store the color state of this stream
  constructor: (params={}) ->
    super
    @renderClearTextLine = params.renderClearTextLine
    @renderDOMLine   = params.renderDOMLine
    @ansiColorState  = params.ansiColorState

  # rawText - String - a utf8 string containing ansi color codes, newlines "\n", and printable characters
  pushRaw: (rawText) ->
    rawLines = rawText.split "\n"
  
    # skip rawLines[0] when it's the empty string.
    # Each MUD msg begins with a newline, causing rawLines[0] to be the empty string during regular play
    # Since each rawLines translates into a line of output, rawLines[0] inserts an unnecessary blank line
    @pushLine @renderClearTextLine(rawLines[0]), @renderDOMLine(@ansiColorState, rawLines[0]) if rawLines[0].length > 0

    # I'm using literal javascript here because this for loop is optimized for my use-case (thanks jsperf.com)
    `
    for(var i = 1, len = rawLines.length; i < len; ++i) {
      this.pushLine(this.renderClearTextLine(rawLines[i]), this.renderDOMLine(this.ansiColorState, rawLines[i]));  
    }
    `
    null

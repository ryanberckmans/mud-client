

# Public. Render the passed rawLine into clear text, suitable for user scripting
#
# rawLine - string containing only printable characters and well-formed ansi color codes, and no newlines
#
# Returns a string, rawLine with ansi codes stripped out
@renderClearTextLine = (rawLine) ->
  rawLine.replace /\x1B\[\d\d?m/g, ""

# Public. Render the passed rawLine into a DOM Object.
#
# ansiColorState - an instance of AnsiColorState representing current color as of the start of rawLine
# rawLine - string containing only printable characters and well-formed ansi color codes, and no newlines
#
# Returns a DOM object ready to display to the user (TODO - returns a html string right now)
@renderDOMLine = (ansiColorState, rawLine) ->
  # prepend renderAnsiColor.colorSpan() to re-open the current color
  renderAnsiColor.colorSpan(ansiColorState) + ansiColorParser.parse(escapeHtmlEntities(rawLine), {
      ansiColorState: ansiColorState
      renderAnsiColor: renderAnsiColor
    })

# Public. AnsiColorState must be instantiated by the client and passed to renderDOMLine.
# Clients should NOT modify AnsiColorState directly.
class @AnsiColorState
  constructor: ->
    @reset()

  # reset() this AnsiColorState to the default color. Sets isReset to true.
  # isReset is true if this AnsiColorState hasn't been modified since the last reset
  # Note that isReset only functions off reset(), and won't detect manual changes that appear to be a "reset"
  reset: ->
    @foregroundColor = RESET_FOREGROUND_COLOR
    @backgroundColor = RESET_BACKGROUND_COLOR
    @isBold = RESET_IS_BOLD
    @isReset = true
    @color = generateColor @foregroundColor, @backgroundColor, @isBold
    null

  setForegroundColor: (newForegroundColor) ->
    unless newForegroundColor == null
      @isReset = false
      @foregroundColor = newForegroundColor
      @color = generateColor @foregroundColor, @backgroundColor, @isBold
    @foregroundColor

  setBackgroundColor: (newBackgroundColor) ->
    unless newBackgroundColor == null
      @isReset = false
      @backgroundColor = newBackgroundColor
      @color = generateColor @foregroundColor, @backgroundColor, @isBold
    @backgroundColor

  setIsBold: (newIsBold) ->
    unless newIsBold == null
      @isReset = false
      @isBold = newIsBold 
      @color = generateColor @foregroundColor, @backgroundColor, @isBold
    @isBold


# ********************************
# Private below here
# ********************************

escapeHtmlEntities = (s) ->
  s.replace(/&/g, '&amp;')
   .replace(/"/g, '&quot;')
   .replace(/</g, '&lt;')
   .replace(/>/g, '&gt;')

generateColor = (foregroundColor, backgroundColor, isBold) ->
  s = foregroundColor + "_" + backgroundColor + "_bg"
  s += "_b" if isBold
  s

RESET_FOREGROUND_COLOR = "white"
RESET_BACKGROUND_COLOR = "black"
RESET_IS_BOLD = false

# renderAnsiColor functions return html for ansi color transitions
renderAnsiColor =
  colorSpan: (ansiColorState) ->
    "<span class='ansi_color_" + ansiColorState.color + "'>"

  changeColor: (ansiColorState) ->
    "</span>" + @colorSpan ansiColorState

  fgColorOn: (ansiColorState, foregroundColor) ->
    return "" if foregroundColor == ansiColorState.foregroundColor
    ansiColorState.setForegroundColor foregroundColor
    @changeColor ansiColorState

  bgColorOn: (ansiColorState, backgroundColor) ->
    return "" if backgroundColor == ansiColorState.backgroundColor
    ansiColorState.setBackgroundColor backgroundColor
    @changeColor ansiColorState

  boldOn: (ansiColorState) ->
    return "" if ansiColorState.isBold
    ansiColorState.setIsBold true
    @changeColor ansiColorState

  boldOff: (ansiColorState) ->
    return "" unless ansiColorState.isBold
    ansiColorState.setIsBold false
    @changeColor ansiColorState

  reset: (ansiColorState) ->
    return "" if ansiColorState.isReset
    ansiColorState.reset()
    @changeColor ansiColorState

ANSI_COLOR_PARSER_GRAMMAR = """
  {
    state  = options.ansiColorState
    render = options.renderAnsiColor
  }

  start
    = special:special start:start { return special + start; }
    / char:. start:start { return char + start; }
    / ""

  special
    = "\u001b[1m"  { return render.boldOn(state); }
    / "\u001b[22m" { return render.boldOff(state); }
    / "\u001b[0m"  { return render.reset(state); }
    / "\u001b[00m" { return render.reset(state); }
   // foreground colors
    / "\u001b[30m" { return render.fgColorOn(state,"black"); }
    / "\u001b[31m" { return render.fgColorOn(state,"red"); }
    / "\u001b[32m" { return render.fgColorOn(state,"green"); }
    / "\u001b[33m" { return render.fgColorOn(state,"yellow"); }
    / "\u001b[34m" { return render.fgColorOn(state,"blue"); }
    / "\u001b[35m" { return render.fgColorOn(state,"magenta"); }
    / "\u001b[36m" { return render.fgColorOn(state,"cyan"); }
    / "\u001b[37m" { return render.fgColorOn(state,"white"); }
   // background colors
    / "\u001b[40m" { return render.bgColorOn(state,"black"); }
    / "\u001b[41m" { return render.bgColorOn(state,"red"); }
    / "\u001b[42m" { return render.bgColorOn(state,"green"); }
    / "\u001b[43m" { return render.bgColorOn(state,"yellow"); }
    / "\u001b[44m" { return render.bgColorOn(state,"blue"); }
    / "\u001b[45m" { return render.bgColorOn(state,"magenta"); }
    / "\u001b[46m" { return render.bgColorOn(state,"cyan"); }
    / "\u001b[47m" { return render.bgColorOn(state,"white"); }
  """  

ansiColorParser = PEG.buildParser ANSI_COLOR_PARSER_GRAMMAR

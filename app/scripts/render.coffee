

# @param {String} rawLine - containing only printable characters and well-formed ansi color codes, and no newlines
@renderClearTextLine = (rawLine) ->
  rawLine.replace /\x1B\[\d\d?m/g, ""

# @param {String} rawLine - containing only printable characters and well-formed ansi color codes, and no newlines
@TBDrenderDOMLine = (rawLine) ->
  # TBD
  rawLine

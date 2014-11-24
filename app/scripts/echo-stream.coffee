
class @EchoStream extends TextStream

  # Params
  #    Required. jQuery - instance of jQuery
  constructor: (params={}) ->
    super
    @jQuery = params.jQuery

  # htmlText - String containing newlines, printable characters and other html, but not unprintable characters such as ansi color codes. Newlines must be "\n" and are rewritten as a prepended <br>. Any trailing newline is discarded.
  pushRaw: (htmlText) ->
    htmlTextLines = htmlText.split "\n"

    # If the last character in htmlText is "\n", we want to discard the last element in htmlTextLines,
    # since it's just an empty string. This has the same effect as htmlText.chomp() - no chomp() function exists in javascript
    htmlTextLines.pop() if htmlTextLines[htmlTextLines.length-1].length < 1

    len = htmlTextLines.length
    return if len < 1

    # the first line in an echo isn't prepended with <br>, 
    # this allows a user command to appear on the same line as the prompt
    domLine = @jQuery.parseHTML("<span class='echo_line echo_color'>" + htmlTextLines[0] + "</span>")[0];
    @pushLine "", domLine # TODO - Should EchoStream push clearText? How would this be used? Logging?    

    # subsequent echo lines, past the first, are prepended with <br>
    `
    for(var i = 1; i < len; ++i) {
      domLine = this.jQuery.parseHTML("<span class='echo_line echo_color'><br>" + htmlTextLines[i] + "</span>")[0];
      this.pushLine("",domLine);
    }
    `
    null

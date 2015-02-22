
CONTAINER_ID = "user-input"
FORM_ID = "user-input-form"
@INPUT_ID = "user-input-cli" # TODO, this global is used in mud-client.js. most things in mud-client.js, as well as inputGrammar, should be moved here.

# TODO construct the element with DOM api instead of setting innerHtml. process_client_input shouldn't be a global, rather closed over.
# This is first step in migrating user input logic from index.html into a library.
# Note: inline styles are temporary, should be moved to app.css once user-input code stabilizes.
CONTAINER_INNER_HTML = '
  <form autocomplete="off" id="' + FORM_ID + '"onsubmit="mud_client.process_client_input(); return false;" style="text-align: center;">
      <input id="' + INPUT_ID + '" type="text" value="" style="border: 1px solid #464646; width: 100%; padding: 5px;">
  </form>'

@setupUserInput = ->
  $('#' + CONTAINER_ID).html(CONTAINER_INNER_HTML)
  userInputElementjQuery = $('#' + INPUT_ID)  
  userInputElement = userInputElementjQuery[0]

  onKeyboardDownArrow = (evt) ->
    # TODO move cmd_history_down/up from mud_client.js
    if cmd_history_down.length > 0
      cmd_history_up.push userInputElement.value
      userInputElement.value = cmd_history_down.pop()
    else
      userInputElement.value = ""

  onKeyboardUpArrow = (evt) ->
    if cmd_history_up.length > 0
      cmd_history_down.push userInputElement.value
      userInputElement.value = cmd_history_up.pop()

  keyboardHandlers = ->
    userInputElementjQuery.keydown (evt) ->
      if evt.keyCode == '40' # down arrow
        evt.preventDefault()
        onKeyboardDownArrow evt
      else if evt.keyCode == '38' # up arrow
        evt.preventDefault()
        onKeyboardUpArrow evt
  
  userInputGUI = ->
    userInputElement.value = ""
    focusUserInput = -> userInputElementjQuery.focus()
    $('#' + FORM_ID).fadeIn 500, focusUserInput
    $(window).blur  focusUserInput
    $(window).click focusUserInput
  
  keyboardHandlers()
  userInputGUI()

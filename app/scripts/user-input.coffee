
CONTAINER_ID = "user-input"
FORM_ID = "user-input-form"
@INPUT_ID = "user-input-cli" # TODO, this global is used in mud-client.js. most things in mud-client.js, as well as inputGrammar, should be moved here.

# TODO construct the element with DOM api instead of setting innerHtml. cmd() shouldn't be a global, rather closed over. Also userInputHandler
# This is first step in migrating user input logic from index.html into a library.
# Note: inline styles are temporary, should be moved to app.css once user-input code stabilizes.
CONTAINER_INNER_HTML = '
  <form autocomplete="off" id="' + FORM_ID + '"onsubmit="userInputHandler(); return false;" style="text-align: center;">
      <input id="' + INPUT_ID + '" type="text" value="" style="border: 1px solid #464646; width: 100%; padding: 5px;">
  </form>'

cmdHistoryDown = []
cmdHistoryUp = []

userInputElement = null
userInputForm = null

cmdHistory = (userInput) ->
  if cmdHistoryDown.length > 0
    cmdHistoryUp.push userInput # resave the old copy of a historical cmd we're browsing

  while cmdHistoryDown.length > 1
    cmdHistoryUp.push cmdHistoryDown.pop() # save all the commands we scrolled through already
  
  cmdHistoryDown.pop() # never save the last cmd in down_arrow, because it is the transient command the user half-typed in. 
  
  if userInput.length > 0
    cmdHistoryUp.push userInput # save the current command unless its a simple return


# TODO when CONTAINER_INNER_HTML uses DOM API,
# userInputHandler should be closed over instead of a global.
# When it's closed over, move it inside setupUserInput()
@userInputHandler = ->
  cmdHistory(userInputElement.value)
  mud_client.cmd(userInputElement.value)
  userInputElement.value = "";

@setupUserInput = ->
  $('#' + CONTAINER_ID).html(CONTAINER_INNER_HTML)
  userInputElementjQuery = $('#' + INPUT_ID)
  userInputElement = userInputElementjQuery[0]

  onKeyboardDownArrow = (evt) ->
    if cmdHistoryDown.length > 0
      cmdHistoryUp.push userInputElement.value
      userInputElement.value = cmdHistoryDown.pop()
    else
      userInputElement.value = ""

  onKeyboardUpArrow = (evt) ->
    if cmdHistoryUp.length > 0
      cmdHistoryDown.push userInputElement.value
      userInputElement.value = cmdHistoryUp.pop()

  keyboardHandlers = ->
    # WTF is wrong with this line and key up/down?
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

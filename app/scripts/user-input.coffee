
USER_INPUT_CONTAINER_ID = "user-input"



@setupUserInput = ->
  userInputElementjQuery = $('#user_input')
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
    $("#user_input_form").fadeIn 500, focusUserInput
    $(window).blur  focusUserInput
    $(window).click focusUserInput
  
  keyboardHandlers()
  userInputGUI()

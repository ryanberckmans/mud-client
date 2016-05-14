
# main.coffee contains app instantiation (sometimes called wiring) and gratuitous use of globals
#
# All other code should use dependency injection and no globals

# RELAY_ENDPOINT points to where relay/relay.rb is listening for websocket connections
RELAY_ENDPOINT = "ws://localhost:12346"

fromMudAnsiColorStream = null
echoStream = null
socket = null

# -- BEGIN MASTER GLOBALS --
# CoffeeScript wraps this file in an anonymous function.
# Anything without a reference outside this file will be garbage collected.

unless @mud_client?
  throw "fatal: expected mud_client to already exist"

@mud_client.socket = socket

# -- END MASTER GLOBALS --

# -- BEGIN EXPORTED GLOBALS --
# These are globals declared in main.coffee and used by other components which don't have dependency injection yet

@send_to_mud = (msg) -> socket.send msg
@echo = (s) -> echoStream.pushRaw s

# -- END EXPORTED GLOBALS --

# Technically setupUI and setupUserInput should be linked somehow, since the user input form is a part of the UI.
# All user input stuff will eventually live in user-input.coffee. Not sure where other UI stuff will live,
# or how user-input.coffee will touch other stuff. user-input is already supposed to be completely
# self-contained, except for the passing of a div#id to setup the form on. app/index.html should contain
# no user input code, except <div id="user_input_div"></div>.
setupUI = ->
  onResize = ->
    $("#interface").height $(window).height() - 20
    $("#output").height $("#interface").height() - 50
  onResize()
  $(window).resize onResize

setupTextStreams = ->
  fromMudAnsiColorStream = new AnsiColorStream
    renderClearTextLine: renderClearTextLine
    renderDOMLine: renderDOMLine
    ansiColorState: new AnsiColorState()

  outputElement = $('#output')[0]

  mainBuffer = new BufferStream outputElement: outputElement

  fromMudAnsiColorStream.addChild mainBuffer

  echoStream = new EchoStream jQuery: $
  echoStream.addChild mainBuffer

setupSocket = ->
  onSocketOpen = ->
    setupUserInput()

  onSocketMessage = (evt) ->
    fromMudAnsiColorStream.pushRaw evt.data

  onSocketClose = ->
    echo "<p>Refresh page to reconnect \\o/</p>"

  onSocketError = (evt) ->
    echo "<p>WebSocket error: " + evt.data + "</p>"
    
  socket = new WebSocket RELAY_ENDPOINT
  socket.onopen = onSocketOpen
  socket.onmessage = onSocketMessage
  socket.onclose = onSocketClose
  socket.onerror = onSocketError

main = ->
  setupTextStreams()
  setupSocket()
  setupUI()

$(document).ready -> main()

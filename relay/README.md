
# Relay

Relay.rb accepts websocket connections from the MUD client and forwards them to the MUD Medievia.

# Running it

1. By default, relay.rb listens for websocket connections on localhost:12346. The mud client javascript must be hardcoded to point to relay.rb's endpoint.
2. `bundler exec ruby relay.rb`

# Sanitizing text sent from mud

Relay.rb sanitizes text sent from the mud:

* \r is stripped out
* unprintable telnet codes are stripped out.

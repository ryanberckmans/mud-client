
# Relay

Relay.rb accepts websocket connections from the MUD client and forwards them to the MUD Medievia.

# Installing dependencies

Relay.rb needs native extensions for eventmachine:

1. (on debian) `apt-get install ruby-dev`
2. `cd relay && bundle install --path vendor/bundle && bundle install`

# Configuring relay endpoint

By default, relay.rb listens for websocket connections on port 12346. The user's browser expects relay.rb on a hardcoded endpoint:

1. Create the file wm_client/js/ws-host.js with the line, `wshost = 'ws://server-running-relay-rb.com:12346';`

# Running

1. `bundler exec ruby relay.rb`

# Sanitizing text sent from mud

Relay.rb sanitizes text sent from the mud:

* \r is stripped out
* unprintable telnet codes are stripped out.

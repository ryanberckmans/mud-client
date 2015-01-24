
# Relay

Relay.rb accepts websocket connections from the MUD client and forwards them to the MUD Medievia.

# Installing dependencies

Relay.rb needs native extensions for eventmachine:

1. (on debian) `apt-get install ruby-dev`
1. (on OSX), install XCode command line tools which include 'ruby-dev' and possibly 'gem'
2. from mud-client root, `cd relay && bundle install --path vendor/bundle && bundle install`

# Configuring relay endpoint

By default, relay.rb listens for websocket connections on port 12346. The user's browser expects relay.rb on a hardcoded endpoint:

1. See `RELAY_ENDPOINT` in `app/scripts/main.coffee`

# Running

1. `bundle exec ruby relay.rb`

# Sanitizing text sent from mud

Relay.rb sanitizes text sent from the mud:

* \r is stripped out
* unprintable telnet codes are stripped out.

# mud-client

A web client for playing online multiplayer text games.

# Dependencies

## Build

mud-client uses [gulp.js](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md).

1. npm install --global gulp
2. npm install
3. gulp

## Deploy

1. run relay.rb on your server
2. `js/ws-host.js` must be set to the relay.rb server endpoint
3. deploy `dist/` to your webserver

# Origins

This client was originally forked from PHudBase.

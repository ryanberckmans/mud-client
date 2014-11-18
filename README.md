# mud-client

A web client for playing online multiplayer text games.

# Dependencies

## Build

mud-client uses [gulp.js](https://github.com/gulpjs/gulp).

1. npm install --global gulp
2. npm install
3. gulp

## Deploy

1. run `relay/relay.rb` on your server
2. `js/ws-host.js` must be set to the relay.rb server endpoint
3. deploy `dist/` to your webserver


# Mud text pipeline

WIP design. Not yet implemented.

How does MUD data get displayed in the player's browser? How does this work with modern mud client features, such as a 50k line scrollback, scripting, grepping, logging, teeing, etc.?

    MUD -> telnet data
    Scrubber -> utf8 text with ansi codes and no protocol
    Lineizer -> each_line() with ansi codes
    MudTextStream -> pairs of (clearLine, htmlLine)

## Mud

The MUD emits ascii-8bit encoded data containing ansi codes, telnet codes and content. By design, we don't support any telnet behavior and are only interested in colorized content.

## Scrubber

Transcode ascii-8bit to utf8. Fix newlines to '\n'. Strip telnet codes. Emits content and ansi codes encoded as utf8.

## Lineizer

Buffer unterminated ansi codes. Emits each_line(), content that's guaranteed to match /^$/. Each line contains well-formed ansi codes.

## MudTextStream

Convert ansi codes to css classes. Emit pairs of (clearLine,htmlLine), where clearLine is the clear-text, greppable/programmable version of the htmlLine intended to be displayed to the user. 

htmlLine converts ansi codes to css, escapes html entities and wraps each line in a <span>. Perhaps htmlLine should be parsed into htmlLineDom, so as to prevent child MudTextStreams from redundantly parsing the same line - a good configuration option.

Unlike Scrubber and Lineizer, the client is intended to use multiple MudTextStreams. MudTextStreams are composable and are intended to serve as a base type for filters.

MudTextStream api:

    pushRawLine(rawLine) // called by Lineizer
    
    addObserver(MudTextStream other) 
    removeObserver(MudTextStream other)

    pushLine(clearLine, htmlLine) // called by pushRawLine() and any MudTextStream this is observing


## Full Example

Consider a player with three client windows. A primary gameplay window, a window containing only auction messages, and a window containing only private messages. Let's walk through how this might work:

1. MUD emits "You hit the rabbit!\r\nAUCTION: a cheeseburger, minimum bid 100".
2. Scrubber cleans up the "\r\n" and transcodes to utf8.
3. Lineizer emits two lines, "You hit the rabbit!" and "AUCTION: a cheeseburger, minimum bid 100"
4. MudTextStream converts "You hit the rabbit!" into (clearLine="You hit the rabbit",htmlLine="<span><span class="color_fg_bb">You hit the rabbit!</span></span>") and similar for the auction line.
5. Both lines appear in the primary gameplay window.
6. The auction window, subclassing MudTextStream, only outputs lines matching /^AUCTION:/. It uses clearLine to compute this match, and then outputs the paired htmlLine.


# Origins

This client was originally forked from PHudBase.

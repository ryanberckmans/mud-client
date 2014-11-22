
@inputGrammar = """
start
  = cmd:cmd ";" start:start { return cmd.concat(start); }
  / cmd

cmd
  = "/" i:integer text:text { var cmds = []; for(;i>0;i--) cmds.push(text.trimLeft()); return cmds; }
  / "/call" ws host:token ws port:integer text { mud_client.chat.call( host, port ); return [null]; }
  / text:text { return [text]; }

integer
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

token
  = s:[^ \t;]+ { return s.join(""); }

ws
  = whitespace

whitespace
  = [ \t]+

text 
  = s:[^;]* { return s.join(""); }
"""

@outputGrammar = """
start
  = special:special start:start { return special + start; }
  / char:. start:start { return char + start; }
  / ""

special
  = "\u001b[1m"  { return mud_client.bold_on(); }
  / "\u001b[22m" { return mud_client.bold_off(); }
  / "\u001b[0m"  { return mud_client.reset(); }
  / "\u001b[00m" { return mud_client.reset(); }
 // foreground colors
  / "\u001b[30m" { return mud_client.fg_color_on("black"); }
  / "\u001b[31m" { return mud_client.fg_color_on("red"); }
  / "\u001b[32m" { return mud_client.fg_color_on("green"); }
  / "\u001b[33m" { return mud_client.fg_color_on("yellow"); }
  / "\u001b[34m" { return mud_client.fg_color_on("blue"); }
  / "\u001b[35m" { return mud_client.fg_color_on("magenta"); }
  / "\u001b[36m" { return mud_client.fg_color_on("cyan"); }
  / "\u001b[37m" { return mud_client.fg_color_on("white"); }
 // background colors
  / "\u001b[40m" { return mud_client.bg_color_on("black_bg"); }
  / "\u001b[41m" { return mud_client.bg_color_on("red_bg"); }
  / "\u001b[42m" { return mud_client.bg_color_on("green_bg"); }
  / "\u001b[43m" { return mud_client.bg_color_on("yellow_bg"); }
  / "\u001b[44m" { return mud_client.bg_color_on("blue_bg"); }
  / "\u001b[45m" { return mud_client.bg_color_on("magenta_bg"); }
  / "\u001b[46m" { return mud_client.bg_color_on("cyan_bg"); }
  / "\u001b[47m" { return mud_client.bg_color_on("white_bg"); }
"""

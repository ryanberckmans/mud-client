
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

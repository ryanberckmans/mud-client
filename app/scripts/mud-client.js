
var mud_client = {
  
  input_grammar: inputGrammar,
  input_parser: PEG.buildParser(inputGrammar),
  
  send: function(cmd) {
    echo(cmd.replace(/_hack_newline/g,"")); // echo
    send_to_mud(cmd);
  },
  
  // Process a cmd as if the user had typed it
  cmd: function(cmd) {
    var cmds = null;
    try {
      cmds = this.input_parser.parse(cmd);
    } catch (e) {
      alert("error parsing:" + cmd );
      cmds = [];
    }

    // TODO - commands should have "trim() called on them. No whitespace to left or right"
    // TODO - fix hack_newline crap and how it breaks pagination
    for ( var i=0; i < cmds.length ; i++ ) {
      if ( cmds[i] == null ) {
        cmds.splice(i,1);
        i--; // decrement i to account for element removal
      } else {
        if (cmds[i] == "") {
          cmds[i] = "_hack_newline";
        }
        cmds[i] += "\n";
      }
    }
    if ( cmds.length > 0 ) {
      this.send(cmds.join(""));
    }
	  
	  document.getElementById(INPUT_ID).value = "";
    return true;
  }
};

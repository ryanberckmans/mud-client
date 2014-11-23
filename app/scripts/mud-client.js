
$(document).ready(function() {
  var resizeUi = function() {
    $("#interface").height($(window).height() - 20);
    $("#output, #scroller, #right").height($("#interface").height() - 50);
  }
  resizeUi();
  $(window).resize(resizeUi);
});

var mud_client = {
  
  input_grammar: inputGrammar,
  input_parser: PEG.buildParser(inputGrammar),
  
  send: function(cmd) {
    echo(cmd.replace(/_hack_newline/g,"")); // echo
    send_to_mud(cmd);
  },
  
  process_client_input: function() {
    var input = document.getElementById("user_input").value;
    
    if (cmd_history_down.length > 0 ) {
      cmd_history_up.push(input); // resave the old copy of a historical cmd we're browsing
    }

    while ( cmd_history_down.length > 1 ) {
      cmd_history_up.push( cmd_history_down.pop()); // save all the commands we scrolled through already
    }
    cmd_history_down.pop(); // never save the last cmd in down_arrow, because it is the transient coomand the user half-typed in. 
    
    if (input.length > 0) {
      cmd_history_up.push(input); // save the current command unless its a simple return
    }
    
    var cmds = null;
    try {
      cmds = this.input_parser.parse(input);
    } catch (e) {
      alert("error parsing:" + input );
      cmds = [];
    }

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
	  
	  document.getElementById("user_input").value = "";
    return true;
  }
};

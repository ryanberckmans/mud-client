
var grammar = null
var parser = null;
$.get("grammar.txt", function(g) {
  grammar = g;
  parser = PEG.buildParser(grammar);
});
      
var mud_client = {
  
  send: function(cmd) {
    print(cmd, "#999"); // echo
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
      cmds = parser.parse(input);
    } catch (e) {
      alert("error parsing:" + input );
      cmds = [];
    }

    for ( var i=0; i < cmds.length ; i++ ) {
      cmds[i] += "\n";
    }
    this.send(cmds.join(""));
	  
	  document.getElementById("user_input").value = "";
    return true;
  },
};
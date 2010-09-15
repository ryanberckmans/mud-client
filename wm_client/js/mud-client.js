
$.get("input-grammar.txt", function(g) {
  mud_client.input_grammar = g;
  mud_client.input_parser = PEG.buildParser(g);
});

$.get("output-grammar.txt", function(g) {
  mud_client.output_grammar = g;
  mud_client.output_parser = PEG.buildParser(g);
});
      
var mud_client = {
  
  translate_color_codes: function(msg) {
    function match(m) {
      switch(m) {
      case "\u001b\[1m":   return mud_client.bold_on();
      case "\u001b\[22m":  return mud_client.bold_off();
      case "\u001b\[0m": return mud_client.reset();
      case "\u001b\[00m": return mud_client.reset();

      // foreground colors
      case "\u001b\[30m": return mud_client.color_on("black");
      case "\u001b\[31m": return mud_client.color_on("red");
      case "\u001b\[32m": return mud_client.color_on("green");
      case "\u001b\[33m": return mud_client.color_on("yellow");
      case "\u001b\[34m": return mud_client.color_on("blue");
      case "\u001b\[35m": return mud_client.color_on("magenta");
      case "\u001b\[36m": return mud_client.color_on("cyan");
      case "\u001b\[37m": return mud_client.color_on("white");

      default:
        alert("error matched a non-existent color code");
        return "";
      }
    }
    
    var re = /\u001b\[1m|\u001b\[22m|\u001b\[00?m|\u001b\[30m|\u001b\[31m|\u001b\[32m|\u001b\[33m|\u001b\[34m|\u001b\[35m|\u001b\[36m|\u001b\[37m/g;

    msg = msg.replace( re, match );

    return msg;
  },

  color: null,
  bold: false,
  
  color_on: function(color) {
    var s = "";
    
    if ( this.color == color ) {
      return s;
    }
    
    s += this.color_off();
    s += "<span class='tnc_" + color + "'>";
    this.color = color;
    
    return s;
  },
  
  color_off: function() {
    var s = "";
    if ( this.color ) {
      s = "</span>";
      this.color = null;
    }
    
    return s;
  },
  
  reset: function() {
    var s = "";
    s += this.color_off();
    s += this.bold_off();
    return s;
  },
  
  bold_on: function() {
    var s = ""
    if ( ! this.bold ) { 
      this.bold = true; 
      s = "<b>"; 
    }
    return s;
  },
  
  bold_off: function() {
    var s = "";
    if ( this.bold ) { 
      this.bold = false; 
      s = "</b>"; 
    }
    
    return s;
  },
  
  input_grammar: null,
  input_parser: null,

  output_grammar: null,
  output_parser: null,
  
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
      cmds = this.input_parser.parse(input);
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
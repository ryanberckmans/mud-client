
$.get("input-grammar.txt", function(g) {
  mud_client.input_grammar = g;
  mud_client.input_parser = PEG.buildParser(g);
});

$.get("output-grammar.txt", function(g) {
  mud_client.output_grammar = g;
  mud_client.output_parser = PEG.buildParser(g);
});
      
var mud_client = {
  
  input_grammar: null,
  input_parser: null,

  output_grammar: null,
  output_parser: null,

  fg_color: "white",
  bg_color: "black_bg",
  color: "white_black_bg",
  color_is_bold: false,
  bold: false,
  
  color_span: function() {
    var s = "";
    if ( this.color ) {
      s += "<span class='tnc_" + this.color;
      if ( this.bold ) {
        s += "_b"; 
      }
      s +="'>";
    }
    
    return s;
  },
  
  fg_color_on: function(color) {
    this.fg_color = color;
    return this.color_on( color + "_" + this.bg_color);
  },
  
  bg_color_on: function(color) {
    this.bg_color = color;
    return this.color_on( this.fg_color + "_" + color );
  },
  
  color_on: function(color) {
    var s = "";
    
    if ( this.color == color && this.color_is_bold == this.bold) {
      return s;
    }
    
    if ( this.color ) {
      s += "</span>";
    }

    this.color_is_bold = this.bold
    this.color = color;
    s += this.color_span();
    return s;
  },
  
  color_off: function() {
    var s = "";
    if ( this.color ) {
      s += "</span>";
      this.bg_color = "black_bg";
      this.fg_color = "white";
      this.color = this.fg_color + "_" + this.bg_color;
    }
    return s;
  },
  
  bold_on: function() {
    var s = ""
    this.bold = true;
    if ( this.color && !this.color_is_bold ) {
      this.color_is_bold = true;
      s += "</span><span class='tnc_" + this.color + "_b'>";
    }
    return s;
  },
  
  bold_off: function() {
    var s = ""
    this.bold = false;
    if ( this.color && this.color_is_bold ) {
      this.color_is_bold = false;
      s += "</span><span class='tnc_" + this.color + "'>";
    }
    return s;
  },

  reset: function() {
    var s = "";
    this.bold = false;
    s += this.color_off();
    return s;
  },
  
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
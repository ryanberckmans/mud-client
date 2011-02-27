
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
    this.color_is_bold = false;
    if ( this.color ) {
      s += "</span>";
      this.bg_color = "black_bg";
      this.fg_color = "white";
      this.color = this.fg_color + "_" + this.bg_color;
    }
    s += this.color_span(); // all text is wrapped in <span>, so use span for reset colors
    return s;
  },
  
  send: function(cmd) {
    print(cmd); // echo
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
        cmds[i] += "\n";
      }
    }
    if ( cmds.length > 0 ) {
      this.send(cmds.join(""));
    }
	  
	  document.getElementById("user_input").value = "";
    return true;
  },
  
  chat: {
    connections: {},
    chat_name: "NotYetSet",
    
    call: function(host, port) {
      try {
      if( this.connections[host] ) {
        print ("chat connection to " + host + " already exists\n");
        return;
      }
      
      print("initiating chat connection to " + host + ":" + port + "\n");
      
      var socket = null;
      try {
        socket = new WebSocket("ws://127.0.0.1:4050/" + host + "/" + port);
        this.connections[host] = { socket: socket };
      } catch (e) {
        print ("error opening chat socket to " + host + " " + port);
      }
      
	    socket.onopen = function() {
        print("socket opened");
        mud_client.chat.connected(host);
      }
	    
	    socket.onmessage = function(evt) {
			  mud_client.chat.handshake(host,evt.data);
	    }
      
      socket.onclose = function(evt) {
        mud_client.chat.disconnect(host);
      }      
      
      socket.onerror = function(evt) {
        mud_client.chat.disconnect(host);
      }
        
      } catch(e) {
        print ("/call error: " + e);
      }
    },
    
    handshake: function(host,msg) {
      if ( ! this.connections[host] ) {
        return;
      }
      if ( msg.match('/NO/') ) {
        print("chat connection to " + host + " denied by them\n");
      } else {
        print("handshake yes msg" + msg);
      }
    },
    
    connected: function(host) {
      if ( ! this.connections[host] ) {
        return;
      } 
      this.connections[host].connected = true;
      print("chat connection to " + host + " established\n");
      this.connections[host].socket.send("CHAT:"+this.chat_name+"\n000.000.000.000999  ");
    },
    
    message: function(host, msg) {
      print(host + " chats: " + msg);
    },
    
    disconnect: function(host) {
      if ( ! this.connections[host] ) {
        return;
      } 
      print (this.connections[host].socket.readyState ) ;
      if ( ! this.connections[host].connected ) {
        print("chat connection to " + host + " failed\n");
      } else {
        print("chat connection to " + host + " lost\n");
      }
      this.connections[host] = null;
    },
  }, // end mud_client.call
};

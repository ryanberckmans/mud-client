
// Temporary home for MudMaster chat code which is a work-in-progress and not used
{
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
  }
}

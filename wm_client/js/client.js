/*******************************************************************************************************************
 * 
 * This work is licensed under the Creative Commons Attribution 3.0 United States License. 
 * To view a copy of this license, visit http://creativecommons.org/licenses/by/3.0/us/ or 
 * send a letter to Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
 * 
 *******************************************************************************************************************/

var socket;
var conn_div;
var m_conn_div;

var next_del;

var stopped;
var logging = false;
var output_mouse_over = false;
var smooth_scroll = false;

var h_pct, h_raw, m_pct, m_raw, e_pct, e_raw, w_pct, w_raw, nl_pct, nl_raw;

var m_nw, m_n, m_ne, m_e, m_se, m_s, m_sw, m_w, m_up, m_down, m_in, m_out;

var map;

// Change this as necessary //
var wshost = "ws://noric.org:12346/server/server.php";

var mudhost;
var mudport;

var scrollback, prevent_autoscroll=false;

$(document).ready(function(){		    
	conn_div = document.getElementById('connection_ws');
	m_conn_div = document.getElementById('connection_mud');	
	
	m_nw = document.getElementById("m_nw");
	m_n = document.getElementById("m_n");
	m_ne = document.getElementById("m_ne");
	m_e = document.getElementById("m_e");
	m_se = document.getElementById("m_se");
	m_s = document.getElementById("m_s");
	m_sw = document.getElementById("m_sw");
	m_w = document.getElementById("m_w");
	m_up = document.getElementById("m_u");
	m_down = document.getElementById("m_d");
	m_in = document.getElementById("m_i");
	m_out = document.getElementById("m_o");
	
	h_pct = document.getElementById("h_pct");
	h_raw = document.getElementById("h_raw");
	m_pct = document.getElementById("m_pct");
	m_raw = document.getElementById("m_raw");
	e_pct = document.getElementById("e_pct");
	e_raw = document.getElementById("e_raw");
	w_pct = document.getElementById("w_pct");
	w_raw = document.getElementById("w_raw");
	nl_pct = document.getElementById("nl_pct");
	nl_raw = document.getElementById("nl_raw");
	
	next_del = 0;	
	
  // Set this to dump debug message from Flash to console.log:
  WebSocket.__debug = true;
	
	socket = new WebSocket(wshost);	
	
	socket.onopen = function() {
    set_connected_phudbase();
    mud_login();
  }
	
	socket.onmessage = function(evt) {				
		handle_read(evt.data);
	}
  
  socket.onclose = function(evt) {
    set_disconnected();
  }      
  
  socket.onerror = function() {
    ow_Write("<p>WebSocket error:</p>");
  }

  output_div = window.top.document.getElementById("output");
});

var MUD = "localhost 4000";
function mud_login() {
  send_to_mud("PHUD:CONNECT " + MUD);
  postLogin();
}

function send_to_mud(msg) {
  socket.send(msg);
}

function postLogin() {
  keyboard_handlers();
	document.getElementById("user_input").value = "";
	$("#data_form").fadeIn(500, function() {document.getElementById("user_input").focus()});
  $("#c_right").hide();
  $("#c_output").css("margin-right", "auto");
  $(window).blur( function(e) { $("#user_input").focus(); } );
}

function user_input_down_arrow(evt) {
  if ( cmd_history_down.length > 0 ) {
    cmd_history_up.push( document.getElementById("user_input").value );
    document.getElementById("user_input").value = cmd_history_down.pop();
  } else {
    document.getElementById("user_input").value = "";
  }
}

var cmd_history_down = [];
var cmd_history_up = [];

function user_input_up_arrow(evt) {
  // command scrollback
  if ( cmd_history_up.length > 0 ) {
    cmd_history_down.push(document.getElementById("user_input").value);
    document.getElementById("user_input").value = cmd_history_up.pop();
  }
}

function keyboard_handlers() {
  $("#user_input").keydown( function( evt ) {
    if (evt.keyCode == '40') { // down arrow
      evt.preventDefault();
      user_input_down_arrow(evt);
    } else if (evt.keyCode == '38') { // up arrow
      evt.preventDefault();
      user_input_up_arrow(evt);
    }
  });
}

function set_connected_phudbase()
{
	conn_div.style.background = "green";
	conn_div.innerHTML = "<p style='font-size: 1.5em; font-weight: bold; color: #fff;'>CONNECTED</p>";
}

function set_connected_mud()
{
	m_conn_div.style.background = "green";
	m_conn_div.innerHTML = "<p style='font-size: 1.5em; font-weight: bold; color: #fff;'>CONNECTED</p>";	
}

function set_disconnected_mud()
{
	m_conn_div.style.background = "red";
	m_conn_div.innerHTML = "<p style='font-size: 1.25em; font-weight: bold; color: #fff;'>DISCONNECTED</p>";
}

function set_disconnected()
{
	conn_div.style.background = "red";
  conn_div.innerHTML = "<p style='font-size: 1.25em; font-weight: bold; color: #fff;'>DISCONNECTED</p>";
  m_conn_div.style.background = "red";
	m_conn_div.innerHTML = "<p style='font-size: 1.25em; font-weight: bold; color: #fff;'>DISCONNECTED</p>";
}

function print(s) {
  var color = "#ccc";
  ow_Write("<br><span style='color:"+color+ "'>" + s + "</span>");
}

var utf8_to_html = [];
for( i = 128; i < 256 ; i++ ) {
  var hex = i.toString(16);
  var utf8 = new RegExp("\\\\u00" + hex, "gi");
  var html = "&#" + i.toString() + ";";
  utf8_to_html[i] = []
  utf8_to_html[i][0] = utf8;
  utf8_to_html[i][0] = html;
}

function handle_read(s)
{
  for( i = 128; i < 256 ; i++ ) {
    s = s.replace( utf8_to_html[i][0], utf8_to_html[i][1] );
  }

	data = eval("(" + s + ")");

  // Output a standard message //
	if (data.message) {
    ow_Write(mud_client.color_span() + // re-open <span> for current color, because html we append won't be inserted into the most recent span
             mud_client.output_parser.parse(data.message));
  }
	
	// Write a WebMud server status message //
	if (data.server_status) ss_Write(data.server_status);
	
	// Set the connection status for the MUD
	if (data.conn_status) 
	{
		if (data.conn_status == "connected")		
			set_connected_mud();
		else if (data.conn_status == "disconnected")
			set_disconnected_mud();		
	}
	
	// Set the connection status for the PHudBase-WebMud server (sent by the Flash client) //
	if (data.fconn_status)
	{
		if (data.fconn_status == "connected")		
			set_connected_phudbase();
		else if (data.fconn_status == "disconnected")
			set_disconnected();		
	}
}


function ow_Write(text)
{	
  var lines = $("#output").find("br").length;
  while( lines > 120 ) {
    var head = $("#output").children().slice(0,5);
    var lines_in_head = $(head).find("br").length + $(head).filter("br").length;
    $(head).remove();
    lines -= lines_in_head;
  }
	output_div.innerHTML += text;
	output_div.scrollTop = output_div.scrollHeight;
}

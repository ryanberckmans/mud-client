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

var mudhost;
var mudport;

var scrollback, prevent_autoscroll=false;


fromMudAnsiColorStream = new AnsiColorStream({
  renderClearTextLine: renderClearTextLine,
  renderDOMLine: renderDOMLine,
  ansiColorState: new AnsiColorState()
});

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
	
  // Set URL of your WebSocketMain.swf here:
  //WebSocket.__swfLocation = "WebSocketMain.swf";

  // Set this to dump debug message from Flash to console.log:
  //WebSocket.__debug = true;

  mode = "websocket";

  // Set this to dump debug message from Flash to console.log:
  //WebSocket.__debug = true;
	
	socket = new WebSocket(wshost);	
	
	socket.onopen = function() {
    set_connected_phudbase();
    mud_login();
  }
	
	socket.onmessage = function(evt) {
		fromMudAnsiColorStream.pushRaw(evt.data);
	}
  
  socket.onclose = function(evt) {
    echo("<p>Refresh page to reconnect \\o/</p>");
    set_disconnected();
  }      
  
  socket.onerror = function(evt) {
    echo("<p>WebSocket error: " + evt.data + "</p>");
  }

  output_div = window.top.document.getElementById("output");
});

function mud_login() {
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
  $(window).blur( function(e) { document.getElementById("user_input").focus() } );
  $(window).click( function(e) { document.getElementById("user_input").focus() } );
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

// htmlTextLine is a string that may contain newlines
// newLines are rewritten as <br>, and any trailing newline is discarded
function echo(htmlText) {
  var htmlTextLines = htmlText.split("\n");

  // If the last character in htmlText is "\n", we want to discard the last element in htmlTextLines,
  // since it's just an empty string. This has the same effect as htmlText.chomp() - no chomp() function exists in javascript
  if (htmlTextLines[htmlTextLines.length-1].length < 1) htmlTextLines.pop();

  var len = htmlTextLines.length;
  if (len < 1) return;

  // the first line in an echo isn't prepended with <br>, 
  // this allows a user command to appear on the same line as the prompt
  var domLine = $.parseHTML("<span class='echo_line echo_color'>" + htmlTextLines[0] + "</span>")[0];
  ow_Write(domLine);

  // subsequent echo lines, past the first, are prepended with <br>
  for(var i = 1; i < len; ++i) {
    domLine = $.parseHTML("<span class='echo_line echo_color'><br>" + htmlTextLines[i] + "</span>")[0];
    ow_Write(domLine);
  }
}

mudBufferTextStream = new TextStream();
fromMudAnsiColorStream.addChild(mudBufferTextStream);

mudBufferTextStream.onPushLine(function(clearTextLine, domLine) {
  ow_Write(domLine);
});

function ow_Write(dom)
{	
  output_div.appendChild(dom);  
	output_div.scrollTop = output_div.scrollHeight;
}

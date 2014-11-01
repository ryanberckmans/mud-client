require 'websocket/driver'
require 'eventmachine'
require 'json'

MUD = "medievia.com"
MUD_PORT = 4000

module MudConnection
  attr_accessor :mud_client_connection

  def strip_telnet data
    result = ""
    result.force_encoding Encoding::UTF_8 # the MUD sends ASCII_8BIT encoded strings; rebuild the string in UTF_8 and receive transcoding for free
    previous_was_255 = false
    next_char_is_option_code = false
    data.each_byte do |next_char|
      case next_char
      when "\r".ord # strip \r, since Medievia sends \r\n for each newline
      when 255 # strip out telnet interpret as a command - TELNET_IAC
        previous_was_255 = true
      else
        if previous_was_255
          case next_char
          when 249 # strip out telnet goahead -  TELNET_GA
          when 250 # DEBUG - char250 may be legal. It's used for telnet option subnegotiation, but I'm unsure if it can appear legally on its own. For now, translate to "chr250" as a debug
            result << "chr250"
          when 251..254 # strip out telnet options, each of 251-254 is followed by a more specific option code, which we also wish to strip out - TELNET_WILL/WONT/DO/DONT
            next_char_is_option_code = true
          else
            result << "chr255chr#{next_char.to_i}" # DEBUG - we don't expect anything else to follow TELNET_IAC, so translate to chr255chr(i) as a debug
          end
        elsif next_char_is_option_code
          #result << "opt#{next_char.to_i}" # DEBUG - output that we suppressed the option
          next_char_is_option_code = false
        else
          result << next_char
        end
        previous_was_255 = false
      end
    end
    result
  end

  def receive_data data
    data = strip_telnet data
    @mud_client_connection.msg data
  end

  def unbind
    @mud_client_connection.on_mud_disconnect
  end
end

module MudClientConnection
  def initialize
    @@client_number ||= 0
    @@client_number += 1
    @client_number = @@client_number

    @driver = WebSocket::Driver.server(self)

    @driver.on(:connect) do
      puts "#{@client_number} connected"
      if WebSocket::Driver.websocket?(@driver.env)
        @driver.start
      else
        # handle other HTTP requests
        puts "#{@client_number} MudClienntConnection#initialize immediately closing non-websocket connection"
        close_connection
      end
    end

    @driver.on(:open) do |e|
      puts "#{@client_number} websocket handshake complete, connecting to mud"
      EM.connect(MUD, MUD_PORT, MudConnection) do |mud_connection| 
        @mud_connection = mud_connection
        @mud_connection.mud_client_connection = self
        on_mud_connect
      end
    end

    @driver.on(:error)   { |e| puts "#{@client_number} error: #{e.message}" }
    @driver.on(:message) { |e| @mud_connection.send_data e.data }
    @driver.on(:close)   { |e| puts "#{@client_number} closed connection by client"; close_connection_after_writing; @mud_connection.close_connection_after_writing if @mud_connection }
  end

  # WebSocket impl, do not touch
  def receive_data data
    @driver.parse data
  end

  # WebSocket impl, do not touch
  def write data
    send_data data
  end

  def on_mud_connect
    puts "#{@client_number} connected to mud"
    @driver.text "\nInstructions:\n\n    Use 'map font 3'. If you have problems, use 'map font 1'\n    Semicolon and repetition work: 'ack;blink;/3 smile'\n\nWanted: expert to fix medievia.ttf so this can use 'map font 5'.\n"
  end

  def on_mud_disconnect
    puts "#{@client_number} disconnected from mud, closing client connection"
    @driver.text("Mud disconnected. Bye!")
    close_connection_after_writing
  end

  # Use msg() to send a text message for display to the user. Don't use write() or send_data()
  def msg data
    @driver.text(data)
  end
end

EM.run {
  EM.start_server '0.0.0.0', 12346, MudClientConnection
}

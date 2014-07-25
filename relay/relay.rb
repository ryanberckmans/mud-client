require 'websocket/driver'
require 'eventmachine'
require 'json'

MUD = "medievia.com"
MUD_PORT = 4000

module MudConnection
  attr_accessor :mud_client_connection

  def strip_telnet data
    result = ""
    previous_was_255 = false
    data.each_byte do |next_char|
      case next_char
      when "\r".ord # strip \r, since Medievia sends \r\n for each newline
      when 255
        previous_was_255 = true   
      else
        if previous_was_255
          case next_char
          when 249
          when 253
          when 251
          else
            result << "chr255chr#{next_char.to_i}"
          end
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
    print "mud disconnected"
    @mud_client_connection.on_mud_disconnect
    @mud_client_connection.close_connection_after_writing
  end
end

module MudClientConnection
  def initialize
    @driver = WebSocket::Driver.server(self)

    @driver.on(:connect) do
      if WebSocket::Driver.websocket?(@driver.env)
        @driver.start
      else
        # handle other HTTP requests
        puts "MudClienntConnection#initialize immediately closing non-websocket connection"
        close_connection
      end
    end

    @driver.on(:open) do |e|
      EM.connect(MUD, MUD_PORT, MudConnection) do |mud_connection| 
        @mud_connection = mud_connection
        @mud_connection.mud_client_connection = self
        on_mud_connect
      end
    end

    @driver.on(:error)   { |e| puts "error: #{e.message}" }
    @driver.on(:message) { |e| puts "received #{e.data}"; @mud_connection.send_data e.data }
    @driver.on(:close)   { |e| close_connection_after_writing; @mud_connection.close_connection_after_writing }
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
    @driver.text(JSON.generate(:conn_status => "connected"))
  end

  def on_mud_disconnect
    @driver.text(JSON.generate(:message => "Mud disconnected. Bye!", :conn_status => "disconnected"))
  end

  # Use msg() to send a text message for display to the user. Don't use write() or send_data()
  def msg data
    @driver.text(JSON.generate(:message => data))
  end
end

EM.run {
  EM.start_server '0.0.0.0', 12346, MudClientConnection
}

require "web_socket"

Thread.abort_on_exception = true

CHAT_PORT = 4050
ACCEPTED_DOMAINS = ["127.0.0.1"]

server = WebSocketServer.new(
  :accepted_domains => ACCEPTED_DOMAINS,
  :port => 4050)

server.run() do |ws|
  puts("Connection accepted")
  puts("Path: #{ws.path}, Origin: #{ws.origin}")

  parse = ws.path.split("/")
  return unless parse.length == 3
  chat_destination = parse[1]
  chat_port = parse[2]

  ws.handshake()
  while data = ws.receive()
    printf("Received: %p\n", data)
    ws.send(data)
    printf("Sent: %p\n", data)
  end
  puts("Connection closed")
end

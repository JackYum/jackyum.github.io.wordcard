import http.server
import socketserver

PORT = 8089
FILE_PATH = "./t_word.csv"

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            with open(FILE_PATH, 'rb') as file:
                self.send_response(200)
                self.send_header('Content-type', 'text/csv')
                # 添加CORS头信息，允许来自 http://localhost:63344 的请求访问该资源
                self.send_header('Access-Control-Allow-Origin', 'http://localhost:63344')
                self.end_headers()
                self.wfile.write(file.read())
        else:
            self.send_response(404)

httpd = socketserver.TCPServer(("", PORT), Handler)
print("Server running at http://localhost:{}".format(PORT))
httpd.serve_forever()

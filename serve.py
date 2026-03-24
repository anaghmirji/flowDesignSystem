import os
import http.server
import socketserver

PORT = 3000
DIR = os.path.dirname(os.path.abspath(__file__))

os.chdir(DIR)

Handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at http://localhost:{PORT}")
    httpd.serve_forever()

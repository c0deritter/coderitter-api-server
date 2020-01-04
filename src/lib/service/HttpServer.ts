import Log from 'coderitter-api-log'
import http from 'http'

let log = new Log(__filename)

export default class HttpServer {

  server?: http.Server
  config: HttpServerConfig = {}
  listener: ((request: http.IncomingMessage, data: string, response: http.ServerResponse) => void)[] = []

  constructor(config?: HttpServerConfig) {
    this.config = config || this.config
  }
  
  async start(): Promise<void> {
    this.server = http.createServer((request, response) => {
      let l = log.fn('handler')
      if (request.url == '/api_v1') {
        let data = ''

        request.on('data', chunk => {
          data += chunk
        })

        request.on('end', () => {
          for (let listener of this.listener) {
            listener(request, data, response)
          }
        })
      }
    })

    return new Promise<void>((resolve, reject) => {
      if (this.server != undefined) {
        this.server.listen(this.config.port, () => {
          log.info('HTTP server started at ' + this.config.port)
          resolve()
        })
      }
    })
  }

  async end() {
    if (this.server != undefined) {
      this.server.close()
    }
  }
}

export interface HttpServerConfig {
  port?: number
}
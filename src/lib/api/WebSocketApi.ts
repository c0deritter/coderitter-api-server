import { ChangeEvent, EventBus } from 'coderitter-api'
import Log from 'coderitter-api-log'
import { toJsonObj } from 'mega-nice-json'
import WebSocket from 'ws'
import Api from './Api'

let log = new Log(__filename)

export default class WebSocketApi {

  webSocketServer: WebSocket.Server
  api: Api
  eventBus: EventBus

  constructor(webSocketServer: WebSocket.Server, api: Api, eventBus: EventBus) {
    this.webSocketServer = webSocketServer
    this.api = api
    this.eventBus = eventBus

    this.eventBus.addHandler('WebSocketApi', (event: ChangeEvent) => this.sendToAllClients(event))
  }

  start() {
    this.webSocketServer.on('connection', (socket, request) => {
      log.info('New WebSocket connection from ' + request.connection.remoteAddress)

      socket.on('message', messageBuffer => {
        // let response = this.api.process(messageBuffer.toString())
        // let responseObj = toJsonObj(response)
        // socket.send(responseObj)
      })
    })

    this.webSocketServer.on('error', error => {
      log.error('WebSocket error ' + error.message)
    })
  }

  sendToAllClients(data: any) {
    let l = log.fn('sendToAllClients')
    l.debug('data =', data)

    let jsonObj = toJsonObj(data)
    let json = JSON.stringify(jsonObj)
    let clients = this.webSocketServer.clients

    if (clients) {
      clients.forEach(client => {
        l.insane('Sending to client', (<any> client)._socket._peername.address)
        client.send(json)
      })
    }
  }
}

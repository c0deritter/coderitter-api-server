import { EventBus } from 'coderitter-api'
import Log from 'coderitter-api-log'
import { Client as NatsClient, connect, NatsConnectionOptions, Payload } from 'ts-nats'
import WebSocket from 'ws'
import Api, { Endpoint } from './api/Api'
import NatsApi from './api/NatsApi'
import PostOnlyApi from './api/PostOnlyApi'
import WebSocketApi from './api/WebSocketApi'
import HttpServer, { HttpServerConfig } from './service/HttpServer'

let log = new Log(__filename)

export default class Registry {

  eventBus: EventBus = new EventBus()

  httpServer!: HttpServer
  webSocketServer!: WebSocket.Server
  natsClient!: NatsClient

  api: Api = new Api()
  natsApi!: NatsApi
  postOnlyApi!: PostOnlyApi
  webSocketApi!: WebSocketApi

  private natsClientConfig: NatsConnectionOptions
  private httpServerConfig: HttpServerConfig

  constructor(natsClientConfig: NatsConnectionOptions, httpServerConfig: HttpServerConfig) {
    this.httpServerConfig = httpServerConfig
    this.natsClientConfig = natsClientConfig

    this.natsClientConfig.payload = Payload.STRING
  }

  async start(endpoints: { [id: string]: Endpoint }) {
    log.info('Starting Coderitter API services...')

    // NATS client
    this.natsClient = await connect(this.natsClientConfig)
    log.info('Connected to NATS servers', this.natsClientConfig.servers)
  
    // HTTP Server
    this.httpServer = new HttpServer(this.httpServerConfig)
    await this.httpServer.start()

    // WebSocket Server
    this.webSocketServer = new WebSocket.Server({
      server: this.httpServer.server
    }, () => {
      let address = this.webSocketServer.address() as any
      log.info('WebSocket server running at ' + address.address + ':' + address.port + ' - ' + address.family)
    })

    // APIs
    this.api.endpoints = endpoints
    log.info('Initialized API with endpoints', endpoints)
    this.natsApi = new NatsApi(this.natsClient, this.api)
    this.postOnlyApi = new PostOnlyApi(this.httpServer, this.api)
    this.webSocketApi = new WebSocketApi(this.webSocketServer, this.api, this.eventBus)

    this.natsApi.start()
    log.info('Started NATS API')
    this.postOnlyApi.start()
    log.info('Started POSTonly API')
    this.webSocketApi.start()
    log.info('Started WebSocket API')
  }

  async stop() {
    log.info('Stopping services...')

    this.natsClient.close()
    log.info('Stopped NATS client')

    this.httpServer.end()
    log.info('Stopped HTTP server...')

    this.webSocketServer.close()
    log.info('Stopped WebSocket server...')
  }
}

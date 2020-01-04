import { EventBus } from 'coderitter-api';
import { Client as NatsClient, NatsConnectionOptions } from 'ts-nats';
import WebSocket from 'ws';
import Api, { Endpoint } from './api/Api';
import NatsApi from './api/NatsApi';
import PostOnlyApi from './api/PostOnlyApi';
import WebSocketApi from './api/WebSocketApi';
import HttpServer, { HttpServerConfig } from './service/HttpServer';
export default class Registry {
    eventBus: EventBus;
    httpServer: HttpServer;
    webSocketServer: WebSocket.Server;
    natsClient: NatsClient;
    api: Api;
    natsApi: NatsApi;
    postOnlyApi: PostOnlyApi;
    webSocketApi: WebSocketApi;
    private natsClientConfig;
    private httpServerConfig;
    constructor(natsClientConfig: NatsConnectionOptions, httpServerConfig: HttpServerConfig);
    start(endpoints: {
        [id: string]: Endpoint;
    }): Promise<void>;
    stop(): Promise<void>;
}

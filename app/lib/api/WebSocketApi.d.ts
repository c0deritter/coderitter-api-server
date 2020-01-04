import { EventBus } from 'coderitter-api';
import WebSocket from 'ws';
import Api from './Api';
export default class WebSocketApi {
    webSocketServer: WebSocket.Server;
    api: Api;
    eventBus: EventBus;
    constructor(webSocketServer: WebSocket.Server, api: Api, eventBus: EventBus);
    start(): void;
    sendToAllClients(data: any): void;
}

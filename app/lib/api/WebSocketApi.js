"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const coderitter_api_log_1 = __importDefault(require("coderitter-api-log"));
const mega_nice_json_1 = require("mega-nice-json");
let log = new coderitter_api_log_1.default(__filename);
class WebSocketApi {
    constructor(webSocketServer, api, eventBus) {
        this.webSocketServer = webSocketServer;
        this.api = api;
        this.eventBus = eventBus;
        this.eventBus.addHandler('WebSocketApi', (event) => this.sendToAllClients(event));
    }
    start() {
        this.webSocketServer.on('connection', (socket, request) => {
            log.info('New WebSocket connection from ' + request.connection.remoteAddress);
            socket.on('message', messageBuffer => {
                // let response = this.api.process(messageBuffer.toString())
                // let responseObj = toJsonObj(response)
                // socket.send(responseObj)
            });
        });
        this.webSocketServer.on('error', error => {
            log.error('WebSocket error ' + error.message);
        });
    }
    sendToAllClients(data) {
        let l = log.fn('sendToAllClients');
        l.debug('data =', data);
        let jsonObj = mega_nice_json_1.toJsonObj(data);
        let json = JSON.stringify(jsonObj);
        let clients = this.webSocketServer.clients;
        if (clients) {
            clients.forEach(client => {
                l.insane('Sending to client', client._socket._peername.address);
                client.send(json);
            });
        }
    }
}
exports.default = WebSocketApi;

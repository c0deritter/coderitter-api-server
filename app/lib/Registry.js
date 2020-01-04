"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const coderitter_api_1 = require("coderitter-api");
const coderitter_api_log_1 = __importDefault(require("coderitter-api-log"));
const ts_nats_1 = require("ts-nats");
const ws_1 = __importDefault(require("ws"));
const Api_1 = __importDefault(require("./api/Api"));
const NatsApi_1 = __importDefault(require("./api/NatsApi"));
const PostOnlyApi_1 = __importDefault(require("./api/PostOnlyApi"));
const WebSocketApi_1 = __importDefault(require("./api/WebSocketApi"));
const HttpServer_1 = __importDefault(require("./service/HttpServer"));
let log = new coderitter_api_log_1.default(__filename);
class Registry {
    constructor(natsClientConfig, httpServerConfig) {
        this.eventBus = new coderitter_api_1.EventBus();
        this.api = new Api_1.default();
        this.httpServerConfig = httpServerConfig;
        this.natsClientConfig = natsClientConfig;
        this.natsClientConfig.payload = ts_nats_1.Payload.STRING;
    }
    start(endpoints) {
        return __awaiter(this, void 0, void 0, function* () {
            log.info('Starting Coderitter API services...');
            // NATS client
            this.natsClient = yield ts_nats_1.connect(this.natsClientConfig);
            log.info('Connected to NATS servers', this.natsClientConfig.servers);
            // HTTP Server
            this.httpServer = new HttpServer_1.default(this.httpServerConfig);
            yield this.httpServer.start();
            // WebSocket Server
            this.webSocketServer = new ws_1.default.Server({
                server: this.httpServer.server
            }, () => {
                let address = this.webSocketServer.address();
                log.info('WebSocket server running at ' + address.address + ':' + address.port + ' - ' + address.family);
            });
            // APIs
            this.api.endpoints = endpoints;
            log.info('Initialized API with endpoints', endpoints);
            this.natsApi = new NatsApi_1.default(this.natsClient, this.api);
            this.postOnlyApi = new PostOnlyApi_1.default(this.httpServer, this.api);
            this.webSocketApi = new WebSocketApi_1.default(this.webSocketServer, this.api, this.eventBus);
            this.natsApi.start();
            log.info('Started NATS API');
            this.postOnlyApi.start();
            log.info('Started POSTonly API');
            this.webSocketApi.start();
            log.info('Started WebSocket API');
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            log.info('Stopping services...');
            this.natsClient.close();
            log.info('Stopped NATS client');
            this.httpServer.end();
            log.info('Stopped HTTP server...');
            this.webSocketServer.close();
            log.info('Stopped WebSocket server...');
        });
    }
}
exports.default = Registry;

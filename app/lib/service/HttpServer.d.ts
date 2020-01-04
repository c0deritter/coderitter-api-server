/// <reference types="node" />
import http from 'http';
export default class HttpServer {
    server?: http.Server;
    config: HttpServerConfig;
    listener: ((request: http.IncomingMessage, data: string, response: http.ServerResponse) => void)[];
    constructor(config?: HttpServerConfig);
    start(): Promise<void>;
    end(): Promise<void>;
}
export interface HttpServerConfig {
    port?: number;
}

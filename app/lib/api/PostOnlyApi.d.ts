import HttpServer from '../service/HttpServer';
import Api from './Api';
export default class PostOnlyApi {
    httpServer: HttpServer;
    api: Api;
    constructor(httpServer: HttpServer, api: Api);
    start(): Promise<void>;
}

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
const coderitter_api_log_1 = __importDefault(require("coderitter-api-log"));
const http_1 = __importDefault(require("http"));
let log = new coderitter_api_log_1.default(__filename);
class HttpServer {
    constructor(config) {
        this.config = {};
        this.listener = [];
        this.config = config || this.config;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.server = http_1.default.createServer((request, response) => {
                let l = log.fn('handler');
                if (request.url == '/api_v1') {
                    let data = '';
                    request.on('data', chunk => {
                        data += chunk;
                    });
                    request.on('end', () => {
                        for (let listener of this.listener) {
                            listener(request, data, response);
                        }
                    });
                }
            });
            return new Promise((resolve, reject) => {
                if (this.server != undefined) {
                    this.server.listen(this.config.port, () => {
                        log.info('HTTP server started at ' + this.config.port);
                        resolve();
                    });
                }
            });
        });
    }
    end() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.server != undefined) {
                this.server.close();
            }
        });
    }
}
exports.default = HttpServer;

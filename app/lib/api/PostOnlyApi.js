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
const mega_nice_json_1 = require("mega-nice-json");
let log = new coderitter_api_log_1.default(__filename);
class PostOnlyApi {
    constructor(httpServer, api) {
        this.httpServer = httpServer;
        this.api = api;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.httpServer.listener.push((request, remoteMethodCall, response) => __awaiter(this, void 0, void 0, function* () {
                let l = log.fn('handler');
                l.debug('request.url =', request.url);
                l.debug('remoteMethodCall =', remoteMethodCall);
                let result = yield this.api.process(remoteMethodCall);
                l.debug('result =', result);
                let resultObj = mega_nice_json_1.toJsonObj(result);
                l.debug('resultObj =', resultObj);
                let resultJson;
                try {
                    resultJson = JSON.stringify(resultObj);
                }
                catch (e) {
                    l.error('Could not stringify result to JSON.', e);
                    let errorResult = coderitter_api_1.Result.remoteError('Could not stringify result to JSON');
                    resultJson = JSON.stringify(errorResult);
                }
                response.setHeader('Access-Control-Allow-Origin', '*');
                response.end(resultJson, 'utf-8');
                l.debug('Response was send');
            }));
            log.info('Attached POSTonly HTTP API to HTTP server');
        });
    }
}
exports.default = PostOnlyApi;

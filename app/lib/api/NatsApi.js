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
class NatsApi {
    constructor(natsClient, api) {
        this.natsClient = natsClient;
        this.api = api;
    }
    start() {
        this.natsClient.subscribe('workos', (err, msg) => __awaiter(this, void 0, void 0, function* () {
            let l = log.fn('handler');
            if (err) {
                l.error(err);
            }
            else if (msg.reply) {
                let result = yield this.api.process(msg.data);
                l.debug('result =', result);
                let resultObj = mega_nice_json_1.toJsonObj(result);
                l.debug('resultObj =', resultObj);
                let resultJson;
                try {
                    resultJson = JSON.stringify(resultObj);
                    l.debug('resultJson =', resultJson);
                }
                catch (e) {
                    l.error('Could not stringify the APIs result', e);
                    let errorMessage = coderitter_api_1.Result.remoteError('Could not stringify result on the server');
                    this.natsClient.publish(JSON.stringify(errorMessage));
                    return;
                }
                this.natsClient.publish(msg.reply, resultJson);
                l.debug('Sent reply', msg.reply);
            }
            else {
                l.error('Unexpected');
            }
        }));
    }
}
exports.default = NatsApi;

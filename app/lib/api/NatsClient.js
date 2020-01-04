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
class NatsClient {
    constructor(originalNatsClient, instantiator) {
        this.originalNatsClient = originalNatsClient;
        this.instantiator = instantiator;
    }
    request(server, methodName, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let l = log.fn('request');
            l.debug('server =', server);
            l.debug('methodName =', methodName);
            l.debug('options =', options);
            let remoteOptions = new coderitter_api_1.RemoteMethodCall(methodName, options);
            l.debug('remoteOptions =', remoteOptions);
            let remoteOptionsObj = mega_nice_json_1.toJsonObj(remoteOptions);
            l.debug('remoteOptionsObj =', remoteOptionsObj);
            let remoteOptionsJson = JSON.stringify(remoteOptionsObj);
            l.insane('remoteOptionsJson =', remoteOptionsJson);
            let natsResult = yield this.originalNatsClient.request(server, 1000, remoteOptionsJson);
            l.debug('natsResult.data =', natsResult.data);
            let resultObj = JSON.parse(natsResult.data);
            l.debug('resultObj =', resultObj);
            let mismatch = coderitter_api_1.Result.isValid(resultObj);
            l.debug('mismatch =', mismatch);
            if (mismatch == undefined) {
                l.insane('this.instantiator =', this.instantiator);
                let result = mega_nice_json_1.fromJsonObj(resultObj, this.instantiator);
                l.debug('result =', result);
                return result;
            }
            else {
                throw new Error('Received result did not match the expected format ' + mismatch.message);
            }
        });
    }
}
exports.default = NatsClient;

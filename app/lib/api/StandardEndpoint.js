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
class StandardEndpoint {
    constructor(serviceObject, method, instantiator) {
        this.serviceObject = serviceObject;
        this.method = method;
        this.instantiator = instantiator;
    }
    process(optionsObj) {
        return __awaiter(this, void 0, void 0, function* () {
            let l = log.fn('process');
            l.debug('this.serviceObject', this.serviceObject.constructor.name);
            l.debug('this.method =', this.method);
            l.debug('optionsObj =', optionsObj);
            l.insane('NatsClient.instantiator =', this.instantiator);
            let options = mega_nice_json_1.fromJsonObj(optionsObj, this.instantiator);
            l.debug('options =', options);
            try {
                return yield this.serviceObject[this.method](options);
            }
            catch (e) {
                l.error('An exception was thrown while executing the method', e);
                return coderitter_api_1.Result.remoteError('There was an error with your request. We just were informed that it happened and we will look into the issue. Please try again later.');
            }
        });
    }
}
exports.default = StandardEndpoint;

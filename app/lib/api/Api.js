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
const mega_nice_validation_1 = require("mega-nice-validation");
let log = new coderitter_api_log_1.default(__filename);
class Api {
    constructor() {
        this.endpoints = {};
    }
    get ids() {
        return Object.keys(this.endpoints);
    }
    process(options, methodName) {
        return __awaiter(this, void 0, void 0, function* () {
            let l = log.fn('process');
            l.debug('options =', options);
            l.debug('methodName =', methodName);
            if (typeof options === 'string') {
                try {
                    options = JSON.parse(options);
                }
                catch (e) {
                    l.debug('Tried to parse string but it was not JSON.');
                }
            }
            if (methodName == undefined) {
                if (options.methodName != undefined) {
                    methodName = options.methodName;
                    options = options.options;
                }
                else {
                    l.warn('Given RemoteOptions misses \'methodName\' property', options);
                    return coderitter_api_1.Result.mismatch(mega_nice_validation_1.Mismatch.missing('methodName'));
                }
            }
            l.debug('methodName =', methodName);
            l.debug('options =', options);
            if (methodName != undefined && methodName in this.endpoints) {
                l.debug(`Found a reaction for id '${methodName}'`);
                let reaction = this.endpoints[methodName];
                let result = yield reaction.process(options);
                l.debug('result =', result);
                return result;
            }
            else {
                l.warn('No reaction available.', 'this.endpoints =', this.endpoints);
                // TODO: change to mismatch
                return coderitter_api_1.Result.remoteError('Remote method name is unknown. ' + methodName);
            }
        });
    }
}
exports.default = Api;

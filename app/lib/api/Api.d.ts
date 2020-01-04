import { RemoteMethodCall } from 'coderitter-api';
export interface Endpoint {
    process(optionsObj: any): Promise<any>;
}
export default class Api {
    endpoints: {
        [id: string]: Endpoint;
    };
    get ids(): string[];
    process(options: string | RemoteMethodCall | any, methodName?: string): Promise<any>;
}

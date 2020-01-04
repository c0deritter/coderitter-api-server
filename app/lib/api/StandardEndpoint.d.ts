import { Instantiator } from 'mega-nice-json';
export default class StandardEndpoint {
    serviceObject: any;
    method: string;
    instantiator?: Instantiator;
    constructor(serviceObject: any, method: string, instantiator?: Instantiator);
    process(optionsObj: any): Promise<any>;
}

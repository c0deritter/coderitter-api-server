import { Result } from 'coderitter-api';
import { Instantiator } from 'mega-nice-json';
import { Client } from 'ts-nats';
export default class NatsClient {
    originalNatsClient: Client;
    instantiator: Instantiator;
    constructor(originalNatsClient: Client, instantiator: Instantiator);
    request<T>(server: string, methodName: string, options?: any): Promise<Result<T>>;
}

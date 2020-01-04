import { Client as NatsClient } from 'ts-nats';
import Api from './Api';
export default class NatsApi {
    natsClient: NatsClient;
    api: Api;
    constructor(natsClient: NatsClient, api: Api);
    start(): void;
}

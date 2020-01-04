import { RemoteMethodCall, Result } from 'coderitter-api'
import Log from 'coderitter-api-log'
import { fromJsonObj, Instantiator, toJsonObj } from 'mega-nice-json'
import { Client } from 'ts-nats'

let log = new Log(__filename)

export default class NatsClient {

  originalNatsClient: Client
  instantiator: Instantiator

  constructor(originalNatsClient: Client, instantiator: Instantiator) {
    this.originalNatsClient = originalNatsClient
    this.instantiator = instantiator
  }

  async request<T>(server: string, methodName: string, options?: any): Promise<Result<T>> {
    let l = log.fn('request')
    l.debug('server =', server)
    l.debug('methodName =', methodName)
    l.debug('options =', options)

    let remoteOptions = new RemoteMethodCall(methodName, options)
    l.debug('remoteOptions =', remoteOptions)

    let remoteOptionsObj = toJsonObj(remoteOptions)
    l.debug('remoteOptionsObj =', remoteOptionsObj)

    let remoteOptionsJson = JSON.stringify(remoteOptionsObj)
    l.insane('remoteOptionsJson =', remoteOptionsJson)

    let natsResult = await this.originalNatsClient.request(server, 1000, remoteOptionsJson)
    l.debug('natsResult.data =', natsResult.data)
    let resultObj = JSON.parse(natsResult.data)
    l.debug('resultObj =', resultObj)
    let mismatch = Result.isValid(resultObj)
    l.debug('mismatch =', mismatch)

    if (mismatch == undefined) {
      l.insane('this.instantiator =', this.instantiator)
      let result = fromJsonObj(resultObj, this.instantiator)
      l.debug('result =', result)
      return <Result<T>> result
    }
    else {
      throw new Error('Received result did not match the expected format ' + mismatch.message)
    }
  }
}
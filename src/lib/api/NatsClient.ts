import { fromJsonObj, Instantiator, Log, RemoteMethodCall, Result, toJsonObj } from 'coderitter-api'
import { Client } from 'ts-nats'

let log = new Log(__filename)

export default class NatsClient {

  originalNatsClient: Client
  instantiator: Instantiator

  constructor(originalNatsClient: Client, instantiator: Instantiator) {
    this.originalNatsClient = originalNatsClient
    this.instantiator = instantiator
  }

  async request<T>(server: string, methodName: string, parameter?: any): Promise<Result<T>> {
    let l = log.fn('request')
    l.debug('server =', server)
    l.debug('methodName =', methodName)
    l.debug('parameter =', parameter)

    let remoteMethodCall: RemoteMethodCall = { methodName: methodName, parameter: parameter }
    l.debug('remoteMethodCall =', remoteMethodCall)

    let remoteMethodCallObj = toJsonObj(remoteMethodCall)
    l.debug('remoteMethodCallObj =', remoteMethodCallObj)

    let remoteMethodCallJson = JSON.stringify(remoteMethodCallObj)
    l.insane('remoteMethodCallJson =', remoteMethodCallJson)

    let natsResult = await this.originalNatsClient.request(server, 1000, remoteMethodCallJson)
    l.debug('natsResult.data =', natsResult.data)
    let resultData = JSON.parse(natsResult.data)
    l.debug('resultData =', resultData)

    // throws error if not valid
    Result.checkIfRawResultObjIsValid(resultData)

    l.insane('this.instantiator =', this.instantiator)
    let result = fromJsonObj(resultData, this.instantiator)
    l.debug('result =', result)
    return <Result<T>> result
  }
}
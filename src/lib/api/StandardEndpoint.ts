import { Result } from 'coderitter-api'
import Log from 'coderitter-api-log'
import { fromJsonObj, Instantiator } from 'mega-nice-json'

let log = new Log(__filename)

export default class StandardEndpoint {

  serviceObject: any
  method: string
  instantiator?: Instantiator

  constructor(serviceObject: any, method: string, instantiator?: Instantiator) {
    this.serviceObject = serviceObject
    this.method = method
    this.instantiator = instantiator
  }

  async process(optionsObj: any): Promise<any> {
    let l = log.fn('process')
    l.debug('this.serviceObject', this.serviceObject.constructor.name)
    l.debug('this.method =', this.method)
    l.debug('optionsObj =', optionsObj)

    l.insane('NatsClient.instantiator =', this.instantiator)
    let options = fromJsonObj(optionsObj, this.instantiator)
    l.debug('options =', options)

    try {
      return await this.serviceObject[this.method](options)
    }
    catch (e) {
      l.error('An exception was thrown while executing the method', e)
      return Result.remoteError('There was an error with your request. We just were informed that it happened and we will look into the issue. Please try again later.')
    }
  }
}

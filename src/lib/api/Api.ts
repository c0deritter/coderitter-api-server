import { RemoteMethodCall, Result } from 'coderitter-api'
import Log from 'coderitter-api-log'
import { Mismatch } from 'mega-nice-validation'

let log = new Log(__filename)

export interface Endpoint {
  process(optionsObj: any): Promise<any>
}

export default class Api {

  endpoints: { [id: string]: Endpoint } = {}

  get ids(): string[] {
    return Object.keys(this.endpoints)
  }
  
  async process(options: string|RemoteMethodCall|any, methodName?: string): Promise<any> {
    let l = log.fn('process')
    l.debug('options =', options)
    l.debug('methodName =', methodName)

    if (typeof options === 'string') {
      try {
        options = JSON.parse(options)
      }
      catch (e) {
        l.debug('Tried to parse string but it was not JSON.')
      }
    }

    if (methodName == undefined) {
      if (options.methodName != undefined) {
        methodName = options.methodName
        options = options.options
      }
      else {
        l.warn('Given RemoteOptions misses \'methodName\' property', options)
        return Result.mismatch(Mismatch.missing('methodName'))
      }
    }

    l.debug('methodName =', methodName)
    l.debug('options =', options)

    if (methodName != undefined && methodName in this.endpoints) {
      l.debug(`Found an endpoint for method '${methodName}'`)
      let endpoint = this.endpoints[methodName]
      let result = await endpoint.process(options)
      l.debug('result =', result)
      return result
    }
    else {
      l.warn(`No endpoint available for method name '${methodName}'.`, this.ids)
      // TODO: change to mismatch
      return Result.remoteError('Remote method name is unknown. ' + methodName)
    }
  }
}

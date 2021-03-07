import { fromJsonObj, Instantiator, Log, RemoteMethodCall, Result, toJsonObj } from 'coderitter-api'
import { Api } from 'coderitter-api-remote-method-api'
import HttpServer from '../service/HttpServer'

let log = new Log(__filename, 'debug')

/**
 * It receives the data directly from the HTTP server and
 * uses the Api object to execute the remote method call.
 * 
 * Also it converts the incoming JSON with the help of mega-nice-json
 * to instances of the original classes.
 * 
 * And it converts the outgoing object with the help of mega-nice-json
 * to a JSON string which contains the class information.
 */
export default class PostOnlyApi {

  httpServer!: HttpServer
  api!: Api
  instantiator!: Instantiator

  async start(): Promise<void> {
    this.httpServer.listener.push(async (request, remoteMethodCallJson, response) => {
      let l = log.fn('handler')
      l.debug('request.url =', request.url)
      l.debug('remoteMethodCallJson =', remoteMethodCallJson)

      let result: Result<any>|undefined = undefined

      let remoteMethodCall: RemoteMethodCall|undefined = undefined
      try {
        remoteMethodCall = <RemoteMethodCall> fromJsonObj(remoteMethodCallJson, this.instantiator)
      }
      catch (e) {
        l.error('Could not parse the JSON containing the RemoteMethodCall')
        result = Result.remoteError('Could not parse the JSON containing the RemoteMethodCall')
      }

      l.debug('remoteMethodCall =', remoteMethodCall)
      
      // if the result is not already erroneous
      if ((! result || result && ! result.isRemoteError()) && remoteMethodCall) {
        l.debug('Calling method...')
        result = await this.api.callMethod(remoteMethodCall)
      }

      l.debug('result =', result)
  
      let resultObj = toJsonObj(result)
      l.debug('resultObj =', resultObj)

      let resultJson
      try {
        resultJson = JSON.stringify(resultObj)
      }
      catch (e) {
        l.error('Could not stringify result to JSON.', e)
        let errorResult = Result.remoteError('Could not stringify result to JSON')
        let errorResultObj = toJsonObj(errorResult)
        resultJson = JSON.stringify(errorResultObj)
      }

      response.setHeader('Access-Control-Allow-Origin', '*')
      response.end(resultJson, 'utf-8')
      l.debug('Response was send')
    })
  }
}
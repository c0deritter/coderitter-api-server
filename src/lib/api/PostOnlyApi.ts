import { Result } from 'coderitter-api'
import Log from 'coderitter-api-log'
import { toJsonObj } from 'mega-nice-json'
import HttpServer from '../service/HttpServer'
import Api from './Api'

let log = new Log(__filename)

export default class PostOnlyApi {

  httpServer: HttpServer
  api: Api

  constructor(httpServer: HttpServer, api: Api) {
    this.httpServer = httpServer
    this.api = api
  }
  
  async start(): Promise<void> {
    this.httpServer.listener.push(async (request, remoteMethodCall, response) => {
      let l = log.fn('handler')
      l.debug('request.url =', request.url)
      l.debug('remoteMethodCall =', remoteMethodCall)
      
      let result = await this.api.process(remoteMethodCall)
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
        resultJson = JSON.stringify(errorResult)
      }

      response.setHeader('Access-Control-Allow-Origin', '*')
      response.end(resultJson, 'utf-8')
      l.debug('Response was send')
    })
  }
}

import { Result } from 'coderitter-api'
import Log from 'coderitter-api-log'
import { toJsonObj } from 'mega-nice-json'
import { Client as NatsClient } from 'ts-nats'
import Api from './Api'

let log = new Log(__filename)

export default class NatsApi {

  natsClient: NatsClient
  api: Api
  config: NatsApiConfig

  constructor(natsClient: NatsClient, api: Api, config: NatsApiConfig) {
    this.natsClient = natsClient
    this.api = api
    this.config = config
  }

  start() {
    this.natsClient.subscribe(this.config.subject, async (err, msg) => {
      let l = log.fn('handler')
      
      if (err) {
        l.error(err)
      }

      else if (msg.reply) {
        let result = await this.api.process(msg.data)
        l.debug('result =', result)

        let resultObj = toJsonObj(result)
        l.debug('resultObj =', resultObj)

        let resultJson: string
        try {
          resultJson = JSON.stringify(resultObj)
          l.debug('resultJson =', resultJson)
        }
        catch (e) {
          l.error('Could not stringify the APIs result', e)
          let errorMessage = Result.remoteError('Could not stringify result on the server')
          this.natsClient.publish(JSON.stringify(errorMessage))
          return 
        }

        this.natsClient.publish(msg.reply, resultJson)
        l.debug('Sent reply', msg.reply)
      }

      else {
        l.error('Unexpected')
      }
    })
  }
}

export interface NatsApiConfig {
  subject: string
}
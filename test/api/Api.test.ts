import { expect } from 'chai'
import 'mocha'
import { Api } from '../../src'

describe('API', function() {
  describe('Reactor', function() {
    it('should react on data and separate id', async function() {
      let testData = {
        prop1: 1,
        prop2: '2'
      }

      let api = new Api()
      api.endpoints = {
        'testId': {
          async process(data: any): Promise<object> {
            return data
          }
        }
      }

      let result = await api.process(testData, 'testId')      
      
      expect(result).to.deep.equal(testData)
    })

    it('should react on data and id combined', async function() {
      let testOptions = {
        prop1: 1,
        prop2: '2'
      }

      let api = new Api()
      api.endpoints = {
        'testId': {
          async process(data: any): Promise<object> {
            return data
          }
        }
      }

      let result = await api.process({
        methodName: 'testId',
        options: testOptions
      })

      expect(result).to.deep.equal(testOptions)
    })
  })
})
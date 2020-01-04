import { expect } from 'chai'
import { Result } from 'coderitter-api'
import 'mocha'
import { StandardEndpoint } from '../../src'

describe('API', function() {
  describe('StandardEndpoint', function() {
    it('should call the correct method on the service object', async function() {
      let endpoint = new StandardEndpoint(testService, 'test')
      let result = await endpoint.process({
        prop1: 1,
        prop2: '2'
      })

      expect(result).to.not.be.undefined
      expect(result.type).to.equal('value')
      expect(result.value).to.not.be.undefined
      expect(result.value.prop1).to.equal(1)
      expect(result.value.prop2).to.equal('2')
    })

    it('should handle a thrown error', async function() {
      let endpoint = new StandardEndpoint(testService, 'testError')
      let result = await endpoint.process({})

      expect(result.type).to.equal('remoteError')
    })
  })
})

class TestService {
  async test(options: any): Promise<Result<any>> {
    return Result.value(options)
  }

  async testError(options: any): Promise<Result<any>> {
    throw new Error('Test error')
  }
}

const testService = new TestService()
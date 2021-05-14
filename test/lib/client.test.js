import sinon from 'sinon'
import { expect } from 'chai'
import { getClient, getApp } from '../../lib/client.js'

describe('lib/client.js', () => {
  class ClientClassMock {
    constructor () {
      this.user = { id: 'sample-id' }
      this.api = { applications: sinon.stub().returns(this) }
      this.guilds = sinon.stub()
    }
  }

  describe('.getClient', () => {
    it('returns an instance of Discord.Client', () => {
      const client = getClient({ Client: ClientClassMock })
      expect(client).to.be.an.instanceOf(ClientClassMock)
    })

    it('always return the same instance', () => {
      const client = getClient({ Client: ClientClassMock })
      const client2 = getClient({ Client: ClientClassMock })
      expect(client).to.eq(client2)
    })
  })

  describe('.getApp', () => {
    let clientMock

    beforeEach(() => {
      clientMock = getClient({ Client: ClientClassMock })
    })

    it('returns an app instance for the user', () => {
      expect(getApp({ client: clientMock })).to.eq(clientMock.api.applications())
      expect(clientMock.api.applications).to.have.been.calledWith('sample-id')
    })

    context('when a guild id is provided', () => {
      it('sets guild id', () => {
        getApp('sample-guild-id', { client: clientMock })
        expect(clientMock.guilds).to.have.been.calledWith('sample-guild-id')
      })
    })
  })
})

import localesMock from '../support/fixtures/locales-mock.js'
import sinon from 'sinon'
import { APIMessage } from 'discord.js'
import { CHANNEL_MESSAGE_WITH_SOURCE, DICE_2D6 } from '../../lib/constants.js'
import { expect } from 'chai'
import { waitForInteractions } from '../../lib/interactions.js'

const configMock = {
  COLOR: 'sample-color',
  DICE: DICE_2D6,
}

describe('lib/interactions.js', () => {
  describe('.waitForInteractions', () => {
    let clientMock
    let getClientStub

    beforeEach(() => {
      const interactionsMock = {
        callback: {
          post: sinon.stub().resolves(),
        },
      }

      clientMock = {
        api: { interactions: sinon.stub().returns(interactionsMock) },
        channels: { resolve: sinon.stub() },
        ws: { on: sinon.stub() },
      }

      getClientStub = sinon.stub().returns(clientMock)
    })

    it('waits for INTERACTION_CREATE ws event', () => {
      waitForInteractions(localesMock, configMock, { getClient: getClientStub })
      expect(getClientStub).to.have.been.calledOnce
      expect(clientMock.ws.on).to.have.been.calledWith('INTERACTION_CREATE', sinon.match.func)
    })

    context('when an interaction is created', () => {
      beforeEach(() => {
        const interactionMock = {
          id: 'sample-id',
          channel_id: 'sample-channel-id',
          token: 'sample-token',
          data: {
            name: 'sample-name',
            options: [
              {
                type: 2,
                options: [
                  {
                    type: 1,
                    options: [
                      { value: 2, type: 4, name: 'atributo' }],
                    name: 'sample-move',
                  }],
                name: 'sample-category',
              }],
          },
        }

        // clientMock.ws.on.callsArgWith(1, interactionMock) // calls event callback
        clientMock.ws.on.callsFake(async (event, cb) => {
          await cb(interactionMock)
        })
        const data = { message: 'sample-api-message-data' }
        sinon.stub(APIMessage, 'create').returns({ resolveData: sinon.stub().resolves({ data }) })
      })

      it('posts interaction callback', async () => {
        await waitForInteractions(localesMock, configMock, { getClient: getClientStub })
        expect(getClientStub).to.have.been.calledTwice
        expect(clientMock.channels.resolve).to.have.been.calledWith('sample-channel-id')

        await new Promise((resolve) => setTimeout(resolve, 0)) // defer until all promises resolves
        expect(clientMock.api.interactions).to.have.been.calledWith('sample-id', 'sample-token')
        expect(clientMock.api.interactions().callback.post).to.have.been.calledWith({
          data: {
            type: CHANNEL_MESSAGE_WITH_SOURCE,
            data: { message: 'sample-api-message-data' },
          },
        })
      })
    })
  })
})

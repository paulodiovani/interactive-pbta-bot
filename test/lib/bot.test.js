import { expect } from 'chai'
import sinon from 'sinon'
import { start } from '../../lib/bot.js'
import localesMock from '../support/fixtures/locales-mock.js'

describe('lib/bot.js', () => {
  describe('.start', () => {
    let clientMock
    let dependenciesMock

    const config = {
      DICE: 'sample-dice',
      EMBED_COLOR: 'sample-color',
      GUILD: 'sample-guild-id',
      LOCALE_FILE: '/sample/locale/file',
      TOKEN: 'sample-token',
    }

    beforeEach(() => {
      clientMock = {
        login: sinon.stub(),
        on: sinon.stub().callsArg(1), // calls the event callback
      }

      dependenciesMock = {
        getApp: sinon.stub(),
        getClient: sinon.stub().returns(clientMock),
        loadLocales: sinon.stub().resolves(localesMock),
        getCommands: sinon.stub().resolves([{ id: 'sample-command-id' }]),
        registerCommands: sinon.stub().resolves(),
        deleteCommand: sinon.stub().resolves(),
        waitForInteractions: sinon.stub(),
      }
    })

    it('gets the client and login', async () => {
      await start(config, dependenciesMock)

      expect(dependenciesMock.loadLocales).to.have.been.calledWith(config.LOCALE_FILE)
      expect(dependenciesMock.getClient).to.have.been.calledOnce
      expect(clientMock.on).to.have.been.calledWith('ready', sinon.match.func)
      expect(clientMock.login).to.have.been.calledWith(config.TOKEN)
    })

    context('when client starts', () => {
      it('register commands, lists them, and wait for interactions', async () => {
        await start(config, dependenciesMock)
        await Promise.resolve() // defer until all promises resolves

        expect(dependenciesMock.getCommands).to.have.been.calledWith({ getApp: sinon.match.func })
        expect(dependenciesMock.deleteCommand).to.not.have.been.called
        expect(dependenciesMock.registerCommands).to.have.been.calledWith(localesMock, { getApp: sinon.match.func })
        expect(dependenciesMock.waitForInteractions).to.have.been.calledWith(localesMock, config.DICE, config.EMBED_COLOR)
      })
    })

    context('when client starts and it is set to delete commands', () => {
      it('register commands, lists them, and wait for interactions', async () => {
        await start({ ...config, DELETE_COMMANDS: true }, dependenciesMock)
        await Promise.resolve() // defer until all promises resolve

        expect(dependenciesMock.deleteCommand).to.have.been.calledWith({ id: 'sample-command-id' }, { getApp: sinon.match.func })
      })
    })
  })
})

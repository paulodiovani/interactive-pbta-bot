import sinon from 'sinon'
import { expect } from 'chai'
import localesMock from '../support/fixtures/locale-mock.js'
import { getCommands, registerCommands, deleteCommand } from '../../lib/commands.js'

describe('lib/commands.js', () => {
  let appMock
  let getAppStub

  beforeEach(() => {
    const commandsMock = {
      get: sinon.stub().resolves([{ name: 'sample command' }]),
      put: sinon.stub().resolves(),
      delete: sinon.stub().resolves(),
    }
    const commandsStub = sinon.stub().returns(commandsMock)
    // commands is both a method and a property
    for (const m in commandsMock) commandsStub[m] = commandsMock[m]

    appMock = {
      commands: commandsStub,
    }

    getAppStub = sinon.stub().returns(appMock)
  })

  describe('.getCommands', () => {
    it('gets existing commands', async () => {
      await getCommands({ getApp: getAppStub })
      expect(appMock.commands.get).to.have.been.calledOnce
    })
  })

  describe('.registerCommands', () => {
    it('register new commands', async () => {
      await registerCommands(localesMock, { getApp: getAppStub })
      expect(appMock.commands.put).to.have.been.calledWith({
        data: [
          {
            name: 'sample-command',
            description: 'sample-command-description',
            options: [{
              name: 'sample-category',
              description: 'sample-category-description',
              type: 2,
              options: [
                {
                  name: 'sample-move',
                  description: 'sample-move-description',
                  type: 1,
                  options: [
                    {
                      name: 'attribute',
                      description: 'Attr Description',
                      type: 4,
                      required: true,
                    },
                    {
                      name: 'modifier',
                      description: 'Mod Description',
                      type: 4,
                      required: false,
                    },
                  ],
                },
              ],
            }],
          },
        ],
      })
    })
  })

  describe('.deleteCommand', () => {
    it('deletes an existing command', async () => {
      const command = { id: 123, name: 'sample-command' }
      await deleteCommand(command, { getApp: getAppStub })
      expect(appMock.commands).to.have.been.calledWith(123)
      expect(appMock.commands.delete).to.have.been.calledOnce
    })
  })
})

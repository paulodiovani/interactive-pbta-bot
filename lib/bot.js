import * as Client from './client.js'
import * as Commands from './commands.js'
import * as Interactions from './interactions.js'
import * as Moves from './moves.js'
import { debug, info } from './logger.js'

export const start = async (config, {
  getApp = Client.getApp,
  getClient = Client.getClient,
  loadMoves = Moves.loadMoves,
  getCommands = Commands.getCommands,
  registerCommands = Commands.registerCommands,
  deleteCommand = Commands.deleteCommand,
  waitForInteractions = Interactions.waitForInteractions,
} = {}) => {
  debug('Using moves file at', config.MOVES_FILE)
  const moves = await loadMoves(config.MOVES_FILE)

  const client = getClient()

  client.on('ready', async () => {
    const getGuildApp = () => getApp(config.GUILD)

    // existing commands
    const commands = await getCommands({ getApp: getGuildApp })

    // delete older commands, if asked
    if (config.DELETE_COMMANDS) {
      for (const command of commands) {
        debug('Deleting command', command.id, command.name)
        await deleteCommand(command, { getApp: getGuildApp })
      }
    }

    // register commands
    await registerCommands(moves, { getApp: getGuildApp })

    // list commands in debug mode
    info(`Registered ${commands.length} commands`)
    debug('Registered commands: ', JSON.stringify(commands))

    // wait for received interactions
    waitForInteractions(moves, config)

    // all done
    info('Bot is ready! 🤖')
  })

  client.login(config.TOKEN)
}

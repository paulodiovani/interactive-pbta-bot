import * as Client from './client.js'
import * as Commands from './commands.js'
import * as Interactions from './interactions.js'
import * as Locales from './locales.js'
import { debug, info } from './logger.js'

export const start = async (config, {
  getApp = Client.getApp,
  getClient = Client.getClient,
  loadLocales = Locales.loadLocales,
  getCommands = Commands.getCommands,
  registerCommands = Commands.registerCommands,
  deleteCommand = Commands.deleteCommand,
  waitForInteractions = Interactions.waitForInteractions,
} = {}) => {
  debug('Using locale file at', config.LOCALE_FILE)
  const locales = await loadLocales(config.LOCALE_FILE)

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
    await registerCommands(locales, { getApp: getGuildApp })

    // list commands in debug mode
    info(`Registered ${commands.length} commands`)
    debug('Registered commands: ', JSON.stringify(commands))

    // wait for received interactions
    waitForInteractions(locales, config.DICE, config.EMBED_COLOR)

    // all done
    info('Bot is ready! 🤖')
  })

  client.login(config.TOKEN)
}

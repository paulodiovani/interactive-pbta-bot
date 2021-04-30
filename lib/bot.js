import { debug, info } from './logger.js'
import { getClient as _getClient, getApp as _getApp } from './client.js'
import { getCommands, registerCommands, deleteCommand } from './commands.js'
import { waitForInteractions } from './interactions.js'
import { loadLocales } from './locales.js'

export const start = async (config, { getClient = _getClient, getApp = _getApp } = {}) => {
  debug('Using locale file at', config.LOCALE_FILE)
  const locales = await loadLocales(config.LOCALE_FILE)

  const client = getClient()

  client.on('ready', async () => {
    const getGuildApp = () => getApp(config.GUILD)

    // delete older commands, if asked
    if (config.DELETE_COMMANDS) {
      for (const command of await getCommands({ getApp: getGuildApp })) {
        debug('Deleting command', command.id, command.name)
        await deleteCommand(command, { getApp: getGuildApp })
      }
    }

    // register commands
    await registerCommands(locales, { getApp: getGuildApp })

    // list commands in debug mode
    const commands = await getCommands({ getApp: getGuildApp })
    info(`Registered ${commands.length} commands`)
    debug('Registered commands: ', JSON.stringify(commands))

    // wait for received interactions
    waitForInteractions(locales, config.DICE, config.EMBED_COLOR)

    // all done
    info('Bot is ready! 🤖')
  })

  client.login(config.TOKEN)
}

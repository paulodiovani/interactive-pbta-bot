import { debug, info } from './logger.js'
import { getClient, getApp as _getApp } from './client.js'
import { getCommands, registerCommands, deleteCommand } from './commands.js'
import { waitForInteractions } from './interactions.js'
import { loadLocales } from './locales.js'

export const start = (config) => {
  debug('Using locale file at', config.LOCALE_FILE)
  const locales = loadLocales(config.LOCALE_FILE)

  const client = getClient()

  client.on('ready', async () => {
    const getApp = () => _getApp(config.GUILD)

    // delete older commands, if asked
    if (config.DELETE_COMMANDS) {
      for (const command of await getCommands(getApp)) {
        debug('Deleting command', command.id, command.name)
        await deleteCommand(getApp, command)
      }
    }

    // register commands
    await registerCommands(getApp, locales)

    // list commands in debug mode
    const commands = await getCommands(getApp)
    info(`Registered ${commands.length} commands`)
    debug('Registered commands: ', JSON.stringify(commands))

    // wait for received interactions
    waitForInteractions(locales, config.DICE, config.EMBED_COLOR)

    // all done
    info('Bot is ready! 🤖')
  })

  client.login(config.TOKEN)
}

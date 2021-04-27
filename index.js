import path from 'path'
import { debug, info } from './lib/logger.js'
import { fileURLToPath } from 'url'
import { getClient, getApp as _getApp } from './lib/discord-client.js'
import { getCommands, registerCommands } from './lib/commands.js'
import { waitForInteractions } from './lib/interactions.js'
import { loadLocales } from './lib/locales.js'
import { DICE_2D6 } from './lib/constants.js'

const config = {
  LOCALE: process.env.LOCALE || 'en_US',
  COLOR: process.env.EMBED_COLOR || '#000',
  GUILD: process.env.GUILD,
  TOKEN: process.env.TOKEN,
  DICE: process.env.DICE || DICE_2D6,
}

const dirname = path.dirname(fileURLToPath(import.meta.url))
const localeFile = path.join(dirname, 'locales', config.LOCALE + '.yml')
debug('Using locale file at', localeFile)

const locales = loadLocales(localeFile)

const client = getClient()

client.on('ready', async () => {
  const getApp = () => _getApp(config.GUILD)

  // register commands
  await registerCommands(getApp, locales)

  // list commands in debug mode
  const commands = await getCommands(getApp)
  info(`Registered ${commands.length} commands`)
  debug('Registered commands: ', JSON.stringify(commands))

  // wait for received interactions
  waitForInteractions(locales, config.DICE, config.COLOR)

  // all done
  info('Bot is ready! 🤖')
})

client.login(config.TOKEN)

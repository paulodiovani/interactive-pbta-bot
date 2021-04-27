import path from 'path'
import { debug, info } from './lib/logger.js'
import { fileURLToPath } from 'url'
import { getClient, getApp } from './lib/discord-client.js'
import { getCommands, registerCommands } from './lib/commands.js'
import { waitForInteractions } from './lib/interactions.js'
import { loadLocales } from './lib/locales.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const localeFile = path.join(dirname, 'locales', process.env.LOCALE + '.yml')
debug('Using locale file at', localeFile)

const locales = loadLocales(localeFile)

const client = getClient()

client.on('ready', async () => {
  const app = () => getApp(process.env.GUILD)

  // register commands
  await registerCommands(locales)

  // list commands in debug mode
  const commands = await getCommands(app)
  info(`Registered ${commands.length} commands`)
  debug('Registered commands: ', JSON.stringify(commands))

  // wait for received interactions
  waitForInteractions(locales, process.env.EMBED_COLOR)

  // all done
  info('Bot is ready! 🤖')
})

client.login(process.env.TOKEN)

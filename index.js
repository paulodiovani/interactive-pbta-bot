import path from 'path'
import { debug } from './lib/logger.js'
import { fileURLToPath } from 'url'
import { getApi, getApp, login, onInteraction, onReady } from './lib/discord-client.js'
import { getCommands, registerCommands, registerInteractions } from './lib/commands.js'

login(process.env.TOKEN)

onReady(async () => {
  const dirname = path.dirname(fileURLToPath(import.meta.url))
  const localeFile = path.join(dirname, 'locales', process.env.LOCALE + '.yml')
  debug('Using locale file at', localeFile)

  const app = () => getApp(process.env.GUILD)
  const api = getApi()

  // register new commands
  await registerCommands(app, localeFile)

  // list commands in debug mode
  const commands = await getCommands(app)
  debug('Registered commands: ', JSON.stringify(commands, null, 2))

  // register interactions
  await registerInteractions(api, onInteraction, localeFile)
})

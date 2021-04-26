import path from 'path'
import { debug } from './lib/logger.js'
import { fileURLToPath } from 'url'
import { getApp, login, onReady } from './lib/discord-client.js'
import { getCommands, registerCommands } from './lib/commands.js'

login(process.env.TOKEN)

onReady(async () => {
  const dirname = path.dirname(fileURLToPath(import.meta.url))
  const localeFile = path.join(dirname, 'locales', process.env.LOCALE + '.yml')
  debug('Using locale file at', localeFile)

  const app = () => getApp(process.env.GUILD)

  registerCommands(app, localeFile)

  const commands = await getCommands(app)
  debug('Registered commands: ', commands)
})

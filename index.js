import { debug } from './lib/logger.js'
import { getApp, login, onReady } from './lib/discord-client.js'
import { getCommands, registerCommands } from './lib/commands/index.js'

login(process.env.TOKEN)

onReady(async () => {
  const app = () => getApp(process.env.GUILD)

  registerCommands(app)

  const commands = await getCommands(app)
  debug('Registered commands: ', commands)
})

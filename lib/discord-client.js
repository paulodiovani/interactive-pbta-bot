import Discord from 'discord.js'
import { info } from './logger.js'

const client = new Discord.Client()

export const getApi = () => {
  return client.api
}

export const getApp = (guildId) => {
  const app = getApi().applications(client.user.id)

  if (guildId) {
    app.guilds(guildId)
  }

  return app
}

export const login = (token) => {
  client.login(token)
}

export const onInteraction = (callback) => {
  client.ws.on('INTERACTION_CREATE', async (interaction) => {
    const { name: command, options: [{ name: group, options: [{ name: subcommand }] }] } = interaction.data
    info('Received interaction', command, group, subcommand)
    await callback(interaction)
  })
}

export const onReady = (callback) => {
  client.on('ready', async () => {
    info('Bot is ready! 🤖')
    await callback()
  })
}

import Discord from 'discord.js'
import { info } from './logger.js'

const client = new Discord.Client()

export const getApp = (guildId) => {
  const app = client.api.applications(client.user.id)

  if (guildId) {
    app.guilds(guildId)
  }

  return app
}

export const login = (token) => {
  client.login(token)
}

export const onReady = (callback) => {
  client.on('ready', () => {
    info('Bot is ready! 🤖')
    callback()
  })
}

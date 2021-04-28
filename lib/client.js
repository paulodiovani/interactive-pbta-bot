import { Client } from 'discord.js'
import { debug } from './logger.js'

// singleton instance
let client

export const getClient = () => {
  if (!client) {
    client = new Client()
  }

  return client
}

export const getApp = (guildId) => {
  const app = client.api.applications(client.user.id)

  if (guildId) {
    debug('Connecting only to guild', guildId)
    app.guilds(guildId)
  }

  return app
}

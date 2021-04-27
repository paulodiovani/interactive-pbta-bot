import { Client } from 'discord.js'

const client = new Client()

export const getClient = () => {
  return client
}

export const getApp = (guildId) => {
  const app = client.api.applications(client.user.id)

  if (guildId) {
    app.guilds(guildId)
  }

  return app
}

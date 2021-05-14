import { Client as _Client } from 'discord.js'
import { debug } from './logger.js'

// singleton instance
let _client

export const getClient = ({ Client = _Client } = {}) => {
  if (!_client) {
    _client = new Client()
  }

  return _client
}

export const getApp = (guildId, { client = _client } = {}) => {
  const app = client.api.applications(client.user.id)

  if (guildId) {
    debug('Connecting only to guild', guildId)
    app.guilds(guildId)
  }

  return app
}

import path from 'path'
import { fileURLToPath } from 'url'
import { DICE_2D6 } from './lib/constants.js'
import * as Bot from './lib/bot.js'

const { LOCALE = 'en_US' } = process.env

const dirname = path.dirname(fileURLToPath(import.meta.url))
const localeFile = path.join(dirname, 'locales', LOCALE + '.yml')

const config = {
  ...process.env,
  LOCALE,
  LOCALE_FILE: localeFile,
  EMBED_COLOR: process.env.EMBED_COLOR || '#000',
  GUILD: process.env.GUILD,
  TOKEN: process.env.TOKEN,
  DICE: process.env.DICE || DICE_2D6,
  DELETE_COMMANDS: process.env.DELETE_COMMANDS || false,
}

Bot.start(config)

import * as Bot from './lib/bot.js'
import path from 'path'
import { DICE_2D6 } from './lib/constants.js'
import { error } from './lib/logger.js'
import { fileURLToPath } from 'url'

const { MOVELIST = 'moves/apocalypse-world.en-us.yml' } = process.env

const dirname = path.dirname(fileURLToPath(import.meta.url))
const movesFile = path.join(dirname, MOVELIST)

const config = {
  ...process.env,
  MOVES_FILE: movesFile,
  COLOR: process.env.COLOR || '#000',
  GUILD: process.env.GUILD,
  TOKEN: process.env.TOKEN,
  DICE: process.env.DICE || DICE_2D6,
  DELETE_COMMANDS: process.env.DELETE_COMMANDS === 'true',
}

const start = async () => {
  try {
    await Bot.start(config)
  } catch (e) {
    error(e)
    process.exit(1)
  }
}
start()

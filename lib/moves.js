import YAML from 'yaml'
import fs from 'fs/promises'
import { debug, error } from './logger.js'

export const loadMoves = async (movesFile) => {
  try {
    const file = await fs.readFile(movesFile, 'utf8')
    const moveList = YAML.parse(file)

    debug('Read moves from yaml', JSON.stringify(moveList))
    return moveList
  } catch (e) {
    error(e)
    throw new Error('Failed to load move list.')
  }
}

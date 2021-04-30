import YAML from 'yaml'
import fs from 'fs/promises'
import { debug } from './logger.js'

export const loadLocales = async (localeFile) => {
  try {
    const file = await fs.readFile(localeFile, 'utf8')
    const locales = YAML.parse(file)

    debug('Read locales from yaml', JSON.stringify(locales))
    return locales
  } catch (e) {
    throw new Error('Failed to load locales.')
  }
}

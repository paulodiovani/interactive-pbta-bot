import YAML from 'yaml'
import fs from 'fs'
import { debug, error } from './logger.js'

export const loadLocales = (localeFile) => {
  try {
    const file = fs.readFileSync(localeFile, 'utf8')
    const locales = YAML.parse(file)

    debug('Read locales from yaml', JSON.stringify(locales))
    return locales
  } catch (e) {
    error('Failed to load locales.', e)
    return {}
  }
}

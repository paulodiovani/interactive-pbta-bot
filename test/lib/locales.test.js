import { readdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { expect } from 'chai'
import { loadLocales } from '../../lib/locales.js'

describe('lib/locales.js', () => {
  const getLocaleFiles = async () => {
    const dirname = path.dirname(fileURLToPath(import.meta.url))
    const localesPath = path.join(dirname, '..', '..', 'locales')
    const localeFiles = await readdir(localesPath)

    return localeFiles.map((file) => path.join(localesPath, file))
  }

  describe('.loadLocales', () => {
    it('throws error when provided inexistent path', async () => {
      try {
        await loadLocales('/tmp/invalid-path')
      } catch (e) {
        expect(e.message).to.eq('Failed to load locales.')
      }
    })

    it('returns an object with expected commands and translations', async () => {
      const localeFiles = await getLocaleFiles()

      for (const localeFile of localeFiles) {
        try {
          const locales = await loadLocales(localeFile)

          expect(locales)
            .to.be.an('object')
            .that.include.all.keys('application', 'commands', 'categories', 'moves')

          expect(locales.application)
            .to.be.an('object')
            .that.include.all.keys('attribute', 'dice', 'modifier', 'result', 'total')

          for (const key in locales.application) {
            expect(locales.application[key])
              .to.be.an('object')
              .that.include.all.keys('name', 'description')
          }

          for (const command of locales.commands) {
            expect(command)
              .to.be.an('object')
              .that.include.all.keys('name', 'description')
          }

          for (const category of locales.categories) {
            expect(category)
              .to.be.an('object')
              .that.include.all.keys('name', 'description')
          }

          for (const move of locales.moves) {
            expect(move)
              .to.be.an('object')
              .that.include.all.keys('name', 'description', 'category', 'results')

            expect(locales.categories.map((cat) => cat.name)).to.include(move.category)

            expect(move.results)
              .to.be.an('object')
              .that.include.all.keys('complete_success', 'success_with_complications', 'failure')
          }
        } catch (e) {
          throw new Error(`${e.message} in ${path.basename(localeFile)}`)
        }
      }
    })
  })
})

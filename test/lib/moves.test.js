import { readdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { expect } from 'chai'
import { loadMoves } from '../../lib/moves.js'

describe('lib/moves.js', () => {
  const getMovesFiles = async () => {
    const dirname = path.dirname(fileURLToPath(import.meta.url))
    const movesPath = path.join(dirname, '..', '..', 'moves')
    const files = await readdir(movesPath)

    return files.map((file) => path.join(movesPath, file))
  }

  describe('.loadMoves', () => {
    it('throws error when provided inexistent path', async () => {
      try {
        await loadMoves('/tmp/invalid-path')
      } catch (e) {
        expect(e.message).to.eq('Failed to load move list.')
      }
    })

    it('returns an object with expected commands and translations', async () => {
      const files = await getMovesFiles()

      for (const movesFile of files) {
        try {
          const moveList = await loadMoves(movesFile)

          expect(moveList)
            .to.be.an('object')
            .that.include.all.keys('application', 'commands', 'categories', 'moves')

          expect(moveList.application)
            .to.be.an('object')
            .that.include.all.keys('attribute', 'dice', 'modifier', 'result', 'total')

          for (const key in moveList.application) {
            expect(moveList.application[key])
              .to.be.an('object')
              .that.include.all.keys('name', 'description')
          }

          for (const command of moveList.commands) {
            expect(command)
              .to.be.an('object')
              .that.include.all.keys('name', 'description')
          }

          for (const category of moveList.categories) {
            expect(category)
              .to.be.an('object')
              .that.include.all.keys('name', 'description')
          }

          for (const move of moveList.moves) {
            expect(move)
              .to.be.an('object')
              .that.include.all.keys('name', 'description', 'category', 'results')

            expect(moveList.categories.map((cat) => cat.name)).to.include(move.category)

            expect(move.results)
              .to.be.an('object')
              .that.include.all.keys('complete_success', 'success_with_complications', 'failure')
          }
        } catch (e) {
          throw new Error(`${e.message} in ${path.basename(movesFile)}`)
        }
      }
    })
  })
})

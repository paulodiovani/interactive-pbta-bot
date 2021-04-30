import { expect } from 'chai'
import { DICE_2D6, DICE_2D10, RESULT_SUCCESS, RESULT_PARTIAL, RESULT_FAILURE } from '../../lib/constants.js'
import { roll, getResult } from '../../lib/dice.js'

describe('lib/dice.js', () => {
  describe('.roll', () => {
    const repeat = (times = 1, fn = () => {}) => {
      for (let i = 0; i < times; i++) {
        fn()
      }
    }

    context('when dice is 2d10', () => {
      // repeat some times to test with different values
      repeat(25, () => {
        it('returns an array of two integers within 1 and 10', () => {
          const result = roll(DICE_2D10)
          expect(result).to.be.an('array')
          expect(result[0])
            .to.be.an('number')
            .that.is.within(1, 10)
            .that.is.eq(Math.ceil(result[0]))
          expect(result[1])
            .to.be.an('number')
            .that.is.within(1, 10)
            .that.is.eq(Math.ceil(result[1]))
        })
      })
    })

    context('when dice is 2d6', () => {
      // repeat some times to test with different values
      repeat(25, () => {
        it('returns an array of two integers within 1 and 6', () => {
          const result = roll(DICE_2D6)
          expect(result).to.be.an('array')
          expect(result[0])
            .to.be.an('number')
            .that.is.within(1, 6)
            .that.is.eq(Math.ceil(result[0]))
          expect(result[1])
            .to.be.an('number')
            .that.is.within(1, 6)
            .that.is.eq(Math.ceil(result[1]))
        })
      })
    })
  })

  describe('.getResult', () => {
    context('when dice is 2d10', () => {
      it('returns complete success when value is equal or greater than 15', () => {
        expect(getResult(DICE_2D10, 15)).to.be.eq(RESULT_SUCCESS)
        expect(getResult(DICE_2D10, 16)).to.be.eq(RESULT_SUCCESS)
        expect(getResult(DICE_2D10, 19)).to.be.eq(RESULT_SUCCESS)
        expect(getResult(DICE_2D10, 20)).to.be.eq(RESULT_SUCCESS)
        expect(getResult(DICE_2D10, 999)).to.be.eq(RESULT_SUCCESS)
      })

      it('returns complete success when value is within 10 and 14', () => {
        expect(getResult(DICE_2D10, 10)).to.be.eq(RESULT_PARTIAL)
        expect(getResult(DICE_2D10, 11)).to.be.eq(RESULT_PARTIAL)
        expect(getResult(DICE_2D10, 12)).to.be.eq(RESULT_PARTIAL)
        expect(getResult(DICE_2D10, 13)).to.be.eq(RESULT_PARTIAL)
        expect(getResult(DICE_2D10, 14)).to.be.eq(RESULT_PARTIAL)
      })

      it('returns complete success when value is equal or equal or lower than 9', () => {
        expect(getResult(DICE_2D10, 1)).to.be.eq(RESULT_FAILURE)
        expect(getResult(DICE_2D10, 2)).to.be.eq(RESULT_FAILURE)
        expect(getResult(DICE_2D10, 5)).to.be.eq(RESULT_FAILURE)
        expect(getResult(DICE_2D10, 8)).to.be.eq(RESULT_FAILURE)
        expect(getResult(DICE_2D10, 9)).to.be.eq(RESULT_FAILURE)
      })
    })

    context('when dice is 2d6', () => {
      it('returns complete success when value is equal or greater than 10', () => {
        expect(getResult(DICE_2D6, 10)).to.be.eq(RESULT_SUCCESS)
        expect(getResult(DICE_2D6, 11)).to.be.eq(RESULT_SUCCESS)
        expect(getResult(DICE_2D6, 999)).to.be.eq(RESULT_SUCCESS)
      })

      it('returns complete success when value is within 7 and 9', () => {
        expect(getResult(DICE_2D6, 7)).to.be.eq(RESULT_PARTIAL)
        expect(getResult(DICE_2D6, 8)).to.be.eq(RESULT_PARTIAL)
        expect(getResult(DICE_2D6, 9)).to.be.eq(RESULT_PARTIAL)
      })

      it('returns complete success when value is equal or equal or lower than 6', () => {
        expect(getResult(DICE_2D6, 1)).to.be.eq(RESULT_FAILURE)
        expect(getResult(DICE_2D6, 2)).to.be.eq(RESULT_FAILURE)
        expect(getResult(DICE_2D6, 6)).to.be.eq(RESULT_FAILURE)
      })
    })
  })
})

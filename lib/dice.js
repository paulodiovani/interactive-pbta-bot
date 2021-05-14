import { DICE_2D6, DICE_2D10, RESULT_SUCCESS, RESULT_PARTIAL, RESULT_FAILURE } from './constants.js'

const getRandomInt = (max) => {
  return Math.ceil(Math.random() * max)
}

export const roll = (dice) => {
  switch (dice) {
    case DICE_2D10:
      return [getRandomInt(10), getRandomInt(10)]
    case DICE_2D6:
    default:
      return [getRandomInt(6), getRandomInt(6)]
  }
}

export const getResult = (dice, value) => {
  switch (dice) {
    case DICE_2D10:
      if (value >= 15) return RESULT_SUCCESS
      if (value >= 10) return RESULT_PARTIAL
      return RESULT_FAILURE
    case DICE_2D6:
      if (value >= 10) return RESULT_SUCCESS
      if (value >= 7) return RESULT_PARTIAL
      return RESULT_FAILURE
    default:
      return [getRandomInt(6), getRandomInt(6)]
  }
}

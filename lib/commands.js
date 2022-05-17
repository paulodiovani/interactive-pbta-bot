import { SUB_COMMAND, SUB_COMMAND_GROUP, INTEGER } from './constants.js'
import { getApp as _getApp } from './client.js'

const moveToOption = (moveList) => (move) => ({
  name: move.name,
  description: move.description,
  type: SUB_COMMAND,
  options: [
    {
      name: moveList.application.attribute.name,
      description: moveList.application.attribute.description,
      type: INTEGER,
      required: true,
    },
    {
      name: moveList.application.modifier.name,
      description: moveList.application.modifier.description,
      type: INTEGER,
      required: false,
    },
  ],
})

const categoryToOption = (moveList) => (category) => ({
  name: category.name,
  description: category.description,
  type: SUB_COMMAND_GROUP,
  options: moveList.moves?.filter((m) => m.category === category.name)?.map(moveToOption(moveList)) || [],
})

const commandToData = (moveList) => (command) => ({
  name: command.name,
  description: command.description,
  options: moveList.categories?.filter((c) => c.command === command.name).map(categoryToOption(moveList)) || [],
})

export const getCommands = async ({ getApp = _getApp } = {}) => {
  return await getApp().commands.get()
}

export const registerCommands = async (moveList, { getApp = _getApp } = {}) => {
  const { commands } = moveList

  const data = commands.map(commandToData(moveList))
  await getApp().commands.put({ data })
}

export const deleteCommand = async (command, { getApp = _getApp } = {}) => {
  await getApp().commands(command.id).delete()
}

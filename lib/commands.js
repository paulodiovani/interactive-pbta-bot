import { SUB_COMMAND, SUB_COMMAND_GROUP, INTEGER } from './constants.js'
import { getApp as _getApp } from './client.js'

const moveToOption = (locales) => (move) => ({
  name: move.name,
  description: move.description,
  type: SUB_COMMAND,
  options: [
    {
      name: locales.application.attribute.name,
      description: locales.application.attribute.description,
      type: INTEGER,
      required: true,
    },
    {
      name: locales.application.modifier.name,
      description: locales.application.modifier.description,
      type: INTEGER,
      required: false,
    },
  ],
})

const categoryToOption = (locales) => (category) => ({
  name: category.name,
  description: category.description,
  type: SUB_COMMAND_GROUP,
  options: locales.moves?.filter((m) => m.category === category.name)?.map(moveToOption(locales)) || [],
})

const commandToData = (locales) => (command) => ({
  name: command.name,
  description: command.description,
  options: locales.categories?.map(categoryToOption(locales)) || [],
})

export const getCommands = async ({ getApp = _getApp } = {}) => {
  return await getApp().commands.get()
}

export const registerCommands = async (locales, { getApp = _getApp } = {}) => {
  const { commands } = locales

  const data = commands.map(commandToData(locales))
  await getApp().commands.put({ data })
}

export const deleteCommand = async (command, { getApp = _getApp } = {}) => {
  await getApp().commands(command.id).delete()
}

import { debug } from './logger.js'
import { readLocales } from './locales.js'

const SUB_COMMAND = 1
const SUB_COMMAND_GROUP = 2

const subCommandToOption = (subCommand) => ({
  name: subCommand.name,
  description: subCommand.description,
  type: SUB_COMMAND,
})

const groupToCommandOption = (group) => ({
  name: group.name,
  description: group.description,
  type: SUB_COMMAND_GROUP,
  options: group.sub_commands.map(subCommandToOption),
})

const commandToData = (command) => ({
  data: {
    name: command.name,
    description: command.description,
    options: command.groups.map(groupToCommandOption),
  },
})

export const getCommands = (app) => {
  return app().commands.get()
}

export const registerCommands = async (app, localeFile) => {
  const locales = readLocales(localeFile)

  const commands = locales.commands.map(commandToData)

  debug('commands', JSON.stringify(commands, null, 2))

  // register all commands
  commands.forEach(async (command) => {
    await app().commands.post(command)
  })
}

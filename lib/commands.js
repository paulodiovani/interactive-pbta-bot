import { debug } from './logger.js'
import { loadLocales } from './locales.js'

const SUB_COMMAND = 1
const SUB_COMMAND_GROUP = 2

const CHANNEL_MESSAGE_WITH_SOURCE = 4

const interactionToData = (interaction) => ({
  type: CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: 'Hello',
  },
})

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
  name: command.name,
  description: command.description,
  options: command.groups.map(groupToCommandOption),
})

export const getCommands = async (app) => {
  return await app().commands.get()
}

export const registerCommands = async (app, localeFile) => {
  const locales = loadLocales(localeFile)

  const data = locales.commands.map(commandToData)

  debug('commands', JSON.stringify(data, null, 2))

  // register all commands
  await app().commands.put({ data })
}

export const registerInteractions = async (api, onInteraction, localeFile) => {
  // read interactions
  onInteraction(async (interaction) => {
    const data = interactionToData(interaction)
    api.interactions(interaction.id, interaction.token).callback.post({ data })
  })
}

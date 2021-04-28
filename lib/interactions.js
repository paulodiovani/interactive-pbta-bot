import { APIMessage, MessageEmbed } from 'discord.js'
import { getClient } from './client.js'
import { SUB_COMMAND, SUB_COMMAND_GROUP, INTEGER, CHANNEL_MESSAGE_WITH_SOURCE } from './constants.js'
import { debug, info } from './logger.js'
import { roll, getResult } from './dice.js'

const createApiMessage = async (interaction, content) => {
  const { data } = await APIMessage.create(
    getClient().channels.resolve(interaction.channel_id),
    content,
  )
    .resolveData()

  return { ...data }
}

const optionsToMoveHash = (memo, item) => ({
  ...memo,
  ...(item.type === SUB_COMMAND && { name: item.name }),
  ...(item.type === SUB_COMMAND_GROUP && { category: item.name }),
  args: {
    ...memo.args,
    ...(item.type === INTEGER && { [item.name]: item.value }),
  },
  ...item.options?.reduce(optionsToMoveHash, {}),
})

const interactionToData = async (interaction, locales, dice, color) => {
  const { application, moves } = locales
  const { data: { options } } = interaction
  const moveHash = options.reduce(optionsToMoveHash, {})
  debug('Move', moveHash)

  const moveLocales = moves.find((m) => m.name === moveHash.name)
  debug('Move locales', moveLocales)

  const diceRoll = roll(dice)
  const attribute = moveHash.args[application.attribute.name]
  const modifier = moveHash.args[application.modifier.name] || 0
  const total = diceRoll[0] + diceRoll[1] + attribute + modifier
  const result = getResult(dice, total)

  const embed = new MessageEmbed()
    .setColor(color)
    .setTitle(moveLocales.description)
    .addFields(
      { name: application.dice.description, value: diceRoll.join(', '), inline: true },
      { name: application.attribute.description, value: attribute, inline: true },
      { name: application.modifier.description, value: modifier, inline: true },
      { name: application.total.description, value: total, inline: true },
      { name: application.result.description, value: moveLocales.results[result] },
    )

  const data = await createApiMessage(interaction, embed)

  return {
    type: CHANNEL_MESSAGE_WITH_SOURCE,
    data,
  }
}

export const waitForInteractions = (locales, dice, color) => {
  getClient().ws.on('INTERACTION_CREATE', async (interaction) => {
    const { name, options } = interaction.data
    info('Received interaction', name, JSON.stringify(options))

    const data = await interactionToData(interaction, locales, dice, color)
    await getClient().api.interactions(interaction.id, interaction.token).callback.post({ data })
  })
}

import { APIMessage, MessageEmbed } from 'discord.js'
import { getClient as _getClient } from './client.js'
import { SUB_COMMAND, SUB_COMMAND_GROUP, INTEGER, CHANNEL_MESSAGE_WITH_SOURCE } from './constants.js'
import { debug, info } from './logger.js'
import { roll, getResult } from './dice.js'

const createApiMessage = async (interaction, content, { getClient }) => {
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

const interactionToData = async (interaction, moveList, { DICE, COLOR }, { getClient }) => {
  const { application, moves } = moveList
  const { data: { options } } = interaction
  const moveHash = options.reduce(optionsToMoveHash, {})
  debug('Move', moveHash)

  const moveItem = moves.find((m) => m.name === moveHash.name)
  debug('Moves', moveItem)

  const diceRoll = roll(DICE)
  const attribute = moveHash.args[application.attribute.name]
  const modifier = moveHash.args[application.modifier.name] || 0
  const total = diceRoll[0] + diceRoll[1] + attribute + modifier
  const result = getResult(DICE, total)

  const embed = new MessageEmbed()
    .setColor(COLOR)
    .setTitle(moveItem.description)
    .addFields(
      { name: application.dice.description, value: diceRoll.join(', '), inline: true },
      { name: application.attribute.description, value: attribute, inline: true },
      { name: application.modifier.description, value: modifier, inline: true },
      { name: application.total.description, value: total, inline: true },
      { name: application.result.description, value: moveItem.results[result] },
    )

  const data = await createApiMessage(interaction, embed, { getClient })

  return {
    type: CHANNEL_MESSAGE_WITH_SOURCE,
    data,
  }
}

export const waitForInteractions = (moveList, { DICE, COLOR }, { getClient = _getClient } = {}) => {
  getClient().ws.on('INTERACTION_CREATE', async (interaction) => {
    const { name, options } = interaction.data
    info('Received interaction', name, JSON.stringify(options))

    const data = await interactionToData(interaction, moveList, { DICE, COLOR }, { getClient })
    await getClient().api.interactions(interaction.id, interaction.token).callback.post({ data })
  })
}

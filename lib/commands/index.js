export const getCommands = (app) => {
  return app().commands.get()
}

export const registerCommands = async (app) => {
  await app().commands.post({
    data: {
      name: 'test-pbta',
      description: 'Sample test command',
    },
  })
}

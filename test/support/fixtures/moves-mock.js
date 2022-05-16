const movesMock = {
  application: {
    attribute: {
      name: 'attribute',
      description: 'Attr Description',
    },
    dice: {
      name: 'dice',
      description: 'Dice Description',
    },
    modifier: {
      name: 'modifier',
      description: 'Mod Description',
    },
    result: {
      name: 'result',
      description: 'Res Description',
    },
    total: {
      name: 'total',
      description: 'Tot Description',
    },
  },
  commands: [
    {
      name: 'sample-command',
      description: 'sample-command-description',
    },
  ],
  categories: [
    {
      name: 'sample-category',
      description: 'sample-category-description',
    },
  ],
  moves: [
    {
      name: 'sample-move',
      description: 'sample-move-description',
      category: 'sample-category',
      results: {
        complete_success: 'sample-success',
        success_with_complications: 'sample-succes-with-complication',
        failure: 'sample-failure',
      },
    },
  ],
}

export default movesMock

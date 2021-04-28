const localesMock = {
  application: {
    attribute: {
      name: 'attribute',
      description: 'Attr Description',
    },
    modifier: {
      name: 'modifier',
      description: 'Mod Description',
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
    },
  ],
}

export default localesMock

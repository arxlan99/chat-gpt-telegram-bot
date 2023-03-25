const models = [
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT 3.5 Turbo',
    description:
      'GPT 3.5 Turbo is a large model with 1.5B parameters trained on a variety of tasks.',
    howToImplement: '/setmodel gpt-3.5-turbo',
  },
  {
    id: 'gpt-4',
    name: 'GPT 4',
    description:
      'GPT 4 is a large model with 1.5B parameters trained on a variety of tasks. !WARNING! This model is still in beta and may not work as expected.',
    howToImplement: '/setmodel gpt-4',
  },
];

module.exports = models;

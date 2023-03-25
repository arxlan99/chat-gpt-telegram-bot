const { Configuration, OpenAIApi } = require('openai');

const createGpt4 = async (apiKey, prompt, chatId, bot) => {
  const configuration = new Configuration({
    apiKey: apiKey,
  });
  const openai = new OpenAIApi(configuration);

  const loadingMessage = await bot.sendMessage(chatId, 'Thinking...');

  var messages = [
    { role: 'system', content: 'Stay in character. You are math teacher' },
    { role: 'user', content: prompt },
  ];

  const completion = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: messages,
  });

  console.log({ completion });

  await bot.deleteMessage(chatId, loadingMessage.message_id);

  return completion.data?.choices[0]?.message?.content || 'No response';
};

module.exports = createGpt4;

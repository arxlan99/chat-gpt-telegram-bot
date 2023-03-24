const { Configuration, OpenAIApi } = require('openai');

const createTurbo = async (apiKey, prompt, chatId, bot) => {
  const configuration = new Configuration({
    apiKey: apiKey,
  });
  const openai = new OpenAIApi(configuration);

  const loadingMessage = await bot.sendMessage(chatId, 'Thinking...');

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    max_tokens: 100,
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: prompt },
    ],
  });

  await bot.deleteMessage(chatId, loadingMessage.message_id);

  return completion.data?.choices[0]?.message?.content || 'No response';
};

module.exports = createTurbo;

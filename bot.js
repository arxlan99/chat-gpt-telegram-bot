const TelegramBot = require('node-telegram-bot-api');
const models = require('./constants/models');
const User = require('./models/userModel');
const createTurbo = require('./utils/gpt-3.5-turbo');

const startBot = () => {
  const token = process.env.TELEGRAM_TOKEN;
  const bot = new TelegramBot(token, { polling: true });

  // give first message without prompt
  bot.onText(/\/start/, (msg) => {
    bot.sendMessage(
      msg.chat.id,
      `
      <b>Welcome to my bot!</b>\n\n You can Chat Gpt models with Api using this models. If you want to see all the commands, type /help
      `,
      {
        parse_mode: 'HTML',
      }
    );
  });

  bot.setMyCommands([
    { command: '/start', description: 'Start the bot' },
    { command: '/help', description: 'Hi bro I am here for you' },
    { command: '/models', description: 'Show all the models' },
    { command: '/setmodel', description: 'Set the model' },
    { command: '/setapikey', description: 'Set the API key' },
    { command: '/chat', description: 'Chat with the bot' },
  ]);

  bot.onText(/\/help/, (msg) => {
    // bot.sendDice(msg.chat.id, { emoji: '🎲' });
    bot.sendAnimation(
      msg.chat.id,
      'https://media.giphy.com/media/lqLNp3dJlWihNuhegE/giphy.gif'
    );

    // write as a html message
    bot.sendMessage(
      msg.chat.id,
      'You can see all the commands under the /help command'
    );
    bot.sendMessage(
      msg.chat.id,
      `
        <b>Commands</b>

        /start - Start the bot

        /help - Show this message

        /models - Show all the models

        /setmodel - Set the model, e.g. <b>/setmodel</b> davinci

        /setapikey - Set the API key, e.g. /setapikey YOUR_API_KEY

        /chat - Chat with the bot, e.g. /chat Hello, how are you?
        
        /getmodel - Get the current model

        /getapikey - Get the current API key
      `,
      {
        parse_mode: 'HTML',
      }
    );
  });

  bot.onText(/\/models/, async (msg) => {
    // write models nice and pretty
    bot.sendMessage(
      msg.chat.id,
      `
        ${models
          .map((model) => {
            return `*${model.name}*\n${model.description}\n\n`;
          })
          .join('')}
        `
    );
  });

  bot.onText(/\/setmodel (.+)/, (msg, match) => {
    const modelId = match[1];
    openai.setModelId(modelId);
    // bot.sendMessage(msg.chat.id, `Model set to ${modelId}`);
    bot.sendMessage(
      msg.chat.id,
      'Right now, just work gpt-3.5-turbo model, I will add more models soon'
    );
  });

  bot.onText(/\/setapikey (.+)/, async (msg, match) => {
    const userId = msg.from.id;
    const apiKey = match[1];

    const user = await User.findOneAndUpdate(
      {
        userId: userId,
      },
      {
        apiKey: apiKey,
      },
      {
        new: true,
        upsert: true,
      }
    );

    if (user) {
      bot.sendMessage(
        msg.chat.id,
        `Your OpenAI API key has been set to ${apiKey}`
      );
    } else {
      bot.sendMessage(msg.chat.id, 'There was an error setting your API key');
    }
  });

  bot.onText(/\/getapikey/, async (msg) => {
    const userId = msg.from.id;

    const apiKey = await User.findOne({ userId: userId }).select('apiKey');

    if (!apiKey) {
      bot.sendAnimation(
        msg.chat.id,
        'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyQ/giphy.gif'
      );
      bot.sendMessage(msg.chat.id, 'You have not set your OpenAI API key yet!');
    } else {
      bot.sendMessage(msg.chat.id, `Your OpenAI API key is: ${apiKey}`);
    }
  });

  bot.onText(/\/getmodel/, (msg) => {
    bot.sendMessage(msg.chat.id, `Current model: ${openai.modelId}`);
  });

  bot.onText(/\/deleteApiKey/, async (msg) => {
    const userId = msg.from.id;
    const user = await User.findOneAndUpdate(
      {
        userId: userId,
      },
      {
        apiKey: null,
      },
      {
        new: true,
        upsert: true,
      }
    );

    if (user) {
      bot.sendMessage(msg.chat.id, 'Your OpenAI API key has been deleted.');
    }
    bot.sendMessage(msg.chat.id, 'There was an error deleting your API key');
  });

  bot.onText(/\/chat/, async (msg) => {
    const userId = msg.from.id;
    const user = await User.findOne({ userId: userId }).select('apiKey');

    if (!user.apiKey) {
      bot.sendMessage(
        msg.chat.id,
        'Please set your OpenAI API key using the /setapikey command.'
      );
      return;
    }

    if (!msg.text) {
      bot.sendMessage(
        msg.chat.id,
        'Please enter a prompt, e.g. /chat Hello, how are you?'
      );
      return;
    }

    prompt = msg?.text?.replace('/chat', '');

    try {
      const returnMessage = await createTurbo(
        user.apiKey,
        prompt,
        msg.chat.id,
        bot
      );
      bot.sendMessage(msg.chat.id, returnMessage);
    } catch (error) {
      bot.sendMessage(
        msg.chat.id,
        'There was an error, please control your API key'
      );
    }
  });
};

module.exports = startBot;

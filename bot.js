const TelegramBot = require('node-telegram-bot-api');
const models = require('./constants/models');
const Message = require('./models/messageModel');
const User = require('./models/userModel');
const createTurbo = require('./utils/gpt-3.5-turbo');
const createGpt4 = require('./utils/gpt-4');

// const token = process.env.TELEGRAM_TOKEN;
const token = '6054692269:AAG0Zd_M9CiOruEkmlH2N2bJXWbF1t-zGUQ';
const bot = new TelegramBot(token, { polling: true });

const startBot = () => {
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
    { command: '/getapikey', description: 'Get the API key' },
    { command: '/getmodel', description: 'Get the current model' },
    { command: '/getallmessages', description: 'Get all messages' },
    { command: '/chat', description: 'Chat with the bot' },
    { command: '/setmodelcontent', description: 'Set the model content' },
    {
      command: '/getalluserinformation',
      description: 'Get all user information',
    },
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

        /setmodel - Set the model, e.g. <b>/setmodel</b> gpt-3.5-turbo

        /setapikey - Set the API key, e.g. /setapikey YOUR_API_KEY

        /setmodelcontent - If you wanna customize your model role, set model content, e.g. /setModelContent You are a helpful assistant.

        /getalluserinformation - Get all the user information

        /getapikey - Get the API key

        /chat - Chat with the bot, e.g. /chat Hello, how are you?
        
        /getmodel - Get the current model

        /getapikey - Get the current API key

        /getallmessages - Get all the messages
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
            return `*${model.name}*\n${model.description}\nHow To Implement:     <b>${model.howToImplement}</b>\n\n`;
          })
          .join('')}
        `,
      {
        parse_mode: 'HTML',
      }
    );
  });

  bot.onText(/\/setmodel (.+)/, async (msg, match) => {
    const modelId = match[1];
    const userId = msg.from.id;

    // check if the model exists
    const model = models.find((model) => model.id === modelId);

    if (!model) {
      chat.sendMessage(
        msg.chat.id,
        'This model does not exist, please try again'
      );
      return;
    }

    const user = await User.findOneAndUpdate(
      {
        userId: userId,
      },
      {
        model: modelId,
      },
      {
        new: true,
        upsert: true,
      }
    );

    if (user) {
      bot.sendMessage(
        msg.chat.id,
        'Your model has been set to ' + model.name + '!'
      );
    } else {
      bot.sendMessage(msg.chat.id, 'There was an error setting the model');
    }
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

  bot.onText(/\/setmodelcontent (.+)/, async (msg, match) => {
    const userId = msg.from.id;
    const modelContent = match[1];

    const user = await User.findOneAndUpdate(
      {
        userId: userId,
      },
      {
        modelContent: modelContent,
      },
      {
        new: true,
        upsert: true,
      }
    );

    if (user) {
      bot.sendMessage(
        msg.chat.id,
        `Your model content has been set to ${modelContent}`
      );
    } else if (!user) {
      bot.sendMessage(
        msg.chat.id,
        'There was an error setting your model content'
      );
    }
  });

  bot.onText(/\/getalluserinformation/, async (msg) => {
    const userId = msg.from.id;

    const res = await User.findOne({ userId: userId }).select('-_id -__v');

    if (!res) {
      bot.sendMessage(msg.chat.id, 'You have not set your API key yet!');
    } else {
      bot.sendMessage(
        msg.chat.id,
        'Your user information: ' + '\n' + JSON.stringify(res, null, 2)
      );
    }
  });

  bot.onText(/\/getapikey/, async (msg) => {
    const userId = msg.from.id;

    const res = await User.findOne({ userId: userId }).select('apiKey');

    if (!res) {
      bot.sendAnimation(
        msg.chat.id,
        'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyQ/giphy.gif'
      );
      bot.sendMessage(msg.chat.id, 'You have not set your OpenAI API key yet!');
    } else {
      bot.sendMessage(msg.chat.id, `Your OpenAI API key is: ${res.apiKey}`);
    }
  });

  bot.onText(/\/getmodel/, (msg) => {
    bot.sendMessage(msg.chat.id, `Current model: ${openai.modelId}`);
  });

  bot.onText(/\/getallmessages/, async (msg) => {
    const userId = msg.from.id;

    const { message } = Message.find({ userId: userId });
    if (!message) {
      bot.sendMessage(msg.chat.id, 'You have not sent any messages yet!');
    } else {
      bot.sendMessage(
        msg.chat.id,
        'Your messages: ' + JSON.stringify(message, null, 2)
      );
    }
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

  bot.onText(/\/chat/, async (msg, match) => {
    const userId = msg.from.id;
    const user = await User.findOne({ userId: userId });

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

    if (!prompt) {
      bot.sendMessage(
        msg.chat.id,
        'Please enter a prompt, e.g. /chat Hello, how are you?'
      );
      return;
    }

    try {
      if (user.model === 'gpt-3.5-turbo') {
      }
      let returnMessage;
      switch (user.model) {
        case 'gpt-3.5-turbo':
          returnMessage = await createTurbo(
            user.apiKey,
            prompt,
            msg.chat.id,
            bot
          );
          bot.sendMessage(msg.chat.id, returnMessage);
          break;

        case 'gpt-4':
          returnMessage = await createGpt4(
            user.apiKey,
            prompt,
            msg.chat.id,
            bot
          );
          bot.sendMessage(msg.chat.id, returnMessage);
          break;

        default:
          break;
      }
    } catch (error) {
      bot.sendMessage(
        msg.chat.id,
        'There was an error, please control your API key. If you wanna use GPT-4, you have to attend waitlist and approve the request.'
      );
    }
  });
};

module.exports = startBot;

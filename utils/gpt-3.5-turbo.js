const { Configuration, OpenAIApi } = require('openai');
const Message = require('../models/messageModel');

const getMessageFromDB = async (chatId, prompt) => {
  const messages = await Message.findOne({ user: chatId }).select(
    'message -_id'
  );

  let sendingMessage = [];

  if (!messages) {
    console.log('sendingMessage', sendingMessage);

    sendingMessage.push({
      role: 'system',
      content: 'You are a helpful assistant.',
    });
  } else {
    if (messages.message.length === 0) {
      sendingMessage.push(
        {
          role: 'system',
          content: 'You are a helpful assistant.',
        },
        {
          role: 'user',
          content: prompt,
        }
      );
    } else if (messages.message.length > 0) {
      sendingMessage.push(...messages.message);

      if (messages.message.length > 15) {
        sendingMessage = sendingMessage.slice(-10);
        arr.unshif({
          role: 'system',
          content: 'You are a helpful assistant.',
        });
        sendingMessage.push({
          role: 'user',
          content: prompt,
        });
      }

      sendingMessage.push({
        role: 'user',
        content: prompt,
      });
    }
  }

  return sendingMessage;
};

const addMessageToDB = async (chatId, message) => {
  // if there is no message, create a new message, else update the message

  try {
    const u_message = await Message.findOne({ user: chatId }).select(
      '-_id -__v -user'
    );

    if (!u_message) {
      await Message.create({
        user: chatId,
        message: message,
      });
    } else {
      console.log('sending messages', message);

      try {
        // update the message
        await Message.findOneAndUpdate(
          { user: chatId },
          { $set: { message: message } },
          { new: true }
        );

        await u_message.save();
      } catch (error) {
        console.log('error', error.message);
      }
    }
  } catch (error) {
    console.log('error', error.message);
  }

  return;
};

const createTurbo = async (apiKey, prompt, chatId, bot) => {
  const sendingMessage = await getMessageFromDB(chatId, prompt);

  const configuration = new Configuration({
    apiKey: apiKey,
  });
  const openai = new OpenAIApi(configuration);

  const loadingMessage = await bot.sendMessage(chatId, 'Thinking...');

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    max_tokens: 1000,
    messages: sendingMessage,
  });

  await bot.deleteMessage(chatId, loadingMessage.message_id);

  sendingMessage.push({
    role: 'system',
    content: completion.data?.choices[0]?.message?.content || 'No response',
  });

  await addMessageToDB(chatId, sendingMessage);

  return completion.data?.choices[0]?.message?.content || 'No response';
};

module.exports = createTurbo;

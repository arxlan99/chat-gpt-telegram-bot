

# ChatGPT Playground Telegram Bot

The ChatGPT Telegram Bot is a simple chatbot that uses OpenAI's GPT model to respond to messages as if it were a human. You can also specify which OpenAI model to use for generating responses.

> [Demo - Telegram](https://t.me/chatGptPlaygroundLatest_bot)  

## ***Usage***

 1. Start a conversation with the bot by searching for it in Telegram
    and clicking "Start".
 2. Set your OpenAI API key by sending the /setapikey command followed
    by your API key. For example:

	```js
	/setapikey YOUR_API_KEY
	```
	
	You can take api key from https://platform.openai.com/account/api-keys
	You only need to set your API key once.

 3. Send message using /chat
	```js
	/chat Who are you
	```

## Commands

**/start** - Start a conversation with the bot.

**/help** - Get help with using the bot.

**/setapikey** - Set your OpenAI API key. Follow this command with your API key.

**/setmodel** - Set the OpenAI model to use. Follow this command with the model ID.

## Dependencies

**node-telegram-bot-api:** For interacting with the Telegram API.
**openai:** For generating responses using the OpenAI GPT model.
**mongodb**: For storing user data, such as API keys and message history.


## Installation

**Clone the repository:**
```js
git clone https://github.com/arxlan99/chat-gpt-telegram-bot.git
```
**Install the dependencies:**

```js
npm install
```

**Config .env file**

```js
TELEGRAM_TOKEN = <your  telegram  token>
MONGO_URI = <your  mongo  uri>
```
If you don't know how to reach telegram token, you can watch this [video](https://www.youtube.com/watch?v=Pj8mwuMZZvg)

**Start the bot:**
```js
npm start
```



ChatGPT Playground Telegram Bot
The ChatGPT Telegram Bot is a simple chatbot that uses OpenAI's GPT model to respond to messages as if it were a human. You can also specify which OpenAI model to use for generating responses.

Usage
Start a conversation with the bot by searching for it in Telegram and clicking "Start".

Set your OpenAI API key by sending the /setapikey command followed by your API key. For example:

bash
Copy code
/setapikey YOUR_API_KEY
You only need to set your API key once.

(Optional) Set the OpenAI model ID to use by sending the /setmodel command followed by the model ID. For example:

bash
Copy code
/setmodel curie
The default model is davinci.

Send a message to the bot and wait for it to respond. The bot will generate a response using the selected OpenAI model (or the default model if none is specified).

Commands
/start - Start a conversation with the bot.

/help - Get help with using the bot.

/setapikey - Set your OpenAI API key. Follow this command with your API key.

/setmodel - Set the OpenAI model to use. Follow this command with the model ID.

Dependencies
node-telegram-bot-api: For interacting with the Telegram API.

openai: For generating responses using the OpenAI GPT-3 model.

mongodb: For storing user data, such as API keys and message history.

Installation
Clone the repository:

bash
Copy code
git clone https://github.com/YOUR_USERNAME/chatgpt-telegram-bot.git
Install the dependencies:

Copy code
npm install
Rename config.example.js to config.js and replace YOUR_MONGODB_URI with your MongoDB URI.

Start the bot:

Copy code
npm start
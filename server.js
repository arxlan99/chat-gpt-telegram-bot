const express = require('express');
const cors = require('cors');

const startBot = require('./bot');
const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const port = process.env.PORT || 3000;

const app = express();
app.use(
  cors({
    origin: '*',
  })
);

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Could not connect to MongoDB...', err));

// if mongoose is not ready, wait for it
mongoose.connection.on('connecting', () => {
  console.log('connecting to MongoDB...');
});

// if mongoose is ready, start the bot
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected!');
  startBot();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

/* const express = require('express');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 4000;

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
 */

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const API_URL = 'https://api.mistral.ai/v1/chat/completions';
const API_KEY = process.env.API_KEY;

app.post('/generate', async (req, res) => {
  const { userInput, messages } = req.body;
  if (!userInput) return res.status(400).json({ error: 'Missing userInput' });

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        temperature: 1.5,
        top_p: 1,
        max_tokens: 4096,
        stream: false,
        stop: '</html>',
        random_seed: 0,
        messages: messages || [{ role: 'user', content: userInput }],
        response_format: { type: 'text' },
        presence_penalty: 0,
        frequency_penalty: 0,
        n: 1
      })
    });
    if (!response.ok) {
      return res.status(500).json({ error: 'API error', status: response.status });
    }
    const result = await response.json();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

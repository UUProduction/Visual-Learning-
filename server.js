const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());
app.use(express.static('.'));

app.post('/api/question', async (req, res) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: 'Generate a vocabulary question for grades 1-6 ELA. Return ONLY a valid JSON object with no markdown, no extra text, exactly this format: {"word":"someword","correct":"the correct definition","choices":["correct definition","wrong def 1","wrong def 2","wrong def 3"]} — shuffle the choices randomly.'
        }]
      })
    });
    const data = await response.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('V:L server running on port ' + PORT));

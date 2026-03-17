const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());
app.use(express.static('.'));

app.post('/api/question', async (req, res) => {
  try {
    console.log('Received question request');
    console.log('API key exists:', !!process.env.ANTHROPIC_API_KEY);
    console.log('API key starts with:', process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.substring(0, 10) : 'MISSING');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: 'Generate a vocabulary question for grades 1-6 ELA. Return ONLY a valid JSON object with no markdown, no extra text, exactly this format: {"word":"someword","correct":"the correct definition","choices":["correct definition","wrong def 1","wrong def 2","wrong def 3"]} — shuffle the choices randomly.'
        }]
      })
    });

    console.log('Anthropic status:', response.status);
    const raw = await response.text();
    console.log('Anthropic raw response:', raw);

    const data = JSON.parse(raw);

    if (!data.content || !data.content[0]) {
      return res.status(500).json({ error: 'No content in response', raw: data });
    }

    var text = data.content[0].text.trim();
    text = text.replace(/```json|```/g, '').trim();

    var match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return res.status(500).json({ error: 'No JSON found', raw: text });
    }

    var parsed = JSON.parse(match[0]);

    if (!parsed.word || !parsed.correct || !parsed.choices) {
      return res.status(500).json({ error: 'Invalid structure', raw: parsed });
    }

    res.json({ content: [{ text: JSON.stringify(parsed) }] });

  } catch(e) {
    console.error('Error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('V:L server running on port ' + PORT));

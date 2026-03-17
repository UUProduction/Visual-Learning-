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

    if (!data.content || !data.content[0]) {
      console.error('Bad API response:', JSON.stringify(data));
      return res.status(500).json({ error: 'No content in API response', raw: data });
    }

    // Strip any markdown fences Claude might add
    var text = data.content[0].text.trim();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    // Find JSON object in the text in case there's extra text around it
    var match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      console.error('No JSON found in response:', text);
      return res.status(500).json({ error: 'No JSON in response', raw: text });
    }

    var parsed = JSON.parse(match[0]);

    // Validate structure
    if (!parsed.word || !parsed.correct || !parsed.choices || parsed.choices.length < 2) {
      return res.status(500).json({ error: 'Invalid question structure', raw: parsed });
    }

    res.json({ content: [{ text: JSON.stringify(parsed) }] });

  } catch(e) {
    console.error('Server error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('V:L running on port ' + PORT));

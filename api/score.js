export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, love, life, trust } = req.body;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `You are an empathetic reflection analyser for a philosophical blog about Love, Life, and Trust.
A reader has shared their personal reflections. Analyse them and return a JSON object ONLY — no extra text, no markdown fences.

Reflections:
- On Love: "${love || '(not answered)'}"
- On Life: "${life || '(not answered)'}"
- On Trust: "${trust || '(not answered)'}"

Return this exact JSON structure:
{
  "scores": {
    "love": <integer 1-9>,
    "loveType": <2-word archetype label like "Deep Nurturer" or "Gentle Seeker">,
    "life": <integer 1-9>,
    "lifeType": <2-word archetype label like "Bold Explorer" or "Quiet Philosopher">,
    "trust": <integer 1-9>,
    "trustType": <2-word archetype label like "Faithful Guardian" or "Cautious Grower">
  },
  "greeting": "<Warm one-line greeting using their name: ${name}>",
  "remark": "<3-4 warm, insightful, positive sentences about their overall emotional world. Be specific, poetic, and celebratory of their inner depth.>"
}

Scoring guide:
1-3 = still discovering / guarded / early stage
4-6 = growing / aware / evolving
7-9 = deep / open / mature expression`
      }]
    })
  });

  const data = await response.json();
  const raw = data.content.map(b => b.text || '').join('').replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(raw);
  res.status(200).json(parsed);
}

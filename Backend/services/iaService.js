const axios = require('axios');
const apiKey = process.env.OPENROUTER_API_KEY;
console.log('OpenRouter API Key:', apiKey ? '✅ Presente' : '❌ Faltante o inválida');

async function getPrediction(prompt) {
  try {
    const url = 'https://openrouter.ai/api/v1/chat/completions';

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };

const data = {
  model: 'deepseek/deepseek-chat-v3-0324:free',
  messages: [
    {
      role: 'system',
      content: 'Solo continúa el texto del usuario. No respondas como asistente. No expliques nada. Responde solo con la continuación inmediata, breve y coherente del texto.'
    },
    {
      role: 'user',
      content: prompt
    }
  ],
  max_tokens: 15, // para que la continuación sea breve
  temperature: 0.7
};


    console.log("🧠 Enviando solicitud a OpenRouter con prompt:", prompt);

    const response = await axios.post(url, data, { headers });

    const reply = response.data.choices[0].message.content.trim();
    return reply;

  } catch (error) {
    console.error("❌ Error en getPrediction:", error.message);
    if (error.response) {
      console.error("📡 Código de estado:", error.response.status);
      console.error("📩 Respuesta de error:", JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

module.exports = { getPrediction };

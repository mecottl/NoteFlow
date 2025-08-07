import axios from 'axios';
import config from '../config/env.js';

const apiKey = config.OPENROUTER_API_KEY;
console.log('OpenRouter API Key:', apiKey ? '✅ Presente' : '❌ Faltante o inválida');

async function getPrediction(prompt) {
  try {
    const url = 'https://openrouter.ai/api/v1/chat/completions';

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };

    const data = {
      model: config.OPENROUTER_MODEL,
      messages: [
        {
          role: 'system',
          content: 'Solo continúa el texto del usuario. No respondas como asistente. No expliques nada. Responde solo con la continuación inmediata, breve y coherente del texto. si el usuario pide algo como una lista, una tabla o un código, simplemente continúa con el formato solicitado. No agregues explicaciones ni comentarios adicionales. si una palabra esta incompleta completa la palabra y termina la frase'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 15,
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

const iaService = {
  getPrediction
};

export default iaService;

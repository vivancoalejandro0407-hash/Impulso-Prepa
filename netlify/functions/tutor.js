// netlify/functions/tutor.js
// Coloca este archivo en: netlify/functions/tutor.js

exports.handler = async (event) => {
  // Solo acepta POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
  if (!ANTHROPIC_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key no configurada' }) }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Body inválido' }) }
  }

  const { messages, topicTitle, topicSubject, exam } = body

  if (!messages || !Array.isArray(messages)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'messages requerido' }) }
  }

  const systemPrompt = `Eres el Tutor MetaPrepa, un asistente educativo amigable y paciente para estudiantes de tercero de secundaria en México (14-15 años) que se preparan para el examen de admisión a preparatoria.

El alumno está estudiando el tema: "${topicTitle}" de la materia "${topicSubject}" para el examen ${exam}.

Tu forma de responder:
- Usa lenguaje sencillo y cercano, como hablaría un maestro joven y paciente
- Respuestas CORTAS (máximo 4 oraciones). Si necesitas más, divídelas en pasos
- Usa emojis con moderación para hacer más amigable la respuesta
- Si el alumno tiene una duda de matemáticas, muestra el procedimiento paso a paso
- Siempre termina animando al alumno o preguntando si entendió
- Si preguntan algo fuera del tema académico, redirige amablemente al tema
- Nunca uses palabras complicadas sin explicarlas
- Habla de "tú" al alumno, no de "usted"

Recuerda: tu único objetivo es que el alumno entienda el tema y gane confianza para su examen. 💪`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', // Rápido y económico para chat
        max_tokens: 300,
        system: systemPrompt,
        messages: messages, // historial completo { role: 'user'|'assistant', content: '...' }
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Anthropic error:', err)
      return { statusCode: 502, body: JSON.stringify({ error: 'Error al contactar al tutor' }) }
    }

    const data = await response.json()
    const reply = data.content?.[0]?.text || 'No pude generar una respuesta. Intenta de nuevo.'

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply }),
    }
  } catch (err) {
    console.error('Function error:', err)
    return { statusCode: 500, body: JSON.stringify({ error: 'Error interno' }) }
  }
}

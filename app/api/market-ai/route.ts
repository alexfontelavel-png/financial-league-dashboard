import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { question } = await req.json()
  if (!question) return NextResponse.json({ error: 'Pregunta requerida' }, { status: 400 })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'API key no encontrada', hasKey: false }, { status: 500 })

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Eres un analista financiero experto. El usuario participa en una liga de fantasy trading con dinero virtual.
Responde siempre en español, de forma concisa y clara.
Proporciona análisis basados en fundamentos, tendencias del mercado y datos históricos.
Usa bullets y formato claro para estructurar tu respuesta.
Incluye siempre al final un disclaimer breve recordando que es para fantasy trading y no es asesoramiento financiero real.

Pregunta del usuario: ${question}`,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.7,
          },
        }),
      }
    )

    const data = await res.json()

    // Devolver todo para debug
    if (!res.ok) {
      return NextResponse.json({ error: 'Gemini error', status: res.status, data }, { status: 500 })
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      return NextResponse.json({ error: 'Respuesta vacía', raw: data }, { status: 500 })
    }

    return NextResponse.json({ answer: text })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

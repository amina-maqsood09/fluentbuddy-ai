import process from "process"

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { prompt, answer } = req.body

    if (!answer) {
        return res.status(400).json({ error: 'Answer is required' })
    }

    const apiKey = process.env.GEMINI_API_KEY

    const systemPrompt = `You are an English teacher evaluating a student's short written response.

Challenge topic: "${prompt}"
Student's answer: "${answer}"

Evaluate the response and respond ONLY with valid JSON in this exact format, no markdown, no extra text:
{
  "grammarScore": a number 0-100,
  "vocabularyScore": a number 0-100,
  "clarityScore": a number 0-100,
  "whatWentWell": ["short point 1", "short point 2"],
  "improve": ["short point 1", "short point 2"]
}

Be encouraging but honest. Base scores on the actual quality of the writing.`

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
                }),
            }
        )

        const data: any = await response.json()
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
        const cleaned = rawText.replace(/```json|```/g, '').trim()

        let parsed
        try {
            parsed = JSON.parse(cleaned)
        } catch {
            parsed = {
                grammarScore: 0,
                vocabularyScore: 0,
                clarityScore: 0,
                whatWentWell: [],
                improve: ['Could not evaluate. Please try again.'],
                debugRaw: rawText,
                debugData: data,
            }
        }

        return res.status(200).json(parsed)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Something went wrong.', debugErr: String(err) })
    }
}
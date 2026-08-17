import process from "process"

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { message, topic } = req.body

    if (!message) {
        return res.status(400).json({ error: 'Message is required' })
    }

    const apiKey = process.env.GEMINI_API_KEY

    const systemPrompt = `You are FluentBuddy, a friendly English conversation partner and teacher. The user is practicing English conversation on the topic: "${topic || 'general conversation'}".

Reply naturally to continue the conversation, like a supportive friend would. Keep your reply conversational and not too long (2-4 sentences).

Then, separately analyze the user's LAST message for English mistakes.

Respond ONLY with valid JSON in this exact format, no markdown, no extra text:
{
  "reply": "your natural conversational reply here",
  "correction": {
    "hasMistake": true or false,
    "original": "the user's original sentence if there was a mistake, else empty string",
    "corrected": "the corrected version, else empty string",
    "explanation": "a short simple explanation of the grammar rule, else empty string"
  },
  "newVocabulary": [
    { "word": "a useful word from the conversation", "meaning": "simple definition", "example": "example sentence" }
  ]
}

If there's no mistake, set hasMistake to false and leave original/corrected/explanation empty. newVocabulary can be an empty array if nothing notable.`

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        { role: 'user', parts: [{ text: systemPrompt }] },
                        { role: 'model', parts: [{ text: 'Understood. I will respond only in the specified JSON format.' }] },
                        { role: 'user', parts: [{ text: message }] },
                    ],
                }),
            }
        )

        const data: any = await response.json()

        // TEMP DEBUG LOG
        console.log('GEMINI RAW RESPONSE:', JSON.stringify(data))

        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

        const cleaned = rawText.replace(/```json|```/g, '').trim()

        let parsed
        try {
            parsed = JSON.parse(cleaned)
        } catch {
            parsed = {
                reply: rawText || "Sorry, I couldn't process that. Can you try again?",
                correction: { hasMistake: false, original: '', corrected: '', explanation: '' },
                newVocabulary: [],
                debug: data, // TEMP DEBUG
            }
        }

        return res.status(200).json(parsed)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Something went wrong talking to the AI.' })
    }
}
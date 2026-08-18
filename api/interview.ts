import process from "process"

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { interviewType, history, userAnswer, mode } = req.body

    const apiKey = process.env.GEMINI_API_KEY

    if (mode === 'evaluate') {
        const evalPrompt = `You are an interview coach. Below is a mock ${interviewType} interview transcript (question/answer pairs).

Transcript:
${history}

Evaluate the candidate's overall performance and respond ONLY with valid JSON in this exact format, no markdown, no extra text:
{
  "grammarScore": a number 0-100,
  "vocabularyScore": a number 0-100,
  "clarityScore": a number 0-100,
  "confidenceScore": a number 0-100,
  "whatWentWell": ["point 1", "point 2"],
  "improve": ["point 1", "point 2"]
}`

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: evalPrompt }] }] }),
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
                    grammarScore: 0, vocabularyScore: 0, clarityScore: 0, confidenceScore: 0,
                    whatWentWell: [], improve: ['Could not evaluate. Please try again.'],
                }
            }
            return res.status(200).json(parsed)
        } catch (err) {
            return res.status(500).json({ error: 'Something went wrong.' })
        }
    }

    const systemPrompt = `You are an interviewer conducting a mock ${interviewType} interview. Ask natural, relevant interview questions one at a time, based on the conversation so far. Keep questions short and realistic. Do not evaluate the candidate's answer, just respond with your next question or a brief natural reaction plus the next question.

Respond ONLY with valid JSON in this format, no markdown:
{ "question": "your next interview question or reaction + question" }`

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        { role: 'user', parts: [{ text: systemPrompt }] },
                        { role: 'model', parts: [{ text: 'Understood.' }] },
                        { role: 'user', parts: [{ text: `Conversation so far:\n${history}\n\nCandidate's latest answer: ${userAnswer || '(interview starting)'}` }] },
                    ],
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
            parsed = { question: rawText || 'Tell me about yourself.' }
        }
        return res.status(200).json(parsed)
    } catch (err) {
        return res.status(500).json({ error: 'Something went wrong.' })
    }
}
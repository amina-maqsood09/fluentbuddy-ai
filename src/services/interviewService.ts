export async function getInterviewQuestion(interviewType: string, history: string, userAnswer?: string) {
    const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewType, history, userAnswer, mode: 'question' }),
    })
    if (!response.ok) throw new Error('Failed to get question')
    return response.json()
}

export async function evaluateInterview(interviewType: string, history: string) {
    const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewType, history, mode: 'evaluate' }),
    })
    if (!response.ok) throw new Error('Failed to evaluate')
    return response.json()
}
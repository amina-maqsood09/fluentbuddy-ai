const challengePrompts = [
    'My goals for the next year.',
    'A memorable day in my life.',
    'What makes a good friend.',
    'My favorite place to visit.',
    'A skill I want to learn.',
    'My daily routine.',
    'The best advice I ever received.',
    'A challenge I overcame.',
]

export function getTodaysChallenge(): string {
    const dayIndex = new Date().getDate() % challengePrompts.length
    return challengePrompts[dayIndex]
}

export async function evaluateChallenge(prompt: string, answer: string) {
    const response = await fetch('/api/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, answer }),
    })

    if (!response.ok) {
        throw new Error('Failed to evaluate challenge')
    }

    return response.json()
}
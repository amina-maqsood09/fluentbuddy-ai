export async function sendMessage(message: string, topic: string) {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, topic }),
    })

    if (!response.ok) {
        throw new Error('Failed to get AI response')
    }

    return response.json()
}
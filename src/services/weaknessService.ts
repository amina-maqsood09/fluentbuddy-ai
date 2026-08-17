import { collection, query, where, getDocs } from 'firebase/firestore'
import { db, auth } from './firebase'

export interface WeaknessPattern {
    topic: string
    count: number
}

export async function getWeaknessPatterns(): Promise<WeaknessPattern[]> {
    const user = auth.currentUser
    if (!user) throw new Error('Not logged in')

    const q = query(collection(db, 'conversations'), where('userId', '==', user.uid))
    const snapshot = await getDocs(q)

    const counts: Record<string, number> = {}

    snapshot.forEach((doc) => {
        const messages = doc.data().messages || []
        messages.forEach((msg: any) => {
            if (msg.correction?.hasMistake && msg.correction?.lessonTitle) {
                const title = msg.correction.lessonTitle.trim()
                if (title) {
                    counts[title] = (counts[title] || 0) + 1
                }
            }
        })
    })

    return Object.entries(counts)
        .map(([topic, count]) => ({ topic, count }))
        .sort((a, b) => b.count - a.count)
}

export function getTopWeakness(patterns: WeaknessPattern[]): WeaknessPattern | null {
    if (patterns.length === 0) return null
    return patterns[0]
}
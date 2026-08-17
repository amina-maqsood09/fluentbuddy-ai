import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db, auth } from './firebase'

export interface UserStats {
    totalConversations: number
    vocabularyCount: number
    englishLevel: string
    totalMistakes: number
    correctedMistakes: number
}

export async function getUserStats(): Promise<UserStats> {
    const user = auth.currentUser
    if (!user) throw new Error('Not logged in')

    const convQuery = query(collection(db, 'conversations'), where('userId', '==', user.uid))
    const convSnapshot = await getDocs(convQuery)

    let totalMistakes = 0
    convSnapshot.forEach((doc) => {
        const messages = doc.data().messages || []
        messages.forEach((msg: any) => {
            if (msg.correction?.hasMistake) totalMistakes++
        })
    })

    const vocabQuery = query(collection(db, 'vocabulary'), where('userId', '==', user.uid))
    const vocabSnapshot = await getDocs(vocabQuery)

    return {
        totalConversations: convSnapshot.size,
        vocabularyCount: vocabSnapshot.size,
        englishLevel: '—',
        totalMistakes,
        correctedMistakes: totalMistakes,
    }
}

export async function getUserConversations() {
    const user = auth.currentUser
    if (!user) throw new Error('Not logged in')

    const q = query(
        collection(db, 'conversations'),
        where('userId', '==', user.uid),
        orderBy('updatedAt', 'desc')
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as any[]
}
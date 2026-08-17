import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { db, auth } from './firebase'

export async function saveVocabWord(word: string, meaning: string, example: string) {
  const user = auth.currentUser
  if (!user) throw new Error('Not logged in')

  await addDoc(collection(db, 'vocabulary'), {
    userId: user.uid,
    word,
    meaning,
    example,
    learned: false,
    savedAt: new Date().toISOString(),
  })
}

export async function isWordSaved(word: string): Promise<boolean> {
  const user = auth.currentUser
  if (!user) return false

  const q = query(
    collection(db, 'vocabulary'),
    where('userId', '==', user.uid),
    where('word', '==', word)
  )
  const snapshot = await getDocs(q)
  return !snapshot.empty
}
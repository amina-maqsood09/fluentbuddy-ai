import { collection, addDoc, doc, updateDoc } from 'firebase/firestore'
import { db, auth } from './firebase'
import type { Message } from '../types/chat'

export async function createConversation(topic: string) {
    const user = auth.currentUser
    if (!user) throw new Error('Not logged in')

    const docRef = await addDoc(collection(db, 'conversations'), {
        userId: user.uid,
        topic,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    })

    return docRef.id
}

export async function saveMessages(conversationId: string, messages: Message[]) {
    await updateDoc(doc(db, 'conversations', conversationId), {
        messages,
        updatedAt: new Date().toISOString(),
    })
}
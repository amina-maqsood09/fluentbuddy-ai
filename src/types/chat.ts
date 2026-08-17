export interface Message {
    id: string
    sender: 'user' | 'ai'
    text: string
    correction?: {
        hasMistake: boolean
        original: string
        corrected: string
        explanation: string
    }
    newVocabulary?: { word: string; meaning: string; example: string }[]
}
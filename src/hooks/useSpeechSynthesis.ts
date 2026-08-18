import { useState, useCallback } from 'react'

export function useSpeechSynthesis() {
    const [isSpeaking, setIsSpeaking] = useState(false)
    const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

    const speak = useCallback((text: string) => {
        if (!isSupported) return
        window.speechSynthesis.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'en-US'
        utterance.rate = 1
        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)

        window.speechSynthesis.speak(utterance)
    }, [isSupported])

    const stop = useCallback(() => {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
    }, [])

    return { isSpeaking, isSupported, speak, stop }
}
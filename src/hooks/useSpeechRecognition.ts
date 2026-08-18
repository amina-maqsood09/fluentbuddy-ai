import { useState, useRef, useCallback } from 'react'

export function useSpeechRecognition() {
    const [isListening, setIsListening] = useState(false)
    const [isSupported] = useState(
        typeof window !== 'undefined' &&
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    )
    const recognitionRef = useRef<any>(null)

    const startListening = useCallback((onResult: (text: string) => void) => {
        if (!isSupported) return

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        const recognition = new SpeechRecognition()
        recognition.lang = 'en-US'
        recognition.interimResults = false
        recognition.maxAlternatives = 1

        recognition.onstart = () => setIsListening(true)
        recognition.onend = () => setIsListening(false)
        recognition.onerror = () => setIsListening(false)

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript
            onResult(transcript)
        }

        recognitionRef.current = recognition
        recognition.start()
    }, [isSupported])

    const stopListening = useCallback(() => {
        recognitionRef.current?.stop()
    }, [])

    return { isListening, isSupported, startListening, stopListening }
}
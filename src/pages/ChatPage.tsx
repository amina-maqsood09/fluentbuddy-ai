import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { sendMessage } from '../services/chatService'
import { createConversation, saveMessages } from '../services/conversationService'
import { saveVocabWord } from '../services/vocabularyService'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'
import type { Message } from '../types/chat'

function ChatPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const topic = searchParams.get('topic') || 'Free Conversation'

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            sender: 'ai',
            text: `Hey! Let's talk about ${topic.toLowerCase()}. What would you like to share?`,
        },
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [conversationId, setConversationId] = useState<string | null>(null)
    const [savedWords, setSavedWords] = useState<Set<string>>(new Set())
    const bottomRef = useRef<HTMLDivElement>(null)

    const { isListening, isSupported: micSupported, startListening, stopListening } = useSpeechRecognition()
    const { isSpeaking, isSupported: speakerSupported, speak, stop: stopSpeaking } = useSpeechSynthesis()

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        createConversation(topic)
            .then(setConversationId)
            .catch((err) => console.error('Could not start conversation:', err))
    }, [topic])

    async function handleSend(overrideText?: string) {
        const textToSend = overrideText ?? input
        if (!textToSend.trim() || loading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: textToSend,
        }
        const updatedMessages = [...messages, userMessage]
        setMessages(updatedMessages)
        setInput('')
        setLoading(true)

        try {
            const data = await sendMessage(textToSend, topic)
            const aiMessage: Message = {
                id: Date.now().toString() + '-ai',
                sender: 'ai',
                text: data.reply,
                correction: data.correction,
                newVocabulary: data.newVocabulary,
            }
            const finalMessages = [...updatedMessages, aiMessage]
            setMessages(finalMessages)

            if (conversationId) {
                saveMessages(conversationId, finalMessages).catch((err) =>
                    console.error('Could not save conversation:', err)
                )
            }
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { id: Date.now().toString() + '-err', sender: 'ai', text: "Sorry, something went wrong. Please try again." },
            ])
        } finally {
            setLoading(false)
        }
    }

    function handleMicClick() {
        if (isListening) {
            stopListening()
            return
        }
        startListening((transcript) => {
            setInput(transcript)
        })
    }

    async function handleSaveWord(word: string, meaning: string, example: string) {
        try {
            await saveVocabWord(word, meaning, example)
            setSavedWords((prev) => new Set(prev).add(word))
        } catch (err) {
            console.error('Could not save word:', err)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <div className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between shrink-0">
                <button
                    onClick={() => navigate('/topics')}
                    className="text-sm font-medium text-slate-500 hover:text-indigo-700 transition-colors"
                >
                    ← Change topic
                </button>
                <span className="text-sm font-medium text-slate-900">{topic}</span>
            </div>

            <div className="flex-1 max-w-3xl w-full mx-auto px-6 py-6 space-y-4 overflow-y-auto">
                {messages.map((msg) => (
                    <div key={msg.id}>
                        <div className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'ai' && speakerSupported && (
                                <button
                                    onClick={() => (isSpeaking ? stopSpeaking() : speak(msg.text))}
                                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
                                    title="Listen"
                                    aria-label={isSpeaking ? 'Stop reading message aloud' : 'Read message aloud'}
                                >
                                    🔊
                                </button>
                            )}
                            <div
                                className={`max-w-[80%] px-4 py-2.5 rounded-xl text-sm ${msg.sender === 'user'
                                        ? 'bg-indigo-700 text-white'
                                        : 'bg-white border border-slate-200 text-slate-900'
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>

                        {msg.correction?.hasMistake && (
                            <div className="mt-2 max-w-[80%] bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs">
                                {msg.correction.lessonTitle && (
                                    <span className="inline-block bg-amber-100 text-amber-800 font-medium px-2 py-0.5 rounded mb-2">
                                        📘 {msg.correction.lessonTitle}
                                    </span>
                                )}
                                <p className="text-slate-500">Your sentence</p>
                                <p className="text-slate-900 mt-0.5">{msg.correction.original}</p>
                                <p className="text-slate-500 mt-2">Better version</p>
                                <p className="text-emerald-600 font-medium mt-0.5">{msg.correction.corrected}</p>
                                <p className="text-slate-500 mt-2">{msg.correction.explanation}</p>
                            </div>
                        )}

                        {msg.newVocabulary && msg.newVocabulary.length > 0 && (
                            <div className="mt-2 max-w-[80%] flex flex-wrap gap-2">
                                {msg.newVocabulary.map((v) => {
                                    const isSaved = savedWords.has(v.word)
                                    return (
                                        <div key={v.word} className="bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 text-xs">
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <span className="font-medium text-indigo-700">{v.word}</span>
                                                    <span className="text-slate-500"> — {v.meaning}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleSaveWord(v.word, v.meaning, v.example)}
                                                    disabled={isSaved}
                                                    className={`shrink-0 text-xs font-medium px-2 py-1 rounded transition-colors ${isSaved
                                                            ? 'text-emerald-600 cursor-default'
                                                            : 'text-indigo-700 hover:bg-indigo-100'
                                                        }`}
                                                >
                                                    {isSaved ? '✓ Saved' : '+ Save'}
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-500">
                            Typing...
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            <div className="border-t border-slate-200 bg-white px-6 py-4 shrink-0">
                <div className="max-w-3xl mx-auto flex gap-3">
                    {micSupported && (
                        <button
                            onClick={handleMicClick}
                            className={`shrink-0 w-11 h-11 rounded-lg flex items-center justify-center border transition-colors ${isListening
                                    ? 'bg-red-50 border-red-300 text-red-600 animate-pulse'
                                    : 'border-slate-300 text-slate-500 hover:border-indigo-400 hover:text-indigo-700'
                                }`}
                            title={isListening ? 'Stop recording' : 'Speak your answer'}
                            aria-label={isListening ? 'Stop voice recording' : 'Start voice recording'}
                            aria-pressed={isListening}
                        >
                            🎙️
                        </button>
                    )}
                    <label htmlFor="chat-input" className="sr-only">Type your message</label>
                    <input
                        id="chat-input"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isListening ? 'Listening...' : 'Type your message...'}
                        aria-label="Type your message"
                        className="flex-1 min-w-0 border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={loading}
                        className="shrink-0 bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-indigo-800 transition-colors disabled:opacity-50"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatPage
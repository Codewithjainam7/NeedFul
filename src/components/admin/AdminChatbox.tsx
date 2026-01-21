'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Bot, User, Sparkles, BarChart3, Minimize2, TrendingUp, Users, Store } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

function RichTextRenderer({ content, isUser }: { content: string; isUser: boolean }) {
    const lines = content.split('\n')

    return (
        <div className={`space-y-1 ${isUser ? 'text-white' : 'text-gray-800'}`}>
            {lines.map((line, i) => {
                const isBullet = line.trim().startsWith('•') || line.trim().startsWith('*') || line.trim().startsWith('-')
                const cleanLine = isBullet ? line.trim().substring(1).trim() : line
                const parts = cleanLine.split(/(\*\*.*?\*\*)/g)

                const renderedLine = (
                    <span>
                        {parts.map((part, j) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={j} className={isUser ? 'font-bold' : 'font-bold text-gray-900'}>{part.slice(2, -2)}</strong>
                            }
                            return <span key={j}>{part}</span>
                        })}
                    </span>
                )

                if (isBullet) {
                    return (
                        <div key={i} className="flex gap-2 items-start ml-1 mt-1">
                            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isUser ? 'bg-white/60' : 'bg-blue-400'}`} />
                            <span className={isUser ? 'text-white/90' : 'text-gray-700'}>{renderedLine}</span>
                        </div>
                    )
                }

                if (line.trim() === '') return <br key={i} />

                return <p key={i} className={isUser ? 'text-white/95' : 'text-gray-700'}>{renderedLine}</p>
            })}
        </div>
    )
}

export function AdminChatbox() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Hello Admin! 📊 Main NeedFul Admin AI hoon. Platform stats, approvals, performance metrics - kuch bhi poochein!\n\nExamples:\n• "Total businesses?"\n• "Pending approvals?"\n• "Top rated providers?"',
            timestamp: new Date()
        }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 300)
        }
    }, [isOpen])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const updatedMessages = [...messages, userMessage]
            const response = await fetch('/api/admin/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: updatedMessages })
            })

            const data = await response.json()

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response || 'Sorry, kuch gadbad ho gayi.',
                timestamp: new Date()
            }

            setMessages(prev => [...prev, assistantMessage])
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Connection error! Please check your internet.',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const suggestedQueries = [
        { icon: Store, text: 'Total businesses?' },
        { icon: Users, text: 'Pending approvals?' },
        { icon: TrendingUp, text: 'Top rated providers?' }
    ]

    return (
        <>
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className={cn(
                            "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center group z-50",
                            "bg-gradient-to-br from-blue-600 to-indigo-700 hover:shadow-blue-500/40 transition-shadow"
                        )}
                    >
                        <BarChart3 className="w-6 h-6 text-white" />
                        <span className="absolute w-full h-full rounded-full bg-blue-400 animate-ping opacity-20" />
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="fixed bottom-6 right-6 w-[400px] h-[550px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                                    <BarChart3 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white flex items-center gap-1">
                                        Admin AI
                                        <Sparkles className="w-4 h-4 text-yellow-300" />
                                    </h3>
                                    <p className="text-white/80 text-xs">Analytics & Insights</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                            >
                                <Minimize2 className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "flex gap-3",
                                        message.role === 'user' ? 'justify-end' : 'justify-start'
                                    )}
                                >
                                    {message.role === 'assistant' && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center flex-shrink-0">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                    <div
                                        className={cn(
                                            "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                                            message.role === 'user'
                                                ? 'bg-blue-600 text-white rounded-br-none'
                                                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                                        )}
                                    >
                                        <RichTextRenderer content={message.content} isUser={message.role === 'user'} />
                                    </div>
                                    {message.role === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                                            <User className="w-4 h-4 text-gray-600" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-3 justify-start"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 border border-gray-200">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggested Queries */}
                        {messages.length <= 2 && (
                            <div className="px-4 py-2 bg-white border-t border-gray-100">
                                <div className="flex flex-wrap gap-2">
                                    {suggestedQueries.map((query, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setInput(query.text)
                                                inputRef.current?.focus()
                                            }}
                                            className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full border border-blue-100 hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                                        >
                                            <query.icon className="w-3 h-3" />
                                            {query.text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <div className="p-3 bg-white border-t border-gray-200">
                            <div className="flex gap-2 relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask about stats, approvals..."
                                    className="flex-1 pl-4 pr-12 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className={cn(
                                        "absolute right-2 top-1 w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                                        input.trim() && !isLoading
                                            ? "bg-blue-600 text-white hover:bg-blue-700"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    )}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

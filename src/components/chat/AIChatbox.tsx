'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2, Bot, User, Sparkles, MapPin, Minimize2, RefreshCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

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
                const isBullet = line.trim().startsWith('* ')
                const cleanLine = isBullet ? line.trim().substring(2) : line
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
                            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isUser ? 'bg-white/60' : 'bg-orange-400'}`} />
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

export function AIChatbox() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Hello! 👋 Main Needful AI hoon. Main aapki kaise madad kar sakta hoon? (e.g., "Andheri mein best plumber")',
            timestamp: new Date()
        }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Fetch current user for avatar
    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getUser().then(({ data: { user } }) => {
            setCurrentUser(user)
            // Debug log - remove after testing
            if (user) {
                console.log('User metadata:', user.user_metadata)
            }
        })
    }, [])

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

        // Location logic would go here
        let location = null

        try {
            const updatedMessages = [...messages, userMessage]
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: updatedMessages,
                    userLocation: location
                })
            })

            const data = await response.json()

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response || 'Sorry, kuch gadbad ho gayi. Phir se try karo!',
                timestamp: new Date()
            }

            setMessages(prev => [...prev, assistantMessage])
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Connection error! Please check your internet and try again.',
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
        'Best plumber in Andheri',
        'Saste electrician Mumbai',
        'Top rated AC repair'
    ]

    return (
        <>
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0, rotate: -45 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0, rotate: 45 }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        style={{ zIndex: 2147483647 }}
                        className={cn(
                            "fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center group",
                            "bg-gradient-to-br from-[#FF5200] to-orange-600 hover:shadow-orange-500/40 transition-shadow"
                        )}
                    >
                        <MessageCircle className="w-8 h-8 text-white" />
                        <span className="absolute w-full h-full rounded-full bg-orange-400 animate-ping opacity-20" />
                        <span className="absolute right-full mr-4 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-bold shadow-xl translate-x-2 group-hover:translate-x-0 transition-transform">
                            Ask AI Assistant
                        </span>
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
                        style={{ zIndex: 2147483647 }}
                        className="fixed bottom-6 right-6 w-[90vw] md:w-[450px] h-[600px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#FF5200] to-orange-600 p-4 flex items-center justify-between shadow-md z-10 relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 opacity-20 patent-bg" />
                            <div className="flex items-center gap-3 relative z-10">
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center shadow-inner"
                                >
                                    <Bot className="w-6 h-6 text-white" />
                                </motion.div>
                                <div>
                                    <motion.h3
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="font-bold text-white flex items-center gap-1 text-lg"
                                    >
                                        Needful AI
                                        <motion.div
                                            animate={{ rotate: [0, 15, -15, 0] }}
                                            transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                                        >
                                            <Sparkles className="w-4 h-4 text-yellow-300" />
                                        </motion.div>
                                    </motion.h3>
                                    <motion.p
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-white/80 text-xs font-medium"
                                    >
                                        Always here to help
                                    </motion.p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white relative z-10"
                            >
                                <Minimize2 className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/50 scroll-smooth">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={cn(
                                        "flex gap-3",
                                        message.role === 'user' ? 'justify-end' : 'justify-start'
                                    )}
                                >
                                    {message.role === 'assistant' && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF5200] to-orange-600 flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                    <div
                                        className={cn(
                                            "max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm",
                                            message.role === 'user'
                                                ? 'bg-gray-900 text-white rounded-br-none'
                                                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-sm'
                                        )}
                                    >
                                        <RichTextRenderer content={message.content} isUser={message.role === 'user'} />
                                    </div>
                                    {message.role === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-1 overflow-hidden">
                                            {currentUser?.user_metadata?.avatar_url || currentUser?.user_metadata?.picture ? (
                                                <img
                                                    src={currentUser.user_metadata.avatar_url || currentUser.user_metadata.picture}
                                                    alt="User"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <User className="w-5 h-5 text-gray-500" />
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {/* Loading indicator */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3 justify-start"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF5200] to-orange-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-white rounded-2xl rounded-bl-none px-5 py-4 shadow-sm border border-gray-100 flex items-center">
                                        <div className="flex gap-1.5">
                                            <motion.span
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                                                className="w-2 h-2 bg-orange-500 rounded-full"
                                            />
                                            <motion.span
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                                                className="w-2 h-2 bg-orange-500 rounded-full"
                                            />
                                            <motion.span
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                                                className="w-2 h-2 bg-orange-500 rounded-full"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggested Queries */}
                        {messages.length <= 2 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="px-5 py-3 bg-white border-t border-gray-100"
                            >
                                <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide flex items-center gap-2">
                                    <Sparkles className="w-3 h-3 text-orange-400" /> Suggested
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {suggestedQueries.map((query, idx) => (
                                        <motion.button
                                            key={idx}
                                            whileHover={{ scale: 1.05, backgroundColor: "#FFF7ED" }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                setInput(query)
                                                inputRef.current?.focus()
                                            }}
                                            className="px-3 py-1.5 bg-orange-50 text-[#FF5200] text-xs font-medium rounded-full border border-orange-100 transition-colors flex items-center gap-1.5"
                                        >
                                            <MapPin className="w-3 h-3" />
                                            {query}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Input */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <div className="flex gap-2 relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask me anything..."
                                    className="flex-1 pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5200]/20 focus:border-[#FF5200] transition-all placeholder:text-gray-400"
                                    disabled={isLoading}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className={cn(
                                        "absolute right-2 top-1.5 w-9 h-9 rounded-lg flex items-center justify-center transition-all",
                                        input.trim() && !isLoading
                                            ? "bg-[#FF5200] text-white hover:bg-[#e04800] shadow-md"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    )}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </motion.button>
                            </div>
                            <div className="text-center mt-2 flex justify-center items-center gap-1">
                                <Sparkles className="w-3 h-3 text-orange-300" />
                                <span className="text-[10px] text-gray-400">Powered by NeedFul AI</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

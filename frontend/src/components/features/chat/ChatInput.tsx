"use client"

/**
 * ChatInput Component
 *
 * Premium chat input with send button and keyboard shortcuts
 */

import { useState, useRef, useEffect, KeyboardEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Loader2, Sparkles } from "lucide-react"

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading?: boolean
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({
  onSend,
  isLoading = false,
  disabled = false,
  placeholder = "Ask me to manage your tasks...",
}: ChatInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px"
    }
  }, [message])

  const handleSubmit = () => {
    if (message.trim() && !isLoading && !disabled) {
      onSend(message.trim())
      setMessage("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const canSend = message.trim().length > 0 && !isLoading && !disabled

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 blur-sm" />

      {/* Input Container */}
      <div className="relative flex items-end gap-3 p-3 rounded-2xl bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-white/20">
        {/* Sparkle Icon */}
        <motion.div
          className="flex-shrink-0 pb-0.5"
          animate={{ rotate: isLoading ? 360 : 0 }}
          transition={{
            duration: 2,
            repeat: isLoading ? Infinity : 0,
            ease: "linear",
          }}
        >
          <Sparkles className="w-5 h-5 text-purple-500" />
        </motion.div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          rows={1}
          className="flex-1 bg-transparent resize-none outline-none text-foreground placeholder:text-foreground/40 min-h-[24px] max-h-[150px] py-0.5"
        />

        {/* Send Button */}
        <AnimatePresence mode="wait">
          <motion.button
            key={isLoading ? "loading" : "send"}
            onClick={handleSubmit}
            disabled={!canSend}
            className={`flex-shrink-0 p-2.5 rounded-xl transition-all ${
              canSend
                ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105"
                : "bg-foreground/10 text-foreground/30 cursor-not-allowed"
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileTap={canSend ? { scale: 0.95 } : {}}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </AnimatePresence>
      </div>

      {/* Helper Text */}
      <p className="text-xs text-foreground/40 mt-2 text-center">
        Press <kbd className="px-1.5 py-0.5 rounded bg-foreground/10 font-mono text-xs">Enter</kbd> to send,{" "}
        <kbd className="px-1.5 py-0.5 rounded bg-foreground/10 font-mono text-xs">Shift + Enter</kbd> for new line
      </p>
    </motion.div>
  )
}

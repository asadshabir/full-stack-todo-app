"use client"

/**
 * MessageBubble Component
 *
 * Displays a single chat message with premium styling
 */

import { motion } from "framer-motion"
import { User, Bot, Copy, Check } from "lucide-react"
import { useState } from "react"
import type { ChatMessage } from "@/hooks/useChat"

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === "user"

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
          isUser
            ? "bg-gradient-to-br from-purple-500 to-pink-500"
            : "bg-gradient-to-br from-blue-500 to-cyan-500"
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </motion.div>

      {/* Message Content */}
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[75%]`}>
        <motion.div
          className={`relative group px-4 py-3 rounded-2xl ${
            isUser
              ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-tr-sm"
              : "bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/10 text-foreground rounded-tl-sm"
          } ${message.isStreaming ? "animate-pulse" : ""}`}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          {/* Message Text */}
          <div className="whitespace-pre-wrap break-words">
            {message.content || (
              <span className="flex items-center gap-2 text-white/70">
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Thinking
                </motion.span>
                <motion.span
                  className="flex gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 bg-current rounded-full"
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                </motion.span>
              </span>
            )}
          </div>

          {/* Copy Button (for assistant messages) */}
          {!isUser && message.content && (
            <button
              onClick={handleCopy}
              className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-white/20 dark:bg-black/20 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-black/30"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </motion.div>

        {/* Timestamp */}
        <span className="text-xs text-foreground/40 mt-1 px-2">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </motion.div>
  )
}

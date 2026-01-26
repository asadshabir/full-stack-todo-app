"use client"

/**
 * ChatContainer Component
 *
 * Main chat interface combining messages, input, and conversation management
 */

import { useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquarePlus, History, Bot, Sparkles, MessageCircle } from "lucide-react"
import { MessageBubble } from "./MessageBubble"
import { ChatInput } from "./ChatInput"
import { GlassCard } from "@/components/ui/glass-card"
import { useChat } from "@/hooks/useChat"
import type { Conversation } from "@/lib/api"

interface ChatContainerProps {
  initialConversationId?: string
}

export function ChatContainer({ initialConversationId }: ChatContainerProps) {
  const {
    messages,
    isLoading,
    conversationId,
    conversations,
    sendMessage,
    loadConversation,
    startNewConversation,
  } = useChat({ conversationId: initialConversationId })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <div className="flex h-full gap-4">
      {/* Conversations Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:flex flex-col w-72"
      >
        <GlassCard className="flex-1 flex flex-col p-4 overflow-hidden">
          {/* New Chat Button */}
          <button
            onClick={startNewConversation}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all mb-4"
          >
            <MessageSquarePlus className="w-5 h-5" />
            New Conversation
          </button>

          {/* Conversations List */}
          <div className="flex items-center gap-2 mb-3 px-2">
            <History className="w-4 h-4 text-foreground/60" />
            <span className="text-sm font-medium text-foreground/60">Recent</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-foreground/10 scrollbar-track-transparent">
            <AnimatePresence>
              {conversations.map((conv, index) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={conv.id === conversationId}
                  onClick={() => loadConversation(conv.id)}
                  index={index}
                />
              ))}
            </AnimatePresence>

            {conversations.length === 0 && (
              <div className="text-center py-8 text-foreground/40">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No conversations yet</p>
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Chat Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col"
      >
        <GlassCard className="flex-1 flex flex-col overflow-hidden">
          {/* Messages Area */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-foreground/10 scrollbar-track-transparent"
          >
            {messages.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10">
            <ChatInput onSend={sendMessage} isLoading={isLoading} />
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}

/**
 * Conversation Item Component
 */
function ConversationItem({
  conversation,
  isActive,
  onClick,
  index,
}: {
  conversation: Conversation
  isActive: boolean
  onClick: () => void
  index: number
}) {
  const date = new Date(conversation.last_activity_at)
  const timeString = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
        isActive
          ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
          : "hover:bg-white/5 border border-transparent"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isActive
              ? "bg-gradient-to-br from-purple-500 to-pink-500"
              : "bg-foreground/10"
          }`}
        >
          <MessageCircle className={`w-4 h-4 ${isActive ? "text-white" : "text-foreground/60"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            Conversation
          </p>
          <p className="text-xs text-foreground/50">{timeString}</p>
        </div>
      </div>
    </motion.button>
  )
}

/**
 * Empty State Component
 */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full flex items-center justify-center"
    >
      <div className="text-center max-w-md">
        {/* Animated Bot Icon */}
        <motion.div
          className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6"
          animate={{
            boxShadow: [
              "0 0 20px rgba(168, 85, 247, 0.3)",
              "0 0 40px rgba(168, 85, 247, 0.5)",
              "0 0 20px rgba(168, 85, 247, 0.3)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Bot className="w-10 h-10 text-white" />
        </motion.div>

        <h3 className="text-2xl font-bold text-foreground mb-3">
          AI Task Assistant
        </h3>
        <p className="text-foreground/60 mb-6">
          I can help you manage your tasks using natural language. Try saying
          things like:
        </p>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "Add a task to buy groceries",
            "Show my pending tasks",
            "Mark shopping task as done",
            "Delete the completed tasks",
          ].map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 text-sm text-foreground/70"
            >
              <Sparkles className="w-3 h-3 text-purple-400" />
              {suggestion}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

"use client"

/**
 * useChat Hook
 *
 * Custom hook for AI chat functionality with conversation management
 */

import { useState, useCallback, useRef, useEffect } from "react"
import { apiClient, type Message, type Conversation } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isStreaming?: boolean
}

interface UseChatOptions {
  conversationId?: string
  onConversationChange?: (id: string) => void
}

export function useChat(options: UseChatOptions = {}) {
  const { toast } = useToast()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | undefined>(
    options.conversationId
  )
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoadingConversations, setIsLoadingConversations] = useState(false)

  const abortControllerRef = useRef<AbortController | null>(null)

  /**
   * Load conversations list
   */
  const loadConversations = useCallback(async () => {
    setIsLoadingConversations(true)
    try {
      const convs = await apiClient.getConversations()
      setConversations(convs)
    } catch (err) {
      console.error("Failed to load conversations:", err)
    } finally {
      setIsLoadingConversations(false)
    }
  }, [])

  /**
   * Load messages for a specific conversation
   */
  const loadConversation = useCallback(async (convId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const msgs = await apiClient.getConversationMessages(convId)
      const chatMessages: ChatMessage[] = msgs.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: new Date(m.created_at),
      }))
      setMessages(chatMessages)
      setConversationId(convId)
      options.onConversationChange?.(convId)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load conversation"
      setError(message)
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast, options])

  /**
   * Send a message to the AI
   */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      setIsLoading(true)
      setError(null)

      // Add user message immediately
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])

      // Add placeholder for assistant response
      const assistantPlaceholder: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      }
      setMessages((prev) => [...prev, assistantPlaceholder])

      try {
        const response = await apiClient.sendMessage(content.trim(), conversationId)

        // Update conversation ID if new
        if (!conversationId && response.conversation_id) {
          setConversationId(response.conversation_id)
          options.onConversationChange?.(response.conversation_id)
          // Refresh conversations list
          loadConversations()
        }

        // Update assistant message with response
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantPlaceholder.id
              ? {
                  ...msg,
                  content: response.response,
                  isStreaming: false,
                }
              : msg
          )
        )
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to send message"
        setError(message)

        // Remove the placeholder and show error
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== assistantPlaceholder.id)
        )

        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [conversationId, isLoading, toast, options, loadConversations]
  )

  /**
   * Start a new conversation
   */
  const startNewConversation = useCallback(() => {
    setMessages([])
    setConversationId(undefined)
    setError(null)
    options.onConversationChange?.("")
  }, [options])

  /**
   * Clear chat messages
   */
  const clearChat = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  /**
   * Cancel ongoing request
   */
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsLoading(false)
    // Remove any streaming messages
    setMessages((prev) => prev.filter((msg) => !msg.isStreaming))
  }, [])

  // Load conversations on mount
  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  // Load initial conversation if provided
  useEffect(() => {
    if (options.conversationId && options.conversationId !== conversationId) {
      loadConversation(options.conversationId)
    }
  }, [options.conversationId, conversationId, loadConversation])

  return {
    messages,
    isLoading,
    error,
    conversationId,
    conversations,
    isLoadingConversations,
    sendMessage,
    loadConversation,
    loadConversations,
    startNewConversation,
    clearChat,
    cancelRequest,
  }
}

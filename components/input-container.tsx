"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"

interface InputContainerProps {
  onSubmit: (message: string) => void
  isLoading: boolean
}

export default function InputContainer({ onSubmit, isLoading }: InputContainerProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSubmit(message)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
    >
      <div className="backdrop-blur-md bg-white/10 rounded-xl p-2 border border-white/20 shadow-lg w-full">
        <div className="flex flex-col md:flex-row gap-2">
          <motion.input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a yes/no question, e.g. \"Is the sky blue?\""
            aria-label="yes or no question"
            className="flex-1 bg-black/30 text-white font-mono px-4 py-3 rounded-lg outline-none border border-transparent focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            whileFocus={{ boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)" }}
            disabled={isLoading}
          />
          <motion.button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-mono px-6 py-3 rounded-lg disabled:opacity-50"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={isLoading || !message.trim()}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              "Submit"
            )}
          </motion.button>
        </div>
      </div>
    </motion.form>
  )
}

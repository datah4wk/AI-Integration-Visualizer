"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import ParticleBackground from "./particle-background"
import InputContainer from "./input-container"
import FeedbackBoxes from "./feedback-boxes"
import { getAIResponse } from "@/app/actions"
import Footer from "./footer"

export default function AIDecisionVisualizer() {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<string | null>(null)
  const [decision, setDecision] = useState<"YES" | "NO" | null>(null)

  const handleSubmit = async (message: string) => {
    setLoading(true)
    setResponse(null)
    setDecision(null)

    try {
      // Create a prompt that instructs the AI to only respond with YES or NO
      const prompt = `${message}\n\nImportant: Please strictly respond with ONLY the word "YES" or "NO". No other text or explanation.`

      // Use Server Action to make the API call
      const result = await getAIResponse(prompt)

      if ("error" in result) {
        setResponse(result.error)
        return
      }

      // Clean and process the response
      const cleanResponse = result.text.trim().toUpperCase()
      // Only set response for error cases
      // setResponse(result.text);

      // Determine if the response is YES or NO
      if (cleanResponse.includes("YES")) {
        setDecision("YES")
      } else if (cleanResponse.includes("NO")) {
        setDecision("NO")
      } else {
        // If the response doesn't clearly contain YES or NO
        setResponse("Unable to determine a clear YES/NO answer")
      }
    } catch (error) {
      console.error("Error getting AI response:", error)
      setResponse("Error connecting to AI. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      <ParticleBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 flex flex-col items-center justify-center gap-8 w-full max-w-3xl px-4"
      >
        <motion.h1
          className="text-3xl md:text-4xl font-bold font-mono text-center text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          AI Decision Visualizer
        </motion.h1>

        <motion.p
          className="text-center text-sm md:text-base text-white/80 max-w-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Type a yes or no question below and watch the corresponding box glow
          green for YES or red for NO.
        </motion.p>

        <InputContainer onSubmit={handleSubmit} isLoading={loading} />

        {response && response.includes("Error") && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-lg text-center text-red-400"
          >
            {response}
          </motion.div>
        )}

        <FeedbackBoxes decision={decision} isLoading={loading} />

        <div className="mt-16 flex flex-col items-center space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-xs text-center text-white/60 max-w-md px-4"
          >
            This demo uses Groq's language model to answer with
            <span className="font-semibold"> YES </span> or
            <span className="font-semibold"> NO</span>. The glowing boxes
            highlight the AI's choice in real time.
          </motion.div>

          <Footer />
        </div>
      </motion.div>
    </div>
  )
}

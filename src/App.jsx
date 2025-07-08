"use client"

import { useState, useRef, useEffect } from "react"
import ChatMessage from "./components/ChatMessage"
import AvatarBot from "./components/AvatarBot"
import "./App.css"
import GameMenu from "./components/GameMenu"
import PuzzleGame from "./components/PuzzleGame"
import { sendMessageToDeepSeek, getGreetingMessage } from "./services/deepseek"

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: getGreetingMessage(),
      isBot: true,
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const [showGames, setShowGames] = useState(false)
  const [currentGame, setCurrentGame] = useState(null)
  const [gameData, setGameData] = useState(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputText,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputText
    setInputText("")
    setIsTyping(true)

    try {
      // Get conversation history (last 10 messages for context)
      const conversationHistory = messages.slice(-10)
      
      // Call DeepSeek API
      const botResponseText = await sendMessageToDeepSeek(currentInput, conversationHistory)
      
      const botResponse = {
        id: Date.now() + 1,
        text: botResponseText,
        isBot: true,
        timestamp: new Date(),
      }
      
      setMessages((prev) => [...prev, botResponse])
    } catch (error) {
      console.error('Error getting AI response:', error)
      
      // Fallback response if API call fails
      const fallbackResponse = {
        id: Date.now() + 1,
        text: "Oops! I'm having trouble thinking right now. Can you try asking me again? 🤔",
        isBot: true,
        timestamp: new Date(),
      }
      
      setMessages((prev) => [...prev, fallbackResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: getGreetingMessage(),
        isBot: true,
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400">
      <div className="container mx-auto max-w-4xl h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white/20 backdrop-blur-sm rounded-b-3xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AvatarBot isTyping={isTyping} />
              <div>
                <h1 className="text-2xl font-bold text-white drop-shadow-lg">Buddy Chat 🤖</h1>
                <p className="text-white/80 text-sm">Your friendly AI companion!</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowGames(!showGames)}
                className="bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white px-4 py-2 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20 font-semibold"
              >
                🎮 Games
              </button>
              <button
                onClick={clearChat}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
              >
                New Chat ✨
              </button>
            </div>
          </div>
        </header>

        {/* Games Section */}
        {showGames && !currentGame && (
          <GameMenu
            onSelectGame={(game, data) => {
              setCurrentGame(game)
              setGameData(data)
              setShowGames(false)
            }}
          />
        )}

        {/* Current Game */}
        {currentGame && (
          <PuzzleGame
            game={currentGame}
            gameData={gameData}
            onGameComplete={(message) => {
              const completionMessage = {
                id: Date.now(),
                text: message,
                isBot: true,
                timestamp: new Date(),
              }
              setMessages((prev) => [...prev, completionMessage])
              setCurrentGame(null)
              setGameData(null)
            }}
            onBackToChat={() => {
              setCurrentGame(null)
              setGameData(null)
            }}
          />
        )}

        {/* Chat Messages */}
        {!showGames && !currentGame && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && (
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center animate-bounce">
                  <span className="text-white text-lg">🤖</span>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <div
                      className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Form */}
        {!showGames && !currentGame && (
          <form onSubmit={handleSendMessage} className="p-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message here... 💭"
                  className="flex-1 bg-white/50 backdrop-blur-sm rounded-xl px-4 py-3 text-gray-800 placeholder-gray-600 border-none outline-none focus:ring-2 focus:ring-purple-300"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={isTyping || !inputText.trim()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg"
                >
                  Send 🚀
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default App

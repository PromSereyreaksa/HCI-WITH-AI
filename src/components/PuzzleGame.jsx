"use client"

import { useState, useEffect, useRef } from "react"

const PuzzleGame = ({ game, gameData, onGameComplete, onBackToChat }) => {
  const [gameState, setGameState] = useState(gameData)
  const [userInput, setUserInput] = useState("")
  const [showCelebration, setShowCelebration] = useState(false)
  const [difficulty, setDifficulty] = useState("easy")
  const [showAIHint, setShowAIHint] = useState(false)
  const [aiHintText, setAiHintText] = useState("")
  const [hintLevel, setHintLevel] = useState(0)
  const [lastActivity, setLastActivity] = useState(Date.now())
  const [isLoading, setIsLoading] = useState(false)
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [showAIThinking, setShowAIThinking] = useState(false)
  const activityTimer = useRef(null)
  const hintTimer = useRef(null)

  // Enhanced AI hint system - triggers after 10-15 seconds or wrong answers
  useEffect(() => {
    const checkInactivity = () => {
      const timeSinceActivity = Date.now() - lastActivity
      const hintDelay = 10000 + Math.random() * 5000 // 10-15 seconds

      if (timeSinceActivity > hintDelay && !showAIHint && !showCelebration && !isLoading) {
        triggerAIHint("inactivity")
      }
    }

    activityTimer.current = setInterval(checkInactivity, 1000)
    return () => {
      clearInterval(activityTimer.current)
      clearTimeout(hintTimer.current)
    }
  }, [lastActivity, showAIHint, showCelebration, isLoading, hintLevel])

  const resetActivityTimer = () => {
    setLastActivity(Date.now())
    setShowAIHint(false)
    setShowAIThinking(false)
  }

  const triggerAIHint = (trigger) => {
    setShowAIThinking(true)

    // AI thinking delay for realism
    setTimeout(() => {
      setShowAIThinking(false)
      const hints = getIntelligentHints(trigger)
      const selectedHint = hints[Math.min(hintLevel, hints.length - 1)]

      setAiHintText(selectedHint)
      setShowAIHint(true)
      setHintLevel((prev) => Math.min(prev + 1, 3))

      // Auto-hide hint after reading time
      hintTimer.current = setTimeout(() => {
        setShowAIHint(false)
      }, 6000)
    }, 1500)
  }

  const getIntelligentHints = (trigger) => {
    const baseHints = getGameSpecificHints()
    const contextualHints = getContextualHints(trigger)

    return [...contextualHints, ...baseHints]
  }

  const getContextualHints = (trigger) => {
    if (trigger === "wrong_answer") {
      return [
        "🤖 No worries! Even AI makes mistakes while learning. Let me help you think through this step by step! 🧠",
        "🤖 That's not quite right, but you're learning! AI helps by breaking problems into smaller pieces. Let's try that! 🧩",
        "🤖 Great attempt! AI learns from every try. Here's a different way to think about it... 💡",
      ]
    } else if (trigger === "inactivity") {
      return [
        "🤖 I notice you're thinking hard! That's great! AI helps when people need time to process. Here's a gentle nudge... 🌟",
        "🤖 Taking your time is smart! AI waits patiently too. Let me offer some guidance... ⏰",
        "🤖 Thinking deeply shows intelligence! AI assists when you're ready. Here's a helpful hint... 🎯",
      ]
    }
    return []
  }

  const getGameSpecificHints = () => {
    switch (game) {
      case "monster-math":
        return getDifficultyBasedMathHints()
      case "space-quiz":
        return getDifficultyBasedSpaceHints()
      case "animal-sounds":
        return getDifficultyBasedAnimalHints()
      default:
        return ["🤖 You're doing great! Keep trying! 💪"]
    }
  }

  const getDifficultyBasedMathHints = () => {
    const currentAnswer = gameState.answer
    const question = gameState.question

    if (difficulty === "easy") {
      return [
        `🤖 Try counting on your fingers! For ${question}, start with the first number and count up! 🖐️`,
        `🤖 Use objects around you! Get ${question.split(" ")[0]} toys, then add ${question.split(" ")[2]} more! 🧸`,
        `🤖 The answer is ${currentAnswer}! See how ${question.split(" ")[0]} + ${question.split(" ")[2]} = ${currentAnswer}? ✨`,
      ]
    } else if (difficulty === "medium") {
      if (question.includes("+")) {
        return [
          `🤖 For addition, think: what number comes after ${question.split(" ")[0]} when you count ${question.split(" ")[2]} more? 🔢`,
          `🤖 Break it down: ${question.split(" ")[0]} + ${question.split(" ")[2]}. Try adding in smaller steps! 📊`,
          `🤖 The answer is ${currentAnswer}! Addition means combining numbers together! ➕`,
        ]
      } else {
        return [
          `🤖 For subtraction, think: if you have ${question.split(" ")[0]} and take away ${question.split(" ")[2]}, what's left? ➖`,
          `🤖 Count backwards from ${question.split(" ")[0]} by ${question.split(" ")[2]} steps! 👣`,
          `🤖 The answer is ${currentAnswer}! Subtraction means taking away! ✂️`,
        ]
      }
    } else {
      if (question.includes("×")) {
        return [
          `🤖 Multiplication is repeated addition! ${question.split(" ")[0]} × ${question.split(" ")[2]} means adding ${question.split(" ")[0]} to itself ${question.split(" ")[2]} times! 🔄`,
          `🤖 Think of groups: ${question.split(" ")[2]} groups of ${question.split(" ")[0]} objects each! 📦`,
          `🤖 The answer is ${currentAnswer}! Try memorizing multiplication tables - they're super useful! 🧠`,
        ]
      } else {
        return [
          `🤖 This is a challenging problem! Break it into steps you know how to solve! 🪜`,
          `🤖 Use the math strategies you've learned before! 📚`,
          `🤖 The answer is ${currentAnswer}! Great job tackling a hard problem! 🏆`,
        ]
      }
    }
  }

  const getDifficultyBasedSpaceHints = () => {
    const currentQuestion = gameState.question.toLowerCase()

    if (difficulty === "easy") {
      if (currentQuestion.includes("live on")) {
        return [
          "🤖 Think about where your house is! What planet is your home on? 🏠",
          "🤖 Look outside! The ground you walk on is part of which planet? 🌍",
          "🤖 We live on Earth! It's the beautiful blue and green planet! 🌎",
        ]
      } else if (currentQuestion.includes("light") && currentQuestion.includes("day")) {
        return [
          "🤖 What's that bright yellow thing in the sky during the day? ☀️",
          "🤖 When you go outside in the morning, what makes everything bright? 🌅",
          "🤖 The Sun gives us light and warmth every day! ☀️",
        ]
      }
    } else if (difficulty === "medium") {
      if (currentQuestion.includes("closest to the sun")) {
        return [
          "🤖 Think about the order of planets from the Sun! Which one is first? 🥇",
          "🤖 Mercury is the smallest and fastest planet! It's closest to our star! 🏃‍♂️",
          "🤖 Mercury is closest to the Sun! It's very hot there! 🔥",
        ]
      } else if (currentQuestion.includes("biggest planet")) {
        return [
          "🤖 This planet is HUGE! It has a big red spot and many moons! 🔴",
          "🤖 Think of the largest thing you know, then imagine a planet even bigger! 🌌",
          "🤖 Jupiter is the biggest planet! It's like a giant gas ball! ⚡",
        ]
      }
    } else {
      return [
        "🤖 This is advanced space knowledge! Think about what you've learned in science class! 🔬",
        "🤖 Space is amazing and full of mysteries! Use your best scientific thinking! 🚀",
        "🤖 Great job tackling challenging space questions! You're like a young astronaut! 👨‍🚀",
      ]
    }

    return [
      "🤖 Think about what you know about space and planets! 🌌",
      "🤖 Space is full of amazing things! Use your imagination and knowledge! ✨",
      "🤖 You're exploring the universe! Every answer teaches you something new! 🚀",
    ]
  }

  const getDifficultyBasedAnimalHints = () => {
    const animal = gameState.currentAnimal
    const animalName = animal.name.toLowerCase()

    if (difficulty === "easy") {
      if (animalName === "cow") {
        return [
          "🤖 This animal gives us milk! You might see it on a farm! 🥛",
          "🤖 It's black and white (usually) and says 'moo'! What could it be? 🐄",
          "🤖 It's a COW! They're gentle farm animals that help make dairy products! 🧀",
        ]
      } else if (animalName === "cat") {
        return [
          "🤖 This furry friend purrs and likes to chase mice! 🐭",
          "🤖 Many people have this as a pet! It climbs trees and has whiskers! 🌳",
          "🤖 It's a CAT! They're independent and love to nap in sunny spots! 😴",
        ]
      }
    } else if (difficulty === "medium") {
      if (animalName === "lion") {
        return [
          "🤖 This animal is called the 'king of the jungle'! It has a big mane! 👑",
          "🤖 It's a big cat that lives in Africa! Very brave and strong! 💪",
          "🤖 It's a LION! They live in groups called prides! 🦁",
        ]
      }
    } else {
      if (animalName === "elephant") {
        return [
          "🤖 This is the largest land animal! It has a very long nose called a trunk! 👃",
          "🤖 It never forgets and can live for many, many years! Very wise! 🧠",
          "🤖 It's an ELEPHANT! They're gentle giants who live in families! 👨‍👩‍👧‍👦",
        ]
      }
    }

    return [
      `🤖 Listen to the sound again: ${animal.sound} What animal makes this noise? 👂`,
      `🤖 Think about the hint: ${animal.hint} 💭`,
      `🤖 It's a ${animal.name}! ${animal.hint} 🎉`,
    ]
  }

  const handleWrongAnswer = () => {
    setWrongAttempts((prev) => prev + 1)
    resetActivityTimer()
    triggerAIHint("wrong_answer")
  }

  const handleCorrectAnswer = () => {
    setWrongAttempts(0)
    setHintLevel(0)
    resetActivityTimer()
  }

  const generateNewQuestion = () => {
    setIsLoading(true)
    setWrongAttempts(0)
    setHintLevel(0)
    resetActivityTimer()

    setTimeout(() => {
      switch (game) {
        case "monster-math":
          const range = difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 20
          const num1 = Math.floor(Math.random() * range) + 1
          const num2 = Math.floor(Math.random() * range) + 1
          const operations = difficulty === "easy" ? ["+"] : difficulty === "medium" ? ["+", "-"] : ["+", "-", "×"]
          const operation = operations[Math.floor(Math.random() * operations.length)]

          let answer, question
          if (operation === "+") {
            answer = num1 + num2
            question = `${num1} + ${num2}`
          } else if (operation === "-") {
            const larger = Math.max(num1, num2)
            const smaller = Math.min(num1, num2)
            answer = larger - smaller
            question = `${larger} - ${smaller}`
          } else {
            answer = num1 * num2
            question = `${num1} × ${num2}`
          }

          setGameState((prev) => ({ ...prev, question, answer }))
          break

        case "space-quiz":
          const allQuestions = {
            easy: [
              { q: "What planet do we live on?", a: "EARTH", options: ["EARTH", "MARS", "MOON", "SUN"] },
              { q: "What gives us light during the day?", a: "SUN", options: ["SUN", "MOON", "STARS", "EARTH"] },
              { q: "How many moons does Earth have?", a: "ONE", options: ["ONE", "TWO", "THREE", "ZERO"] },
              { q: "What do we see in the sky at night?", a: "STARS", options: ["STARS", "CARS", "TREES", "HOUSES"] },
            ],
            medium: [
              { q: "What planet is closest to the sun?", a: "MERCURY", options: ["MERCURY", "VENUS", "EARTH", "MARS"] },
              { q: "What is the biggest planet?", a: "JUPITER", options: ["JUPITER", "SATURN", "EARTH", "MARS"] },
              {
                q: "What do we call a shooting star?",
                a: "METEOR",
                options: ["METEOR", "COMET", "ASTEROID", "PLANET"],
              },
              { q: "Which planet has rings?", a: "SATURN", options: ["SATURN", "EARTH", "MARS", "VENUS"] },
            ],
            hard: [
              { q: "Which planet has the most moons?", a: "SATURN", options: ["SATURN", "JUPITER", "EARTH", "MARS"] },
              { q: "What is the hottest planet?", a: "VENUS", options: ["VENUS", "MERCURY", "MARS", "JUPITER"] },
              {
                q: "What galaxy do we live in?",
                a: "MILKY WAY",
                options: ["MILKY WAY", "ANDROMEDA", "SPIRAL", "COSMIC"],
              },
              {
                q: "How long does Earth take to orbit the sun?",
                a: "ONE YEAR",
                options: ["ONE YEAR", "ONE MONTH", "ONE DAY", "ONE WEEK"],
              },
            ],
          }

          const questions = allQuestions[difficulty]
          const selectedQuestion = questions[Math.floor(Math.random() * questions.length)]
          setGameState((prev) => ({
            ...prev,
            question: selectedQuestion.q,
            answer: selectedQuestion.a,
            options: selectedQuestion.options.sort(() => Math.random() - 0.5),
          }))
          break

        case "animal-sounds":
          const allAnimals = {
            easy: [
              { name: "COW", sound: "MOO MOO! 🐄", emoji: "🐄", hint: "I give milk and live on farms!" },
              { name: "CAT", sound: "MEOW MEOW! 🐱", emoji: "🐱", hint: "I purr and love to chase mice!" },
              { name: "DOG", sound: "WOOF WOOF! 🐶", emoji: "🐶", hint: "I'm man's best friend!" },
              { name: "DUCK", sound: "QUACK QUACK! 🦆", emoji: "🦆", hint: "I swim in ponds!" },
            ],
            medium: [
              { name: "LION", sound: "ROAR ROAR! 🦁", emoji: "🦁", hint: "I'm the king of the jungle!" },
              { name: "PIG", sound: "OINK OINK! 🐷", emoji: "🐷", hint: "I roll in mud and love food!" },
              { name: "SHEEP", sound: "BAA BAA! 🐑", emoji: "🐑", hint: "I have fluffy wool!" },
              { name: "HORSE", sound: "NEIGH NEIGH! 🐴", emoji: "🐴", hint: "People ride on my back!" },
            ],
            hard: [
              { name: "ELEPHANT", sound: "TRUMPET! 🐘", emoji: "🐘", hint: "I have a long trunk and big ears!" },
              { name: "WOLF", sound: "HOWL! 🐺", emoji: "🐺", hint: "I howl at the moon!" },
              { name: "MONKEY", sound: "OOH OOH AH AH! 🐵", emoji: "🐵", hint: "I swing from trees!" },
              { name: "FROG", sound: "RIBBIT RIBBIT! 🐸", emoji: "🐸", hint: "I hop and live near water!" },
            ],
          }

          const animals = allAnimals[difficulty]
          const animal = animals[Math.floor(Math.random() * animals.length)]
          setGameState((prev) => ({ ...prev, currentAnimal: animal }))
          break
      }
      setIsLoading(false)
    }, 500)
  }

  const celebrate = (message) => {
    setShowCelebration(true)
    setTimeout(() => {
      onGameComplete(
        message + " 🤖 Just like how AI helps people solve problems every day, I helped you learn something new!",
      )
    }, 3000)
  }

  const renderDifficultySelector = () => (
    <div className="mb-6 text-center">
      <p className="text-white text-lg mb-3">🤖 AI adapts to your skill level! Choose your challenge:</p>
      <div className="flex justify-center space-x-3">
        {["easy", "medium", "hard"].map((level) => (
          <button
            key={level}
            onClick={() => {
              setDifficulty(level)
              setHintLevel(0)
              setWrongAttempts(0)
              generateNewQuestion()
              resetActivityTimer()
            }}
            className={`px-6 py-3 rounded-2xl font-bold text-lg transition-all ${
              difficulty === level
                ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white scale-110"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            {level === "easy" && "🟢 Easy"}
            {level === "medium" && "🟡 Medium"}
            {level === "hard" && "🔴 Hard"}
          </button>
        ))}
      </div>
      <p className="text-white/80 text-sm mt-2">
        AI hints get more detailed as you need them! {wrongAttempts > 0 && `(${wrongAttempts} attempts)`}
      </p>
    </div>
  )

  const renderMonsterMath = () => {
    const feedMonster = () => {
      const answer = Number.parseInt(userInput)
      if (answer === gameState.answer) {
        handleCorrectAnswer()
        const newScore = gameState.score + (difficulty === "easy" ? 10 : difficulty === "medium" ? 15 : 20)
        const newHunger = Math.max(0, gameState.monsterHunger - 25)

        if (newHunger === 0) {
          celebrate(`🎉 AMAZING! You fed the monster and scored ${newScore} points! 👾✨`)
        } else {
          setGameState((prev) => ({ ...prev, score: newScore, monsterHunger: newHunger }))
          setUserInput("")
          generateNewQuestion()
        }
      } else {
        handleWrongAnswer()
        setGameState((prev) => ({ ...prev, monsterHunger: Math.min(100, prev.monsterHunger + 5) }))
        setUserInput("")
      }
    }

    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        feedMonster()
      }
    }

    if (isLoading) {
      return (
        <div className="text-center">
          <div className="text-6xl animate-spin mb-4">🤖</div>
          <p className="text-white text-xl">AI is creating a perfect question for your level...</p>
        </div>
      )
    }

    return (
      <div className="text-center space-y-6">
        {renderDifficultySelector()}

        <div className="bg-gradient-to-r from-green-400/20 to-lime-400/20 backdrop-blur-sm rounded-3xl p-8 border-2 border-green-400/30">
          <h3 className="text-3xl font-bold text-white mb-4">👾 Monster Math Battle! 👾</h3>
          <p className="text-white/80 mb-4">🤖 AI helps with math just like calculators and homework apps!</p>

          <div className="text-8xl mb-4 animate-bounce">{gameState.monster}</div>
          <div className="bg-red-400 rounded-full h-6 mb-4 overflow-hidden mx-auto max-w-md">
            <div
              className="bg-green-400 h-full transition-all duration-500 rounded-full"
              style={{ width: `${100 - gameState.monsterHunger}%` }}
            ></div>
          </div>
          <p className="text-white text-lg mb-4">Monster Hunger: {gameState.monsterHunger}% 🍽️</p>
          <div className="text-6xl font-bold text-yellow-300 mb-4">{gameState.question} = ?</div>
          <p className="text-white/80 text-xl">Type your answer and press Enter!</p>
        </div>

        <div className="space-y-4">
          <input
            type="number"
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value)
              resetActivityTimer()
            }}
            onKeyPress={handleKeyPress}
            placeholder="Your answer..."
            className="w-full max-w-md mx-auto block px-6 py-4 rounded-2xl text-center text-2xl font-bold bg-white/90 text-gray-800 border-4 border-blue-300 focus:border-blue-500 focus:outline-none"
            autoFocus
          />
          <button
            onClick={feedMonster}
            disabled={!userInput.trim()}
            className="bg-gradient-to-r from-green-400 to-lime-400 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:scale-110 transition-transform shadow-lg disabled:opacity-50"
          >
            Feed Monster! 🍽️
          </button>
        </div>

        <div className="text-white text-xl">Score: {gameState.score} 🏆</div>
      </div>
    )
  }

  const renderSpaceQuiz = () => {
    const selectAnswer = (answer) => {
      if (answer === gameState.answer) {
        handleCorrectAnswer()
        const newStars = gameState.stars + 1
        const newPosition = Math.min(100, gameState.rocketPosition + 25)

        if (newPosition >= 100) {
          celebrate(`🚀 INCREDIBLE! You reached the stars! You answered ${newStars} questions correctly! 🌟✨`)
        } else {
          setGameState((prev) => ({ ...prev, stars: newStars, rocketPosition: newPosition }))
          generateNewQuestion()
        }
      } else {
        handleWrongAnswer()
      }
    }

    if (isLoading) {
      return (
        <div className="text-center">
          <div className="text-6xl animate-spin mb-4">🚀</div>
          <p className="text-white text-xl">AI is finding a space question at your level...</p>
        </div>
      )
    }

    return (
      <div className="text-center space-y-6">
        {renderDifficultySelector()}

        <div className="bg-gradient-to-r from-blue-400/20 to-indigo-400/20 backdrop-blur-sm rounded-3xl p-8 border-2 border-blue-400/30">
          <h3 className="text-3xl font-bold text-white mb-4">🚀 Space Explorer! 🚀</h3>
          <p className="text-white/80 mb-4">
            🤖 AI helps answer questions just like search engines and voice assistants!
          </p>

          <div className="relative bg-black/30 rounded-2xl p-4 mb-6 h-20">
            <div
              className="absolute bottom-2 text-4xl transition-all duration-1000"
              style={{ left: `${gameState.rocketPosition}%` }}
            >
              🚀
            </div>
            <div className="absolute top-2 right-4 text-2xl">🌟</div>
            <div className="absolute top-4 left-1/4 text-xl">🪐</div>
            <div className="absolute bottom-4 left-1/2 text-lg">⭐</div>
          </div>

          <div className="text-2xl font-bold text-white mb-6">{gameState.question}</div>
          <p className="text-white/80 mb-4">Click on your answer!</p>

          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            {gameState.options.map((option, index) => (
              <button
                key={index}
                onClick={() => selectAnswer(option)}
                className="bg-gradient-to-r from-purple-400 to-blue-400 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-lg border-2 border-white/20 hover:border-white/40"
              >
                {option}
              </button>
            ))}
          </div>

          <div className="mt-4 text-white text-xl">Stars Collected: {gameState.stars} ⭐</div>
        </div>
      </div>
    )
  }

  const renderAnimalSounds = () => {
    const guessAnimal = () => {
      if (userInput.toUpperCase() === gameState.currentAnimal.name) {
        handleCorrectAnswer()
        const newScore = gameState.score + (difficulty === "easy" ? 10 : difficulty === "medium" ? 15 : 20)
        const newStreak = gameState.streak + 1

        if (newStreak >= 3) {
          celebrate(`🎉 FANTASTIC! You got ${newStreak} in a row! You're an animal expert! 🐾✨`)
        } else {
          setGameState((prev) => ({ ...prev, score: newScore, streak: newStreak }))
          setUserInput("")
          generateNewQuestion()
        }
      } else {
        handleWrongAnswer()
        setGameState((prev) => ({ ...prev, streak: 0 }))
        setUserInput("")
      }
    }

    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        guessAnimal()
      }
    }

    if (isLoading) {
      return (
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🐾</div>
          <p className="text-white text-xl">AI is finding an animal at your level...</p>
        </div>
      )
    }

    return (
      <div className="text-center space-y-6">
        {renderDifficultySelector()}

        <div className="bg-gradient-to-r from-orange-400/20 to-yellow-400/20 backdrop-blur-sm rounded-3xl p-8 border-2 border-orange-400/30">
          <h3 className="text-3xl font-bold text-white mb-4">🐾 Animal Sound Detective! 🐾</h3>
          <p className="text-white/80 mb-4">🤖 AI identifies sounds just like Shazam and nature apps!</p>

          <div className="text-8xl mb-4 animate-pulse">🔊</div>
          <div className="text-4xl font-bold text-yellow-300 mb-4">{gameState.currentAnimal.sound}</div>
          <p className="text-white/80 text-xl mb-6">What animal makes this sound?</p>

          <input
            type="text"
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value)
              resetActivityTimer()
            }}
            onKeyPress={handleKeyPress}
            placeholder="Type the animal name..."
            className="w-full max-w-md mx-auto block px-6 py-4 rounded-2xl text-center text-xl font-bold bg-white/90 text-gray-800 mb-4 border-4 border-orange-300 focus:border-orange-500 focus:outline-none"
            autoFocus
          />

          <button
            onClick={guessAnimal}
            disabled={!userInput.trim()}
            className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:scale-110 transition-transform shadow-lg mb-4 disabled:opacity-50"
          >
            Guess Animal! 🐾
          </button>

          <div className="text-white/80 text-lg">Hint: {gameState.currentAnimal.hint}</div>
          <div className="text-white text-xl mt-4">
            Score: {gameState.score} | Streak: {gameState.streak} 🏆
          </div>
        </div>
      </div>
    )
  }

  const renderGame = () => {
    switch (game) {
      case "monster-math":
        return renderMonsterMath()
      case "space-quiz":
        return renderSpaceQuiz()
      case "animal-sounds":
        return renderAnimalSounds()
      default:
        return (
          <div className="text-center">
            <div className="text-6xl mb-4">🎮</div>
            <p className="text-white text-2xl">Game not available yet!</p>
          </div>
        )
    }
  }

  if (showCelebration) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-9xl mb-6 animate-bounce">🎉</div>
          <div className="text-6xl mb-4 animate-pulse">✨🌟⭐🌟✨</div>
          <h2 className="text-4xl font-bold text-white mb-4 animate-bounce">CONGRATULATIONS!</h2>
          <p className="text-white/80 text-2xl animate-pulse">You're absolutely AMAZING!</p>
          <div className="text-6xl mt-4 animate-spin">🏆</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 overflow-y-auto relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBackToChat}
            className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20 font-bold text-lg hover:scale-105"
          >
            ← Back to Buddy 🤖
          </button>
          <div className="text-white/80 text-lg font-semibold">
            AI Level: {difficulty.toUpperCase()} | Hints: {hintLevel}/3 🎯
          </div>
        </div>

        {renderGame()}

        {/* AI Thinking Indicator */}
        {showAIThinking && (
          <div className="fixed bottom-20 right-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl p-4 shadow-2xl border-4 border-white/30 animate-pulse z-50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center animate-spin">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm">AI is thinking...</p>
                <div className="flex space-x-1 mt-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Hint Popup */}
        {showAIHint && (
          <div className="fixed bottom-20 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl p-4 shadow-2xl border-4 border-white/30 animate-bounce z-50 max-w-sm">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm mb-1">
                  AI Hint #{hintLevel} {wrongAttempts > 0 && `(After ${wrongAttempts} tries)`}:
                </p>
                <p className="text-white text-sm">{aiHintText}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PuzzleGame

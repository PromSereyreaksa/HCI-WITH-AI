"use client"

import { useState, useEffect, useRef } from "react"
import { generateGameHint } from "../services/deepseek"

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

  const triggerAIHint = async (trigger) => {
    setShowAIThinking(true)

    try {
      // AI thinking delay for realism
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      let hintText = '';
      
      if (trigger === "wrong_answer") {
        // Use DeepSeek to generate a contextual hint based on the current game and question
        const currentQuestion = getCurrentQuestionForHint()
        const currentAnswer = getCurrentAnswerForHint()
        
        hintText = await generateGameHint(
          game, 
          currentQuestion, 
          currentAnswer, 
          difficulty, 
          wrongAttempts + 1
        )
      } else {
        // For inactivity, use encouraging prompts
        const encouragementPrompts = [
          "🤖 Take your time! Good thinking takes patience! What do you think the answer might be? 🤔",
          "🤖 You're doing great! Sometimes the best ideas come when we slow down and think. 💭",
          "🤖 No rush! Every expert was once a beginner. What's your best guess? ✨",
          "🤖 I believe in you! Trust your instincts and give it a try! 💪"
        ]
        hintText = encouragementPrompts[Math.floor(Math.random() * encouragementPrompts.length)]
      }

      setShowAIThinking(false)
      setAiHintText(hintText)
      setShowAIHint(true)
      setHintLevel((prev) => Math.min(prev + 1, 3))

      // Auto-hide hint after reading time
      hintTimer.current = setTimeout(() => {
        setShowAIHint(false)
      }, 8000)
    } catch (error) {
      console.error('Error generating AI hint:', error)
      setShowAIThinking(false)
      
      // Fallback to basic encouraging message
      setAiHintText("🤖 You're doing great! Keep trying - I believe in you! 💪✨")
      setShowAIHint(true)
      
      hintTimer.current = setTimeout(() => {
        setShowAIHint(false)
      }, 5000)
    }
  }

  const getCurrentQuestionForHint = () => {
    switch (game) {
      case "monster-math":
        return gameState.question
      case "space-quiz":
        return gameState.question
      case "animal-sounds":
        return `What animal makes this sound: ${gameState.currentAnimal?.sound}?`
      default:
        return "current question"
    }
  }

  const getCurrentAnswerForHint = () => {
    switch (game) {
      case "monster-math":
        return gameState.answer
      case "space-quiz":
        return gameState.answer
      case "animal-sounds":
        return gameState.currentAnimal?.name
      default:
        return "answer"
    }
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
          const range = difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 50
          const num1 = Math.floor(Math.random() * range) + 1
          const num2 = Math.floor(Math.random() * range) + 1
          
          let operations
          if (difficulty === "easy") {
            operations = ["+", "-"]
          } else if (difficulty === "medium") {
            operations = ["+", "-", "×"]
          } else {
            operations = ["+", "-", "×", "÷"]
          }
          
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
          } else if (operation === "×") {
            // For multiplication, use smaller numbers to keep it manageable
            const smallNum1 = Math.floor(Math.random() * (difficulty === "medium" ? 10 : 12)) + 1
            const smallNum2 = Math.floor(Math.random() * (difficulty === "medium" ? 10 : 12)) + 1
            answer = smallNum1 * smallNum2
            question = `${smallNum1} × ${smallNum2}`
          } else if (operation === "÷") {
            // For division, ensure we get whole numbers
            const divisor = Math.floor(Math.random() * 12) + 2 // 2-13
            const quotient = Math.floor(Math.random() * 15) + 1 // 1-15
            const dividend = divisor * quotient
            answer = quotient
            question = `${dividend} ÷ ${divisor}`
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
              { q: "What color is the Sun?", a: "YELLOW", options: ["YELLOW", "BLUE", "GREEN", "PURPLE"] },
              { q: "When do we see the Moon?", a: "NIGHT", options: ["NIGHT", "MORNING", "NOON", "NEVER"] },
              { q: "What do astronauts wear in space?", a: "SPACESUIT", options: ["SPACESUIT", "PAJAMAS", "SWIMSUIT", "COAT"] },
              { q: "What do rockets do?", a: "FLY", options: ["FLY", "SWIM", "WALK", "DIG"] },
              { q: "Where do astronauts go?", a: "SPACE", options: ["SPACE", "OCEAN", "FOREST", "STORE"] },
              { q: "What shape is Earth?", a: "ROUND", options: ["ROUND", "SQUARE", "TRIANGLE", "FLAT"] },
              { q: "What twinkles in the night sky?", a: "STARS", options: ["STARS", "CARS", "FLOWERS", "BOOKS"] },
              { q: "What is the Moon made of?", a: "ROCK", options: ["ROCK", "CHEESE", "WATER", "CANDY"] },
            ],
            medium: [
              { q: "What planet is closest to the sun?", a: "MERCURY", options: ["MERCURY", "VENUS", "EARTH", "MARS"] },
              { q: "What is the biggest planet?", a: "JUPITER", options: ["JUPITER", "SATURN", "EARTH", "MARS"] },
              { q: "What do we call a shooting star?", a: "METEOR", options: ["METEOR", "COMET", "ASTEROID", "PLANET"] },
              { q: "Which planet has rings?", a: "SATURN", options: ["SATURN", "EARTH", "MARS", "VENUS"] },
              { q: "What is the red planet called?", a: "MARS", options: ["MARS", "VENUS", "JUPITER", "SATURN"] },
              { q: "How long is one day on Earth?", a: "24 HOURS", options: ["24 HOURS", "12 HOURS", "48 HOURS", "1 HOUR"] },
              { q: "What do we call people who go to space?", a: "ASTRONAUTS", options: ["ASTRONAUTS", "PILOTS", "SAILORS", "DRIVERS"] },
              { q: "Which planet is known as Earth's twin?", a: "VENUS", options: ["VENUS", "MARS", "JUPITER", "MERCURY"] },
              { q: "What is a group of stars called?", a: "CONSTELLATION", options: ["CONSTELLATION", "COLLECTION", "CLUSTER", "CROWD"] },
              { q: "What pulls things down to Earth?", a: "GRAVITY", options: ["GRAVITY", "MAGNETS", "WIND", "RAIN"] },
              { q: "What is the path a planet takes around the Sun?", a: "ORBIT", options: ["ORBIT", "CIRCLE", "LINE", "SQUARE"] },
              { q: "What do comets have that makes them special?", a: "TAIL", options: ["TAIL", "LEGS", "ARMS", "WINGS"] },
              { q: "Which planet spins on its side?", a: "URANUS", options: ["URANUS", "EARTH", "MARS", "VENUS"] },
              { q: "What is the closest star to Earth?", a: "SUN", options: ["SUN", "MOON", "MARS", "VENUS"] },
              { q: "How many planets are in our solar system?", a: "EIGHT", options: ["EIGHT", "SEVEN", "NINE", "TEN"] },
            ],
            hard: [
              { q: "Which planet has the most moons?", a: "SATURN", options: ["SATURN", "JUPITER", "EARTH", "MARS"] },
              { q: "What is the hottest planet?", a: "VENUS", options: ["VENUS", "MERCURY", "MARS", "JUPITER"] },
              { q: "What galaxy do we live in?", a: "MILKY WAY", options: ["MILKY WAY", "ANDROMEDA", "SPIRAL", "COSMIC"] },
              { q: "How long does Earth take to orbit the sun?", a: "ONE YEAR", options: ["ONE YEAR", "ONE MONTH", "ONE DAY", "ONE WEEK"] },
              { q: "What is the coldest planet in our solar system?", a: "NEPTUNE", options: ["NEPTUNE", "PLUTO", "URANUS", "SATURN"] },
              { q: "What is the asteroid belt between?", a: "MARS AND JUPITER", options: ["MARS AND JUPITER", "EARTH AND MARS", "JUPITER AND SATURN", "VENUS AND EARTH"] },
              { q: "What is a light-year?", a: "DISTANCE", options: ["DISTANCE", "TIME", "SPEED", "WEIGHT"] },
              { q: "What is the largest moon in our solar system?", a: "GANYMEDE", options: ["GANYMEDE", "EUROPA", "TITAN", "MOON"] },
              { q: "Which planet has the Great Red Spot?", a: "JUPITER", options: ["JUPITER", "SATURN", "MARS", "VENUS"] },
              { q: "What is the name of our galaxy's central black hole?", a: "SAGITTARIUS A", options: ["SAGITTARIUS A", "BLACK STAR", "VOID ONE", "DARK CENTER"] },
              { q: "How many Earth days does it take Mercury to orbit the Sun?", a: "88 DAYS", options: ["88 DAYS", "365 DAYS", "180 DAYS", "30 DAYS"] },
              { q: "What is the boundary around a black hole called?", a: "EVENT HORIZON", options: ["EVENT HORIZON", "DARK EDGE", "SPACE BORDER", "VOID LINE"] },
              { q: "Which spacecraft was first to leave our solar system?", a: "VOYAGER 1", options: ["VOYAGER 1", "HUBBLE", "APOLLO 11", "CASSINI"] },
              { q: "What type of star is our Sun?", a: "YELLOW DWARF", options: ["YELLOW DWARF", "RED GIANT", "WHITE DWARF", "BLUE GIANT"] },
              { q: "What is the temperature at the Sun's core?", a: "15 MILLION", options: ["15 MILLION", "1 MILLION", "100 THOUSAND", "50 MILLION"] },
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
              { name: "PIG", sound: "OINK OINK! 🐷", emoji: "🐷", hint: "I roll in mud and love food!" },
              { name: "SHEEP", sound: "BAA BAA! 🐑", emoji: "🐑", hint: "I have fluffy wool!" },
              { name: "CHICKEN", sound: "CLUCK CLUCK! 🐔", emoji: "🐔", hint: "I lay eggs for breakfast!" },
              { name: "HORSE", sound: "NEIGH NEIGH! 🐴", emoji: "🐴", hint: "People ride on my back!" },
              { name: "FROG", sound: "RIBBIT RIBBIT! 🐸", emoji: "🐸", hint: "I hop and live near water!" },
              { name: "BEE", sound: "BUZZ BUZZ! 🐝", emoji: "🐝", hint: "I make honey and fly to flowers!" },
              { name: "BIRD", sound: "TWEET TWEET! 🐦", emoji: "🐦", hint: "I can fly and build nests!" },
              { name: "MOUSE", sound: "SQUEAK SQUEAK! 🐭", emoji: "🐭", hint: "I'm small and like cheese!" },
            ],
            medium: [
              { name: "LION", sound: "ROAR ROAR! 🦁", emoji: "🦁", hint: "I'm the king of the jungle!" },
              { name: "ELEPHANT", sound: "TRUMPET! 🐘", emoji: "🐘", hint: "I have a long trunk and big ears!" },
              { name: "MONKEY", sound: "OOH OOH AH AH! 🐵", emoji: "🐵", hint: "I swing from trees!" },
              { name: "WOLF", sound: "HOWL HOWL! �", emoji: "�", hint: "I howl at the moon!" },
              { name: "BEAR", sound: "GROWL GROWL! 🐻", emoji: "🐻", hint: "I love honey and fish!" },
              { name: "TIGER", sound: "ROAR GROWL! �", emoji: "�", hint: "I have orange stripes!" },
              { name: "SNAKE", sound: "HISS HISS! 🐍", emoji: "🐍", hint: "I slither on the ground!" },
              { name: "OWL", sound: "HOO HOO! 🦉", emoji: "🦉", hint: "I'm wise and hunt at night!" },
              { name: "CROW", sound: "CAW CAW! 🐦‍⬛", emoji: "🐦‍⬛", hint: "I'm black and very smart!" },
              { name: "GOAT", sound: "BLEAT BLEAT! �", emoji: "�", hint: "I climb mountains and eat grass!" },
              { name: "TURKEY", sound: "GOBBLE GOBBLE! 🦃", emoji: "🦃", hint: "I'm often eaten at Thanksgiving!" },
              { name: "SEAL", sound: "ARF ARF! 🦭", emoji: "🦭", hint: "I swim and balance balls on my nose!" },
            ],
            hard: [
              { name: "WHALE", sound: "WHOOOOO! 🐋", emoji: "🐋", hint: "I'm the largest animal and sing songs!" },
              { name: "DOLPHIN", sound: "CLICK CLICK! �", emoji: "�", hint: "I'm smart and love to jump!" },
              { name: "EAGLE", sound: "SCREECH! 🦅", emoji: "🦅", hint: "I soar high and have excellent vision!" },
              { name: "KANGAROO", sound: "THUMP THUMP! 🦘", emoji: "🦘", hint: "I hop and carry babies in my pouch!" },
              { name: "PEACOCK", sound: "KEE-OW! 🦚", emoji: "🦚", hint: "I have beautiful colorful tail feathers!" },
              { name: "FLAMINGO", sound: "HONK HONK! 🦩", emoji: "🦩", hint: "I'm pink and stand on one leg!" },
              { name: "HYENA", sound: "LAUGH! 🐺", emoji: "🐺", hint: "I sound like I'm laughing!" },
              { name: "RHINO", sound: "SNORT SNORT! 🦏", emoji: "🦏", hint: "I have a big horn on my nose!" },
              { name: "HIPPO", sound: "GRUNT GRUNT! 🦛", emoji: "🦛", hint: "I'm huge and love water!" },
              { name: "CRICKET", sound: "CHIRP CHIRP! 🦗", emoji: "🦗", hint: "You hear me at night in summer!" },
              { name: "ROOSTER", sound: "COCK-A-DOODLE-DOO! �", emoji: "�", hint: "I wake everyone up in the morning!" },
              { name: "PENGUIN", sound: "SQUAWK! 🐧", emoji: "🐧", hint: "I waddle and can't fly but swim great!" },
              { name: "PARROT", sound: "SQUAWK HELLO! 🦜", emoji: "🦜", hint: "I'm colorful and can copy words!" },
              { name: "WOODPECKER", sound: "TAP TAP TAP! �", emoji: "�", hint: "I peck holes in trees with my beak!" },
              { name: "COYOTE", sound: "YIP YIP HOWL! 🐺", emoji: "🐺", hint: "I'm like a wild dog and hunt in packs!" },
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

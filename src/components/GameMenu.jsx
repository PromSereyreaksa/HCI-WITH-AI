"use client"

const games = [
  {
    id: "monster-math",
    title: "Monster Math Battle 👾",
    description: "AI helps you solve math just like calculators!",
    icon: "👾",
    color: "from-green-400 to-lime-400",
    working: true,
    aiExample: "Calculators & Math Apps",
  },
  {
    id: "space-quiz",
    title: "Space Explorer 🚀",
    description: "AI helps answer questions like search engines!",
    icon: "🚀",
    color: "from-blue-400 to-indigo-400",
    working: true,
    aiExample: "Google & Siri",
  },
  {
    id: "animal-sounds",
    title: "Animal Sound Detective 🐾",
    description: "AI identifies sounds like nature apps!",
    icon: "🦁",
    color: "from-orange-400 to-yellow-400",
    working: true,
    aiExample: "Shazam & Nature Apps",
  },
  {
    id: "coming-soon-1",
    title: "Rainbow Artist 🌈",
    description: "Coming soon! AI helps with creative apps!",
    icon: "🎨",
    color: "from-pink-400 to-purple-400",
    working: false,
    aiExample: "Drawing Apps",
  },
  {
    id: "coming-soon-2",
    title: "Dance Party 💃",
    description: "Coming soon! AI recognizes movements!",
    icon: "💃",
    color: "from-red-400 to-pink-400",
    working: false,
    aiExample: "Motion Games",
  },
  {
    id: "coming-soon-3",
    title: "Treasure Hunt 🏴‍☠️",
    description: "Coming soon! AI gives smart clues!",
    icon: "💎",
    color: "from-amber-400 to-orange-400",
    working: false,
    aiExample: "GPS & Maps",
  },
]

const GameMenu = ({ onSelectGame }) => {
  const generateGameData = (gameId) => {
    switch (gameId) {
      case "monster-math":
        const monsters = ["👾", "👹", "🤖", "👻", "🐲"]
        const selectedMonster = monsters[Math.floor(Math.random() * monsters.length)]
        return {
          monster: selectedMonster,
          question: "2 + 2",
          answer: 4,
          monsterHunger: 100,
          score: 0,
          level: 1,
        }

      case "space-quiz":
        return {
          question: "What planet do we live on?",
          answer: "EARTH",
          options: ["EARTH", "MARS", "MOON", "SUN"],
          rocketPosition: 0,
          stars: 0,
          planets: ["🪐", "🌍", "🔴", "🟡", "🔵"],
        }

      case "animal-sounds":
        const easyAnimals = [
          { name: "COW", sound: "MOO MOO! 🐄", emoji: "🐄", hint: "I give milk and live on farms!" },
          { name: "CAT", sound: "MEOW MEOW! 🐱", emoji: "🐱", hint: "I purr and love to chase mice!" },
          { name: "DOG", sound: "WOOF WOOF! �", emoji: "🐶", hint: "I'm man's best friend!" },
          { name: "DUCK", sound: "QUACK QUACK! 🦆", emoji: "🦆", hint: "I swim in ponds!" },
        ]
        const startingAnimal = easyAnimals[Math.floor(Math.random() * easyAnimals.length)]
        return {
          currentAnimal: startingAnimal,
          score: 0,
          streak: 0,
        }

      default:
        return {}
    }
  }

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold text-white mb-2 animate-bounce">🤖 AI LEARNING GAMES! 🤖</h2>
        <p className="text-white/80 text-xl">Discover how AI helps you every day!</p>
        <div className="text-6xl animate-pulse mt-2">🌟✨🎉✨🌟</div>
      </div>

      {/* AI Daily Life Examples */}
      <div className="mb-8 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 backdrop-blur-sm rounded-3xl p-6 border-2 border-cyan-400/30">
        <h3 className="text-2xl font-bold text-white mb-4 text-center">🤖 AI Helps You Every Day! 🤖</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/90">
          <div className="text-center p-3 bg-white/10 rounded-2xl">
            <div className="text-3xl mb-2">📱</div>
            <p className="font-semibold">Phone Assistant</p>
            <p className="text-sm">Siri, Google Assistant</p>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-2xl">
            <div className="text-3xl mb-2">🎵</div>
            <p className="font-semibold">Music Apps</p>
            <p className="text-sm">Spotify, YouTube Music</p>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-2xl">
            <div className="text-3xl mb-2">🗺️</div>
            <p className="font-semibold">Maps & Navigation</p>
            <p className="text-sm">Google Maps, Waze</p>
          </div>
        </div>
        <p className="text-white text-center mt-4 text-lg">
          🌟 Just like how I help you in these games, AI helps millions of people every day! 🌟
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {games.map((game, index) => (
          <button
            key={game.id}
            onClick={() => {
              if (game.working) {
                onSelectGame(game.id, generateGameData(game.id))
              }
            }}
            disabled={!game.working}
            className={`group relative overflow-hidden rounded-3xl p-6 transition-all duration-500 ${
              game.working
                ? "hover:scale-110 hover:shadow-2xl hover:rotate-2 cursor-pointer"
                : "opacity-60 cursor-not-allowed"
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-90 group-hover:opacity-100 transition-opacity`}
            ></div>
            <div className="relative z-10 text-center">
              <div
                className={`text-5xl mb-4 transition-all duration-300 ${
                  game.working ? "group-hover:animate-spin group-hover:scale-125" : ""
                }`}
              >
                {game.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-200">{game.title}</h3>
              <p className="text-white/90 text-sm leading-relaxed mb-2">{game.description}</p>
              <div className="text-white/80 text-xs bg-white/20 rounded-full px-3 py-1 inline-block">
                Like: {game.aiExample}
              </div>
              {game.working && (
                <div className="mt-3 text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  🎯🎪🎊
                </div>
              )}
              {!game.working && <div className="mt-3 text-xl">⏳ Coming Soon!</div>}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
            {game.working && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-lg animate-bounce">
                ⭐
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-10 text-center">
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-3xl p-6 max-w-4xl mx-auto border-2 border-white/20">
          <p className="text-white text-2xl font-bold mb-4">🤖 How AI Buddy Helps You Learn! 🤖</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-white/90">
            <div className="flex flex-col items-center space-y-2 p-3 bg-white/10 rounded-2xl">
              <span className="text-3xl">⏰</span>
              <span className="font-semibold">Smart Timing</span>
              <span className="text-sm">Helps when you need it!</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 bg-white/10 rounded-2xl">
              <span className="text-3xl">🎯</span>
              <span className="font-semibold">Perfect Level</span>
              <span className="text-sm">Adjusts to your skill!</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 bg-white/10 rounded-2xl">
              <span className="text-3xl">💡</span>
              <span className="font-semibold">Smart Hints</span>
              <span className="text-sm">Just the right clue!</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 bg-white/10 rounded-2xl">
              <span className="text-3xl">🎉</span>
              <span className="font-semibold">Encouragement</span>
              <span className="text-sm">Celebrates your success!</span>
            </div>
          </div>
          <p className="text-white text-center mt-4 text-lg">
            🌟 This is exactly how AI helps people in real life - by being smart, helpful, and encouraging! 🌟
          </p>
        </div>
      </div>
    </div>
  )
}

export default GameMenu

const AvatarBot = ({ isTyping }) => {
  return (
    <div className="relative">
      <div
        className={`w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center shadow-lg transition-all duration-300 ${isTyping ? "animate-pulse scale-110" : ""}`}
      >
        <span className="text-white text-xl">🤖</span>
      </div>
      {isTyping && <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>}
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center">
        <span className="text-white text-xs">✨</span>
      </div>
    </div>
  )
}

export default AvatarBot

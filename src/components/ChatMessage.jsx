const ChatMessage = ({ message }) => {
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (message.isBot) {
    return (
      <div className="flex items-start space-x-3 animate-fade-in">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center shadow-lg">
          <span className="text-white text-lg">🤖</span>
        </div>
        <div className="flex-1">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
            <p className="text-gray-800 text-lg leading-relaxed">{message.text}</p>
          </div>
          <p className="text-white/70 text-xs mt-1 ml-2">{formatTime(message.timestamp)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start space-x-3 justify-end animate-fade-in">
      <div className="flex-1">
        <div className="bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl p-4 shadow-lg ml-12">
          <p className="text-white text-lg leading-relaxed">{message.text}</p>
        </div>
        <p className="text-white/70 text-xs mt-1 mr-2 text-right">{formatTime(message.timestamp)}</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-400 flex items-center justify-center shadow-lg">
        <span className="text-white text-lg">😊</span>
      </div>
    </div>
  )
}

export default ChatMessage

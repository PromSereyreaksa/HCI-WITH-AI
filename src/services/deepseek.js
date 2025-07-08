import axios from 'axios';

// OpenRouter API configuration (using DeepSeek model through OpenRouter)
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;

// Kid-friendly system prompt to ensure appropriate responses
const SYSTEM_PROMPT = `You are Buddy, a friendly AI companion designed specifically for children. Your responses should be:
- Age-appropriate, safe, and educational
- Encouraging and positive
- Simple to understand but engaging
- Include fun facts or emojis when appropriate
- Always maintain a cheerful, helpful tone
- Avoid any inappropriate content
- Keep responses concise but friendly
- If asked about anything inappropriate, redirect to fun, educational topics

Remember, you're talking to kids, so be their helpful, fun friend who loves to learn and play!`;

export const sendMessageToDeepSeek = async (userMessage, conversationHistory = []) => {
  try {
    // Check if API key is available
    console.log('API_KEY available:', !!API_KEY);
    console.log('API_KEY first 10 chars:', API_KEY ? API_KEY.substring(0, 10) + '...' : 'undefined');
    
    if (!API_KEY) {
      throw new Error('OpenRouter API key not found. Please check your .env file.');
    }

    // Prepare the messages array with system prompt and conversation history
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.map(msg => ({
        role: msg.isBot ? 'assistant' : 'user',
        content: msg.text
      })),
      { role: 'user', content: userMessage }
    ];

    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: 'deepseek/deepseek-chat',
        messages: messages,
        max_tokens: 200,
        temperature: 0.7,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': SITE_URL,
          'X-Title': SITE_NAME
        }
      }
    );

    if (response.data && response.data.choices && response.data.choices[0]) {
      return response.data.choices[0].message.content.trim();
    } else {
      throw new Error('Invalid response format from OpenRouter API');
    }
  } catch (error) {
    console.error('OpenRouter API Error:', error);
    
    // Fallback responses if API fails
    const fallbackResponses = [
      "Oops! I'm having trouble thinking right now. Can you try asking me again? 🤔",
      "My brain is taking a little break! Let's try that question one more time! 🧠✨",
      "Sorry, I'm having a tiny technical hiccup! What would you like to chat about? 🤖",
      "I need a moment to gather my thoughts! Can you ask me something else? 💭"
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
};

// Helper function to get a greeting message
export const getGreetingMessage = () => {
  const greetings = [
    "Hi there, awesome kid! I'm Buddy, your AI friend! What would you like to chat about today? 🤖✨",
    "Hello, superstar! Ready for some fun conversations? 🌟",
    "Hey there, curious explorer! What adventure should we go on today? 🚀",
    "Welcome back, friend! I'm so excited to chat with you! What's on your mind? 🎉",
    "Hi! I'm Buddy, and I love learning new things with kids like you! What shall we discover today? 📚✨"
  ];
  
  return greetings[Math.floor(Math.random() * greetings.length)];
};

// Helper function to generate AI-powered hints for game questions
export const generateGameHint = async (gameType, question, correctAnswer, difficulty, attemptNumber = 1) => {
  try {
    if (!API_KEY) {
      throw new Error('OpenRouter API key not found.');
    }

    let hintPrompt = '';
    
    switch (gameType) {
      case 'monster-math':
        hintPrompt = `You are Buddy, a kid-friendly AI helper. A child is struggling with this math problem: "${question}". The correct answer is ${correctAnswer}. This is their attempt #${attemptNumber}. Difficulty level: ${difficulty}.

Give them a ${attemptNumber === 1 ? 'gentle hint' : attemptNumber === 2 ? 'more detailed hint' : 'step-by-step explanation'} to help them learn. Use simple words, encouraging tone, and include fun emojis. Keep it under 50 words.`;
        break;
        
      case 'space-quiz':
        hintPrompt = `You are Buddy, a kid-friendly AI helper. A child is struggling with this space question: "${question}". The correct answer is "${correctAnswer}". This is their attempt #${attemptNumber}. Difficulty level: ${difficulty}.

Give them a ${attemptNumber === 1 ? 'fun hint' : attemptNumber === 2 ? 'more detailed clue' : 'educational explanation'} about space. Use simple words, exciting tone about space exploration, and include space emojis. Keep it under 50 words.`;
        break;
        
      case 'animal-sounds':
        hintPrompt = `You are Buddy, a kid-friendly AI helper. A child is trying to guess what animal makes this sound, but they're having trouble. The correct answer is "${correctAnswer}". This is their attempt #${attemptNumber}. Difficulty level: ${difficulty}.

Give them a ${attemptNumber === 1 ? 'playful hint' : attemptNumber === 2 ? 'descriptive clue' : 'clear description'} about this animal. Use simple words, playful tone, and include animal emojis. Keep it under 50 words.`;
        break;
        
      default:
        hintPrompt = `You are Buddy, a kid-friendly AI helper. A child needs help with a learning activity. Give them an encouraging, gentle hint. Use simple words and fun emojis. Keep it under 50 words.`;
    }

    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: 'deepseek/deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: hintPrompt }
        ],
        max_tokens: 100,
        temperature: 0.8,
        top_p: 0.9,
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': SITE_URL,
          'X-Title': SITE_NAME
        }
      }
    );

    if (response.data && response.data.choices && response.data.choices[0]) {
      return response.data.choices[0].message.content.trim();
    } else {
      throw new Error('Invalid response format from OpenRouter API');
    }
  } catch (error) {
    console.error('OpenRouter Hint Generation Error:', error);
    
    // Fallback hints if API fails
    const fallbackHints = {
      'monster-math': [
        "🤖 Try counting on your fingers! That always helps! 🖐️",
        "🤖 Break the problem into smaller parts! You've got this! 💪",
        "🤖 Take your time and think step by step! 🧠✨"
      ],
      'space-quiz': [
        "🤖 Think about what you see in the sky! 🌟",
        "🤖 Remember what you learned about planets! 🪐",
        "🤖 Space is amazing - use your imagination! 🚀"
      ],
      'animal-sounds': [
        "🤖 What animal would make that sound? 🐾",
        "🤖 Think about where this animal might live! 🏠",
        "🤖 Listen carefully to the sound again! 👂"
      ]
    };
    
    const gameHints = fallbackHints[gameType] || fallbackHints['monster-math'];
    return gameHints[Math.floor(Math.random() * gameHints.length)];
  }
};

// Temporary debug function - remove this later
export const debugEnvVars = () => {
  console.log('Environment variables debug:');
  console.log('API_KEY:', !!API_KEY, API_KEY ? API_KEY.substring(0, 10) + '...' : 'undefined');
  console.log('SITE_URL:', SITE_URL);
  console.log('SITE_NAME:', SITE_NAME);
  console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
  return { hasApiKey: !!API_KEY, siteUrl: SITE_URL, siteName: SITE_NAME };
};
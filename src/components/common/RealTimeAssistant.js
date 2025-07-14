import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { MdChat, MdCall, MdMic, MdSend, MdLocationOn, MdEmergency, MdSupport, MdVoiceChat } from 'react-icons/md';
// TODO: Integrate with backend chatbot and voice/call API

// TODO: Replace with your OpenAI API key
const OPENAI_API_KEY = 'API_KEY';

const RealTimeAssistant = () => {
  const { isDarkMode } = useTheme();
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your travel assistant. How can I help you today?", sender: 'assistant', timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const recognitionRef = useRef(null);

  // --- OpenAI Chatbot Integration ---
  const fetchAIResponse = async (userMessage) => {
    setIsTyping(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: "You are a helpful travel assistant." },
            ...messages.filter(m => m.sender === 'user' || m.sender === 'assistant').map(m => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.text
            })),
            { role: 'user', content: userMessage }
          ],
          max_tokens: 150,
        })
      });
      const data = await response.json();
      const aiText = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that.";
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: aiText,
        sender: 'assistant',
        timestamp: new Date()
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Sorry, I couldn't reach the assistant right now.",
        sender: 'assistant',
        timestamp: new Date()
      }]);
    }
    setIsTyping(false);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages([...messages, newMessage]);
    setInputMessage('');
    fetchAIResponse(inputMessage);
  };

  // --- Web Speech API Voice Recognition ---
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Sorry, your browser does not support speech recognition.');
      return;
    }
    if (isListening) {
      recognitionRef.current && recognitionRef.current.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => {
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  };

  // --- Geolocation API for Location Sharing ---
  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationMessage = `My current location is: https://maps.google.com/?q=${latitude},${longitude}`;
        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            text: locationMessage,
            sender: 'user',
            timestamp: new Date()
          }
        ]);
        fetchAIResponse(locationMessage);
      },
      () => {
        alert('Unable to retrieve your location.');
      }
    );
  };

  const handleEmergencyCall = () => {
    window.open('tel:112', '_blank');
  };

  const handleSupportCall = () => {
    window.open('tel:+91-1800-123-4567', '_blank');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    hover: { 
      scale: 1.02,
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
        >
          <h1 className="text-4xl font-bold mb-2">AI Travel Assistant</h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Get instant help with your travel needs
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Chat Interface */}
          <motion.div variants={cardVariants} className="lg:col-span-2">
            <div className={`h-[600px] rounded-2xl shadow-lg flex flex-col ${
              isDarkMode ? 'bg-[#1a1e2e] border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              {/* Chat Header */}
              <div className={`p-4 border-b ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`}>
                    <MdChat size={20} />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Travel Assistant
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Online • Ready to help
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    variants={itemVariants}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? `${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`
                        : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} ${isDarkMode ? 'text-white' : 'text-gray-900'}`
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-100' : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className={`max-w-xs p-3 rounded-2xl ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input Area */}
              <div className={`p-4 border-t ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className={`flex-1 p-3 rounded-xl border-2 transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-400'
                    } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                    aria-label="Type your message"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleVoiceInput}
                    className={`p-3 rounded-xl transition-colors duration-200 ${
                      isListening
                        ? 'bg-red-500 text-white'
                        : isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                    }`}
                    aria-label="Start voice input"
                  >
                    <MdMic size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      !inputMessage.trim()
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                    aria-label="Send message"
                  >
                    <MdSend size={20} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={cardVariants} className="space-y-6">
            {/* Emergency Actions */}
            <div className={`p-6 rounded-2xl shadow-lg ${
              isDarkMode ? 'bg-[#1a1e2e] border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-red-600' : 'bg-red-500'} text-white`}>
                  <MdEmergency size={24} />
                </div>
                <div>
                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Emergency
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Quick access to help
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEmergencyCall}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  aria-label="Emergency call"
                >
                  <MdCall size={20} />
                  Emergency Call
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSupportCall}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  aria-label="Support call"
                >
                  <MdSupport size={20} />
                  Support Call
                </motion.button>
              </div>
            </div>

            {/* Voice Commands */}
            <div className={`p-6 rounded-2xl shadow-lg ${
              isDarkMode ? 'bg-[#1a1e2e] border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-green-600' : 'bg-green-500'} text-white`}>
                  <MdVoiceChat size={24} />
                </div>
                <div>
                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Voice Commands
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Try these voice commands
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  "Book a flight",
                  "Find hotels nearby",
                  "Get directions",
                  "Emergency help",
                  "Translate text"
                ].map((command, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setInputMessage(command)}
                    className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                    aria-label={`Voice command: ${command}`}
                  >
                    <span className="text-sm">"{command}"</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Location Services */}
            <div className={`p-6 rounded-2xl shadow-lg ${
              isDarkMode ? 'bg-[#1a1e2e] border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-purple-600' : 'bg-purple-500'} text-white`}>
                  <MdLocationOn size={24} />
                </div>
                <div>
                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Location Services
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Share your location for better assistance
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShareLocation}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                aria-label="Share location"
              >
                <MdLocationOn size={20} />
                Share Location
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default RealTimeAssistant; 
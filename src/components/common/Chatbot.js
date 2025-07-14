import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const Chatbot = () => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi! 👋 How can I help you today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const faqs = [
    {
      question: "How do I cancel a booking?",
      answer: "To cancel a booking:\n1. Go to 'My Bookings'\n2. Find your booking\n3. Click the 'Cancel' button\n4. Follow the refund instructions\n\nNote: Cancellation charges may apply based on service provider policy."
    },
    {
      question: "How do I change travel dates?",
      answer: "To change your travel dates:\n1. Go to 'My Bookings'\n2. Select the booking you want to modify\n3. Click on 'Modify Booking'\n4. Select new dates and check for any price differences\n5. Confirm the changes\n\nNote: Date change fees may apply depending on the service provider."
    },
    {
      question: "Where can I find my booking history?",
      answer: "You can view all your bookings by:\n1. Click on 'My Bookings' in the sidebar\n2. Here you'll find both upcoming and past bookings\n3. Use the filter options to sort by date or booking type"
    },
    {
      question: "What is the refund policy?",
      answer: "Our refund policy varies by service:\n\n• Flights: Refunds depend on airline policies, typically 75% refund if cancelled 72+ hours before departure\n• Hotels: Full refund if cancelled 24+ hours in advance\n• Packages: 80% refund if cancelled 7+ days before, 50% if within 3-7 days\n\nFor specific details, please check the terms during booking."
    },
    {
      question: "How can I earn loyalty points?",
      answer: "Earn TapNTrip loyalty points through:\n\n• Flight bookings: 5 points per ₹100 spent\n• Hotel stays: 8 points per ₹100 spent\n• Package bookings: 10 points per ₹100 spent\n• Referrals: 500 points per friend who makes their first booking\n• Reviews: 100 points for verified reviews\n\nPoints can be redeemed for discounts, upgrades, and exclusive deals in the Rewards section."
    },
    {
      question: "What payment options do you support?",
      answer: "We support multiple payment methods:\n\n• Credit/Debit Cards (Visa, Mastercard, Amex, RuPay)\n• Net Banking (40+ Indian banks)\n• UPI (Google Pay, PhonePe, Paytm)\n• Mobile Wallets (Paytm, Amazon Pay)\n• EMI options (3, 6, 12 months)\n• International cards with 3D secure\n\nAll transactions are secured with 256-bit encryption."
    }
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      setIsOpen(false);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const toggleChat = () => {
    setIsOpen(prevState => !prevState);
  };

  const handleFAQClick = async (faq) => {
    // Add user question
    setMessages(prev => [...prev, { type: 'user', text: faq.question }]);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate bot typing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add bot answer
    setMessages(prev => [...prev, { type: 'bot', text: faq.answer }]);
    setIsTyping(false);
  };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: inputMessage }]);
    setInputMessage('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate bot typing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check for matching FAQ
    const matchingFaq = faqs.find(faq => 
      faq.question.toLowerCase().includes(inputMessage.toLowerCase()) || 
      inputMessage.toLowerCase().includes(faq.question.toLowerCase())
    );
    
    if (matchingFaq) {
      setMessages(prev => [...prev, { type: 'bot', text: matchingFaq.answer }]);
    } else {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: "I'm still learning! For this query, please reach out to our support team at support@tapntrip.com or try one of the suggested questions below." 
      }]);
    }
    
    setIsTyping(false);
  };

  const chatVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 }
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleChat}
          title="Need Help?"
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg flex items-center justify-center text-2xl z-50 group"
        >
          {isOpen ? '\u2715' : '\ud83d\udcac'}
          <span className="absolute left-16 bottom-1/2 translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">Need Help?</span>
        </motion.button>
      </div>

      {/* Chat Popup */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 max-w-xs w-full max-h-[400px] overflow-y-auto bg-[#1F2937] rounded-2xl shadow-2xl p-3 z-50 border border-gray-700">
          <div className={`rounded-2xl shadow-xl overflow-hidden ${
            isDarkMode ? 'bg-[#1a1e2e] text-white' : 'bg-white text-gray-900'
          }`}>
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <h3 className="font-semibold text-white">TapNTrip Assistant</h3>
                    <p className="text-xs text-white/80">Always here to help</p>
                  </div>
                </div>
                <button
                  onClick={toggleChat}
                  className="text-white/90 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mr-2 flex-shrink-0">
                      🤖
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-tr-none'
                      : isDarkMode
                        ? 'bg-[#2d3348] text-white rounded-tl-none'
                        : 'bg-gray-100 text-gray-900 rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-line text-sm">{message.text}</p>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white ml-2 flex-shrink-0">
                      👤
                    </div>
                  )}
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mr-2 flex-shrink-0">
                    🤖
                  </div>
                  <div className={`rounded-lg p-3 ${
                    isDarkMode ? 'bg-[#2d3348]' : 'bg-gray-100'
                  }`}>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-100" />
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-200" />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* FAQ Suggestions */}
            <div className={`px-4 py-3 border-t ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Frequently Asked Questions:
              </p>
              <div className="flex overflow-x-auto pb-2 space-x-2 hide-scrollbar">
                {faqs.map((faq, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleFAQClick(faq)}
                    className={`flex-shrink-0 p-2 rounded-lg text-left text-xs ${
                      isDarkMode
                        ? 'bg-[#2d3348] hover:bg-[#3d4358] text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    {faq.question}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <form onSubmit={handleSubmitMessage} className={`p-3 border-t ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  className={`flex-1 p-2 rounded-l-lg border ${
                    isDarkMode 
                      ? 'bg-[#2d3348] border-gray-700 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-r-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Call Support and Toggles */}
            <div className="flex justify-between items-center p-4 border-b">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg mr-2">Call Support</button>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1">
                  <input type="checkbox" className="accent-blue-600" /> Share Location
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" className="accent-blue-600" /> Reminders
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot; 
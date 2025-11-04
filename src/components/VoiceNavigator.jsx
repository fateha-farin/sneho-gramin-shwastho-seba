import { useState, useRef, useEffect } from 'react';

export default function VoiceNavigator() {
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  // Culturally appropriate Bangla responses with regional flavor
  const banglaResponses = {
    greetings: [
      "আসসালামু আলাইকুম ভাই! কেমন আছেন আপনি?",
      "ওহে! কেমন আছেন? আজকে আপনাকে দেখে খুব ভালো লাগছে!",
      "আসসালামু আলাইকুম! আপনার দিনটি কেমন যাচ্ছে?"
    ],
    health_help: [
      "আরে ভাই, কি সমস্যা বলুন তো? আমি চেষ্টা করি সাহায্য করতে।",
      "বলুন বলুন, কি হয়েছে? আমি আপনার কথা শুনছি।",
      "কি সমস্যা হচ্ছে? আমাকে বলুন, দেখা যাক কি করা যায়।"
    ],
    symptoms: [
      "ওহো, বুঝতে পারছি। এটা নিয়ে চিন্তা করার কিছু নেই। একটু বিশ্রাম নিন।",
      "আপনার এই লক্ষণগুলো দেখে আমার মনে হচ্ছে ডাক্তার দেখানো উচিত।",
      "এটা সাধারণ সমস্যা। তবে যদি বেশি দিন থাকে তবে ডাক্তার দেখাবেন।"
    ],
    mental_health: [
      "বুঝতে পারছি আপনার মনটা ভালো নেই। এটা কোনো দোষের কথা না ভাই।",
      "মন খারাপ থাকলে কথা বলুন। আমরা আছি আপনার সাথে।",
      "জীবনে সবাইরই এমন সময় আসে। সবার সাথে এমন হয়, আপনি একলা নন।"
    ],
    locations: [
      "আপনার কাছের স্বাস্থ্যকেন্দ্রের কথা বলছি? এক্ষুণি দেখিয়ে দিচ্ছি।",
      "হ্যাঁ ভাই, আপনার এলাকার হাসপাতালের তথ্য দিচ্ছি।",
      "নিকটবর্তী ক্লিনিক খুঁজে বের করছি, একটু অপেক্ষা করুন।"
    ],
    emergency: [
      "ওমা! এতো জরুরি সমস্যা? দ্রুত হাসপাতালে যান! আমি সাহায্য করছি।",
      "আল্লাহ! এক্ষুণি ৯৯৯ এ কল করুন! আমি রাস্তা দেখিয়ে দিচ্ছি।",
      "জরুরি অবস্থা! দয়া করে শান্ত থাকুন, আমি সাহায্য করছি।"
    ],
    medicine: [
      "ওষুধের জন্য ফার্মেসিতে যাবেন? নিকটবর্তী ফার্মেসি খুঁজে দিচ্ছি।",
      "ওষুধ সম্পর্কে জানতে চান? সাধারণ ওষুধের তথ্য দিতে পারি।",
      "ডাক্তারের প্রেসক্রিপশন ছাড়া ওষুধ খাবেন না ভাই।"
    ],
    default: [
      "দুঃখিত ভাই, পুরোটা বুঝতে পারি নাই। আবার বলবেন?",
      "ওহো! এটা আমার বোঝার ক্ষমতার বাইরে। অন্য কিছু জিজ্ঞেস করবেন?",
      "আমি এখনো সেটা শিখি নাই। অন্য কিছুর জন্য বলুন তো?"
    ]
  };

  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'bn-BD'; // Bangla language

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        addToConversation('user', 'শুনছি... বলুন কথা', false);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        processUserSpeech(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        const errorMessage = 'দুঃখিত, আপনার কথা ভালোভাবে শুনতে পাই নাই। আবার চেষ্টা করবেন?';
        addToConversation('assistant', errorMessage, true);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    synthesisRef.current = window.speechSynthesis;

    // Add welcome message that speaks automatically
    setTimeout(() => {
      const welcomeMessage = 'আসসালামু আলাইকুম! আমি স্নেহ, আপনার স্বাস্থ্য সঙ্গী। বলুন, কিভাবে সাহায্য করতে পারি?';
      addToConversation('assistant', welcomeMessage, true);
    }, 1000);
  }, []);

  const addToConversation = (sender, message, shouldSpeak = false) => {
    setConversation(prev => [...prev, { sender, message, timestamp: new Date() }]);
    
    // Automatically speak AI responses
    if (shouldSpeak && sender === 'assistant') {
      setTimeout(() => {
        speakBangla(message);
      }, 500);
    }
  };

  const processUserSpeech = (transcript) => {
    addToConversation('user', transcript, false);
    setIsThinking(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const response = generateCulturallyAppropriateResponse(transcript);
      addToConversation('assistant', response, true); // This will auto-speak
      setIsThinking(false);
    }, 1500);
  };

  const generateCulturallyAppropriateResponse = (userInput) => {
    const input = userInput.toLowerCase();

    // Enhanced pattern matching for rural health concerns
    if (input.includes('সালাম') || input.includes('আদাব') || input.includes('নমস্কার') || input.includes('কেমন')) {
      return getRandomResponse(banglaResponses.greetings);
    }
    if (input.includes('ব্যথা') || input.includes('জ্বালা') || input.includes('কামড়') || input.includes('বিষ')) {
      return getRandomResponse(banglaResponses.symptoms);
    }
    if (input.includes('জ্বর') || input.includes('সর্দি') || input.includes('কাশি') || input.includes('ঠান্ডা')) {
      return "আরে সর্দি-কাশি তো সবারই হয় ভাই! গরম পানি খান, ভালো করে ঘুমান। যদি জ্বর ৩ দিনের বেশি থাকে, তখন ডাক্তার দেখাবেন।";
    }
    if (input.includes('মন') || input.includes('চিন্তা') || input.includes('টেনশন') || input.includes('ডিপ্রেশন')) {
      return getRandomResponse(banglaResponses.mental_health);
    }
    if (input.includes('হাসপাতাল') || input.includes('ডাক্তার') || input.includes('ক্লিনিক') || input.includes('ডাক্তারখানা')) {
      return getRandomResponse(banglaResponses.locations);
    }
    if (input.includes('জরুরি') || input.includes('ইমারজেন্সি') || input.includes('অ্যাম্বুলেন্স') || input.includes('দ্রুত')) {
      return getRandomResponse(banglaResponses.emergency);
    }
    if (input.includes('ওষুধ') || input.includes('মেডিসিন') || input.includes('পিল')) {
      return getRandomResponse(banglaResponses.medicine);
    }
    if (input.includes('ধন্যবাদ') || input.includes('থ্যাংকস') || input.includes('শুকরিয়া')) {
      return "আপনাকেও ধন্যবাদ ভাই! আল্লাহ আপনার ভালো রাখুন। আর কোনো সমস্যা হলে বলবেন।";
    }
    if (input.includes('কোথায়') || input.includes('খুঁজি') || input.includes('পাব')) {
      return "আপনি কি হাসপাতাল, ডাক্তার, না ফার্মেসি খুঁজছেন? স্পষ্ট করে বলুন ভাই।";
    }

    return getRandomResponse(banglaResponses.default);
  };

  const getRandomResponse = (responses) => {
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const speakBangla = (text) => {
    if (synthesisRef.current && 'speechSynthesis' in window) {
      // Stop any ongoing speech
      synthesisRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'bn-BD';
      utterance.rate = 0.8; // Slower for elderly users
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Configure for better Bangla pronunciation
      utterance.onstart = () => {
        setIsSpeaking(true);
        console.log('Started speaking:', text);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        console.log('Finished speaking');
      };
      
      utterance.onerror = (event) => {
        setIsSpeaking(false);
        console.error('Speech error:', event);
      };

      // Get available voices and try to find a Bangla voice
      const voices = synthesisRef.current.getVoices();
      const banglaVoice = voices.find(voice => 
        voice.lang.includes('bn') || voice.lang.includes('BD') || voice.lang.includes('bangla')
      );
      
      if (banglaVoice) {
        utterance.voice = banglaVoice;
        console.log('Using Bangla voice:', banglaVoice.name);
      } else {
        console.log('No Bangla voice found, using default');
      }

      synthesisRef.current.speak(utterance);
    } else {
      console.error('Speech synthesis not supported');
    }
  };

  const startListening = () => {
    if (isSpeaking) {
      // Stop speaking if currently speaking
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        const errorMsg = 'দুঃখিত, মাইক্রোফোন কাজ করতেছে না। ব্রাউজারটি রিস্টার্ট করে দেখবেন?';
        addToConversation('assistant', errorMsg, true);
      }
    } else {
      const errorMsg = 'দুঃখিত, আপনার ব্রাউজারে ভয়েস রিকগনিশন সাপোর্ট করে না। Chrome ব্রাউজার ব্যবহার করুন।';
      addToConversation('assistant', errorMsg, true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const clearConversation = () => {
    // Stop any ongoing speech
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
    
    setConversation([]);
    const welcomeMessage = 'আসসালামু আলাইকুম! আবার শুরু করছি। বলুন, কিভাবে সাহায্য করতে পারি?';
    addToConversation('assistant', welcomeMessage, true);
  };

  // Quick response buttons that also speak
  const handleQuickQuestion = (question, responseType) => {
    addToConversation('user', question, false);
    setIsThinking(true);

    setTimeout(() => {
      let response;
      switch(responseType) {
        case 'fever':
          response = "জ্বর হলে প্রথমে থার্মোমিটার দিয়ে জ্বর মাপুন। ১০১ ডিগ্রির বেশি হলে প্যারাসিটামল খান। প্রচুর পানি খান এবং বিশ্রাম নিন। ৩ দিনের বেশি জ্বর থাকলে ডাক্তার দেখান।";
          break;
        case 'hospital':
          response = "আপনার নিকটবর্তী হাসপাতালের তথ্য দিচ্ছি। আপনার বর্তমান লোকেশন জানালে আরও সঠিকভাবে বলতে পারব। সাধারণত ইউনিয়ন স্বাস্থ্য কেন্দ্র বা উপজেলা হাসপাতালে যেতে পারেন।";
          break;
        case 'sadness':
          response = "মন খারাপ নিয়ে চিন্তিত হচ্ছেন? এটা খুব স্বাভাবিক ভাই। কাছের কাউকে কথা বলুন, হালকা হাঁটাহাঁটি করুন। যদি অনেকদিন ধরে মন খারাপ থাকে, তাহলে কাউন্সেলরের সাথে কথা বলুন।";
          break;
        case 'medicine':
          response = "ওষুধ সম্পর্কে জানতে চান? সাধারণ ওষুধ যেমন প্যারাসিটামল জ্বরের জন্য, এন্টাসিড পেটের সমস্যার জন্য। কিন্তু ডাক্তারের পরামর্শ ছাড়া ওষুধ খাবেন না। ফার্মেসিতে গিয়ে ফার্মাসিস্টের সাথে কথা বলুন।";
          break;
        default:
          response = "আমি আপনাকে কিভাবে সাহায্য করতে পারি? বিস্তারিত বলুন।";
      }
      addToConversation('assistant', response, true);
      setIsThinking(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">ভয়েস অ্যাসিস্ট্যান্ট</h2>
        <p className="text-gray-600 mb-6">
          বাংলায় কথা বলুন, আমি শুনব এবং বাংলায় জবাব দেব। পড়তে না পারলেও শুনে বুঝতে পারবেন!
        </p>

        {/* Conversation Area */}
        <div className="mb-6 h-80 overflow-y-auto border border-gray-200 rounded-xl p-4 bg-gray-50">
          {conversation.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-green-500 text-white'
                    : 'bg-purple-100 text-gray-800'
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs opacity-70 mt-1">
                  {msg.timestamp.toLocaleTimeString('bn-BD', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isThinking && (
            <div className="text-left">
              <div className="inline-block bg-purple-100 text-gray-800 px-4 py-2 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-sm text-gray-600">চিন্তা করছি...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Voice Controls */}
        <div className="text-center space-y-4">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg mx-auto ${
              isListening 
                ? 'bg-red-500 animate-pulse' 
                : isSpeaking
                ? 'bg-purple-500 animate-pulse'
                : 'bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
            } transition-all duration-300`}
            disabled={isSpeaking}
          >
            {isListening ? '⏹️' : isSpeaking ? '🔊' : '🎤'}
          </button>

          <div className="flex justify-center space-x-4">
            <p className="text-gray-600 flex items-center">
              {isListening ? 'কথা বলুন...' : 
               isSpeaking ? 'আমি কথা বলছি...' : 
               'মাইক্রোফোনে ক্লিক করে কথা বলুন'}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
            <button
              onClick={() => handleQuickQuestion("জ্বর হলে কি করব", 'fever')}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm transition-colors"
            >
              জ্বর সম্পর্কে
            </button>
            <button
              onClick={() => handleQuickQuestion("হাসপাতাল কোথায়", 'hospital')}
              className="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm transition-colors"
            >
              হাসপাতাল খুঁজুন
            </button>
            <button
              onClick={() => handleQuickQuestion("মন খারাপ怎么办", 'sadness')}
              className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg text-sm transition-colors"
            >
              মন খারাপ
            </button>
            <button
              onClick={() => handleQuickQuestion("ওষুধ সম্পর্কে জানতে চাই", 'medicine')}
              className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm transition-colors"
            >
              ওষুধ সম্পর্কে
            </button>
          </div>

          <button
            onClick={clearConversation}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            নতুন করে শুরু করুন
          </button>
        </div>

        {/* Elderly User Help Section */}
        <div className="mt-6 bg-linear-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-yellow-800 text-sm text-center">
            <strong>👵 বয়স্ক ব্যবহারকারীদের জন্য:</strong> আমি সব কথা বাংলায় বলব। আপনি কেবল মাইক্রোফোনে কথা বলুন, আমি শুনব এবং জবাব দেব। পড়তে না পারলেও সমস্যা নেই!
          </p>
        </div>
      </div>
    </div>
  );
}
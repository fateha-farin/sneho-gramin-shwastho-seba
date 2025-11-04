import { useState, useEffect } from 'react'

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null)
  const [moodHistory, setMoodHistory] = useState([])
  const [todayMood, setTodayMood] = useState(null)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  const moods = [
    { emoji: '😊', label: 'খুব ভালো', description: 'মন খুব হালকা ও খুশি', value: 5 },
    { emoji: '🙂', label: 'ভালো', description: 'স্বাভাবিক ভালো আছি', value: 4 },
    { emoji: '😐', label: 'মোটামুটি', description: 'ঠিক আছে, কিছু না', value: 3 },
    { emoji: '😔', label: 'খারাপ', description: 'মন খারাপ, চিন্তিত', value: 2 },
    { emoji: '😢', label: 'অনেক খারাপ', description: 'বেশি চাপ বা দুঃখ', value: 1 }
  ]

  // Load mood history from localStorage on component mount
  useEffect(() => {
    loadMoodHistory()
    checkTodayMood()
    
    // Listen for online/offline events
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleOnline = () => {
    setIsOffline(false)
    // You can add sync functionality here if you have a backend
  }

  const handleOffline = () => {
    setIsOffline(true)
  }

  const loadMoodHistory = () => {
    try {
      const saved = localStorage.getItem('sneho_mood_history')
      if (saved) {
        const history = JSON.parse(saved)
        setMoodHistory(history)
      }
    } catch (error) {
      console.error('Error loading mood history:', error)
    }
  }

  const saveMoodHistory = (history) => {
    try {
      localStorage.setItem('sneho_mood_history', JSON.stringify(history))
    } catch (error) {
      console.error('Error saving mood history:', error)
    }
  }

  const checkTodayMood = () => {
    const today = new Date().toDateString()
    const saved = localStorage.getItem('sneho_mood_history')
    if (saved) {
      const history = JSON.parse(saved)
      const todayEntry = history.find(entry => 
        new Date(entry.timestamp).toDateString() === today
      )
      if (todayEntry) {
        setTodayMood(todayEntry)
      }
    }
  }

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood)
    
    const newEntry = {
      mood: mood.label,
      emoji: mood.emoji,
      value: mood.value,
      description: mood.description,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('bn-BD'),
      time: new Date().toLocaleTimeString('bn-BD')
    }

    // Update today's mood
    setTodayMood(newEntry)

    // Update mood history
    const updatedHistory = [newEntry, ...moodHistory.filter(entry => 
      new Date(entry.timestamp).toDateString() !== new Date().toDateString()
    )].slice(0, 30) // Keep last 30 entries

    setMoodHistory(updatedHistory)
    saveMoodHistory(updatedHistory)
  }

  const clearMoodHistory = () => {
    if (window.confirm('আপনি কি নিশ্চিত যে আপনি সকল মুড হিস্টোরি ডিলিট করতে চান?')) {
      setMoodHistory([])
      setTodayMood(null)
      setSelectedMood(null)
      localStorage.removeItem('sneho_mood_history')
    }
  }

  const getMoodStats = () => {
    if (moodHistory.length === 0) return null

    const last7Days = moodHistory.slice(0, 7)
    const averageMood = last7Days.reduce((sum, entry) => sum + entry.value, 0) / last7Days.length
    const moodCounts = {}
    
    last7Days.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1
    })

    const mostFrequentMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    )

    return {
      average: averageMood.toFixed(1),
      mostFrequent: mostFrequentMood,
      totalEntries: moodHistory.length,
      streak: calculateStreak()
    }
  }

  const calculateStreak = () => {
    if (moodHistory.length === 0) return 0
    
    let streak = 0
    const sortedHistory = [...moodHistory].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    )
    
    const today = new Date()
    let currentDate = new Date(today)
    
    for (let i = 0; i < sortedHistory.length; i++) {
      const entryDate = new Date(sortedHistory[i].timestamp).toDateString()
      const checkDate = currentDate.toDateString()
      
      if (entryDate === checkDate) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }
    
    return streak
  }

  const moodStats = getMoodStats()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-yellow-200">
        {/* Offline Indicator */}
        {isOffline && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700 text-sm text-center">
              ⚡ অফলাইন মোড - আপনার ডেটা স্থানীয়ভাবে সংরক্ষিত হচ্ছে
            </p>
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-800 mb-6">আপনার মন কেমন?</h2>
        
        {/* Today's Mood Status */}
        {todayMood && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <h3 className="font-bold text-green-800 mb-2 flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              আজকের মুড
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{todayMood.emoji}</span>
                <div>
                  <p className="font-medium text-gray-800">{todayMood.mood}</p>
                  <p className="text-sm text-gray-600">{todayMood.time}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setSelectedMood(null)
                  setTodayMood(null)
                  const updatedHistory = moodHistory.filter(entry => 
                    new Date(entry.timestamp).toDateString() !== new Date().toDateString()
                  )
                  setMoodHistory(updatedHistory)
                  saveMoodHistory(updatedHistory)
                }}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                পরিবর্তন করুন
              </button>
            </div>
          </div>
        )}

        {/* Mood Selection Grid */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {moods.map((mood, index) => (
            <button
              key={index}
              onClick={() => handleMoodSelect(mood)}
              disabled={todayMood}
              className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                todayMood 
                  ? 'opacity-50 cursor-not-allowed border-gray-200'
                  : selectedMood?.label === mood.label 
                    ? 'border-yellow-400 bg-yellow-50 scale-105' 
                    : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-25'
              }`}
            >
              <span className="text-3xl mb-2">{mood.emoji}</span>
              <span className="text-sm font-medium text-gray-700">{mood.label}</span>
            </button>
          ))}
        </div>

        {selectedMood && !todayMood && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-green-800 text-center">
              <strong>{selectedMood.emoji} {selectedMood.label}:</strong> {selectedMood.description}
            </p>
            <button 
              onClick={() => setSelectedMood(null)}
              className="w-full mt-3 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-colors"
            >
              মুড সেভ করুন
            </button>
          </div>
        )}

        {/* Mood Statistics */}
        {moodStats && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h3 className="font-bold text-blue-800 mb-3 flex items-center">
              <span className="text-blue-500 mr-2">📊</span>
              আপনার মুড পরিসংখ্যান
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{moodStats.streak}</p>
                <p className="text-xs text-blue-700">লগ ইন স্ট্রীক</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{moodStats.totalEntries}</p>
                <p className="text-xs text-green-700">মোট এন্ট্রি</p>
              </div>
            </div>
          </div>
        )}

        {/* Mood History */}
        {moodHistory.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-700">সাম্প্রতিক মুড লগ</h3>
              <button 
                onClick={clearMoodHistory}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                হিস্টোরি ডিলিট করুন
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {moodHistory.slice(0, 7).map((entry, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{entry.emoji}</span>
                    <div>
                      <span className="font-medium block">{entry.mood}</span>
                      <span className="text-xs text-gray-500">{entry.date}</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{entry.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Storage Info */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-gray-600 text-sm">
            <strong>💾 ডেটা স্টোরেজ:</strong> আপনার সকল মুড ডেটা আপনার ডিভাইসে সংরক্ষিত হয়। 
            ইন্টারনেট ছাড়াই কাজ করে। সর্বোচ্চ ৩০ দিনের ডেটা সংরক্ষিত থাকে।
          </p>
        </div>
      </div>
    </div>
  )
}
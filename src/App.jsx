import { useState, useEffect } from 'react'
import SplashScreen from './components/SplashScreen'
import Login from './components/Login'
import Home from './components/Home'
import VoiceNavigator from './components/VoiceNavigator'
import HealthMap from './components/HealthMap'
import MoodTracker from './components/MoodTracker'
import AnonymousHelp from './components/AnonymousHelp'
import HealthTips from './components/HealthTips'
import MaternalChildTracker from './components/MaternalChildTracker'
import SymptomGuide from './components/SymptomGuide'
import HealthEvents from './components/HealthEvents'
import CHWDirectory from './components/CHWDirectory'
import FriendsSocial from './components/FriendsSocial'
import Footer from './components/Footer'

export default function App() {
  const [currentView, setCurrentView] = useState('home')
  const [isLoading, setIsLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [user, setUser] = useState(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [viewHistory, setViewHistory] = useState(['home'])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Check if user is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('sneho_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleLoadingComplete = () => {
    setIsLoading(false)
    setShowLogin(true)
  }

  const handleLogin = (userData) => {
    setUser(userData)
    setShowLogin(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('sneho_user')
    setUser(null)
    setShowLogin(true)
    setCurrentView('home')
    setViewHistory(['home'])
    setIsMobileMenuOpen(false)
  }

  // Enhanced navigation function with history tracking
  const navigateTo = (view) => {
    setViewHistory(prev => [...prev, view])
    setCurrentView(view)
    setIsMobileMenuOpen(false) // Close mobile menu after navigation
  }

  // Go back to previous page
  const goBack = () => {
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory]
      newHistory.pop()
      const previousView = newHistory[newHistory.length - 1]
      setCurrentView(previousView)
      setViewHistory(newHistory)
    }
  }

  // Go to home page
  const goHome = () => {
    setCurrentView('home')
    setViewHistory(['home'])
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const renderView = () => {
    switch(currentView) {
      case 'home': return <Home onNavigate={navigateTo} />
      case 'voice': return <VoiceNavigator />
      case 'map': return <HealthMap />
      case 'mood': return <MoodTracker />
      case 'help': return <AnonymousHelp />
      case 'tips': return <HealthTips />
      case 'maternal': return <MaternalChildTracker />
      case 'symptoms': return <SymptomGuide />
      case 'events': return <HealthEvents />
      case 'volunteers': return <CHWDirectory />
      case 'friends': return <FriendsSocial onNavigate={navigateTo} />
      default: return <Home onNavigate={navigateTo} />
    }
  }

  // Show Splash Screen
  if (isLoading) {
    return <SplashScreen onLoadingComplete={handleLoadingComplete} />
  }

  // Show Login Screen
  if (showLogin || !user) {
    return <Login onLogin={handleLogin} />
  }

  // Show Main App
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      
      {/* Header - Responsive Navbar */}
      <header className="bg-white shadow-sm border-b border-green-200 flex-shrink-0 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            
            {/* Left Side - Logo and Navigation */}
            <div className="flex items-center space-x-4">
              
              {/* Mobile menu button - Only show on small screens */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              >
                <span className="sr-only">মেনু খুলুন</span>
                {isMobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>

              {/* Navigation Buttons - Hidden on mobile, visible on desktop */}
              <div className="hidden lg:flex items-center space-x-3">
                {/* Back Button - Show only when not on home page */}
                {currentView !== 'home' && (
                  <button
                    onClick={goBack}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    <span>←</span>
                    <span>পিছনে</span>
                  </button>
                )}

                {/* Home Button - Always show except on home page */}
                {currentView !== 'home' && (
                  <button
                    onClick={goHome}
                    className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    <span>🏠</span>
                    <span>হোম</span>
                  </button>
                )}
              </div>

              {/* Logo and App Name */}
              <div className="flex items-center space-x-3">
                <img 
                  src="/sneho-pws-logo.png"
                  alt="Sneho Logo"
                  className="w-10 h-10 object-contain"
                />
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-green-800">স্নেহ💝</h1>
                  <p className="text-xs text-green-600">আপনার স্বাস্থ্য সঙ্গী</p>
                </div>
              </div>
            </div>

            {/* Right Side - User Profile Section */}
            <div className="flex items-center space-x-4">
              
              {/* Online Status - Hidden on very small screens */}
              <div className="hidden sm:flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600 hidden md:inline">
                  {isOnline ? 'অনলাইন' : 'অফলাইন'}
                </span>
              </div>

              {/* User Info - Responsive layout */}
              <div className="flex items-center space-x-3">
                
                {/* User details - Hidden on mobile, visible on tablet+ */}
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">ID: {user.id}</p>
                </div>

                {/* User Avatar */}
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.name.charAt(0)}
                </div>

                {/* Logout Button - Text hidden on mobile */}
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                >
                  <span>🚪</span>
                  <span className="hidden sm:inline">লগ আউট</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <div className="space-y-2">
                
                {/* Navigation Buttons for Mobile */}
                <div className="flex space-x-2">
                  {currentView !== 'home' && (
                    <button
                      onClick={goBack}
                      className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-colors text-sm"
                    >
                      <span>←</span>
                      <span>পিছনে</span>
                    </button>
                  )}
                  {currentView !== 'home' && (
                    <button
                      onClick={goHome}
                      className="flex-1 flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors text-sm"
                    >
                      <span>🏠</span>
                      <span>হোম</span>
                    </button>
                  )}
                </div>

                {/* Quick Actions for Mobile */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => navigateTo('voice')}
                    className="flex items-center justify-center space-x-2 bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    <span>🎤</span>
                    <span>ভয়েস</span>
                  </button>
                  <button
                    onClick={() => navigateTo('mood')}
                    className="flex items-center justify-center space-x-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    <span>😊</span>
                    <span>মুড</span>
                  </button>
                  <button
                    onClick={() => navigateTo('map')}
                    className="flex items-center justify-center space-x-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    <span>🗺️</span>
                    <span>ম্যাপ</span>
                  </button>
                  <button
                    onClick={() => navigateTo('help')}
                    className="flex items-center justify-center space-x-2 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    <span>🆘</span>
                    <span>সাহায্য</span>
                  </button>
                </div>

                {/* User Info for Mobile */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm text-gray-600">
                        {isOnline ? 'অনলাইন' : 'অফলাইন'}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">ID: {user.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderView()}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
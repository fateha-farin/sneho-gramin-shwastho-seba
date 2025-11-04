import { useState } from 'react';

export default function Login({ onLogin }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-defined user credentials for demo
  const demoUsers = [
    { id: 'sneho001', password: 'sneho123', name: 'আরিফ আহমেদ' },
    { id: 'sneho002', password: 'sneho123', name: 'ফাতেমা বেগম' },
    { id: 'sneho003', password: 'sneho123', name: 'রহিম উদ্দিন' },
    { id: 'admin', password: 'admin123', name: 'এডমিন' }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    setTimeout(() => {
      const user = demoUsers.find(u => u.id === userId && u.password === password);
      
      if (user) {
        // Save user info to localStorage
        localStorage.setItem('sneho_user', JSON.stringify({
          id: user.id,
          name: user.name,
          loginTime: new Date().toISOString(),
          isOnline: true
        }));
        onLogin(user);
      } else {
        setError('ভুল ইউজার আইডি বা পাসওয়ার্ড!');
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleDemoLogin = (demoId, demoPassword) => {
    setUserId(demoId);
    setPassword(demoPassword);
    
    // Auto login after setting credentials
    setTimeout(() => {
      const user = demoUsers.find(u => u.id === demoId && u.password === demoPassword);
      if (user) {
        localStorage.setItem('sneho_user', JSON.stringify({
          id: user.id,
          name: user.name,
          loginTime: new Date().toISOString(),
          isOnline: true
        }));
        onLogin(user);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-400 to-blue-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* App Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <img 
              src="/sneho-pws-logo.png" 
              alt="Sneho Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Sneho</h1>
          <p className="text-white opacity-90">আপনার ডিজিটাল স্বাস্থ্য সঙ্গী</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">লগ ইন করুন</h2>
          
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  ইউজার আইডি
                </label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="আপনার ইউজার আইডি লিখুন"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="আপনার পাসওয়ার্ড লিখুন"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>লগ ইন হচ্ছে...</span>
                </>
              ) : (
                <span>লগ ইন করুন</span>
              )}
            </button>
          </form>

          {/* Demo Login Buttons */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm text-center mb-4">ডেমো অ্যাকাউন্ট দিয়ে ট্রাই করুন:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDemoLogin('sneho001', 'sneho123')}
                className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors"
              >
                ইউজার ১
              </button>
              <button
                onClick={() => handleDemoLogin('sneho002', 'sneho123')}
                className="p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium transition-colors"
              >
                ইউজার ২
              </button>
              <button
                onClick={() => handleDemoLogin('sneho003', 'sneho123')}
                className="p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-sm font-medium transition-colors"
              >
                ইউজার ৩
              </button>
              <button
                onClick={() => handleDemoLogin('admin', 'admin123')}
                className="p-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg text-sm font-medium transition-colors"
              >
                এডমিন
              </button>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              অ্যাকাউন্ট নেই?{' '}
              <button className="text-green-600 hover:text-green-700 font-medium">
                রেজিস্ট্রেশন করুন
              </button>
            </p>
          </div>
        </div>

        {/* App Info */}
        <div className="mt-6 text-center">
          <p className="text-white text-sm opacity-80">
            ভয়েস গাইডেড সাহায্য, মুড ট্র্যাকিং এবং অফলাইন এক্সেস
          </p>
        </div>
      </div>
    </div>
  );
}
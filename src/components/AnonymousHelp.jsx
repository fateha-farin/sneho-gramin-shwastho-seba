import { useState } from 'react'

export default function AnonymousHelp() {
  const [message, setMessage] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      // Simulate sending help request
      setIsSubmitted(true)
      // In real app, this would queue for offline sync
    }
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-200 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">আপনার অনুরোধ পাঠানো হয়েছে</h2>
          <p className="text-gray-600 mb-6">
            একজন প্রশিক্ষিত স্বাস্থ্যকর্মী ৪৮ ঘন্টার মধ্যে আপনার সাথে যোগাযোগ করবেন। 
            আপনার পরিচয় গোপন রাখা হবে।
          </p>
          <button 
            onClick={() => {
              setIsSubmitted(false)
              setMessage('')
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            নতুন অনুরোধ
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">গোপন সাহায্য অনুরোধ</h2>
        <p className="text-gray-600 mb-6">
          আপনার সমস্যা লিখুন। আপনার নাম বা পরিচয় দিতে হবে না। 
          একজন প্রশিক্ষিত স্বাস্থ্যকর্মী আপনার সাথে যোগাযোগ করবেন।
        </p>

        <form onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="আপনি কি ধরনের সাহায্য চান? (উদা: মানসিক চাপ, পারিবারিক সমস্যা, স্বাস্থ্য সংক্রান্ত)"
            className="w-full h-40 p-4 border border-gray-300 rounded-xl resize-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
          />
          
          <div className="mt-6 space-y-4">
            <button
              type="submit"
              disabled={!message.trim()}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-4 rounded-xl font-bold text-lg transition-colors"
            >
              সাহায্য চান
            </button>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-yellow-800 text-sm">
                <strong>গোপনীয়তা:</strong> আপনার কোন ব্যক্তিগত তথ্য সংগ্রহ করা হয় না। 
                অনুরোধ অফলাইনেও সংরক্ষিত হবে এবং ইন্টারনেট থাকলে স্বয়ংক্রিয়ভাবে পাঠানো হবে।
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
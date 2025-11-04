import { useState } from 'react'

export default function SymptomGuide() {
  const [selectedSymptom, setSelectedSymptom] = useState(null)

  const symptoms = [
    {
      id: 'fever',
      name: 'জ্বর',
      description: '৩ দিনের বেশি জ্বর',
      advice: [
        'পর্যাপ্ত পানি ও তরল পান করুন',
        'প্যারাসিটামল নিতে পারেন',
        'যদি ৩ দিনের বেশি থাকে বা ১০৩°F এর বেশি হয়, ডাক্তার দেখান'
      ],
      emergency: 'জ্বরের সাথে ঘাড় শক্ত, তীব্র মাথাব্যথা বা খিঁচুনি হলে জরুরি বিভাগে যান'
    },
    {
      id: 'diarrhea',
      name: 'ডায়রিয়া',
      description: 'বারবার পাতলা পায়খানা',
      advice: [
        'ওআরএস খেতে থাকুন',
        'হালকা খাবার খান (ভাত, ডাল)',
        'পর্যাপ্ত বিশ্রাম নিন'
      ],
      emergency: 'রক্ত পড়লে, ৬+ বার হলে, বা দুর্বলতা দেখা দিলে হাসপাতালে যান'
    },
    {
      id: 'chest-pain',
      name: 'বুক ব্যথা',
      description: 'বুকের মাঝখানে চাপ বা ব্যথা',
      advice: [
        'তাৎক্ষণিক বিশ্রাম নিন',
        'যদি আগে থেকে হৃদরোগ থাকে, ওষুধ নিন'
      ],
      emergency: 'বুক ব্যথা, শ্বাসকষ্ট, ঘাম হলে তাৎক্ষণিক হাসপাতালে যান বা ৯৯৯ কল করুন'
    },
    {
      id: 'mental-stress',
      name: 'মানসিক চাপ',
      description: 'দুঃখ, ভয়, বা চিন্তা বেশি সময় ধরে',
      advice: [
        'কাছের কাউকে কথা বলুন',
        'হালকা ব্যায়াম করুন',
        'নিয়মিত ঘুমান'
      ],
      emergency: 'আত্মহত্যার চিন্তা আসলে তাৎক্ষণিক হেল্পলাইন ০৯৬১১৭৭৭৭৭৭ এ কল করুন'
    }
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">লক্ষণ গাইড</h2>
        <p className="text-gray-600 mb-6">
          সাধারণ লক্ষণ সম্পর্কে জানুন। এটি চিকিৎসা পরামর্শ নয় - গুরুতর হলে ডাক্তার দেখান।
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {symptoms.map((symptom) => (
            <button
              key={symptom.id}
              onClick={() => setSelectedSymptom(symptom)}
              className={`p-4 border rounded-xl text-left transition-all ${
                selectedSymptom?.id === symptom.id 
                  ? 'border-orange-400 bg-orange-50 shadow-md' 
                  : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              <h3 className="font-bold text-gray-800 mb-1">{symptom.name}</h3>
              <p className="text-sm text-gray-600">{symptom.description}</p>
            </button>
          ))}
        </div>

        {selectedSymptom && (
          <div className="border border-orange-200 rounded-xl p-5 bg-orange-50">
            <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center">
              <span className="text-orange-500 mr-2">🩺</span>
              {selectedSymptom.name}
            </h3>
            
            <div className="mb-6">
              <h4 className="font-bold text-gray-700 mb-2">কি করবেন:</h4>
              <ul className="space-y-2">
                {selectedSymptom.advice.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2 text-gray-700">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-bold text-red-700 mb-2 flex items-center">
                <span className="text-red-500 mr-2">🚨</span>
                জরুরি অবস্থা
              </h4>
              <p className="text-red-700 text-sm">{selectedSymptom.emergency}</p>
            </div>
          </div>
        )}

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-yellow-800 text-sm">
            <strong>মনে রাখুন:</strong> এটি শুধু শিক্ষামূলক তথ্য। কোন চিকিৎসা পরামর্শ নয়। 
            গুরুতর লক্ষণ দেখা দিলে নিকটস্থ হাসপাতালে যান।
          </p>
        </div>
      </div>
    </div>
  )
}
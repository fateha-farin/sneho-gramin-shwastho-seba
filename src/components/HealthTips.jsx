import { useState, useEffect } from 'react'

export default function HealthTips() {
  const [tips, setTips] = useState([])
  const [season, setSeason] = useState('')

  useEffect(() => {
    // Determine current season based on month
    const month = new Date().getMonth()
    let currentSeason = ''
    let seasonName = ''
    
    if (month >= 5 && month <= 8) {
      currentSeason = 'monsoon'
      seasonName = 'বর্ষা'
    } else if (month >= 11 || month <= 1) {
      currentSeason = 'winter' 
      seasonName = 'শীত'
    } else {
      currentSeason = 'summer'
      seasonName = 'গ্রীষ্ম'
    }
    
    setSeason(seasonName)
    loadSeasonalTips(currentSeason)
  }, [])

  const loadSeasonalTips = (season) => {
    const seasonalTips = {
      monsoon: [
        {
          title: 'ডেঙ্গু প্রতিরোধ',
          tips: [
            'মশারি ব্যবহার করুন',
            'বাড়ির চারপাশে পানি জমতে দেবেন না',
            'ফুল হাতা জামা পরুন'
          ]
        },
        {
          title: 'পানিবাহিত রোগ',
          tips: [
            'পানি ফুটিয়ে পান করুন',
            'বাইরের খোলা খাবার এড়িয়ে চলুন',
            'হাত ভালোভাবে ধুয়ে নিন'
          ]
        }
      ],
      winter: [
        {
          title: 'সর্দি-কাশি প্রতিরোধ',
          tips: [
            'গরম কাপড় পরুন',
            'গরম পানি ও স্যুপ পান করুন',
            'শিশুদের গরম কাপড়ে মুড়ে দিন'
          ]
        },
        {
          title: 'ত্বকের যত্ন',
          tips: [
            'নিয়মিত ময়েশ্চারাইজার ব্যবহার করুন',
            'গরম পানি দিয়ে গোসল করবেন না',
            'পর্যাপ্ত পানি পান করুন'
          ]
        }
      ],
      summer: [
        {
          title: 'হিট স্ট্রোক প্রতিরোধ',
          tips: [
            'প্রচুর পানি ও তরল পান করুন',
            'সূর্যের তাপ এড়িয়ে চলুন',
            'হালকা রঙের সুতি কাপড় পরুন'
          ]
        },
        {
          title: 'ডায়রিয়া প্রতিরোধ',
          tips: [
            'বাড়িতে ORS তৈরি করে রাখুন',
            'বাইরের কাটা ফল এড়িয়ে চলুন',
            'খাবার গরম অবস্থায় খান'
          ]
        }
      ]
    }
    setTips(seasonalTips[season] || [])
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">মৌসুমি স্বাস্থ্য টিপস</h2>
        <div className="flex items-center space-x-2 mb-6">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            {season} মৌসুম
          </span>
          <span className="text-gray-500 text-sm">• আজকের তারিখ: {new Date().toLocaleDateString('bn-BD')}</span>
        </div>
        
        <div className="space-y-4">
          {tips.map((category, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
              <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center">
                <span className="text-blue-500 mr-2">💡</span>
                {category.title}
              </h3>
              <ul className="space-y-2">
                {category.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="flex items-start space-x-2 text-gray-700">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-yellow-800 text-sm">
            <strong>দ্রুত সাহায্য:</strong> জরুরি স্বাস্থ্য সমস্যায় নিকটস্থ স্বাস্থ্যকেন্দ্রে যান বা ৯৯৯ এ কল করুন।
          </p>
        </div>
      </div>
    </div>
  )
}
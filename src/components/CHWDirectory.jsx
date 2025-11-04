import { useState } from 'react'

export default function CHWDirectory() {
  const [selectedSkill, setSelectedSkill] = useState('all')

  const healthWorkers = [
    {
      id: 1,
      name: 'আয়েশা বেগম',
      village: 'চর কলাপাড়া',
      union: 'চর কলাপাড়া',
      skills: ['মানসিক স্বাস্থ্য', 'প্রসূতি যত্ন', 'প্রাথমিক চিকিৎসা'],
      contact: '০১৮১২-৯৮৭৬৫৪',
      trainedBy: 'ব্র্যাক',
      availability: 'সকাল ৯টা - বিকেল ৪টা',
      experience: '৩ বছর'
    },
    {
      id: 2,
      name: 'রহিম উদ্দিন',
      village: 'নয়াপাড়া',
      union: 'চরফ্যাশন',
      skills: ['প্রাথমিক চিকিৎসা', 'টীকাকরণ', 'স্বাস্থ্য শিক্ষা'],
      contact: '০১৭৩৪-১২৩৪৫৬',
      trainedBy: 'স্বাস্থ্য বিভাগ',
      availability: 'সকাল ১০টা - সন্ধ্যা ৬টা',
      experience: '৫ বছর'
    },
    {
      id: 3,
      name: 'ফাতেমা খাতুন',
      village: 'পুরান বাজার',
      union: 'চরফ্যাশন',
      skills: ['মানসিক স্বাস্থ্য', 'নারীর স্বাস্থ্য', 'পুষ্টি'],
      contact: '০১৯৫৬-৭৮৯০১২',
      trainedBy: 'আশা',
      availability: 'বিকেল ৩টা - রাত ৮টা',
      experience: '২ বছর'
    }
  ]

  const skills = ['all', 'মানসিক স্বাস্থ্য', 'প্রসূতি যত্ন', 'প্রাথমিক চিকিৎসা', 'টীকাকরণ', 'নারীর স্বাস্থ্য']

  const filteredWorkers = selectedSkill === 'all' 
    ? healthWorkers 
    : healthWorkers.filter(worker => worker.skills.includes(selectedSkill))

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-teal-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">স্বাস্থ্যকর্মী ডিরেক্টরি</h2>
        <p className="text-gray-600 mb-6">
          আপনার এলাকার প্রশিক্ষিত কমিউনিটি স্বাস্থ্যকর্মী
        </p>

        {/* Skill Filter */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium">দক্ষতা দিয়ে খুঁজুন:</label>
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <button
                key={skill}
                onClick={() => setSelectedSkill(skill)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedSkill === skill
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {skill === 'all' ? 'সব' : skill}
              </button>
            ))}
          </div>
        </div>

        {/* Workers List */}
        <div className="space-y-4">
          {filteredWorkers.map(worker => (
            <div key={worker.id} className="border border-gray-200 rounded-xl p-5 hover:border-teal-300 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{worker.name}</h3>
                  <p className="text-gray-600 text-sm">
                    📍 {worker.village}, {worker.union}
                  </p>
                </div>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                  {worker.experience} অভিজ্ঞতা
                </span>
              </div>

              <div className="mb-3">
                <div className="flex flex-wrap gap-2 mb-2">
                  {worker.skills.map(skill => (
                    <span 
                      key={skill}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <strong>প্রশিক্ষণ:</strong> {worker.trainedBy}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>সহজলভ্য:</strong> {worker.availability}
                </p>
              </div>

              <div className="flex space-x-3">
                <a 
                  href={`tel:${worker.contact}`}
                  className="flex-1 bg-teal-500 hover:bg-teal-600 text-white text-center py-2 rounded-lg font-medium transition-colors"
                >
                  📞 কল করুন
                </a>
                <button className="flex-1 border border-teal-500 text-teal-500 hover:bg-teal-50 py-2 rounded-lg font-medium transition-colors">
                  💬 বার্তা
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-yellow-800 text-sm">
            <strong>মনে রাখুন:</strong> কমিউনিটি স্বাস্থ্যকর্মীরা প্রশিক্ষিত স্বেচ্ছাসেবক। 
            তারা প্রাথমিক সাহায্য দিতে পারেন, কিন্তু জটিল সমস্যায় ডাক্তার দেখান।
          </p>
        </div>
      </div>
    </div>
  )
}
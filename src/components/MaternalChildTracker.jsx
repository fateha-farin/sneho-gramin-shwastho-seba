import { useState, useEffect } from 'react'

export default function MaternalChildTracker() {
  const [trackerType, setTrackerType] = useState('') // 'maternal' or 'child'
  const [dueDate, setDueDate] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [birthCertificate, setBirthCertificate] = useState('')
  const [notifications, setNotifications] = useState([])
  const [childInfo, setChildInfo] = useState(null)

  // Load saved data from localStorage
  useEffect(() => {
    loadSavedData()
    checkUpcomingNotifications()
  }, [])

  const loadSavedData = () => {
    try {
      const savedDueDate = localStorage.getItem('sneho_maternal_due_date')
      const savedBirthDate = localStorage.getItem('sneho_child_birth_date')
      const savedCertificate = localStorage.getItem('sneho_birth_certificate')
      
      if (savedDueDate) setDueDate(savedDueDate)
      if (savedBirthDate) setBirthDate(savedBirthDate)
      if (savedCertificate) setBirthCertificate(savedCertificate)
    } catch (error) {
      console.error('Error loading saved data:', error)
    }
  }

  const checkUpcomingNotifications = () => {
    const today = new Date()
    const upcoming = []

    // Check maternal notifications
    if (dueDate) {
      const maternalSchedule = getMaternalSchedule(dueDate)
      maternalSchedule.forEach(item => {
        const visitDate = new Date(item.date)
        const daysUntil = Math.ceil((visitDate - today) / (1000 * 60 * 60 * 24))
        
        if (daysUntil >= 0 && daysUntil <= 3) {
          upcoming.push({
            type: 'maternal',
            message: `এএনসি ভিজিট: ${item.visit} (${daysUntil === 0 ? 'আজ' : `${daysUntil} দিন বাকি`})`,
            date: item.date
          })
        }
      })
    }

    // Check child vaccination notifications
    if (birthDate) {
      const vaxSchedule = getVaccinationSchedule(birthDate)
      vaxSchedule.forEach(item => {
        const vaxDate = new Date(item.dueDate)
        const daysUntil = Math.ceil((vaxDate - today) / (1000 * 60 * 60 * 24))
        
        if (daysUntil >= 0 && daysUntil <= 3) {
          upcoming.push({
            type: 'vaccination',
            message: `টিকা: ${item.vaccine} (${daysUntil === 0 ? 'আজ' : `${daysUntil} দিন বাকি`})`,
            date: item.dueDate
          })
        }
      })
    }

    setNotifications(upcoming)
  }

  const maternalSchedule = [
    { week: 8, visit: 'প্রথম এএনসি ভিজিট - প্রাথমিক পরীক্ষা', completed: false },
    { week: 20, visit: 'দ্বিতীয় এএনসি ভিজিট - আল্ট্রাসাউন্ড', completed: false },
    { week: 28, visit: 'তৃতীয় এএনসি ভিজিট - রক্ত পরীক্ষা', completed: false },
    { week: 36, visit: 'চতুর্থ এএনসি ভিজিট - চূড়ান্ত প্রস্তুতি', completed: false }
  ]

  const vaccinationSchedule = [
    { age: 'জন্ম', vaccine: 'বিসিজি, ওপিভি-০, হেপাটাইটিস বি-১', completed: false },
    { age: '৬ সপ্তাহ', vaccine: 'পেন্টাভ্যালেন্ট-১, ওপিভি-১, পিসিভি-১', completed: false },
    { age: '১০ সপ্তাহ', vaccine: 'পেন্টাভ্যালেন্ট-২, ওপিভি-২', completed: false },
    { age: '১৪ সপ্তাহ', vaccine: 'পেন্টাভ্যালেন্ট-৩, ওপিভি-৩, পিসিভি-২', completed: false },
    { age: '৯ মাস', vaccine: 'এমআর-১', completed: false },
    { age: '১৫ মাস', vaccine: 'এমআর-২', completed: false }
  ]

  const calculateWeeks = (date) => {
    const today = new Date()
    const targetDate = new Date(date)
    const diffTime = targetDate - today
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))
    return Math.max(0, 40 - diffWeeks)
  }

  const getMaternalSchedule = (dueDate) => {
    const due = new Date(dueDate)
    return maternalSchedule.map(item => {
      const visitDate = new Date(due)
      visitDate.setDate(visitDate.getDate() - (40 - item.week) * 7)
      return {
        ...item,
        date: visitDate.toISOString().split('T')[0],
        displayDate: visitDate.toLocaleDateString('bn-BD')
      }
    })
  }

  const getVaccinationSchedule = (birthDate) => {
    const birth = new Date(birthDate)
    return vaccinationSchedule.map(item => {
      let dueDate = new Date(birth)
      
      if (item.age === 'জন্ম') {
        dueDate = new Date(birth)
      } else if (item.age.includes('সপ্তাহ')) {
        const weeks = parseInt(item.age)
        dueDate.setDate(dueDate.getDate() + weeks * 7)
      } else if (item.age.includes('মাস')) {
        const months = parseInt(item.age)
        dueDate.setMonth(dueDate.getMonth() + months)
      }
      
      return {
        ...item,
        dueDate: dueDate.toISOString().split('T')[0],
        displayDate: dueDate.toLocaleDateString('bn-BD'),
        status: new Date() >= dueDate ? 'due' : 'upcoming'
      }
    })
  }

  const handleDueDateSave = () => {
    if (dueDate) {
      localStorage.setItem('sneho_maternal_due_date', dueDate)
      alert('প্রসবের তারিখ সফলভাবে সেভ হয়েছে! রিমাইন্ডার সেট করা হয়েছে।')
      checkUpcomingNotifications()
    }
  }

  const handleChildInfoSave = () => {
    if (birthDate && birthCertificate) {
      localStorage.setItem('sneho_child_birth_date', birthDate)
      localStorage.setItem('sneho_birth_certificate', birthCertificate)
      
      setChildInfo({
        birthDate,
        birthCertificate,
        tikaCard: generateTikaCard(birthCertificate, birthDate)
      })
      
      alert('শিশুর তথ্য সফলভাবে সেভ হয়েছে! টিকা কার্ড তৈরি করা হয়েছে।')
      checkUpcomingNotifications()
    } else {
      alert('দয়া করে জন্ম তারিখ এবং জন্ম নিবন্ধন নম্বর দিন।')
    }
  }

  const generateTikaCard = (certificateNo, birthDate) => {
    return {
      certificateNo,
      birthDate,
      issuedDate: new Date().toLocaleDateString('bn-BD'),
      vaccinations: getVaccinationSchedule(birthDate),
      qrCode: `TIKA-${certificateNo}-${birthDate.replace(/-/g, '')}`
    }
  }

  const simulateNotification = () => {
    if (notifications.length > 0) {
      const notification = notifications[0]
      alert(`🔔 রিমাইন্ডার: ${notification.message}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-pink-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">মা ও শিশু স্বাস্থ্য ট্র্যাকার</h2>
        
        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-yellow-800 mb-2 flex items-center">
                  <span className="text-yellow-500 mr-2">🔔</span>
                  আসন্ন রিমাইন্ডার
                </h3>
                {notifications.map((notif, index) => (
                  <p key={index} className="text-yellow-700 text-sm">
                    • {notif.message}
                  </p>
                ))}
              </div>
              <button 
                onClick={simulateNotification}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                নোটিফিকেশন টেস্ট
              </button>
            </div>
          </div>
        )}

        {!trackerType ? (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button 
              onClick={() => setTrackerType('maternal')}
              className="p-6 border-2 border-pink-200 rounded-xl hover:border-pink-400 hover:bg-pink-50 transition-colors text-center"
            >
              <div className="text-4xl mb-2">🤰</div>
              <h3 className="font-bold text-gray-800">গর্ভাবস্থা ট্র্যাকার</h3>
              <p className="text-sm text-gray-600 mt-1">এএনসি ভিজিট রিমাইন্ডার</p>
            </button>
            <button 
              onClick={() => setTrackerType('child')}
              className="p-6 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors text-center"
            >
              <div className="text-4xl mb-2">👶</div>
              <h3 className="font-bold text-gray-800">শিশু টীকাকরণ</h3>
              <p className="text-sm text-gray-600 mt-1">ডিজিটাল টিকা কার্ড</p>
            </button>
          </div>
        ) : (
          <div>
            <button 
              onClick={() => setTrackerType('')}
              className="mb-4 text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>←</span>
              <span>পিছনে যান</span>
            </button>

            {trackerType === 'maternal' && (
              <div className="maternal-tracker">
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2 font-medium">প্রসবের সম্ভাব্য তারিখ:</label>
                  <div className="flex space-x-2">
                    <input 
                      type="date" 
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                    />
                    <button 
                      onClick={handleDueDateSave}
                      className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      সেভ করুন
                    </button>
                  </div>
                </div>
                
                {dueDate && (
                  <div className="schedule">
                    <h3 className="font-bold text-gray-800 mb-4 text-lg">
                      বর্তমান সপ্তাহ: {calculateWeeks(dueDate)} সপ্তাহ
                    </h3>
                    <div className="space-y-3">
                      {getMaternalSchedule(dueDate).map((item, index) => (
                        <div key={index} className={`p-4 border rounded-xl ${
                          new Date() >= new Date(item.date) 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex justify-between items-center">
                            <div>
                              <strong className="text-gray-800">{item.week} সপ্তাহ:</strong>
                              <p className="text-gray-600">{item.visit}</p>
                              <p className="text-sm text-gray-500">তারিখ: {item.displayDate}</p>
                            </div>
                            {new Date() >= new Date(item.date) ? (
                              <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">সম্পন্ন</span>
                            ) : (
                              <span className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">আসন্ন</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {trackerType === 'child' && (
              <div className="child-tracker">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">শিশুর জন্ম তারিখ:</label>
                    <input 
                      type="date" 
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">জন্ম নিবন্ধন নম্বর:</label>
                    <input 
                      type="text" 
                      value={birthCertificate}
                      onChange={(e) => setBirthCertificate(e.target.value)}
                      placeholder="জন্ম নিবন্ধন নম্বর লিখুন"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>
                
                <button 
                  onClick={handleChildInfoSave}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors mb-6"
                >
                  তথ্য সেভ করুন ও টিকা কার্ড দেখুন
                </button>
                
                {childInfo && (
                  <div className="space-y-6">
                    {/* Digital Tika Card */}
                    <div className="border-2 border-blue-300 rounded-xl p-6 bg-blue-50">
                      <h3 className="font-bold text-blue-800 text-xl mb-4 text-center">ডিজিটাল টিকা কার্ড</h3>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">নিবন্ধন নম্বর</p>
                          <p className="font-bold">{childInfo.birthCertificate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">জন্ম তারিখ</p>
                          <p className="font-bold">{new Date(childInfo.birthDate).toLocaleDateString('bn-BD')}</p>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 mb-4">
                        <h4 className="font-bold text-gray-800 mb-3">টিকা সিডিউল</h4>
                        <div className="space-y-2">
                          {childInfo.tikaCard.vaccinations.map((vax, index) => (
                            <div key={index} className="flex justify-between items-center p-2 border-b">
                              <div>
                                <p className="font-medium">{vax.vaccine}</p>
                                <p className="text-sm text-gray-600">{vax.age} - {vax.displayDate}</p>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs ${
                                vax.status === 'due' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                              }`}>
                                {vax.status === 'due' ? 'টিকা দিন' : 'আসন্ন'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-600">QR Code: {childInfo.tikaCard.qrCode}</p>
                        <button className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                          📱 কার্ড ডাউনলোড করুন
                        </button>
                      </div>
                    </div>

                    {/* Vaccination Schedule */}
                    <div className="schedule">
                      <h3 className="font-bold text-gray-800 mb-4 text-lg">টীকাকরণ সিডিউল</h3>
                      <div className="space-y-3">
                        {getVaccinationSchedule(childInfo.birthDate).map((item, index) => (
                          <div key={index} className={`p-4 border rounded-xl ${
                            item.status === 'due' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
                          }`}>
                            <div className="flex justify-between items-center">
                              <div>
                                <strong className="text-gray-800">{item.age}:</strong>
                                <p className="text-gray-600">{item.vaccine}</p>
                                <p className="text-sm text-gray-500">তারিখ: {item.displayDate}</p>
                              </div>
                              <span className={`px-2 py-1 rounded text-sm ${
                                item.status === 'due' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                              }`}>
                                {item.status === 'due' ? 'টিকা দিন' : 'আসন্ন'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 bg-purple-50 border border-purple-200 rounded-xl p-4">
          <p className="text-purple-800 text-sm">
            <strong>📅 রিমাইন্ডার:</strong> আসন্ন এএনসি ভিজিট এবং টিকার জন্য স্বয়ংক্রিয় নোটিফিকেশন পাবেন। 
            <strong> 🔔 গোপনীয়তা:</strong> আপনার সকল তথ্য শুধু আপনার ডিভাইসে সংরক্ষিত হয়।
          </p>
        </div>
      </div>
    </div>
  )
}
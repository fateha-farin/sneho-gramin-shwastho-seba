import { useState } from "react";

export default function HealthEvents() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "বিনামূল্যে ডায়াবেটিস স্ক্রিনিং",
      date: "২০২৪-১২-১৫",
      time: "সকাল ৯টা - দুপুর ১টা",
      location: "কমিউনিটি ক্লিনিক, চর কলাপাড়া",
      organizer: "স্বাস্থ্য বিভাগ",
      type: "স্ক্রিনিং",
      participants: 24,
      maxParticipants: 50,
      isRegistered: false,
    },
    {
      id: 2,
      title: "রক্তদান শিবির",
      date: "২০২৪-১২-২০",
      time: "সকাল ১০টা - বিকেল ৪টা",
      location: "উপজেলা স্বাস্থ্য কমপ্লেক্স",
      organizer: "সন্ধানী",
      type: "রক্তদান",
      participants: 15,
      maxParticipants: 30,
      isRegistered: false,
    },
    {
      id: 3,
      title: "মানসিক স্বাস্থ্য সচেতনতা কর্মশালা",
      date: "২০২৪-১২-২৫",
      time: "বিকেল ৩টা - ৫টা",
      location: "স্থানীয় উচ্চ বিদ্যালয়",
      organizer: "ব্র্যাক",
      type: "কর্মশালা",
      participants: 42,
      maxParticipants: 60,
      isRegistered: true,
    },
  ]);

  const [showConfirmation, setShowConfirmation] = useState(null);
  const [showDetails, setShowDetails] = useState(null);

  const handleRegister = (eventId) => {
    setEvents(
      events.map((event) =>
        event.id === eventId
          ? {
              ...event,
              isRegistered: true,
              participants: event.participants + 1,
            }
          : event
      )
    );
    setShowConfirmation(eventId);

    // Hide confirmation after 3 seconds
    setTimeout(() => {
      setShowConfirmation(null);
    }, 3000);
  };

  const handleCancelRegistration = (eventId) => {
    setEvents(
      events.map((event) =>
        event.id === eventId
          ? {
              ...event,
              isRegistered: false,
              participants: event.participants - 1,
            }
          : event
      )
    );
  };

  const toggleDetails = (eventId) => {
    setShowDetails(showDetails === eventId ? null : eventId);
  };

  const getEventStatus = (event) => {
    if (event.participants >= event.maxParticipants) {
      return { text: "সম্পূর্ণ", color: "bg-red-100 text-red-700" };
    }
    if (event.isRegistered) {
      return { text: "নিবন্ধিত", color: "bg-green-100 text-green-700" };
    }
    return { text: "উপলব্ধ", color: "bg-blue-100 text-blue-700" };
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          স্বাস্থ্য ইভেন্ট
        </h2>
        <p className="text-gray-600 mb-6">
          আসন্ন কমিউনিটি স্বাস্থ্য ইভেন্ট ও ক্যাম্প
        </p>

        <div className="space-y-4">
          {events.map((event) => {
            const status = getEventStatus(event);

            return (
              <div
                key={event.id}
                className="border border-gray-200 rounded-xl p-5 hover:border-purple-300 hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3
                    className="font-bold text-lg text-gray-800 cursor-pointer hover:text-purple-600 transition-colors"
                    onClick={() => toggleDetails(event.id)}
                  >
                    {event.title}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${status.color}`}
                  >
                    {status.text}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-500">📅</span>
                    <span>
                      {event.date} • {event.time}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-500">📍</span>
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-500">🏢</span>
                    <span>আয়োজক: {event.organizer}</span>
                  </div>

                  {/* Participants Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>
                        অংশগ্রহণকারী: {event.participants}/
                        {event.maxParticipants}
                      </span>
                      <span>
                        {Math.round(
                          (event.participants / event.maxParticipants) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            (event.participants / event.maxParticipants) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Event Details - Expandable */}
                {showDetails === event.id && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-bold text-purple-800 mb-2">
                      ইভেন্ট বিস্তারিত:
                    </h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• বিনামূল্যে স্বাস্থ্য পরীক্ষা</li>
                      <li>• অভিজ্ঞ ডাক্তার উপস্থিত</li>
                      <li>• প্রাথমিক স্বাস্থ্য পরামর্শ</li>
                      <li>• প্রয়োজনীয় ওষুধ বিতরণ</li>
                    </ul>
                  </div>
                )}

                {/* Interactive Buttons */}
                <div className="mt-4 space-y-2">
                  {event.isRegistered ? (
                    <div className="space-y-2">
                      <button
                        className="w-full bg-green-500 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
                        disabled
                      >
                        <span>✅</span>
                        <span>আপনি নিবন্ধিত হয়েছেন</span>
                      </button>
                      <button
                        onClick={() => handleCancelRegistration(event.id)}
                        className="w-full border border-red-500 text-red-500 hover:bg-red-50 py-2 rounded-lg font-medium transition-colors"
                      >
                        নিবন্ধন বাতিল করুন
                      </button>
                    </div>
                  ) : event.participants >= event.maxParticipants ? (
                    <button
                      className="w-full bg-gray-400 text-white py-3 rounded-lg font-medium cursor-not-allowed"
                      disabled
                    >
                      ⏳ ইভেন্ট পূর্ণ
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRegister(event.id)}
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>📝</span>
                      <span>ইভেন্টে নিবন্ধন করুন</span>
                    </button>
                  )}

                  {/* View Details Toggle */}
                  <button
                    onClick={() => toggleDetails(event.id)}
                    className="w-full text-purple-600 hover:text-purple-800 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1"
                  >
                    <span>{showDetails === event.id ? "▲" : "▼"}</span>
                    <span>
                      {showDetails === event.id
                        ? "বিস্তারিত লুকান"
                        : "বিস্তারিত দেখুন"}
                    </span>
                  </button>
                </div>

                {/* Registration Confirmation */}
                {showConfirmation === event.id && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg animate-pulse">
                    <p className="text-green-700 text-sm text-center">
                      ✅ সফলভাবে নিবন্ধন completed! ইভেন্টের দিন উপস্থিত থাকুন।
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Friend Participation Section */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h4 className="font-bold text-blue-800 mb-3 flex items-center">
            <span className="text-blue-500 mr-2">👥</span>
            বন্ধুদের আমন্ত্রণ
          </h4>
          <p className="text-blue-700 text-sm mb-3">
            এই ইভেন্টে বন্ধুদের আমন্ত্রণ জানান এবং একসাথে অংশগ্রহণ করুন
          </p>
          <button
            onClick={() => onNavigate("friends")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            বন্ধুদের ডাকুন
          </button>
        </div>

        {/* Statistics */}
        <div className="mt-6 bg-linear-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
          <h4 className="font-bold text-purple-800 mb-2">ইভেন্ট পরিসংখ্যান:</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {events.length}
              </p>
              <p className="text-xs text-purple-700">মোট ইভেন্ট</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {events.filter((e) => e.isRegistered).length}
              </p>
              <p className="text-xs text-green-700">আপনার নিবন্ধন</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {events.reduce((sum, event) => sum + event.participants, 0)}
              </p>
              <p className="text-xs text-blue-700">মোট অংশগ্রহণ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

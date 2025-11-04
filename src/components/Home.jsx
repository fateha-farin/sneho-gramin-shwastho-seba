export default function Home({ onNavigate }) {
  const features = [
    {
      id: "voice",
      title: "ভয়েস সহায়িকা",
      description: "কথা বলুন, সাহায্য নিন",
      icon: "🎤",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "mood",
      title: "মুড ট্র্যাকার",
      description: "আপনার মনের অবস্থা জানুন",
      icon: "😊",
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: "map",
      title: "স্বাস্থ্য ম্যাপ",
      description: "কাছের স্বাস্থ্যকেন্দ্র খুঁজুন",
      icon: "🗺️",
      color: "from-green-500 to-blue-500",
    },
    {
      id: "help",
      title: "গোপন সাহায্য",
      description: "বেনামে সাহায্য চান",
      icon: "🆘",
      color: "from-red-500 to-orange-500",
    },
    {
      id: "tips",
      title: "স্বাস্থ্য টিপস",
      description: "মৌসুমি স্বাস্থ্য পরামর্শ",
      icon: "💡",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "maternal",
      title: "মা ও শিশু",
      description: "গর্ভাবস্থা ও টীকাকরণ",
      icon: "👶",
      color: "from-pink-500 to-purple-500",
    },
    {
      id: "symptoms",
      title: "লক্ষণ গাইড",
      description: "লক্ষণ দেখে পরামর্শ নিন",
      icon: "🩺",
      color: "from-indigo-500 to-purple-500",
    },
    {
      id: "events",
      title: "স্বাস্থ্য ইভেন্ট",
      description: "কমিউনিটি ইভেন্ট দেখুন",
      icon: "📅",
      color: "from-teal-500 to-green-500",
    },
    {
      id: "volunteers",
      title: "স্বাস্থ্যকর্মী",
      description: "স্থানীয় স্বাস্থ্যকর্মী খুঁজুন",
      icon: "👥",
      color: "from-orange-500 to-red-500",
    },
    
    {
      id: "friends",
      title: "বন্ধু ও সামাজিক",
      description: "বন্ধুদের সাথে যুক্ত হোন এবং ইভেন্টে আমন্ত্রণ দিন",
      icon: "👥",
      color: "from-indigo-500 to-purple-500",
    }
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {" "}
      {/* Added padding for bottom nav */}
      <section className="text-center mb-12 py-8">
        <h1 className="text-5xl font-bold text-green-800 mb-4">স্নেহ💝</h1>
        <p className="text-xl text-green-600 mb-6">
          আপনার ডিজিটাল স্বাস্থ্য সঙ্গী
        </p>
        <p className="text-gray-600 max-w-2xl mx-auto">
          ভয়েস গাইডেড সাহায্য, মুড ট্র্যাকিং এবং অফলাইন এক্সেস সহ সম্পূর্ণ
          বিনামূল্যের প্ল্যাটফর্ম
        </p>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div
            key={feature.id}
            onClick={() => onNavigate(feature.id)}
            className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-green-300"
          >
            <div
              className={`w-14 h-14 rounded-2xl bg-linear-to-r ${feature.color} flex items-center justify-center text-2xl text-white mb-4`}
            >
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-6 border-t border-gray-700">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          
          {/* Company Info */}
          <div className="space-y-2">
            <h3 className="font-bold text-green-400 text-lg">ShasthoTech Bangladesh Limited</h3>
            <p className="text-gray-300 text-sm">
              Leveraging disruptive innovations to synergize community-driven health equity
            </p>
            <p className="text-gray-400 text-xs mt-2">
              © {currentYear} ShasthoTech Bangladesh Ltd. All rights reserved.
            </p>
          </div>

          {/* Support & Partnerships */}
          <div className="space-y-2">
            <h4 className="font-semibold text-green-400">Supportive Organizations</h4>
            <div className="text-gray-300 text-sm space-y-1">
              <p>• Community Health Partners</p>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="space-y-2">
            <h4 className="font-semibold text-green-400">জরুরি হেল্পলাইন</h4>
            <div className="text-gray-300 text-sm space-y-1">
              <p className="flex items-center justify-center md:justify-start space-x-2">
                <span>📞</span>
                <span>জাতীয় হেল্পলাইন: <strong className="text-green-300">৩৩৩</strong></span>
              </p>
              <p className="flex items-center justify-center md:justify-start space-x-2">
                <span>🆘</span>
                <span>জরুরি: <strong className="text-red-300">৯৯৯</strong></span>
              </p>
              <p className="flex items-center justify-center md:justify-start space-x-2">
                <span>💙</span>
                <span>মানসিক স্বাস্থ্য: <strong className="text-blue-300">০৯৬১১৭৭৭৭৭৭</strong></span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Border */}
        <div className="border-t border-gray-700 mt-4 pt-4 text-center">
          <p className="text-gray-400 text-xs">
            Built with ❤️ for better community health in Bangladesh | SDG 3: Good Health & Well-being
          </p>
        </div>

      </div>
    </footer>
  );
}
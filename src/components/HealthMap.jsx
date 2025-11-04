// HealthMap.jsx
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { bangladeshData } from '../lib/bangladeshData';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const hospitalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const clinicIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const pharmacyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map view changes
function MapViewUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);
  return null;
}

export default function HealthMap({ userLocation }) {
  const [selectedDivision, setSelectedDivision] = useState('ঢাকা');
  const [selectedDistrict, setSelectedDistrict] = useState('ঢাকা');
  const [selectedUpazilla, setSelectedUpazilla] = useState('');
  const [mapCenter, setMapCenter] = useState([23.8103, 90.4125]); // Dhaka coordinates
  const [showMap, setShowMap] = useState(true);

  // Coordinates for different divisions (approximate)
  const divisionCoordinates = {
    'ঢাকা': [23.8103, 90.4125],
    'চট্টগ্রাম': [22.3569, 91.7832],
    'রাজশাহী': [24.3745, 88.6042],
    'খুলনা': [22.8456, 89.5403],
    'সিলেট': [24.8910, 91.8710],
    'বরিশাল': [22.7010, 90.3535],
    'রংপুর': [25.7439, 89.2752],
    'ময়মনসিংহ': [24.7471, 90.4203]
  };

  // Enhanced health facilities with coordinates and landmarks
  const healthFacilities = [
    {
      id: 1,
      name: "ঢাকা মেডিকেল কলেজ হাসপাতাল",
      type: "হাসপাতাল",
      division: "ঢাকা",
      district: "ঢাকা", 
      upazilla: "ঢাকা সদর",
      services: ["জরুরী", "অপারেশন", "এমবিবিএস ডাক্তার"],
      phone: "02-9661061",
      beds: 500,
      coordinates: [23.7167, 90.3967],
      landmark: "বাংলাদেশ ব্যাংকের পাশে, পুরান ঢাকা",
      transport: "বাস স্টপ: মেডিকেল কলেজ গেট, রিকশা/অটো পাওয়া যায়",
      nearest: "নিকটস্থ কমিউনিটি ক্লিনিক: ১.৫ কিমি"
    },
    {
      id: 2,
      name: "বঙ্গবন্ধু শেখ মুজিব মেডিকেল বিশ্ববিদ্যালয়",
      type: "বিশেষায়িত হাসপাতাল",
      division: "ঢাকা",
      district: "ঢাকা",
      upazilla: "শাহবাগ", 
      services: ["ক্যান্সার", "হৃদরোগ", "নিউরোলজি"],
      phone: "02-55165000",
      beds: 800,
      coordinates: [23.7333, 90.3986],
      landmark: "শাহবাগ মোড়, বাংলাদেশ জাতীয় জাদুঘরের কাছে",
      transport: "মেট্রো রেল: শাহবাগ স্টেশন, বাস স্টপ: শাহবাগ",
      nearest: "নিকটস্থ ফার্মেসি: ২০০ মিটার"
    },
    {
      id: 3,
      name: "চট্টগ্রাম মেডিকেল কলেজ হাসপাতাল",
      type: "হাসপাতাল",
      division: "চট্টগ্রাম", 
      district: "চট্টগ্রাম",
      upazilla: "চট্টগ্রাম সদর",
      services: ["জরুরী", "প্রসূতি", "শিশু"],
      phone: "031-632104",
      beds: 300,
      coordinates: [22.3667, 91.8000],
      landmark: "আগরতলা রোড, পাহাড়তলী এলাকায়",
      transport: "সিটি বাস রুট, সিএনজি/অটো সহজলভ্য",
      nearest: "নিকটস্থ ডায়াগনস্টিক সেন্টার: ৫০০ মিটার"
    },
    {
      id: 4,
      name: "স্যার সলিমুল্লাহ মেডিকেল কলেজ হাসপাতাল",
      type: "হাসপাতাল",
      division: "ঢাকা",
      district: "ঢাকা",
      upazilla: "মিটফোর্ড",
      services: ["জরুরী", "মেডিসিন", "সার্জারি"],
      phone: "02-7318611", 
      beds: 400,
      coordinates: [23.7083, 90.4075],
      landmark: "মিটফোর্ড রোড, বুড়িগঙ্গা নদীর পাশে",
      transport: "লঞ্চ ঘাট থেকে ২ কিমি, রিকশা পাওয়া যায়",
      nearest: "স্কুলের পাশে, ইংরেজি মাধ্যম স্কুলের সামনে"
    },
    {
      id: 5,
      name: "কুমুদিনী উইমেন্স মেডিকেল কলেজ",
      type: "বিশেষায়িত হাসপাতাল", 
      division: "ঢাকা",
      district: "টাঙ্গাইল",
      upazilla: "টাঙ্গাইল সদर",
      services: ["গাইনোকলজি", "প্রসূতি", "শিশু"],
      phone: "0921-55033",
      beds: 200,
      coordinates: [24.2553, 89.9167],
      landmark: "টাঙ্গাইল সদর, বাস স্ট্যান্ডের নিকটে",
      transport: "বাস স্ট্যান্ড: ৫০০ মিটার, অটো/সিএনজি উপলব্ধ",
      nearest: "নিকটস্থ কমিউনিটি ক্লিনিক: ২ কিমি"
    },
    {
      id: 6,
      name: "সাতক্ষীরা সদর হাসপাতাল",
      type: "হাসপাতাল",
      division: "খুলনা",
      district: "সাতক্ষীরা",
      upazilla: "সাতক্ষীরা সদর",
      services: ["জরুরী", "মেডিসিন", "সার্জারি"],
      phone: "0471-62333",
      beds: 150,
      coordinates: [22.7167, 89.0667],
      landmark: "জেলা সদর দপ্তরের পাশে, প্রধান সড়কে",
      transport: "বাস/টেম্পু স্ট্যান্ড: ১ কিমি",
      nearest: "মসজিদের পাশে, জুমার মসজিদ সংলগ্ন"
    }
  ];

  // Community landmarks data
  const communityLandmarks = [
    {
      id: 'lm1',
      name: 'স্থানীয় বাজার',
      type: 'landmark',
      coordinates: [23.7200, 90.4000],
      description: 'কawরান বাজার - সব ধরনের জিনিসপত্র পাওয়া যায়'
    },
    {
      id: 'lm2', 
      name: 'কমিউনিটি ক্লিনিক',
      type: 'clinic',
      coordinates: [23.7250, 90.3950],
      description: 'ফ্রি প্রাথমিক চিকিৎসা, ওষুধ বিনামূল্যে'
    },
    {
      id: 'lm3',
      name: 'ফার্মেসি',
      type: 'pharmacy', 
      coordinates: [23.7300, 90.4020],
      description: '২৪ ঘন্টা খোলা, সকল ধরনের ওষুধ available'
    },
    {
      id: 'lm4',
      name: 'স্কুল সংলগ্ন ক্লিনিক',
      type: 'clinic',
      coordinates: [23.7350, 90.3900],
      description: 'স্কুলের পাশে, শিশুদের জন্য বিশেষায়িত'
    }
  ];

  const filteredFacilities = healthFacilities.filter(facility => {
    if (selectedDivision && facility.division !== selectedDivision) return false;
    if (selectedDistrict && facility.district !== selectedDistrict) return false;
    if (selectedUpazilla && facility.upazilla !== selectedUpazilla) return false;
    return true;
  });

  const divisions = Object.keys(bangladeshData);
  const districts = selectedDivision ? Object.keys(bangladeshData[selectedDivision]?.districts || {}) : [];
  const upazillas = selectedDistrict ? (bangladeshData[selectedDivision]?.districts[selectedDistrict]?.upazillas || []) : [];

  // Update map center when division changes
  useEffect(() => {
    if (selectedDivision && divisionCoordinates[selectedDivision]) {
      setMapCenter(divisionCoordinates[selectedDivision]);
    }
  }, [selectedDivision]);

  const getIconForType = (type) => {
    switch(type) {
      case 'হাসপাতাল':
      case 'বিশেষায়িত হাসপাতাল':
        return hospitalIcon;
      case 'clinic':
        return clinicIcon;
      case 'pharmacy':
        return pharmacyIcon;
      default:
        return hospitalIcon;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-green-200">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-linear-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl mr-6 shadow-lg">
              🗺️
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">স্বাস্থ্য ম্যাপ</h2>
              <p className="text-gray-600 mt-2">কাছের হাসপাতাল, ক্লিনিক ও কমিউনিটি স্বাস্থ্যকেন্দ্র</p>
            </div>
          </div>
          <button
            onClick={() => setShowMap(!showMap)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            {showMap ? 'লিস্ট দেখুন' : 'ম্যাপ দেখুন'}
          </button>
        </div>

        {/* Location Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">বিভাগ</label>
            <select 
              value={selectedDivision}
              onChange={(e) => {
                setSelectedDivision(e.target.value);
                setSelectedDistrict('');
                setSelectedUpazilla('');
              }}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">সকল বিভাগ</option>
              {divisions.map(div => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">জেলা</label>
            <select 
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSelectedUpazilla('');
              }}
              disabled={!selectedDivision}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">সকল জেলা</option>
              {districts.map(dist => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">উপজেলা</label>
            <select 
              value={selectedUpazilla}
              onChange={(e) => setSelectedUpazilla(e.target.value)}
              disabled={!selectedDistrict}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">সকল উপজেলা</option>
              {upazillas.map(upz => (
                <option key={upz} value={upz}>{upz}</option>
              ))}
            </select>
          </div>
        </div>

        {showMap ? (
          /* Interactive Map Section */
          <div className="mb-8">
            <div className="h-96 rounded-2xl overflow-hidden border border-gray-200">
              <MapContainer 
                center={mapCenter} 
                zoom={12} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapViewUpdater center={mapCenter} />
                
                {/* Health Facilities Markers */}
                {filteredFacilities.map(facility => (
                  <Marker 
                    key={facility.id} 
                    position={facility.coordinates}
                    icon={getIconForType(facility.type)}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-lg text-green-800">{facility.name}</h3>
                        <p className="text-sm text-gray-600">{facility.type}</p>
                        <p className="text-sm mt-2">📞 {facility.phone}</p>
                        <p className="text-sm">🛏️ {facility.beds} বেড</p>
                        <p className="text-sm mt-2">📍 {facility.landmark}</p>
                        <p className="text-sm">🚌 {facility.transport}</p>
                        <p className="text-sm text-blue-600 mt-2">🏥 {facility.nearest}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                
                {/* Community Landmarks */}
                {communityLandmarks.map(landmark => (
                  <Marker 
                    key={landmark.id}
                    position={landmark.coordinates}
                    icon={getIconForType(landmark.type)}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-lg text-blue-800">{landmark.name}</h3>
                        <p className="text-sm text-gray-600">{landmark.description}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
            
            {/* Map Legend */}
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                <span className="text-sm">হাসপাতাল</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                <span className="text-sm">ক্লিনিক</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                <span className="text-sm">ফার্মেসি</span>
              </div>
            </div>
          </div>
        ) : (
          /* List View */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredFacilities.map((facility) => (
              <div key={facility.id} className="border border-gray-200 rounded-2xl p-6 hover:border-green-300 hover:shadow-lg transition-all duration-300 group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-700 transition-colors mb-2">
                      {facility.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{facility.type}</span>
                      <span>{facility.district}, {facility.division}</span>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {facility.beds} বেড
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <span className="w-6">📍</span>
                    <span className="text-sm">{facility.landmark}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <span className="w-6">📞</span>
                    <span>{facility.phone}</span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <span className="w-6">🚌</span>
                    <span className="text-sm">{facility.transport}</span>
                  </div>

                  <div className="flex items-start text-gray-700">
                    <span className="w-6 mt-1">🩺</span>
                    <div>
                      <span className="font-medium">সেবাসমূহ: </span>
                      {facility.services.join(', ')}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-700 font-medium">🏥 {facility.nearest}</p>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button className="flex-1 bg-green-500 text-white py-2 px-4 rounded-xl hover:bg-green-600 transition-colors font-medium">
                    কল করুন
                  </button>
                  <button 
                    onClick={() => setShowMap(true)}
                    className="flex-1 border border-green-500 text-green-600 py-2 px-4 rounded-xl hover:bg-green-50 transition-colors font-medium"
                  >
                    ম্যাপে দেখুন
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredFacilities.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏥</div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">কোন হাসপাতাল পাওয়া যায়নি</h3>
            <p className="text-gray-500">অনুগ্রহ করে ভিন্ন বিভাগ/জেলা/উপজেলা নির্বাচন করুন</p>
          </div>
        )}
      </div>
    </div>
  );
}
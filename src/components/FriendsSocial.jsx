import { useState, useEffect } from 'react';

export default function FriendsSocial({ onNavigate }) {
  const [friends, setFriends] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [invitations, setInvitations] = useState([]);

  // Demo events from HealthEvents component
  const events = [
    { id: 1, title: 'বিনামূল্যে ডায়াবেটিস স্ক্রিনিং', date: '২০২৪-১২-১৫' },
    { id: 2, title: 'রক্তদান শিবির', date: '২০২৪-১২-২০' },
    { id: 3, title: 'মানসিক স্বাস্থ্য সচেতনতা কর্মশালা', date: '২০২৪-১২-২৫' }
  ];

  // Demo users (same as login credentials)
  const demoUsers = [
    { id: 'sneho001', name: 'আরিফ আহমেদ', avatar: 'আ', isOnline: true, mutualFriends: 3 },
    { id: 'sneho002', name: 'ফাতেমা বেগম', avatar: 'ফ', isOnline: false, mutualFriends: 2 },
    { id: 'sneho003', name: 'রহিম উদ্দিন', avatar: 'র', isOnline: true, mutualFriends: 5 },
    { id: 'admin', name: 'এডমিন', avatar: 'এ', isOnline: true, mutualFriends: 1 }
  ];

  useEffect(() => {
    loadFriendsData();
    loadAvailableUsers();
    loadInvitations();
  }, []);

  const loadFriendsData = () => {
    // Load from localStorage or use demo data
    const savedFriends = localStorage.getItem('sneho_friends');
    if (savedFriends) {
      setFriends(JSON.parse(savedFriends));
    } else {
      // Start with 2 demo friends
      setFriends([demoUsers[0], demoUsers[1]]);
    }
  };

  const loadAvailableUsers = () => {
    // Users who are not yet friends
    const currentUser = JSON.parse(localStorage.getItem('sneho_user'));
    const filteredUsers = demoUsers.filter(user => 
      user.id !== currentUser?.id && 
      !friends.some(friend => friend.id === user.id)
    );
    setAvailableUsers(filteredUsers);
  };

  const loadInvitations = () => {
    const savedInvitations = localStorage.getItem('sneho_invitations');
    if (savedInvitations) {
      setInvitations(JSON.parse(savedInvitations));
    }
  };

  const addFriend = (user) => {
    const updatedFriends = [...friends, user];
    setFriends(updatedFriends);
    setAvailableUsers(availableUsers.filter(u => u.id !== user.id));
    localStorage.setItem('sneho_friends', JSON.stringify(updatedFriends));
    
    // Show confirmation
    alert(`${user.name} কে বন্ধু হিসেবে যুক্ত করা হয়েছে!`);
  };

  const removeFriend = (friendId) => {
    const friend = friends.find(f => f.id === friendId);
    const updatedFriends = friends.filter(f => f.id !== friendId);
    setFriends(updatedFriends);
    setAvailableUsers([...availableUsers, friend]);
    localStorage.setItem('sneho_friends', JSON.stringify(updatedFriends));
  };

  const sendEventInvitation = (friendId, eventId) => {
    const event = events.find(e => e.id === eventId);
    const friend = friends.find(f => f.id === friendId);
    const currentUser = JSON.parse(localStorage.getItem('sneho_user'));

    if (!event || !friend) return;

    const invitation = {
      id: Date.now(),
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      toUserId: friend.id,
      toUserName: friend.name,
      status: 'pending', // pending, accepted, declined
      sentAt: new Date().toISOString()
    };

    const updatedInvitations = [...invitations, invitation];
    setInvitations(updatedInvitations);
    localStorage.setItem('sneho_invitations', JSON.stringify(updatedInvitations));

    alert(`${friend.name} কে ${event.title} ইভেন্টে আমন্ত্রণ পাঠানো হয়েছে!`);
    setSelectedEvent('');
  };

  const respondToInvitation = (invitationId, response) => {
    const updatedInvitations = invitations.map(inv => 
      inv.id === invitationId ? { ...inv, status: response } : inv
    );
    setInvitations(updatedInvitations);
    localStorage.setItem('sneho_invitations', JSON.stringify(updatedInvitations));

    const invitation = invitations.find(inv => inv.id === invitationId);
    if (response === 'accepted') {
      alert(`আপনি ${invitation.eventTitle} ইভেন্টে যোগ দিয়েছেন!`);
      // Navigate to events page
      onNavigate('events');
    }
  };

  const getPendingInvitations = () => {
    const currentUser = JSON.parse(localStorage.getItem('sneho_user'));
    return invitations.filter(inv => 
      inv.toUserId === currentUser?.id && inv.status === 'pending'
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">বন্ধু ও সামাজিক যোগাযোগ</h2>
        <p className="text-gray-600 mb-6">
          বন্ধুদের সাথে যুক্ত হোন এবং স্বাস্থ্য ইভেন্টে একসাথে অংশগ্রহণ করুন
        </p>

        {/* Pending Invitations */}
        {getPendingInvitations().length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <h3 className="font-bold text-yellow-800 mb-3 flex items-center">
              <span className="text-yellow-500 mr-2">📨</span>
              ইভেন্ট আমন্ত্রণ
            </h3>
            {getPendingInvitations().map(invitation => (
              <div key={invitation.id} className="flex justify-between items-center p-3 bg-white rounded-lg mb-2">
                <div>
                  <p className="font-medium text-gray-800">
                    {invitation.fromUserName} আপনাকে আমন্ত্রণ জানিয়েছেন
                  </p>
                  <p className="text-sm text-gray-600">
                    {invitation.eventTitle} - {invitation.eventDate}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => respondToInvitation(invitation.id, 'accepted')}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    গ্রহণ করুন
                  </button>
                  <button
                    onClick={() => respondToInvitation(invitation.id, 'declined')}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    প্রত্যাখ্যান
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* My Friends Section */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 text-lg flex items-center">
              <span className="text-green-500 mr-2">👥</span>
              আমার বন্ধু ({friends.length})
            </h3>

            {friends.length === 0 ? (
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p className="text-gray-600">আপনার এখনো কোনো বন্ধু নেই</p>
                <p className="text-sm text-gray-500 mt-1">নিচ থেকে বন্ধু যুক্ত করুন</p>
              </div>
            ) : (
              <div className="space-y-3">
                {friends.map(friend => (
                  <div key={friend.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-linear-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                          {friend.avatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          friend.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{friend.name}</p>
                        <p className="text-sm text-gray-600">ID: {friend.id}</p>
                        <p className="text-xs text-gray-500">
                          {friend.isOnline ? 'অনলাইন' : 'অফলাইন'} • {friend.mutualFriends} mutual
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <select
                        value={selectedEvent}
                        onChange={(e) => {
                          if (e.target.value) {
                            sendEventInvitation(friend.id, parseInt(e.target.value));
                          }
                        }}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        <option value="">ইভেন্টে ডাকুন</option>
                        {events.map(event => (
                          <option key={event.id} value={event.id}>
                            {event.title}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => removeFriend(friend.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                        title="বন্ধুত্ব解除"
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Friends Section */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 text-lg flex items-center">
              <span className="text-blue-500 mr-2">🔍</span>
              বন্ধু যুক্ত করুন
            </h3>

            {availableUsers.length === 0 ? (
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p className="text-gray-600">সকল ব্যবহারকারীর সাথে আপনার বন্ধুত্ব হয়েছে</p>
                <p className="text-sm text-gray-500 mt-1">আরও ব্যবহারকারী শীঘ্রই আসছে</p>
              </div>
            ) : (
              <div className="space-y-3">
                {availableUsers.map(user => (
                  <div key={user.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-linear-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.avatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-600">ID: {user.id}</p>
                        <p className="text-xs text-gray-500">
                          {user.isOnline ? 'অনলাইন' : 'অফলাইন'} • {user.mutualFriends} mutual friends
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => addFriend(user)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      বন্ধু যুক্ত করুন
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Event Invite Section */}
            <div className="mt-6 p-4 bg-linear-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
              <h4 className="font-bold text-green-800 mb-2">দ্রুত ইভেন্ট আমন্ত্রণ</h4>
              <p className="text-sm text-green-700 mb-3">
                বন্ধুদেরকে সরাসরি ইভেন্টে আমন্ত্রণ জানান
              </p>
              <div className="space-y-2">
                {events.map(event => (
                  <div key={event.id} className="flex justify-between items-center p-2 bg-white rounded">
                    <div>
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-gray-600">{event.date}</p>
                    </div>
                    <button
                      onClick={() => onNavigate('events')}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      ইভেন্ট দেখুন
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{friends.length}</p>
            <p className="text-sm text-blue-700">মোট বন্ধু</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {friends.filter(f => f.isOnline).length}
            </p>
            <p className="text-sm text-green-700">অনলাইন বন্ধু</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {invitations.filter(inv => inv.status === 'accepted').length}
            </p>
            <p className="text-sm text-purple-700">গৃহীত আমন্ত্রণ</p>
          </div>
        </div>
      </div>
    </div>
  );
}
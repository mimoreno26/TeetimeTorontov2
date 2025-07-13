import { useState, useEffect } from 'react';
import { User, MapPin, CreditCard, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import Navigation from '../components/Navigation';
import { authService } from '../services/authService';
import { filterService } from '../services/filterService';

interface ProfileProps {
  onLogout: () => void;
}

export default function Profile({ onLogout }: ProfileProps) {
  const user = authService.getCurrentUser();
  const [profileStats, setProfileStats] = useState({
    savedFilters: 0,
    preferredDistance: 'Not set',
    preferredTime: 'Not set'
  });

  useEffect(() => {
    loadProfileStats();
  }, []);

  const loadProfileStats = async () => {
    const filters = await filterService.getSavedFilters();
    
    // Calculate preferred distance based on most common choice
    const distanceCount = filters.reduce((acc, filter) => {
      const distance = filter.maxDistance;
      acc[distance] = (acc[distance] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const mostCommonDistance = Object.keys(distanceCount).length > 0
      ? Object.entries(distanceCount).sort(([,a], [,b]) => b - a)[0][0]
      : null;
    
    let preferredDistance = 'Not set';
    if (mostCommonDistance) {
      const distance = parseInt(mostCommonDistance);
      if (distance <= 15) preferredDistance = 'Close (≤15km)';
      else if (distance <= 30) preferredDistance = 'Nearby (≤30km)';
      else if (distance <= 50) preferredDistance = 'Regional (≤50km)';
      else preferredDistance = 'Any Distance';
    }

    // Calculate preferred time based on most common choice
    const timeCount = filters.reduce((acc, filter) => {
      acc[filter.timeOfDay] = (acc[filter.timeOfDay] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const preferredTime = Object.keys(timeCount).length > 0
      ? Object.entries(timeCount).sort(([,a], [,b]) => b - a)[0][0]
      : 'Not set';

    setProfileStats({
      savedFilters: filters.length,
      preferredDistance,
      preferredTime
    });
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      authService.logout();
      onLogout();
    }
  };

  const menuItems = [
    {
      icon: User,
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      onClick: () => alert('Coming Soon: Profile editing will be available soon!'),
    },
    {
      icon: MapPin,
      title: 'Location Settings',
      subtitle: 'Set your preferred golf course areas',
      onClick: () => alert('Coming Soon: Location settings will be available soon!'),
    },
    {
      icon: CreditCard,
      title: 'Payment Methods',
      subtitle: 'Manage your payment options',
      onClick: () => alert('Coming Soon: Payment management will be available soon!'),
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get help or contact support',
      onClick: () => alert('Help & Support\n\nFor support, please email: support@teetimetoronto.com'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white px-6 py-8 rounded-b-3xl shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        </div>

        {/* User Info Card */}
        <div className="px-6 py-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mr-4">
                <User size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{user?.name || 'Guest User'}</h2>
                <p className="text-gray-600">{user?.email || 'guest@example.com'}</p>
                <p className="text-sm text-gray-500">Member since {user?.memberSince || 'January 2024'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-6 mb-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-xl text-center shadow-sm">
              <div className="text-2xl font-bold text-primary-600 mb-1">{profileStats.savedFilters}</div>
              <div className="text-xs text-gray-600">Saved Filters</div>
            </div>
            <div className="bg-white p-4 rounded-xl text-center shadow-sm">
              <div className="text-sm font-bold text-primary-600 mb-1">{profileStats.preferredDistance}</div>
              <div className="text-xs text-gray-600">Preferred Distance</div>
            </div>
            <div className="bg-white p-4 rounded-xl text-center shadow-sm">
              <div className="text-sm font-bold text-primary-600 mb-1">{profileStats.preferredTime}</div>
              <div className="text-xs text-gray-600">Preferred Time</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center mr-3">
                    <item.icon size={18} className="text-primary-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-600">{item.subtitle}</div>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <div className="px-6 mb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center bg-white text-red-600 py-4 rounded-xl border border-red-200 font-medium hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} className="mr-2" />
            Sign Out
          </button>
        </div>

        {/* App Info */}
        <div className="px-6 text-center text-gray-500">
          <p className="text-xs mb-1">TeeTimeToronto v1.0.0</p>
          <p className="text-xs">© 2024 TeeTimeToronto. All rights reserved.</p>
        </div>
      </div>

      <Navigation />
    </div>
  );
}
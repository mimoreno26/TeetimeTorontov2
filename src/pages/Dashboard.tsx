import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, Bell, MapPin, Clock, Search, Mail, MessageSquare } from 'lucide-react';
import Navigation from '../components/Navigation';
import { filterService } from '../services/filterService';
import { authService } from '../services/authService';

interface SavedFilter {
  id: string;
  name: string;
  golfers: number;
  timeOfDay: string;
  daysOfWeek: string[];
  maxDistance: number;
  priceRange: string;
  minRating: number;
  selectedCourses: string[];
  createdAt: Date;
  notificationPrefs: {
    sms: boolean;
    email: boolean;
  };
}

export default function Dashboard() {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);

  useEffect(() => {
    loadSavedFilters();
  }, []);

  const handleUpdateNotificationPrefs = async (filterId: string, prefs: { sms: boolean; email: boolean }) => {
    // Only validate SMS if user is trying to enable it
    if (prefs.sms && !authService.canEnableSMS()) {
      alert('SMS notifications require a phone number. Please update your profile to add a phone number.');
      return;
    }

    try {
      await filterService.updateFilter(filterId, { notificationPrefs: prefs });
      await loadSavedFilters();
    } catch (error) {
      alert('Failed to update notification preferences');
    }
  };
  
  const loadSavedFilters = async () => {
    const filters = await filterService.getSavedFilters();
    setSavedFilters(filters);
  };

  const handleDeleteFilter = async (filterId: string) => {
    if (window.confirm('Are you sure you want to delete this filter?')) {
      await filterService.deleteFilter(filterId);
      loadSavedFilters();
    }
  };

  const user = authService.getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white px-6 py-8 rounded-b-3xl shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Welcome back, {user?.name || 'Guest'}
          </h1>
          <p className="text-gray-600">Find your perfect tee time</p>
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-6 space-y-4">
          <Link
            to="/search"
            className="flex items-center justify-center bg-primary-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:bg-primary-700 transition-colors"
          >
            <Search size={20} className="mr-2" />
            Find Tee Times
          </Link>

          <Link
            to="/filter"
            className="flex items-center justify-center bg-white text-primary-600 py-4 px-6 rounded-xl font-semibold border-2 border-primary-600 hover:bg-primary-50 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            New Filter
          </Link>
        </div>

        {/* Notifications & Saved Filters Combined */}
        <div className="px-6 mb-6">
          <div className="flex items-center mb-4">
            <Bell size={20} className="text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          </div>

          {savedFilters.length === 0 ? (
            <div className="bg-white p-8 rounded-xl text-center">
              <Filter size={40} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No saved filters</h3>
              <p className="text-gray-600 mb-4">Create your first filter to get started</p>
              <Link
                to="/filter"
                className="inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Create Filter
              </Link>
            </div>
          ) : (
            <div>
              {savedFilters.map(filter => (
                <div key={filter.id} className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{filter.name}</h3>
                      <p className="text-sm text-gray-600">
                        {filter.golfers} golfers • {filter.priceRange}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/filter?id=${filter.id}`}
                        className="text-primary-600 text-sm font-medium hover:text-primary-700"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteFilter(filter.id)}
                        className="text-red-600 text-sm font-medium hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  {/* Compact Notification Toggles */}
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Notifications:</span>
                      <div className="flex items-center space-x-4">
                        {/* Email Toggle */}
                        <div className="flex items-center space-x-2">
                          <Mail size={14} className="text-gray-500" />
                          <button
                            onClick={() => {
                              const newPrefs = {
                                ...filter.notificationPrefs,
                                email: !filter.notificationPrefs.email
                              };
                              handleUpdateNotificationPrefs(filter.id, newPrefs);
                            }}
                            className={`w-8 h-4 rounded-full transition-colors ${
                              filter.notificationPrefs.email ? 'bg-primary-600' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                              filter.notificationPrefs.email ? 'translate-x-4' : 'translate-x-0.5'
                            }`} />
                          </button>
                        </div>

                        {/* SMS Toggle */}
                        <div className="flex items-center space-x-2">
                          <MessageSquare size={14} className={`${authService.canEnableSMS() ? 'text-gray-500' : 'text-gray-300'}`} />
                          <button
                            disabled={!authService.canEnableSMS()}
                            onClick={() => {
                              if (!authService.canEnableSMS()) {
                                alert('SMS notifications require a phone number. Please update your profile to add a phone number.');
                                return;
                              }
                              const newPrefs = {
                                ...filter.notificationPrefs,
                                sms: !filter.notificationPrefs.sms
                              };
                              handleUpdateNotificationPrefs(filter.id, newPrefs);
                            }}
                            className={`w-8 h-4 rounded-full transition-colors ${
                              !authService.canEnableSMS() 
                                ? 'bg-gray-200 cursor-not-allowed' 
                                : filter.notificationPrefs.sms 
                                  ? 'bg-primary-600' 
                                  : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                              filter.notificationPrefs.sms ? 'translate-x-4' : 'translate-x-0.5'
                            }`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notification message */}
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      {Math.floor(Math.random() * 5) + 1} new tee times available
                    </p>
                    <p className="text-xs text-primary-600 font-medium">
                      {Math.floor(Math.random() * 12) + 3} courses match your criteria
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1" />
                      Within {filter.maxDistance}km
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {filter.timeOfDay}
                    </div>
                  </div>
                  <Link
                    to={`/results?filterId=${filter.id}`}
                    className="inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                  >
                    View Available Times
                  </Link>
                </div>
              ))}
            </div>
          )}
          {/* SMS Note for users without phone */}
          {!authService.getCurrentUser()?.phone && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
              <p className="text-xs text-yellow-800">
                <strong>Note:</strong> To enable SMS notifications, please add a phone number to your profile first.
              </p>
            </div>
          )}
        </div>
      </div>

      <Navigation />
    </div>
  );
}
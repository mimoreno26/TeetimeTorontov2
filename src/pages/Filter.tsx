import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Search, Star, X } from 'lucide-react';
import { filterService } from '../services/filterService';
import { courseService } from '../services/courseService';
import { authService } from '../services/authService';

interface FilterData {
  id?: string;
  name: string;
  golfers: number;
  timeOfDay: string;
  daysOfWeek: string[];
  maxDistance: number;
  priceRange: string;
  minRating: number;
  selectedCourses: string[];
  notificationPrefs: {
    sms: boolean;
    email: boolean;
  };
}

export default function Filter() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filterId = searchParams.get('id');
  const isEdit = !!filterId;

  const [filterData, setFilterData] = useState<FilterData>({
    name: '',
    golfers: 2,
    timeOfDay: 'Anytime',
    daysOfWeek: [],
    maxDistance: 50,
    priceRange: 'All',
    minRating: 0,
    selectedCourses: [],
    notificationPrefs: {
      sms: false,
      email: true,
    },
  });

  const [courseSearchQuery, setCourseSearchQuery] = useState('');
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [tempPhoneNumber, setTempPhoneNumber] = useState('');

  const golfersOptions = [1, 2, 3, 4];
  const timeOptions = ['Morning', 'Afternoon', 'Evening', 'Anytime'];
  const daysOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const priceOptions = ['Low', 'Medium', 'High', 'All'];

  useEffect(() => {
    if (isEdit) {
      loadFilter();
    }
    loadCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courseSearchQuery, availableCourses]);

  const loadFilter = async () => {
    if (filterId) {
      const filter = await filterService.getFilter(filterId);
      if (filter) {
        setFilterData(filter);
      }
    }
  };

  const loadCourses = async () => {
    const courses = await courseService.getAllCourses();
    setAvailableCourses(courses);
  };

  const filterCourses = () => {
    if (!courseSearchQuery.trim()) {
      setFilteredCourses([]);
      return;
    }

    const filtered = availableCourses.filter(course =>
      course.name.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
      course.location.toLowerCase().includes(courseSearchQuery.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const handleAddPhoneNumber = async () => {
    if (!tempPhoneNumber.trim()) {
      alert('Please enter a phone number');
      return;
    }

    if (!tempPhoneNumber.match(/^\+?[\d\s\-\(\)]+$/)) {
      alert('Please enter a valid phone number');
      return;
    }

    try {
      await authService.updatePhoneNumber(tempPhoneNumber);
      alert('Phone number added successfully! You can now enable SMS notifications.');
      setTempPhoneNumber('');
    } catch (error) {
      alert('Failed to update phone number. Please try again.');
    }
  };
  const handleSave = async () => {
    if (!filterData.name.trim()) {
      alert('Please enter a filter name');
      return;
    }

    // Validate notification preferences
    if (!filterData.notificationPrefs.sms && !filterData.notificationPrefs.email) {
      alert('Please select at least one notification method');
      return;
    }

    // Check if SMS is selected but user has no phone
    const user = authService.getCurrentUser();
    if (filterData.notificationPrefs.sms && !user?.phone) {
      alert('SMS notifications require a phone number. Please update your profile first or use email notifications only.');
      return;
    }

    try {
      if (isEdit) {
        await filterService.updateFilter(filterId!, filterData);
        alert('Filter updated successfully!');
      } else {
        await filterService.saveFilter(filterData);
        alert('Filter saved successfully!');
      }
      navigate('/');
    } catch (error) {
      alert('Failed to save filter');
    }
  };

  const toggleDay = (day: string) => {
    const updatedDays = filterData.daysOfWeek.includes(day)
      ? filterData.daysOfWeek.filter(d => d !== day)
      : [...filterData.daysOfWeek, day];
    
    setFilterData(prev => ({ ...prev, daysOfWeek: updatedDays }));
  };

  const handleToggleCourse = (courseId: string) => {
    const updatedCourses = filterData.selectedCourses.includes(courseId)
      ? filterData.selectedCourses.filter(id => id !== courseId)
      : [...filterData.selectedCourses, courseId];
    
    setFilterData(prev => ({ ...prev, selectedCourses: updatedCourses }));
  };

  const user = authService.getCurrentUser();
  const hasPhoneNumber = !!user?.phone;
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white px-6 py-4 flex items-center justify-between shadow-sm">
          <button onClick={() => navigate('/')} className="p-2">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            {isEdit ? 'Edit Filter' : 'Create Filter'}
          </h1>
          <button onClick={handleSave} className="p-2">
            <Save size={24} className="text-primary-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Filter Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter Name</label>
            <input
              type="text"
              placeholder="Enter filter name..."
              value={filterData.name}
              onChange={(e) => setFilterData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-colors"
            />
          </div>

          {/* Specific Courses */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Specific Courses (Optional)
            </label>
            
            {/* Search Input */}
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses by name or location..."
                value={courseSearchQuery}
                onChange={(e) => setCourseSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
              />
            </div>

            {/* Selected Courses */}
            {filterData.selectedCourses.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2">Selected courses:</p>
                <div className="space-y-2">
                  {filterData.selectedCourses.map((courseId) => {
                    const course = availableCourses.find(c => c.id === courseId);
                    if (!course) return null;
                    return (
                      <div
                        key={courseId}
                        className="bg-primary-50 border border-primary-200 rounded-lg p-3 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-primary-900">{course.name}</div>
                          <div className="text-sm text-primary-600 flex items-center space-x-3">
                            <span>{course.distance}km away</span>
                            <span className="flex items-center">
                              <Star size={12} className="mr-1 text-yellow-400" fill="currentColor" />
                              {course.rating}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleToggleCourse(courseId)}
                          className="ml-3 text-primary-600 hover:text-primary-800 p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Available Courses to Add */}
            {courseSearchQuery && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Available Courses:</p>
                <div className="bg-white border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                  {filteredCourses.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No courses found matching "{courseSearchQuery}"
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {filteredCourses
                        .filter(course => !filterData.selectedCourses.includes(course.id))
                        .slice(0, 8)
                        .map((course) => (
                        <button
                          key={course.id}
                          onClick={() => handleToggleCourse(course.id)}
                          className="w-full text-left p-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{course.name}</div>
                              <div className="text-sm text-gray-600 flex items-center space-x-3">
                                <span>{course.distance}km away</span>
                                <span className="flex items-center">
                                  <Star size={12} className="mr-1 text-yellow-400" fill="currentColor" />
                                  {course.rating}
                                </span>
                              </div>
                            </div>
                            <div className="ml-3 w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-300 rounded-full opacity-0"></div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Number of Golfers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Number of Golfers</label>
            <div className="grid grid-cols-4 gap-2">
              {golfersOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setFilterData(prev => ({ ...prev, golfers: option }))}
                  className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                    filterData.golfers === option
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Time of Day */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Time</label>
            <div className="grid grid-cols-2 gap-2">
              {timeOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setFilterData(prev => ({ ...prev, timeOfDay: option }))}
                  className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                    filterData.timeOfDay === option
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Days of Week */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Days</label>
            <div className="flex flex-wrap gap-2">
              {daysOptions.map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`py-2 px-3 rounded-full text-sm font-medium transition-colors ${
                    filterData.daysOfWeek.includes(day)
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Max Distance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Maximum Distance: {filterData.maxDistance}km
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 25, 50, 100].map((distance) => (
                <button
                  key={distance}
                  onClick={() => setFilterData(prev => ({ ...prev, maxDistance: distance }))}
                  className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                    filterData.maxDistance === distance
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {distance}km
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Price Range</label>
            <div className="grid grid-cols-4 gap-2">
              {priceOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setFilterData(prev => ({ ...prev, priceRange: option }))}
                  className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                    filterData.priceRange === option
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Minimum Rating: {filterData.minRating}/5 stars
            </label>
            <div className="grid grid-cols-6 gap-2">
              {[0, 1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFilterData(prev => ({ ...prev, minRating: rating }))}
                  className={`py-2 px-3 rounded-lg font-medium transition-colors ${
                    filterData.minRating === rating
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {rating === 0 ? 'Any' : `${rating}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Notification Preferences */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How would you like to be notified?
            </label>
            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
              {/* Email Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="font-medium text-gray-900">Email Notifications</span>
                  <span className="text-sm text-gray-500 ml-2">Get alerts via email</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFilterData(prev => ({ 
                    ...prev, 
                    notificationPrefs: { ...prev.notificationPrefs, email: !prev.notificationPrefs.email }
                  }))}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    filterData.notificationPrefs.email ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    filterData.notificationPrefs.email ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* SMS Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`font-medium ${authService.canEnableSMS() ? 'text-gray-900' : 'text-gray-400'}`}>
                    SMS Notifications
                  </span>
                  <span className={`text-sm ml-2 ${authService.canEnableSMS() ? 'text-gray-500' : 'text-gray-400'}`}>
                    {authService.canEnableSMS() ? 'Get instant text alerts' : 'Phone number required'}
                  </span>
                </div>
                <button
                  type="button"
                  disabled={!authService.canEnableSMS()}
                  onClick={() => {
                    if (authService.canEnableSMS()) {
                      setFilterData(prev => ({ 
                        ...prev, 
                        notificationPrefs: { ...prev.notificationPrefs, sms: !prev.notificationPrefs.sms }
                      }));
                    } else {
                      alert('SMS notifications require a phone number. Please update your profile to add a phone number.');
                    }
                  }}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    !authService.canEnableSMS() 
                      ? 'bg-gray-200 cursor-not-allowed' 
                      : filterData.notificationPrefs.sms 
                        ? 'bg-primary-600' 
                        : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    filterData.notificationPrefs.sms ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Add Phone Number Section */}
              {!hasPhoneNumber && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 mb-3">
                    <strong>Add Phone Number:</strong> Enable SMS notifications by adding your phone number below.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      placeholder="Enter phone number (e.g., +1234567890)"
                      value={tempPhoneNumber}
                      onChange={(e) => setTempPhoneNumber(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white rounded-lg border border-yellow-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm"
                    />
                    <button
                      onClick={handleAddPhoneNumber}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
              {!authService.canEnableSMS() && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> To enable SMS notifications, please add a phone number to your profile first.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
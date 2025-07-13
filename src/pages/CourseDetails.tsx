import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Phone, 
  Globe, 
  Clock, 
  DollarSign,
  Navigation,
  ExternalLink 
} from 'lucide-react';
import { courseService } from '../services/courseService';

interface CourseDetails {
  id: string;
  name: string;
  location: string;
  rating: number;
  priceRange: string;
  distance: number;
  phone: string;
  website: string;
  description: string;
  features: string[];
  availableSlots: string[];
  address: string;
  par: number;
  length: string;
  difficulty: string;
  dressCode: string;
  facilities: string[];
}

export default function CourseDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourseDetails();
  }, []);

  const loadCourseDetails = async () => {
    try {
      if (id) {
        const courseData = await courseService.getCourse(id);
        setCourse(courseData);
      }
    } catch (error) {
      console.error('Error loading course details:', error);
      alert('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (course?.phone) {
      window.open(`tel:${course.phone}`);
    }
  };

  const handleWebsite = () => {
    if (course?.website) {
      window.open(course.website, '_blank');
    } else {
      alert('Website not available for this course');
    }
  };

  const handleDirections = () => {
    if (course?.address) {
      const encodedAddress = encodeURIComponent(course.address);
      const url = `https://maps.google.com/?q=${encodedAddress}`;
      window.open(url, '_blank');
    }
  };

  const handleBooking = () => {
    const message = `Book a tee time at ${course?.name}`;
    const options = [
      `Call Course: ${course?.phone}`,
      course?.website ? `Visit Website: ${course.website}` : null,
      'Cancel'
    ].filter(Boolean);

    if (window.confirm(`${message}\n\n${options.slice(0, -1).join('\n')}`)) {
      if (course?.website) {
        window.open(course.website, '_blank');
      } else {
        handleCall();
      }
    }
  };

  const getPriceColor = (priceRange: string) => {
    switch (priceRange) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading course details...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Course not found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white px-6 py-4 flex items-center shadow-sm">
          <button onClick={() => navigate(-1)} className="p-2 mr-3">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Course Details</h1>
        </div>

        <div className="p-6 space-y-6">
          {/* Course Header */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900 flex-1 mr-3">{course.name}</h2>
              <div className="flex items-center">
                <Star size={16} className="text-yellow-400 mr-1" fill="currentColor" />
                <span className="font-medium text-gray-700">{course.rating}/5</span>
              </div>
            </div>
            
            <div className="flex items-center text-gray-600 mb-3">
              <MapPin size={16} className="mr-2" />
              <span>{course.location}</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <DollarSign size={16} className={`mr-1 ${getPriceColor(course.priceRange)}`} />
                <span className={`font-medium ${getPriceColor(course.priceRange)}`}>
                  {course.priceRange}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <Navigation size={16} className="mr-1" />
                <span>{course.distance}km away</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={handleCall}
              className="bg-white p-4 rounded-xl shadow-sm text-center hover:bg-gray-50 transition-colors"
            >
              <Phone size={18} className="text-primary-600 mx-auto mb-1" />
              <span className="text-sm font-medium text-gray-700">Call</span>
            </button>
            <button
              onClick={handleWebsite}
              className="bg-white p-4 rounded-xl shadow-sm text-center hover:bg-gray-50 transition-colors"
            >
              <Globe size={18} className="text-primary-600 mx-auto mb-1" />
              <span className="text-sm font-medium text-gray-700">Website</span>
            </button>
            <button
              onClick={handleDirections}
              className="bg-white p-4 rounded-xl shadow-sm text-center hover:bg-gray-50 transition-colors"
            >
              <Navigation size={18} className="text-primary-600 mx-auto mb-1" />
              <span className="text-sm font-medium text-gray-700">Directions</span>
            </button>
          </div>

          {/* Course Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Par</div>
                <div className="font-semibold text-gray-900">{course.par}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Length</div>
                <div className="font-semibold text-gray-900">{course.length}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Difficulty</div>
                <div className={`font-semibold ${getDifficultyColor(course.difficulty)}`}>
                  {course.difficulty}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Dress Code</div>
                <div className="font-semibold text-gray-900">{course.dressCode}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Course</h3>
            <p className="text-gray-700 leading-relaxed">{course.description}</p>
          </div>

          {/* Available Times */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Times Today</h3>
            <div className="flex flex-wrap gap-2">
              {course.availableSlots.map((slot, index) => (
                <div key={index} className="bg-primary-50 text-primary-600 px-3 py-2 rounded-lg flex items-center">
                  <Clock size={14} className="mr-2" />
                  <span className="font-medium">{slot}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Features</h3>
            <div className="space-y-2">
              {course.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Facilities */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Facilities</h3>
            <div className="flex flex-wrap gap-2">
              {course.facilities.map((facility, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {facility}
                </span>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone size={16} className="text-gray-400 mr-3" />
                <span className="text-gray-700">{course.phone}</span>
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="text-gray-400 mr-3" />
                <span className="text-gray-700">{course.address}</span>
              </div>
              {course.website && (
                <div className="flex items-center">
                  <Globe size={16} className="text-gray-400 mr-3" />
                  <span className="text-gray-700">{course.website}</span>
                </div>
              )}
            </div>
          </div>

          {/* Book Now Button */}
          <button
            onClick={handleBooking}
            className="w-full bg-primary-600 text-white py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center"
          >
            <ExternalLink size={20} className="mr-2" />
            Book Tee Time
          </button>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Clock, ExternalLink } from 'lucide-react';
import { filterService } from '../services/filterService';
import { courseService } from '../services/courseService';

interface Course {
  id: string;
  name: string;
  location: string;
  rating: number;
  priceRange: string;
  distance: number;
  availableSlots: string[];
  phone: string;
  website: string;
}

export default function Results() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filterId = searchParams.get('filterId');
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [filterName, setFilterName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      if (filterId) {
        const filter = await filterService.getFilter(filterId);
        if (filter) {
          setFilterName(filter.name);
          const filteredCourses = await applyFilters(filter);
          setCourses(filteredCourses);
        }
      } else {
        const allCourses = await courseService.getAllCourses();
        setCourses(allCourses);
      }
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async (filter: any) => {
    const allCourses = await courseService.getAllCourses();
    
    return allCourses.filter(course => {
      if (course.distance > filter.maxDistance) return false;
      if (filter.priceRange !== 'All' && course.priceRange !== filter.priceRange) return false;
      if (course.rating < filter.minRating) return false;
      if (filter.selectedCourses.length > 0 && !filter.selectedCourses.includes(course.id)) return false;
      return true;
    });
  };

  const handleBooking = (course: Course) => {
    const message = `Book a tee time at ${course.name}`;
    const options = [
      `Call Course: ${course.phone}`,
      course.website ? `Visit Website: ${course.website}` : null,
      'Cancel'
    ].filter(Boolean);

    if (window.confirm(`${message}\n\n${options.slice(0, -1).join('\n')}`)) {
      if (course.website) {
        window.open(course.website, '_blank');
      } else {
        window.open(`tel:${course.phone}`);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading results...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white px-6 py-4 flex items-center shadow-sm">
          <button onClick={() => navigate('/')} className="p-2 mr-3">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">Search Results</h1>
            {filterName && <p className="text-sm text-gray-600">{filterName}</p>}
          </div>
        </div>

        <div className="p-6">
          <p className="text-lg font-medium text-gray-900 mb-4">
            {courses.length} courses match your criteria
          </p>

          {courses.length === 0 ? (
            <div className="bg-white p-8 rounded-xl text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filter criteria to see more results
              </p>
              <Link
                to="/filter"
                className="inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Adjust Filters
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 flex-1 mr-3">{course.name}</h3>
                    <div className="flex items-center">
                      <Star size={14} className="text-yellow-400 mr-1" fill="currentColor" />
                      <span className="text-sm font-medium text-gray-700">{course.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin size={14} className="mr-1" />
                    <span className="text-sm">{course.location}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-3">
                    <div className="flex items-center space-x-4">
                      <span className={`font-medium ${getPriceColor(course.priceRange)}`}>
                        {course.priceRange} Price Range
                      </span>
                      <div className="flex items-center text-gray-600">
                        <MapPin size={14} className="mr-1" />
                        <span>{course.distance}km away</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Available times today:</p>
                    <div className="flex flex-wrap gap-2">
                      {course.availableSlots.map((slot, index) => (
                        <div key={index} className="bg-primary-50 text-primary-600 px-2 py-1 rounded flex items-center">
                          <Clock size={12} className="mr-1" />
                          <span className="text-xs font-medium">{slot}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      to={`/course/${course.id}`}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-center font-medium hover:bg-gray-200 transition-colors"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleBooking(course)}
                      className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
                    >
                      <ExternalLink size={16} className="mr-1" />
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
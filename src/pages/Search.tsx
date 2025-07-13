import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, MapPin, Star, Clock, DollarSign } from 'lucide-react';
import Navigation from '../components/Navigation';
import { courseService } from '../services/courseService';

interface Course {
  id: string;
  name: string;
  location: string;
  rating: number;
  priceRange: string;
  distance: number;
  image: string;
  availableSlots: string[];
}

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchQuery, courses]);

  const loadCourses = async () => {
    const coursesData = await courseService.getAllCourses();
    setCourses(coursesData);
    setFilteredCourses(coursesData);
  };

  const filterCourses = () => {
    if (!searchQuery.trim()) {
      setFilteredCourses(courses);
      return;
    }

    const filtered = courses.filter(course =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const getPriceColor = (priceRange: string) => {
    switch (priceRange) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white px-6 py-8 rounded-b-3xl shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Find Golf Courses</h1>
          <p className="text-gray-600">Discover the best courses in Toronto</p>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-6">
          <div className="relative">
            <SearchIcon size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Advanced Filter Button */}
        <div className="px-6 mb-6">
          <Link
            to="/advanced-search"
            className="inline-flex items-center bg-white text-primary-600 px-4 py-2 rounded-lg border border-primary-600 font-medium hover:bg-primary-50 transition-colors"
          >
            Advanced Filters
          </Link>
        </div>

        {/* Results */}
        <div className="px-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {filteredCourses.length} courses found
          </h2>

          {filteredCourses.length === 0 && searchQuery ? (
            <div className="bg-white p-8 rounded-xl text-center">
              <SearchIcon size={40} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600">Try adjusting your search terms</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCourses.map((course) => (
                <Link
                  key={course.id}
                  to={`/course/${course.id}`}
                  className="block bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
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
                      <div className="flex items-center">
                        <DollarSign size={14} className={`mr-1 ${getPriceColor(course.priceRange)}`} />
                        <span className={getPriceColor(course.priceRange)}>{course.priceRange}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin size={14} className="mr-1" />
                        <span>{course.distance}km away</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock size={14} className="mr-1" />
                        <span>{course.availableSlots.length} slots today</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-2">Available times:</p>
                    <div className="flex flex-wrap gap-2">
                      {course.availableSlots.slice(0, 3).map((slot, index) => (
                        <span
                          key={index}
                          className="bg-primary-50 text-primary-600 px-2 py-1 rounded text-xs font-medium"
                        >
                          {slot}
                        </span>
                      ))}
                      {course.availableSlots.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          +{course.availableSlots.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Navigation />
    </div>
  );
}
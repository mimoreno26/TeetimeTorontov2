import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Star, DollarSign } from 'lucide-react';
import Navigation from '../components/Navigation';
import { courseService } from '../services/courseService';

interface Course {
  id: string;
  name: string;
  location: string;
  rating: number;
  priceRange: string;
  distance: number;
  par: number;
  difficulty: string;
  availableSlots: string[];
}

export default function AdvancedSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  
  // Filter states
  const [maxDistance, setMaxDistance] = useState(100);
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [courseType, setCourseType] = useState('All'); // 18-hole, 9-hole, etc.

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, courses, maxDistance, minRating, priceRange, difficulty, courseType]);

  const loadCourses = async () => {
    const coursesData = await courseService.getAllCourses();
    setCourses(coursesData);
    setFilteredCourses(coursesData);
  };

  const applyFilters = () => {
    let filtered = courses;

    // Text search
    if (searchQuery.trim()) {
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Distance filter
    filtered = filtered.filter(course => course.distance <= maxDistance);

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(course => course.rating >= minRating);
    }

    // Price range filter
    if (priceRange !== 'All') {
      filtered = filtered.filter(course => course.priceRange === priceRange);
    }

    // Difficulty filter
    if (difficulty !== 'All') {
      filtered = filtered.filter(course => course.difficulty === difficulty);
    }

    // Course type filter (par-based)
    if (courseType !== 'All') {
      if (courseType === 'Championship') {
        filtered = filtered.filter(course => course.par >= 70);
      } else if (courseType === 'Executive') {
        filtered = filtered.filter(course => course.par < 70);
      }
    }

    setFilteredCourses(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setMaxDistance(100);
    setMinRating(0);
    setPriceRange('All');
    setDifficulty('All');
    setCourseType('All');
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
        <div className="bg-white px-6 py-4 flex items-center shadow-sm">
          <button onClick={() => navigate('/search')} className="p-2 mr-3">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Advanced Search</h1>
        </div>

        <div className="p-6 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Clear All
              </button>
            </div>

            {/* Distance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Distance: {maxDistance}km
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 100].map((distance) => (
                  <button
                    key={distance}
                    onClick={() => setMaxDistance(distance)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      maxDistance === distance
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {distance}km
                  </button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </label>
              <div className="grid grid-cols-6 gap-2">
                {[0, 1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`py-2 px-2 rounded-lg text-sm font-medium transition-colors ${
                      minRating === rating
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {rating === 0 ? 'Any' : `${rating}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="grid grid-cols-4 gap-2">
                {['All', 'Low', 'Medium', 'High'].map((price) => (
                  <button
                    key={price}
                    onClick={() => setPriceRange(price)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      priceRange === price
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {price}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <div className="grid grid-cols-4 gap-2">
                {['All', 'Easy', 'Moderate', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      difficulty === diff
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Course Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Type</label>
              <div className="grid grid-cols-3 gap-2">
                {['All', 'Championship', 'Executive'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setCourseType(type)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      courseType === type
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {filteredCourses.length} courses found
            </h2>

            {filteredCourses.length === 0 ? (
              <div className="bg-white p-8 rounded-xl text-center">
                <Search size={40} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
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

                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin size={14} className="mr-1" />
                      <span className="text-sm">{course.location}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <DollarSign size={14} className={`mr-1 ${getPriceColor(course.priceRange)}`} />
                          <span className={getPriceColor(course.priceRange)}>{course.priceRange}</span>
                        </div>
                        <span className="text-gray-600">{course.distance}km</span>
                        <span className="text-gray-600">Par {course.par}</span>
                        <span className="text-gray-600">{course.difficulty}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
}
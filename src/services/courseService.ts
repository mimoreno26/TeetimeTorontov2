export interface Course {
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
  image: string;
}

class CourseService {
  private courses: Course[] = [
    {
      id: '1',
      name: 'Glen Abbey Golf Club',
      location: 'Oakville, ON',
      rating: 4.5,
      priceRange: 'High',
      distance: 15,
      phone: '(905) 844-1800',
      website: 'https://glenabbey.clublink.ca',
      description: 'Championship golf course designed by Jack Nicklaus. Home to many Canadian Open tournaments.',
      features: ['Championship Course', 'Pro Shop', 'Driving Range', 'Putting Green'],
      availableSlots: ['9:00 AM', '10:30 AM', '2:15 PM', '4:00 PM'],
      address: '1333 Dorval Dr, Oakville, ON L6M 4X7',
      par: 72,
      length: '7,253 yards',
      difficulty: 'Hard',
      dressCode: 'Collared shirt required',
      facilities: ['Restaurant', 'Pro Shop', 'Locker Room', 'Cart Rental'],
      image: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg'
    },
    {
      id: '2',
      name: 'St. George\'s Golf and Country Club',
      location: 'Etobicoke, ON',
      rating: 4.8,
      priceRange: 'High',
      distance: 8,
      phone: '(416) 231-8900',
      website: 'https://stgeorges.org',
      description: 'Historic private club established in 1909. Renowned for its challenging layout and pristine conditions.',
      features: ['Historic Course', 'Private Club', 'Tournament Host', 'Fine Dining'],
      availableSlots: ['8:30 AM', '11:00 AM', '1:30 PM'],
      address: '1668 Islington Ave, Etobicoke, ON M9A 3N1',
      par: 70,
      length: '6,786 yards',
      difficulty: 'Hard',
      dressCode: 'Jacket required in clubhouse',
      facilities: ['Fine Dining', 'Pro Shop', 'Locker Room', 'Valet Service'],
      image: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg'
    },
    {
      id: '3',
      name: 'Don Valley Golf Course',
      location: 'Toronto, ON',
      rating: 4.2,
      priceRange: 'Medium',
      distance: 12,
      phone: '(416) 392-2465',
      website: 'https://www.toronto.ca/data/parks/prd/facilities/complex/41/index.html',
      description: 'Public golf course in the heart of Toronto. Great value with scenic views of the Don Valley.',
      features: ['Public Course', 'City Views', 'Beginner Friendly', 'Good Value'],
      availableSlots: ['7:00 AM', '9:30 AM', '12:00 PM', '3:30 PM', '5:00 PM'],
      address: '4200 Yonge St, North York, ON M2P 2B4',
      par: 71,
      length: '6,215 yards',
      difficulty: 'Moderate',
      dressCode: 'Casual golf attire',
      facilities: ['Snack Bar', 'Pro Shop', 'Cart Rental', 'Practice Range'],
      image: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg'
    },
    {
      id: '4',
      name: 'Angus Glen Golf Club',
      location: 'Markham, ON',
      rating: 4.6,
      priceRange: 'High',
      distance: 25,
      phone: '(905) 887-0090',
      website: 'https://www.angusglen.com',
      description: 'Two championship courses designed by Doug Carrick. Host to PGA Tour events.',
      features: ['Two Courses', 'PGA Tour Host', 'Practice Facility', 'Luxury Amenities'],
      availableSlots: ['8:00 AM', '10:15 AM', '1:45 PM', '4:30 PM'],
      address: '10080 Kennedy Rd, Markham, ON L6C 1N2',
      par: 72,
      length: '7,014 yards',
      difficulty: 'Hard',
      dressCode: 'Golf attire required',
      facilities: ['Restaurant', 'Pro Shop', 'Locker Room', 'Practice Facility'],
      image: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg'
    },
    {
      id: '5',
      name: 'Humber Valley Golf Course',
      location: 'Toronto, ON',
      rating: 3.8,
      priceRange: 'Low',
      distance: 18,
      phone: '(416) 392-2488',
      website: 'https://www.toronto.ca/data/parks/prd/facilities/complex/3138/index.html',
      description: 'Affordable public course perfect for beginners and casual golfers.',
      features: ['Public Course', 'Affordable', 'Beginner Friendly', 'Easy Access'],
      availableSlots: ['6:30 AM', '8:45 AM', '11:15 AM', '2:00 PM', '4:45 PM'],
      address: '40 Beattie Ave, Toronto, ON M6M 5A7',
      par: 70,
      length: '5,890 yards',
      difficulty: 'Easy',
      dressCode: 'Casual',
      facilities: ['Snack Bar', 'Cart Rental', 'Basic Pro Shop'],
      image: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg'
    },
    {
      id: '6',
      name: 'Mississaugua Golf & Country Club',
      location: 'Mississauga, ON',
      rating: 4.3,
      priceRange: 'Medium',
      distance: 22,
      phone: '(905) 278-4747',
      website: 'https://www.mississaugagolf.com',
      description: 'Well-maintained public course with challenging water hazards and scenic views.',
      features: ['Water Hazards', 'Scenic Views', 'Practice Facility', 'Restaurant'],
      availableSlots: ['7:30 AM', '10:00 AM', '1:00 PM', '3:45 PM'],
      address: '1725 Mississauga Rd, Mississauga, ON L5H 2K1',
      par: 71,
      length: '6,445 yards',
      difficulty: 'Moderate',
      dressCode: 'Golf attire required',
      facilities: ['Restaurant', 'Pro Shop', 'Cart Rental', 'Locker Room'],
      image: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg'
    }
  ];

  async getAllCourses(): Promise<Course[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.courses];
  }

  async getCourse(id: string): Promise<Course | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.courses.find(course => course.id === id) || null;
  }

  async searchCourses(query: string): Promise<Course[]> {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    if (!query.trim()) {
      return this.getAllCourses();
    }

    const filtered = this.courses.filter(course =>
      course.name.toLowerCase().includes(query.toLowerCase()) ||
      course.location.toLowerCase().includes(query.toLowerCase())
    );

    return filtered;
  }

  async getCoursesByDistance(maxDistance: number): Promise<Course[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.courses.filter(course => course.distance <= maxDistance);
  }

  async getCoursesByPriceRange(priceRange: string): Promise<Course[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (priceRange === 'All') return this.getAllCourses();
    return this.courses.filter(course => course.priceRange === priceRange);
  }

  async getCoursesByRating(minRating: number): Promise<Course[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.courses.filter(course => course.rating >= minRating);
  }
}

export const courseService = new CourseService();
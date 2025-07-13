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

class FilterService {
  private filters: SavedFilter[] = [];

  async getSavedFilters(): Promise<SavedFilter[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.filters];
  }

  async getFilter(id: string): Promise<SavedFilter | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.filters.find(filter => filter.id === id) || null;
  }

  async saveFilter(filterData: Omit<SavedFilter, 'id' | 'createdAt'>): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newFilter: SavedFilter = {
      ...filterData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    this.filters.push(newFilter);
    return newFilter.id;
  }

  async updateFilter(id: string, updates: Partial<SavedFilter>): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.filters.findIndex(filter => filter.id === id);
    if (index === -1) return false;
    
    this.filters[index] = { ...this.filters[index], ...updates };
    return true;
  }

  async deleteFilter(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.filters.findIndex(filter => filter.id === id);
    if (index === -1) return false;
    
    this.filters.splice(index, 1);
    return true;
  }

  // Get filters matching specific criteria
  async getFiltersByUser(userId: string): Promise<SavedFilter[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    // In a real app, this would filter by userId
    return this.getSavedFilters();
  }

  // Check if filter has any matches
  async hasMatches(filterId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100));
    // Mock implementation - in real app would check against course availability
    return Math.random() > 0.3;
  }
}

export const filterService = new FilterService();
export type { SavedFilter };
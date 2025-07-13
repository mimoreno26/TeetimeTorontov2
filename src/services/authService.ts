export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

class AuthService {
  private currentUser: User | null = null;

  constructor() {
    // Load user from localStorage on initialization
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  async login(email: string, password: string): Promise<boolean> {
    // Mock login - in real app, this would call an API
    const user: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      phone: undefined
    };
    
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    return true;
  }

  async signup(
    name: string,
    email: string, 
    password: string, 
    phone?: string, 
    notificationPrefs?: { sms: boolean; email: boolean }
  ): Promise<boolean> {
    // Mock signup - in real app, this would call an API
    const user: User = {
      id: Date.now().toString(),
      email,
      name,
      phone: phone || undefined
    };
    
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    return true;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  canEnableSMS(): boolean {
    return this.currentUser?.phone !== undefined && this.currentUser?.phone !== '';
  }

  async updatePhoneNumber(phone: string): Promise<void> {
    if (this.currentUser) {
      this.currentUser.phone = phone;
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    if (!this.currentUser) {
      throw new Error('No user logged in');
    }

    this.currentUser = { ...this.currentUser, ...updates };
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    return this.currentUser;
  }
}

export const authService = new AuthService();
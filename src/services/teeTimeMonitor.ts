import { filterService } from './filterService';
import { notificationService } from './notificationService';

interface TeeTimeSlot {
  courseId: string;
  courseName: string;
  date: string;
  time: string;
  price?: string;
  availableSpots: number;
}

interface MonitoringJob {
  id: string;
  userId: string;
  filterId: string;
  isActive: boolean;
  lastChecked: Date;
  nextCheck: Date;
}

class TeeTimeMonitor {
  private checkInterval = 2.5 * 60 * 1000; // 2.5 minutes
  private activeJobs = new Map<string, ReturnType<typeof setTimeout>>();
  private isRunning = false;

  // Start monitoring for all active filters
  async startMonitoring(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🔍 Starting tee time monitoring...');
    
    // Get all active monitoring jobs
    const jobs = await this.getActiveMonitoringJobs();
    
    for (const job of jobs) {
      this.scheduleFilterCheck(job);
    }
  }

  // Stop all monitoring
  stopMonitoring(): void {
    this.isRunning = false;
    
    // Clear all scheduled jobs
    for (const [, timeout] of this.activeJobs) {
      clearTimeout(timeout);
    }
    this.activeJobs.clear();
    
    console.log('⏹️ Stopped tee time monitoring');
  }

  // Add a new filter to monitoring
  async addFilterToMonitoring(userId: string, filterId: string): Promise<void> {
    const job: MonitoringJob = {
      id: `${userId}-${filterId}`,
      userId,
      filterId,
      isActive: true,
      lastChecked: new Date(),
      nextCheck: new Date(Date.now() + this.checkInterval)
    };

    await this.saveMonitoringJob(job);
    
    if (this.isRunning) {
      this.scheduleFilterCheck(job);
    }
  }

  // Remove filter from monitoring
  async removeFilterFromMonitoring(userId: string, filterId: string): Promise<void> {
    const jobId = `${userId}-${filterId}`;
    
    // Clear scheduled job
    const timeout = this.activeJobs.get(jobId);
    if (timeout) {
      clearTimeout(timeout);
      this.activeJobs.delete(jobId);
    }

    // Remove from database
    await this.deactivateMonitoringJob(jobId);
  }

  // Schedule a check for a specific filter
  private scheduleFilterCheck(job: MonitoringJob): void {
    const delay = Math.max(0, job.nextCheck.getTime() - Date.now());
    
    const timeout = setTimeout(async () => {
      await this.checkFilterForMatches(job);
      
      // Schedule next check
      if (this.isRunning && job.isActive) {
        job.nextCheck = new Date(Date.now() + this.checkInterval);
        await this.updateMonitoringJob(job);
        this.scheduleFilterCheck(job);
      }
    }, delay);

    this.activeJobs.set(job.id, timeout);
  }

  // Check a specific filter for matching tee times
  private async checkFilterForMatches(job: MonitoringJob): Promise<void> {
    try {
      console.log(`🔍 Checking filter ${job.filterId} for user ${job.userId}`);
      
      // Get the filter details
      const filter = await filterService.getFilter(job.filterId);
      if (!filter) {
        console.log(`Filter ${job.filterId} not found, deactivating job`);
        await this.deactivateMonitoringJob(job.id);
        return;
      }

      // Get available tee times (mock for now)
      const availableTimes = await this.getAvailableTeeTimesFromAPI();
      
      // Check each available time against the filter
      for (const teeTime of availableTimes) {
        if (await this.matchesFilter(teeTime, filter)) {
          // Get user notification preferences
          const preferences = await this.getUserNotificationPreferences(job.userId);
          
          if (preferences) {
            const success = await notificationService.sendTeeTimeAlert(
              job.userId,
              job.filterId,
              {
                id: teeTime.courseId,
                name: teeTime.courseName,
                timeSlot: teeTime.time,
                date: teeTime.date,
                price: teeTime.price
              },
              preferences
            );

            if (success) {
              console.log(`✅ Sent notification for ${teeTime.courseName} at ${teeTime.time}`);
            }
          }
        }
      }

      // Update last checked time
      job.lastChecked = new Date();
      await this.updateMonitoringJob(job);

    } catch (error) {
      console.error(`Error checking filter ${job.filterId}:`, error);
    }
  }

  // Mock function to get available tee times from Golf Now API
  private async getAvailableTeeTimesFromAPI(): Promise<TeeTimeSlot[]> {
    // TODO: Replace with actual Golf Now API integration
    
    // For now, simulate some available times
    const mockTimes: TeeTimeSlot[] = [
      {
        courseId: '1',
        courseName: 'Glen Abbey Golf Club',
        date: new Date().toISOString().split('T')[0],
        time: '10:30 AM',
        price: '$120',
        availableSpots: 2
      },
      {
        courseId: '3',
        courseName: 'Don Valley Golf Course',
        date: new Date().toISOString().split('T')[0],
        time: '2:15 PM',
        price: '$85',
        availableSpots: 4
      }
    ];

    // Randomly return some times to simulate API changes
    return Math.random() > 0.7 ? mockTimes : [];
  }

  // Check if a tee time matches the filter criteria
  private async matchesFilter(teeTime: TeeTimeSlot, filter: any): Promise<boolean> {
    // Check specific courses if selected
    if (filter.selectedCourses.length > 0 && !filter.selectedCourses.includes(teeTime.courseId)) {
      return false;
    }

    // Check time of day
    if (filter.timeOfDay !== 'Anytime') {
      const hour = parseInt(teeTime.time.split(':')[0]);
      const isPM = teeTime.time.includes('PM');
      const hour24 = isPM && hour !== 12 ? hour + 12 : hour;

      switch (filter.timeOfDay) {
        case 'Morning':
          if (hour24 >= 12) return false;
          break;
        case 'Afternoon':
          if (hour24 < 12 || hour24 >= 17) return false;
          break;
        case 'Evening':
          if (hour24 < 17) return false;
          break;
      }
    }

    // Check day of week
    if (filter.daysOfWeek.length > 0) {
      const dayOfWeek = new Date(teeTime.date).toLocaleDateString('en-US', { weekday: 'short' });
      if (!filter.daysOfWeek.includes(dayOfWeek)) return false;
    }

    // Check number of golfers (available spots)
    if (teeTime.availableSpots < filter.golfers) return false;

    return true;
  }

  // Database operations (mock for now)
  private async getActiveMonitoringJobs(): Promise<MonitoringJob[]> {
    // TODO: Implement Supabase query
    return [];
  }

  private async saveMonitoringJob(_job: MonitoringJob): Promise<void> {
    // TODO: Implement Supabase insert
  }

  private async updateMonitoringJob(_job: MonitoringJob): Promise<void> {
    // TODO: Implement Supabase update
  }

  private async deactivateMonitoringJob(_jobId: string): Promise<void> {
    // TODO: Implement Supabase update to set isActive = false
  }

  private async getUserNotificationPreferences(_userId: string): Promise<any> {
    // TODO: Implement Supabase query
    return {
      sms: true,
      email: true,
      phone: '+1234567890',
      email_address: 'user@example.com'
    };
  }
}

export const teeTimeMonitor = new TeeTimeMonitor();
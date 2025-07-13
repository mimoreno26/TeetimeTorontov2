interface NotificationPreferences {
  sms: boolean;
  email: boolean;
  phone?: string;
  email_address?: string;
}

interface NotificationHistory {
  id: string;
  userId: string;
  filterId: string;
  courseId: string;
  timeSlot: string;
  sentAt: Date;
  type: 'sms' | 'email' | 'push';
  status: 'sent' | 'delivered' | 'failed';
}

interface UserActivity {
  userId: string;
  lastAppOpen: Date;
  lastFilterCheck: Date;
  notificationCount: number;
  cooldownUntil?: Date;
}

class NotificationService {
  private maxNotificationsPerCooldown = 3;
  private cooldownPeriod = 4 * 60 * 60 * 1000; // 4 hours
  private followUpDelay = 30 * 60 * 1000; // 30 minutes
  private maxFollowUps = 2;

  // Track user activity for smart notifications
  async trackUserActivity(userId: string, activity: 'app_open' | 'filter_check') {
    const now = new Date();
    
    // Get current activity record
    const currentActivity = await this.getUserActivity(userId);
    
    const updatedActivity: UserActivity = {
      userId,
      lastAppOpen: activity === 'app_open' ? now : (currentActivity?.lastAppOpen || now),
      lastFilterCheck: activity === 'filter_check' ? now : (currentActivity?.lastFilterCheck || now),
      notificationCount: currentActivity?.notificationCount || 0,
      cooldownUntil: currentActivity?.cooldownUntil
    };

    // Reset notification count if user checked after being notified
    if (activity === 'filter_check' && this.shouldResetCooldown(currentActivity, now)) {
      updatedActivity.notificationCount = 0;
      updatedActivity.cooldownUntil = undefined;
    }

    await this.saveUserActivity(updatedActivity);
    return updatedActivity;
  }

  private shouldResetCooldown(activity: UserActivity | null, now: Date): boolean {
    if (!activity || !activity.cooldownUntil) return false;
    
    // Reset if user checked filters after being notified
    const lastNotificationTime = new Date(activity.cooldownUntil.getTime() - this.cooldownPeriod);
    return activity.lastFilterCheck > lastNotificationTime;
  }

  // Check if user can receive notifications
  async canSendNotification(userId: string, filterId: string): Promise<{
    canSend: boolean;
    reason?: string;
    nextAvailableTime?: Date;
  }> {
    const activity = await this.getUserActivity(userId);
    const now = new Date();

    // Check if user is in cooldown
    if (activity?.cooldownUntil && now < activity.cooldownUntil) {
      return {
        canSend: false,
        reason: 'User in notification cooldown',
        nextAvailableTime: activity.cooldownUntil
      };
    }

    // Check notification count
    if (activity?.notificationCount >= this.maxNotificationsPerCooldown) {
      const cooldownUntil = new Date(now.getTime() + this.cooldownPeriod);
      await this.setCooldown(userId, cooldownUntil);
      
      return {
        canSend: false,
        reason: 'Max notifications reached',
        nextAvailableTime: cooldownUntil
      };
    }

    // Check for duplicate recent notifications
    const recentNotifications = await this.getRecentNotifications(userId, filterId, 10 * 60 * 1000); // 10 minutes
    if (recentNotifications.length > 0) {
      return {
        canSend: false,
        reason: 'Recent notification already sent for this filter'
      };
    }

    return { canSend: true };
  }

  // Send notification with smart logic
  async sendTeeTimeAlert(
    userId: string,
    filterId: string,
    courseDetails: {
      id: string;
      name: string;
      timeSlot: string;
      date: string;
      price?: string;
    },
    preferences: NotificationPreferences
  ): Promise<boolean> {
    // Check if we can send
    const canSend = await this.canSendNotification(userId, filterId);
    if (!canSend.canSend) {
      console.log(`Cannot send notification: ${canSend.reason}`);
      return false;
    }

    const message = this.formatAlertMessage(courseDetails);
    let success = false;

    try {
      // Send SMS if enabled
      if (preferences.sms && preferences.phone) {
        await this.sendSMS(preferences.phone, message);
        await this.logNotification(userId, filterId, courseDetails.id, courseDetails.timeSlot, 'sms', 'sent');
        success = true;
      }

      // Send Email if enabled
      if (preferences.email && preferences.email_address) {
        await this.sendEmail(preferences.email_address, 'Tee Time Available!', message);
        await this.logNotification(userId, filterId, courseDetails.id, courseDetails.timeSlot, 'email', 'sent');
        success = true;
      }

      if (success) {
        // Increment notification count
        await this.incrementNotificationCount(userId);
        
        // Schedule follow-up check
        this.scheduleFollowUp(userId, filterId, courseDetails);
      }

      return success;
    } catch (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
  }

  // Schedule follow-up notifications
  private scheduleFollowUp(userId: string, filterId: string, courseDetails: any) {
    setTimeout(async () => {
      const activity = await this.getUserActivity(userId);
      const now = new Date();
      
      // Check if user has been back to the app
      if (activity?.lastAppOpen && activity.lastAppOpen > new Date(now.getTime() - this.followUpDelay)) {
        console.log('User has been active, skipping follow-up');
        return;
      }

      // Check if we can send follow-up
      const canSend = await this.canSendNotification(userId, filterId);
      if (canSend.canSend && activity && activity.notificationCount < this.maxNotificationsPerCooldown) {
        // Send follow-up with different message
        const followUpMessage = `🏌️ Still available: ${courseDetails.name} at ${courseDetails.timeSlot}. More courses may be available - check the app!`;
        
        const preferences = await this.getUserNotificationPreferences(userId);
        if (preferences) {
          await this.sendTeeTimeAlert(userId, filterId, {
            ...courseDetails,
            name: `${courseDetails.name} (Still Available)`
          }, preferences);
        }
      }
    }, this.followUpDelay);
  }

  private formatAlertMessage(courseDetails: any): string {
    return `🏌️ Tee Time Alert!\n\n${courseDetails.name}\n📅 ${courseDetails.date}\n⏰ ${courseDetails.timeSlot}\n${courseDetails.price ? `💰 ${courseDetails.price}\n` : ''}\nBook now before it's gone!`;
  }

  private async sendSMS(phone: string, message: string): Promise<void> {
    // Implement Twilio SMS sending
    console.log(`SMS to ${phone}: ${message}`);
    // TODO: Implement actual Twilio integration
  }

  private async sendEmail(email: string, subject: string, message: string): Promise<void> {
    // Implement email sending
    console.log(`Email to ${email}: ${subject} - ${message}`);
    // TODO: Implement actual email service integration
  }

  // Database operations (mock for now, will use Supabase)
  private async getUserActivity(userId: string): Promise<UserActivity | null> {
    // TODO: Implement Supabase query
    return null;
  }

  private async saveUserActivity(activity: UserActivity): Promise<void> {
    // TODO: Implement Supabase insert/update
  }

  private async setCooldown(userId: string, cooldownUntil: Date): Promise<void> {
    // TODO: Implement Supabase update
  }

  private async incrementNotificationCount(userId: string): Promise<void> {
    // TODO: Implement Supabase increment
  }

  private async getRecentNotifications(userId: string, filterId: string, timeWindow: number): Promise<NotificationHistory[]> {
    // TODO: Implement Supabase query for recent notifications
    return [];
  }

  private async logNotification(
    userId: string,
    filterId: string,
    courseId: string,
    timeSlot: string,
    type: 'sms' | 'email' | 'push',
    status: 'sent' | 'delivered' | 'failed'
  ): Promise<void> {
    // TODO: Implement Supabase insert
  }

  private async getUserNotificationPreferences(userId: string): Promise<NotificationPreferences | null> {
    // TODO: Implement Supabase query
    return null;
  }
}

export const notificationService = new NotificationService();
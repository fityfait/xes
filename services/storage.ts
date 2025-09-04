import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TestResult {
  id: string;
  testType: string;
  score: number;
  benchmark: string;
  date: string;
  videoPath?: string;
  submitted: boolean;
}

export interface UserProfile {
  name: string;
  age: number;
  gender: string;
  region: string;
  joinDate: string;
}

export class StorageService {
  private static readonly KEYS = {
    USER_PROFILE: 'user_profile',
    TEST_RESULTS: 'test_results',
    BADGES: 'badges',
    PENDING_SUBMISSIONS: 'pending_submissions',
  };

  // User Profile Management
  static async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(this.KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  }

  static async getUserProfile(): Promise<UserProfile | null> {
    try {
      const profile = await AsyncStorage.getItem(this.KEYS.USER_PROFILE);
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // Test Results Management
  static async saveTestResult(result: TestResult): Promise<void> {
    try {
      const existingResults = await this.getTestResults();
      const updatedResults = [...existingResults, result];
      await AsyncStorage.setItem(this.KEYS.TEST_RESULTS, JSON.stringify(updatedResults));
    } catch (error) {
      console.error('Error saving test result:', error);
      throw error;
    }
  }

  static async getTestResults(): Promise<TestResult[]> {
    try {
      const results = await AsyncStorage.getItem(this.KEYS.TEST_RESULTS);
      return results ? JSON.parse(results) : [];
    } catch (error) {
      console.error('Error getting test results:', error);
      return [];
    }
  }

  static async getTestResultsByType(testType: string): Promise<TestResult[]> {
    try {
      const allResults = await this.getTestResults();
      return allResults.filter(result => result.testType === testType);
    } catch (error) {
      console.error('Error getting test results by type:', error);
      return [];
    }
  }

  // Badge Management
  static async saveBadge(badgeId: string, badgeName: string): Promise<void> {
    try {
      const existingBadges = await this.getBadges();
      const badge = {
        id: badgeId,
        name: badgeName,
        earnedDate: new Date().toISOString(),
      };
      const updatedBadges = [...existingBadges, badge];
      await AsyncStorage.setItem(this.KEYS.BADGES, JSON.stringify(updatedBadges));
    } catch (error) {
      console.error('Error saving badge:', error);
      throw error;
    }
  }

  static async getBadges(): Promise<any[]> {
    try {
      const badges = await AsyncStorage.getItem(this.KEYS.BADGES);
      return badges ? JSON.parse(badges) : [];
    } catch (error) {
      console.error('Error getting badges:', error);
      return [];
    }
  }

  // Pending Submissions (for offline support)
  static async addPendingSubmission(submission: any): Promise<void> {
    try {
      const existingSubmissions = await this.getPendingSubmissions();
      const updatedSubmissions = [...existingSubmissions, submission];
      await AsyncStorage.setItem(this.KEYS.PENDING_SUBMISSIONS, JSON.stringify(updatedSubmissions));
    } catch (error) {
      console.error('Error adding pending submission:', error);
      throw error;
    }
  }

  static async getPendingSubmissions(): Promise<any[]> {
    try {
      const submissions = await AsyncStorage.getItem(this.KEYS.PENDING_SUBMISSIONS);
      return submissions ? JSON.parse(submissions) : [];
    } catch (error) {
      console.error('Error getting pending submissions:', error);
      return [];
    }
  }

  static async removePendingSubmission(submissionId: string): Promise<void> {
    try {
      const existingSubmissions = await this.getPendingSubmissions();
      const updatedSubmissions = existingSubmissions.filter(
        (submission: any) => submission.id !== submissionId
      );
      await AsyncStorage.setItem(this.KEYS.PENDING_SUBMISSIONS, JSON.stringify(updatedSubmissions));
    } catch (error) {
      console.error('Error removing pending submission:', error);
      throw error;
    }
  }

  // Clear all data (for logout)
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(this.KEYS));
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }
}
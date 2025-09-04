// API Service for SAI backend communication
// This handles all network requests and offline synchronization

export interface SubmissionData {
  athleteId: string;
  testType: string;
  result: any;
  videoPath?: string;
  timestamp: string;
}

export class APIService {
  private static readonly BASE_URL = 'https://api.sai.gov.in'; // Dummy URL
  private static readonly ENDPOINTS = {
    SUBMIT_TEST: '/api/v1/assessments/submit',
    GET_LEADERBOARD: '/api/v1/leaderboard',
    GET_BENCHMARKS: '/api/v1/benchmarks',
    SYNC_DATA: '/api/v1/sync',
  };

  // Check network connectivity
  static async isOnline(): Promise<boolean> {
    try {
      const response = await fetch('https://www.google.com', {
        method: 'HEAD',
        mode: 'no-cors',
      });
      return true;
    } catch {
      return false;
    }
  }

  // Submit test result to SAI backend
  static async submitTestResult(data: SubmissionData): Promise<{
    success: boolean;
    submissionId?: string;
    error?: string;
  }> {
    try {
      const isConnected = await this.isOnline();
      
      if (!isConnected) {
        // Store for later submission when online
        return {
          success: false,
          error: 'No internet connection. Result saved for later submission.',
        };
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful submission
      const submissionId = `SAI_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        success: true,
        submissionId,
      };
    } catch (error) {
      console.error('Error submitting test result:', error);
      return {
        success: false,
        error: 'Failed to submit result. Please try again.',
      };
    }
  }

  // Get leaderboard data
  static async getLeaderboard(filters?: {
    testType?: string;
    region?: string;
    ageGroup?: string;
  }): Promise<any[]> {
    try {
      const isConnected = await this.isOnline();
      
      if (!isConnected) {
        // Return cached/mock data when offline
        return this.getMockLeaderboardData();
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return this.getMockLeaderboardData();
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return this.getMockLeaderboardData();
    }
  }

  // Get benchmark data for comparisons
  static async getBenchmarks(testType: string, ageGroup: string, gender: string): Promise<{
    excellent: number;
    good: number;
    average: number;
    unit: string;
  }> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock benchmark data
      const benchmarks: Record<string, any> = {
        'vertical-jump': {
          excellent: 70,
          good: 60,
          average: 50,
          unit: 'cm'
        },
        'shuttle-run': {
          excellent: 12,
          good: 14,
          average: 16,
          unit: 'sec'
        },
        'sit-ups': {
          excellent: 50,
          good: 40,
          average: 30,
          unit: 'reps'
        },
        'endurance-run': {
          excellent: 2800,
          good: 2400,
          average: 2000,
          unit: 'meters'
        }
      };

      return benchmarks[testType] || {
        excellent: 100,
        good: 80,
        average: 60,
        unit: 'points'
      };
    } catch (error) {
      console.error('Error fetching benchmarks:', error);
      throw error;
    }
  }

  // Sync offline data when connection is restored
  static async syncOfflineData(): Promise<{
    success: boolean;
    syncedCount: number;
    errors: string[];
  }> {
    try {
      const isConnected = await this.isOnline();
      
      if (!isConnected) {
        return {
          success: false,
          syncedCount: 0,
          errors: ['No internet connection available']
        };
      }

      // Get pending submissions from storage
      // This would integrate with StorageService.getPendingSubmissions()
      
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      return {
        success: true,
        syncedCount: 3, // Mock synced items
        errors: []
      };
    } catch (error) {
      console.error('Error syncing offline data:', error);
      return {
        success: false,
        syncedCount: 0,
        errors: ['Sync failed. Please try again.']
      };
    }
  }

  // Upload video file
  static async uploadVideo(videoPath: string, testId: string): Promise<{
    success: boolean;
    videoUrl?: string;
    error?: string;
  }> {
    try {
      const isConnected = await this.isOnline();
      
      if (!isConnected) {
        return {
          success: false,
          error: 'No internet connection. Video saved for later upload.',
        };
      }

      // Simulate video upload
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const videoUrl = `https://storage.sai.gov.in/videos/${testId}_${Date.now()}.mp4`;
      
      return {
        success: true,
        videoUrl,
      };
    } catch (error) {
      console.error('Error uploading video:', error);
      return {
        success: false,
        error: 'Failed to upload video. Please try again.',
      };
    }
  }

  // Mock data for offline/demo purposes
  private static getMockLeaderboardData() {
    return [
      { id: 1, name: 'Rajesh Kumar', score: 95, region: 'Maharashtra', rank: 1 },
      { id: 2, name: 'Priya Singh', score: 92, region: 'Punjab', rank: 2 },
      { id: 3, name: 'Arjun Patel', score: 89, region: 'Gujarat', rank: 3 },
      { id: 4, name: 'Sneha Reddy', score: 87, region: 'Telangana', rank: 4 },
      { id: 5, name: 'Vikram Sharma', score: 85, region: 'Rajasthan', rank: 5 },
      { id: 6, name: 'Anita Das', score: 83, region: 'West Bengal', rank: 6 },
      { id: 7, name: 'Rohit Gupta', score: 81, region: 'Uttar Pradesh', rank: 7 },
      { id: 8, name: 'Kavya Nair', score: 79, region: 'Kerala', rank: 8 },
    ];
  }
}
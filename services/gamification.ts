// Gamification Service - Handles badges, achievements, and progress tracking

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  criteria: {
    type: 'test_completion' | 'score_threshold' | 'consistency' | 'improvement';
    value: any;
  };
  earned: boolean;
  earnedDate?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  reward?: string;
}

export class GamificationService {
  private static readonly BADGES: Badge[] = [
    {
      id: 'first_test',
      name: 'First Steps',
      description: 'Complete your first assessment test',
      icon: 'target',
      color: '#10b981',
      criteria: { type: 'test_completion', value: 1 },
      earned: false,
    },
    {
      id: 'consistency_week',
      name: 'Consistent Performer',
      description: 'Complete 5 tests in one week',
      icon: 'calendar',
      color: '#3b82f6',
      criteria: { type: 'consistency', value: { tests: 5, days: 7 } },
      earned: false,
    },
    {
      id: 'top_performer',
      name: 'Top 10%',
      description: 'Achieve top 10% score in any test',
      icon: 'trophy',
      color: '#f97316',
      criteria: { type: 'score_threshold', value: 90 },
      earned: false,
    },
    {
      id: 'vertical_jump_master',
      name: 'Jump Master',
      description: 'Score excellent in vertical jump',
      icon: 'arrow-up',
      color: '#8b5cf6',
      criteria: { type: 'score_threshold', value: { test: 'vertical-jump', score: 70 } },
      earned: false,
    },
    {
      id: 'endurance_champion',
      name: 'Endurance Champion',
      description: 'Complete endurance run with excellent rating',
      icon: 'heart',
      color: '#ef4444',
      criteria: { type: 'score_threshold', value: { test: 'endurance-run', score: 2800 } },
      earned: false,
    },
    {
      id: 'speed_demon',
      name: 'Speed Demon',
      description: 'Fastest shuttle run in your region',
      icon: 'zap',
      color: '#fbbf24',
      criteria: { type: 'score_threshold', value: { test: 'shuttle-run', score: 12 } },
      earned: false,
    },
    {
      id: 'improvement_streak',
      name: 'Always Improving',
      description: 'Show improvement in 3 consecutive tests',
      icon: 'trending-up',
      color: '#06b6d4',
      criteria: { type: 'improvement', value: 3 },
      earned: false,
    },
    {
      id: 'all_rounder',
      name: 'All-Rounder',
      description: 'Complete all 5 assessment tests',
      icon: 'award',
      color: '#f59e0b',
      criteria: { type: 'test_completion', value: 5 },
      earned: false,
    },
  ];

  // Check if user earned any new badges based on test result
  static async checkBadgeEligibility(
    testType: string,
    score: number,
    benchmark: string,
    userHistory: any[]
  ): Promise<Badge[]> {
    const newBadges: Badge[] = [];

    for (const badge of this.BADGES) {
      if (badge.earned) continue;

      let earned = false;

      switch (badge.criteria.type) {
        case 'test_completion':
          if (badge.id === 'first_test' && userHistory.length === 1) {
            earned = true;
          } else if (badge.id === 'all_rounder') {
            const uniqueTests = new Set(userHistory.map(h => h.testType));
            earned = uniqueTests.size >= 5;
          }
          break;

        case 'score_threshold':
          if (typeof badge.criteria.value === 'number') {
            earned = score >= badge.criteria.value;
          } else if (badge.criteria.value.test === testType) {
            earned = score >= badge.criteria.value.score;
          }
          break;

        case 'consistency':
          if (badge.id === 'consistency_week') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const recentTests = userHistory.filter(
              h => new Date(h.date) >= weekAgo
            );
            earned = recentTests.length >= 5;
          }
          break;

        case 'improvement':
          if (badge.id === 'improvement_streak') {
            const sameTestHistory = userHistory
              .filter(h => h.testType === testType)
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 3);
            
            if (sameTestHistory.length >= 3) {
              earned = sameTestHistory.every((test, index) => {
                if (index === 0) return true;
                return test.score > sameTestHistory[index - 1].score;
              });
            }
          }
          break;
      }

      if (earned) {
        badge.earned = true;
        badge.earnedDate = new Date().toISOString();
        newBadges.push(badge);
      }
    }

    return newBadges;
  }

  // Get user's current badges
  static async getUserBadges(): Promise<Badge[]> {
    // In a real app, this would fetch from storage
    return this.BADGES.filter(badge => badge.earned);
  }

  // Get all available badges
  static getAllBadges(): Badge[] {
    return [...this.BADGES];
  }

  // Calculate user's overall progress
  static calculateProgress(userHistory: any[]): {
    level: number;
    xp: number;
    nextLevelXP: number;
    totalTests: number;
    averageScore: number;
  } {
    const totalTests = userHistory.length;
    const totalScore = userHistory.reduce((sum, test) => sum + test.score, 0);
    const averageScore = totalTests > 0 ? Math.round(totalScore / totalTests) : 0;
    
    // XP calculation: 10 XP per test + bonus for high scores
    let xp = totalTests * 10;
    userHistory.forEach(test => {
      if (test.score >= 90) xp += 20; // Excellent bonus
      else if (test.score >= 80) xp += 10; // Good bonus
    });

    // Level calculation: Every 100 XP = 1 level
    const level = Math.floor(xp / 100) + 1;
    const nextLevelXP = level * 100;

    return {
      level,
      xp,
      nextLevelXP,
      totalTests,
      averageScore,
    };
  }

  // Get motivational messages based on performance
  static getMotivationalMessage(score: number, benchmark: string): string {
    const messages = {
      excellent: [
        "Outstanding performance! You're setting the bar high! 🏆",
        "Incredible result! Keep pushing your limits! 💪",
        "Exceptional work! You're among the best! ⭐",
      ],
      good: [
        "Great job! You're making solid progress! 👏",
        "Well done! Keep up the good work! 🎯",
        "Nice performance! You're on the right track! 📈",
      ],
      average: [
        "Good effort! There's room for improvement! 💪",
        "Keep practicing! Every test makes you stronger! 🎯",
        "Nice try! Focus on technique for better results! 📚",
      ],
    };

    const category = benchmark.toLowerCase() as keyof typeof messages;
    const categoryMessages = messages[category] || messages.average;
    
    return categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
  }

  // Generate performance insights
  static generateInsights(userHistory: any[]): string[] {
    const insights: string[] = [];

    if (userHistory.length === 0) {
      return ['Complete your first test to get personalized insights!'];
    }

    // Consistency insight
    const lastWeekTests = userHistory.filter(test => {
      const testDate = new Date(test.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return testDate >= weekAgo;
    });

    if (lastWeekTests.length >= 3) {
      insights.push('🔥 You\'re on fire! Great consistency this week!');
    } else if (lastWeekTests.length === 0) {
      insights.push('📅 Try to test at least once this week to maintain progress');
    }

    // Improvement insight
    const recentTests = userHistory.slice(-3);
    if (recentTests.length >= 2) {
      const isImproving = recentTests[recentTests.length - 1].score > recentTests[0].score;
      if (isImproving) {
        insights.push('📈 Your scores are trending upward! Keep it up!');
      }
    }

    // Strength insight
    const testsByType = userHistory.reduce((acc, test) => {
      acc[test.testType] = acc[test.testType] || [];
      acc[test.testType].push(test);
      return acc;
    }, {} as Record<string, any[]>);

    let bestTest = '';
    let bestAverage = 0;
    
    Object.entries(testsByType).forEach(([testType, tests]) => {
      const average = tests.reduce((sum, test) => sum + test.score, 0) / tests.length;
      if (average > bestAverage) {
        bestAverage = average;
        bestTest = testType;
      }
    });

    if (bestTest) {
      const testNames: Record<string, string> = {
        'vertical-jump': 'Vertical Jump',
        'shuttle-run': 'Shuttle Run',
        'sit-ups': 'Sit-Ups',
        'endurance-run': 'Endurance Run',
        'height-weight': 'Height & Weight',
      };
      insights.push(`💪 ${testNames[bestTest]} is your strongest area!`);
    }

    return insights.length > 0 ? insights : ['Keep testing to unlock personalized insights!'];
  }
}
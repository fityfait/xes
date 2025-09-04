import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { 
  Play, 
  Trophy, 
  User, 
  TrendingUp, 
  Bell,
  Award,
  Target,
  Activity
} from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const [recentTests, setRecentTests] = useState([
    { id: 1, test: 'Vertical Jump', score: 65, date: '2025-01-15', benchmark: 'Above Average' },
    { id: 2, test: 'Shuttle Run', score: 12.5, date: '2025-01-14', benchmark: 'Excellent' },
    { id: 3, test: 'Sit-Ups', score: 45, date: '2025-01-13', benchmark: 'Good' },
  ]);

  const chartData = {
    labels: ['Jan 10', 'Jan 11', 'Jan 12', 'Jan 13', 'Jan 14', 'Jan 15'],
    datasets: [
      {
        data: [60, 62, 58, 65, 63, 67],
        color: (opacity = 1) => `rgba(249, 115, 22, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back!</Text>
            <Text style={styles.userName}>Athlete</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color="#ffffff" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Award size={20} color="#f97316" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Tests Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Trophy size={20} color="#10b981" />
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Badges Earned</Text>
          </View>
          <View style={styles.statCard}>
            <TrendingUp size={20} color="#3b82f6" />
            <Text style={styles.statNumber}>85%</Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
        </View>

        {/* Start Test Button */}
        <TouchableOpacity
          style={styles.startTestButton}
          onPress={() => router.push('/tests')}
        >
          <LinearGradient
            colors={['#f97316', '#ea580c']}
            style={styles.startTestGradient}
          >
            <Play size={32} color="#ffffff" />
            <Text style={styles.startTestText}>Start New Test</Text>
            <Text style={styles.startTestSubtext}>Record your performance</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Performance Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Performance Trend</Text>
          <View style={styles.chartWrapper}>
            <LineChart
              data={chartData}
              width={width - 48}
              height={200}
              chartConfig={{
                backgroundColor: 'transparent',
                backgroundGradientFrom: 'rgba(255, 255, 255, 0.05)',
                backgroundGradientTo: 'rgba(255, 255, 255, 0.05)',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#f97316',
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>
        </View>

        {/* Recent Tests */}
        <View style={styles.recentTestsContainer}>
          <Text style={styles.sectionTitle}>Recent Tests</Text>
          {recentTests.map((test) => (
            <View key={test.id} style={styles.testCard}>
              <View style={styles.testIcon}>
                <Activity size={20} color="#f97316" />
              </View>
              <View style={styles.testInfo}>
                <Text style={styles.testName}>{test.test}</Text>
                <Text style={styles.testDate}>{test.date}</Text>
              </View>
              <View style={styles.testResult}>
                <Text style={styles.testScore}>{test.score}</Text>
                <Text style={[
                  styles.testBenchmark,
                  { color: test.benchmark === 'Excellent' ? '#10b981' : 
                           test.benchmark === 'Good' ? '#3b82f6' : '#f97316' }
                ]}>
                  {test.benchmark}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/leaderboard')}
          >
            <Trophy size={24} color="#f97316" />
            <Text style={styles.actionText}>Leaderboard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/profile')}
          >
            <User size={24} color="#f97316" />
            <Text style={styles.actionText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#9ca3af',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 4,
  },
  startTestButton: {
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  startTestGradient: {
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  startTestText: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
    marginTop: 8,
  },
  startTestSubtext: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  chartContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginBottom: 16,
  },
  chartWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  chart: {
    borderRadius: 16,
  },
  recentTestsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  testCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  testIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  testInfo: {
    flex: 1,
  },
  testName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  testDate: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9ca3af',
    marginTop: 2,
  },
  testResult: {
    alignItems: 'flex-end',
  },
  testScore: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
  },
  testBenchmark: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginTop: 8,
  },
});
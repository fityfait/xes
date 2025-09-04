import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { User, CreditCard as Edit, Award, LogOut, Settings, Trophy, Target, Calendar, MapPin } from 'lucide-react-native';

const badges = [
  { id: 1, name: 'First Test', description: 'Completed your first assessment', earned: true, color: '#10b981' },
  { id: 2, name: 'Consistency', description: '5 tests in a week', earned: true, color: '#3b82f6' },
  { id: 3, name: 'Top Performer', description: 'Top 10% in region', earned: true, color: '#f97316' },
  { id: 4, name: 'Endurance Master', description: 'Excellent in endurance run', earned: false, color: '#ef4444' },
  { id: 5, name: 'Speed Demon', description: 'Fastest shuttle run time', earned: false, color: '#8b5cf6' },
  { id: 6, name: 'Power House', description: 'Highest vertical jump', earned: false, color: '#fbbf24' },
];

export default function ProfileScreen() {
  const [userStats] = useState({
    name: 'Athlete Demo',
    age: 18,
    gender: 'Male',
    region: 'Maharashtra',
    joinDate: 'January 2025',
    testsCompleted: 12,
    badgesEarned: 3,
    currentRank: 45,
  });

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => router.replace('/') 
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#f97316', '#ea580c']}
              style={styles.avatar}
            >
              <User size={40} color="#ffffff" />
            </LinearGradient>
          </View>
          <Text style={styles.userName}>{userStats.name}</Text>
          <Text style={styles.userDetails}>
            {userStats.age} years • {userStats.gender} • {userStats.region}
          </Text>
          
          <TouchableOpacity style={styles.editButton}>
            <Edit size={16} color="#f97316" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Target size={24} color="#3b82f6" />
            <Text style={styles.statNumber}>{userStats.testsCompleted}</Text>
            <Text style={styles.statLabel}>Tests Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Award size={24} color="#10b981" />
            <Text style={styles.statNumber}>{userStats.badgesEarned}</Text>
            <Text style={styles.statLabel}>Badges Earned</Text>
          </View>
          <View style={styles.statItem}>
            <Trophy size={24} color="#fbbf24" />
            <Text style={styles.statNumber}>#{userStats.currentRank}</Text>
            <Text style={styles.statLabel}>Current Rank</Text>
          </View>
          <View style={styles.statItem}>
            <Calendar size={24} color="#8b5cf6" />
            <Text style={styles.statNumber}>{userStats.joinDate}</Text>
            <Text style={styles.statLabel}>Member Since</Text>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsContainer}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.badgesGrid}>
            {badges.map((badge) => (
              <View
                key={badge.id}
                style={[
                  styles.badgeCard,
                  !badge.earned && styles.badgeCardLocked,
                ]}
              >
                <View
                  style={[
                    styles.badgeIcon,
                    { backgroundColor: badge.earned ? `${badge.color}20` : 'rgba(107, 114, 128, 0.2)' },
                  ]}
                >
                  <Award
                    size={24}
                    color={badge.earned ? badge.color : '#6b7280'}
                  />
                </View>
                <Text
                  style={[
                    styles.badgeName,
                    !badge.earned && styles.badgeNameLocked,
                  ]}
                >
                  {badge.name}
                </Text>
                <Text
                  style={[
                    styles.badgeDescription,
                    !badge.earned && styles.badgeDescriptionLocked,
                  ]}
                >
                  {badge.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Trophy size={20} color="#f97316" />
            <Text style={styles.actionButtonText}>View Achievements</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Target size={20} color="#f97316" />
            <Text style={styles.actionButtonText}>Test History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <LogOut size={20} color="#ef4444" />
            <Text style={[styles.actionButtonText, styles.logoutButtonText]}>
              Logout
            </Text>
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
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
  },
  settingsButton: {
    padding: 8,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  userDetails: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#9ca3af',
    marginBottom: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f97316',
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#f97316',
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9ca3af',
    textAlign: 'center',
  },
  achievementsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginBottom: 16,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  badgeCardLocked: {
    opacity: 0.5,
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeName: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeNameLocked: {
    color: '#6b7280',
  },
  badgeDescription: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 14,
  },
  badgeDescriptionLocked: {
    color: '#6b7280',
  },
  actionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginLeft: 12,
  },
  logoutButton: {
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  logoutButtonText: {
    color: '#ef4444',
  },
});
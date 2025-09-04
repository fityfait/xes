import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Medal, Award, Filter } from 'lucide-react-native';

const leaderboardData = [
  { id: 1, name: 'Rajesh Kumar', score: 95, region: 'Maharashtra', rank: 1, badge: 'gold' },
  { id: 2, name: 'Priya Singh', score: 92, region: 'Punjab', rank: 2, badge: 'silver' },
  { id: 3, name: 'Arjun Patel', score: 89, region: 'Gujarat', rank: 3, badge: 'bronze' },
  { id: 4, name: 'Sneha Reddy', score: 87, region: 'Telangana', rank: 4, badge: null },
  { id: 5, name: 'Vikram Sharma', score: 85, region: 'Rajasthan', rank: 5, badge: null },
  { id: 6, name: 'Anita Das', score: 83, region: 'West Bengal', rank: 6, badge: null },
  { id: 7, name: 'Rohit Gupta', score: 81, region: 'Uttar Pradesh', rank: 7, badge: null },
  { id: 8, name: 'Kavya Nair', score: 79, region: 'Kerala', rank: 8, badge: null },
];

const filters = ['All Tests', 'Vertical Jump', 'Shuttle Run', 'Sit-Ups', 'Endurance'];

export default function LeaderboardScreen() {
  const [selectedFilter, setSelectedFilter] = useState('All Tests');

  const getBadgeIcon = (badge: string | null, rank: number) => {
    if (badge === 'gold') return <Trophy size={20} color="#fbbf24" />;
    if (badge === 'silver') return <Medal size={20} color="#d1d5db" />;
    if (badge === 'bronze') return <Award size={20} color="#f59e0b" />;
    return <Text style={styles.rankNumber}>#{rank}</Text>;
  };

  const renderLeaderboardItem = ({ item }: { item: typeof leaderboardData[0] }) => (
    <View style={styles.leaderboardItem}>
      <View style={styles.rankContainer}>
        {getBadgeIcon(item.badge, item.rank)}
      </View>
      <View style={styles.athleteInfo}>
        <Text style={styles.athleteName}>{item.name}</Text>
        <Text style={styles.athleteRegion}>{item.region}</Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text style={styles.score}>{item.score}</Text>
        <Text style={styles.scoreLabel}>pts</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>Top performers across India</Text>
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Top 3 Podium */}
      <View style={styles.podiumContainer}>
        <View style={styles.podium}>
          {/* Second Place */}
          <View style={styles.podiumPosition}>
            <View style={[styles.podiumBar, styles.secondPlace]}>
              <Medal size={24} color="#d1d5db" />
            </View>
            <Text style={styles.podiumName}>Priya S.</Text>
            <Text style={styles.podiumScore}>92</Text>
          </View>

          {/* First Place */}
          <View style={styles.podiumPosition}>
            <View style={[styles.podiumBar, styles.firstPlace]}>
              <Trophy size={28} color="#fbbf24" />
            </View>
            <Text style={styles.podiumName}>Rajesh K.</Text>
            <Text style={styles.podiumScore}>95</Text>
          </View>

          {/* Third Place */}
          <View style={styles.podiumPosition}>
            <View style={[styles.podiumBar, styles.thirdPlace]}>
              <Award size={24} color="#f59e0b" />
            </View>
            <Text style={styles.podiumName}>Arjun P.</Text>
            <Text style={styles.podiumScore}>89</Text>
          </View>
        </View>
      </View>

      {/* Full Leaderboard */}
      <View style={styles.leaderboardContainer}>
        <Text style={styles.sectionTitle}>Full Rankings</Text>
        <FlatList
          data={leaderboardData}
          renderItem={renderLeaderboardItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          style={styles.leaderboardList}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#9ca3af',
  },
  filtersContainer: {
    marginBottom: 24,
  },
  filtersContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterButtonActive: {
    backgroundColor: '#f97316',
    borderColor: '#f97316',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#9ca3af',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  podiumContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 160,
  },
  podiumPosition: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  podiumBar: {
    width: 80,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  firstPlace: {
    height: 120,
    backgroundColor: '#fbbf24',
  },
  secondPlace: {
    height: 100,
    backgroundColor: '#d1d5db',
  },
  thirdPlace: {
    height: 80,
    backgroundColor: '#f59e0b',
  },
  podiumName: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  podiumScore: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#f97316',
  },
  leaderboardContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginBottom: 16,
  },
  leaderboardList: {
    flex: 1,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rankNumber: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#f97316',
  },
  athleteInfo: {
    flex: 1,
  },
  athleteName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  athleteRegion: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9ca3af',
    marginTop: 2,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  score: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
  },
  scoreLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9ca3af',
  },
});
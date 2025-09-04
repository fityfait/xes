import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { 
  ArrowUp, 
  Timer, 
  Activity, 
  Heart, 
  Scale,
  ChevronRight 
} from 'lucide-react-native';

const tests = [
  {
    id: 'height-weight',
    name: 'Height & Weight',
    description: 'Basic anthropometric measurements',
    icon: Scale,
    color: '#3b82f6',
    duration: '2 min',
  },
  {
    id: 'vertical-jump',
    name: 'Vertical Jump',
    description: 'Explosive power assessment',
    icon: ArrowUp,
    color: '#f97316',
    duration: '3 min',
  },
  {
    id: 'shuttle-run',
    name: 'Shuttle Run',
    description: 'Agility and speed test',
    icon: Timer,
    color: '#10b981',
    duration: '5 min',
  },
  {
    id: 'sit-ups',
    name: 'Sit-Ups',
    description: 'Core strength endurance',
    icon: Activity,
    color: '#8b5cf6',
    duration: '4 min',
  },
  {
    id: 'endurance-run',
    name: 'Endurance Run',
    description: 'Cardiovascular fitness',
    icon: Heart,
    color: '#ef4444',
    duration: '15 min',
  },
];

export default function TestsScreen() {
  const handleTestSelect = (testId: string) => {
    router.push(`/test/${testId}`);
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Assessment Tests</Text>
          <Text style={styles.subtitle}>Choose a test to begin your assessment</Text>
        </View>

        {/* Test Categories */}
        <View style={styles.testsContainer}>
          {tests.map((test) => {
            const IconComponent = test.icon;
            return (
              <TouchableOpacity
                key={test.id}
                style={styles.testCard}
                onPress={() => handleTestSelect(test.id)}
              >
                <View style={styles.testContent}>
                  <View style={[styles.testIconContainer, { backgroundColor: `${test.color}20` }]}>
                    <IconComponent size={28} color={test.color} />
                  </View>
                  <View style={styles.testInfo}>
                    <Text style={styles.testName}>{test.name}</Text>
                    <Text style={styles.testDescription}>{test.description}</Text>
                    <View style={styles.testMeta}>
                      <Timer size={14} color="#9ca3af" />
                      <Text style={styles.testDuration}>{test.duration}</Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color="#6b7280" />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Before You Start</Text>
          <View style={styles.instructionsList}>
            <View style={styles.instructionItem}>
              <View style={styles.instructionBullet} />
              <Text style={styles.instructionText}>
                Ensure you have adequate space for movement
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.instructionBullet} />
              <Text style={styles.instructionText}>
                Position your device for clear video recording
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.instructionBullet} />
              <Text style={styles.instructionText}>
                Follow all safety guidelines during tests
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.instructionBullet} />
              <Text style={styles.instructionText}>
                Complete tests when you feel physically ready
              </Text>
            </View>
          </View>
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
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
  testsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  testCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  testContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  testIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  testInfo: {
    flex: 1,
  },
  testName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  testDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#9ca3af',
    marginBottom: 8,
  },
  testMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testDuration: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9ca3af',
    marginLeft: 4,
  },
  instructionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  instructionsTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginBottom: 16,
  },
  instructionsList: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  instructionBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f97316',
    marginTop: 6,
    marginRight: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#d1d5db',
    lineHeight: 20,
  },
});
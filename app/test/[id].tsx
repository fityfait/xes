import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { ArrowLeft, Camera, Square, RotateCcw, CircleCheck as CheckCircle, Play } from 'lucide-react-native';
import { AIAnalysisService } from '@/services/aiAnalysis';

const testDetails = {
  'vertical-jump': {
    name: 'Vertical Jump',
    instructions: 'Stand tall with feet shoulder-width apart. When recording starts, jump as high as possible with both feet leaving the ground simultaneously.',
    duration: 10,
  },
  'shuttle-run': {
    name: 'Shuttle Run',
    instructions: 'Set up two markers 10 meters apart. Run back and forth between markers as fast as possible for the duration.',
    duration: 30,
  },
  'sit-ups': {
    name: 'Sit-Ups',
    instructions: 'Lie on your back with knees bent. Perform as many sit-ups as possible in 60 seconds.',
    duration: 60,
  },
  'height-weight': {
    name: 'Height & Weight',
    instructions: 'Stand against a wall for height measurement, then step on a scale for weight measurement.',
    duration: 5,
  },
  'endurance-run': {
    name: 'Endurance Run',
    instructions: 'Run continuously for 12 minutes. Maintain a steady pace throughout the test.',
    duration: 720,
  },
};

export default function TestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [testPhase, setTestPhase] = useState<'instructions' | 'countdown' | 'recording' | 'analysis' | 'results'>('instructions');
  const [testResult, setTestResult] = useState<any>(null);
  const countdownAnim = useRef(new Animated.Value(1)).current;
  const cameraRef = useRef<CameraView>(null);

  const test = testDetails[id as keyof typeof testDetails];

  useEffect(() => {
    if (countdown > 0) {
      Animated.sequence([
        Animated.timing(countdownAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(countdownAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (countdown === 0 && testPhase === 'countdown') {
      startRecording();
    }
  }, [countdown, testPhase]);

  const startCountdown = () => {
    setTestPhase('countdown');
    setCountdown(3);
  };

  const startRecording = async () => {
    setTestPhase('recording');
    setIsRecording(true);

    // Simulate recording duration
    setTimeout(() => {
      stopRecording();
    }, test.duration * 1000);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setTestPhase('analysis');

    // Simulate AI analysis
    setTimeout(async () => {
      const result = await AIAnalysisService.analyzeTest(id as string, null);
      setTestResult(result);
      setTestPhase('results');
    }, 2000);
  };

  const submitResult = () => {
    Alert.alert(
      'Submit to SAI',
      'Your test result will be submitted to the Sports Authority of India. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Submit', 
          onPress: () => {
            Alert.alert('Success', 'Test result submitted successfully!');
            router.back();
          }
        },
      ]
    );
  };

  if (!test) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Test not found</Text>
      </View>
    );
  }

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.container}
      >
        <View style={styles.permissionContainer}>
          <Camera size={64} color="#f97316" />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need camera access to record your test performance
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{test.name}</Text>
        <View style={styles.placeholder} />
      </View>

      {testPhase === 'instructions' && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Test Instructions</Text>
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsText}>{test.instructions}</Text>
            <View style={styles.durationInfo}>
              <Text style={styles.durationLabel}>Test Duration:</Text>
              <Text style={styles.durationValue}>{test.duration} seconds</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.startButton} onPress={startCountdown}>
            <LinearGradient
              colors={['#f97316', '#ea580c']}
              style={styles.startButtonGradient}
            >
              <Play size={24} color="#ffffff" />
              <Text style={styles.startButtonText}>Start Test</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {testPhase === 'countdown' && (
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownLabel}>Get Ready!</Text>
          <Animated.View style={[styles.countdownCircle, { transform: [{ scale: countdownAnim }] }]}>
            <Text style={styles.countdownNumber}>{countdown}</Text>
          </Animated.View>
        </View>
      )}

      {(testPhase === 'recording' || testPhase === 'analysis') && (
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
          >
            <View style={styles.cameraOverlay}>
              {testPhase === 'recording' && (
                <>
                  <View style={styles.recordingIndicator}>
                    <View style={styles.recordingDot} />
                    <Text style={styles.recordingText}>Recording...</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.stopButton}
                    onPress={stopRecording}
                  >
                    <Square size={24} color="#ffffff" fill="#ffffff" />
                  </TouchableOpacity>
                </>
              )}
              {testPhase === 'analysis' && (
                <View style={styles.analysisContainer}>
                  <Text style={styles.analysisText}>Analyzing performance...</Text>
                  <View style={styles.loadingDots}>
                    <View style={styles.loadingDot} />
                    <View style={styles.loadingDot} />
                    <View style={styles.loadingDot} />
                  </View>
                </View>
              )}
            </View>
          </CameraView>
        </View>
      )}

      {testPhase === 'results' && testResult && (
        <View style={styles.resultsContainer}>
          <View style={styles.resultsCard}>
            <CheckCircle size={48} color="#10b981" />
            <Text style={styles.resultsTitle}>Test Complete!</Text>
            
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Your Score:</Text>
              <Text style={styles.resultValue}>{testResult.score} {testResult.unit}</Text>
            </View>
            
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Benchmark:</Text>
              <Text style={[
                styles.resultBenchmark,
                { color: testResult.benchmark === 'Excellent' ? '#10b981' : 
                         testResult.benchmark === 'Good' ? '#3b82f6' : '#f97316' }
              ]}>
                {testResult.benchmark}
              </Text>
            </View>

            {testResult.badgeEarned && (
              <View style={styles.badgeEarned}>
                <Award size={24} color="#fbbf24" />
                <Text style={styles.badgeEarnedText}>Badge Unlocked!</Text>
                <Text style={styles.badgeEarnedName}>{testResult.badgeEarned}</Text>
              </View>
            )}

            <View style={styles.resultActions}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={submitResult}
              >
                <Text style={styles.submitButtonText}>Submit to SAI</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => setTestPhase('instructions')}
              >
                <RotateCcw size={16} color="#f97316" />
                <Text style={styles.retryButtonText}>Retry Test</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  placeholder: {
    width: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  permissionTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  instructionsContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  instructionsTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 32,
  },
  instructionsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  instructionsText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#d1d5db',
    lineHeight: 24,
    marginBottom: 20,
  },
  durationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  durationLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#9ca3af',
  },
  durationValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#f97316',
  },
  startButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  startButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginLeft: 12,
  },
  countdownContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownLabel: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginBottom: 48,
  },
  countdownCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f97316',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  countdownNumber: {
    fontSize: 48,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    marginRight: 8,
  },
  recordingText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  stopButton: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analysisContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analysisText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginBottom: 24,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f97316',
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  resultsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  resultsTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 32,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  resultLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#9ca3af',
  },
  resultValue: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
  },
  resultBenchmark: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  badgeEarned: {
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  badgeEarnedText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#fbbf24',
    marginTop: 8,
  },
  badgeEarnedName: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
    marginTop: 4,
  },
  resultActions: {
    width: '100%',
    marginTop: 24,
  },
  submitButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  retryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#f97316',
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#f97316',
    marginLeft: 8,
  },
});
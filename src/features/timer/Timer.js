import React, { useState } from 'react';
import { View, StyleSheet, Text, Vibration, Platform, Animated, SafeAreaView, Alert } from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';
import { colors } from '../../utils/colors';
import { spacing, fontSizes } from '../../utils/sizes';
import { Countdown } from '../../components/Countdown';
import { RoundedButton } from '../../components/RoundedButton';
import { Timing } from './Timing';
import { Ionicons } from '@expo/vector-icons';

const DEFAULT_TIME = 0.1; // 6 seconds for testing

export const Timer = ({ focusSubject, onTimerEnd, clearSubject }) => {
  useKeepAwake();
  const [minutes, setMinutes] = useState(DEFAULT_TIME);
  const [isStarted, setIsStarted] = useState(false);
  const [progress, setProgress] = useState(1);
  const [fadeAnim] = useState(new Animated.Value(1));

  const onProgress = (progress) => {
    setProgress(progress);
  };

  const vibrate = () => {
    try {
      if (Platform.OS === 'ios') {
        const interval = setInterval(() => Vibration.vibrate(), 1000);
        setTimeout(() => clearInterval(interval), 10000);
        console.log('iOS vibration started');
      } else {
        Vibration.vibrate(10000);
        console.log('Android vibration triggered');
      }
    } catch (error) {
      console.log('Vibration error:', error);
      Alert.alert('Vibration Failed', 'Unable to trigger vibration. Please check device settings.');
    }
  };

  const onEnd = () => {
    console.log('Timer ended');
    vibrate();
    setMinutes(DEFAULT_TIME);
    setProgress(1);
    setIsStarted(false);
    onTimerEnd();
  };

  const changeTime = (min) => {
    setMinutes(min);
    setProgress(1);
    setIsStarted(false);
  };

  const animateToggle = () => {
    Animated.timing(fadeAnim, {
      toValue: isStarted ? 0.5 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setIsStarted(!isStarted);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.countdownContainer}>
          <Countdown
            minutes={minutes}
            isPaused={!isStarted}
            onProgress={onProgress}
            onEnd={onEnd}
          />
        </View>
        <View style={styles.focusContainer}>
          <Text style={styles.title}>Focus:</Text>
          <Text style={styles.task}>{focusSubject}</Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBar, { width: `${progress * 100}%` }]}
            />
          </View>
        </View>
        <View style={styles.timingContainer}>
          <Timing onChangeTime={changeTime} />
        </View>
        <View style={styles.buttonContainer}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <RoundedButton
              title={isStarted ? 'Pause' : 'Start'}
              size={120}
              onPress={animateToggle}
            >
              <Ionicons name={isStarted ? 'pause' : 'play'} size={30} color={colors.white} />
            </RoundedButton>
          </Animated.View>
        </View>
        <View style={styles.cancelContainer}>
          <RoundedButton
            title="Cancel Task"
            size={80}
            onPress={() => {
              Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
                clearSubject();
                fadeAnim.setValue(1);
              });
            }}
            style={styles.cancelButton}
          >
            <Ionicons name="close-circle-outline" size={20} color={colors.accentRed} />
          </RoundedButton>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.darkBlue,
  },
  container: {
    flex: 1,
    backgroundColor: colors.darkBlue,
    paddingHorizontal: spacing.md,
    justifyContent: 'space-between',
  },
  countdownContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  focusContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.lightGray,
    fontSize: fontSizes.md,
    textAlign: 'center',
  },
  task: {
    color: colors.white,
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: spacing.lg,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: colors.lightGray,
    borderRadius: 5,
    overflow: 'hidden',
    marginHorizontal: spacing.md,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.progressBlue,
    borderRadius: 5,
  },
  timingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  cancelContainer: {
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  cancelButton: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    borderColor: colors.accentRed,
  },
});
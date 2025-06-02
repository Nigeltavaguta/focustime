import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RoundedButton } from '../../components/RoundedButton';
import { colors } from '../../utils/colors'; // Corrected import
import { spacing } from '../../utils/sizes';
import { Ionicons } from '@expo/vector-icons';

export const Timing = ({ onChangeTime }) => {
  return (
    <View style={styles.container}>
      <RoundedButton
        size={80}
        title="10 min"
        onPress={() => onChangeTime(10)}
      >
        <Ionicons name="timer-outline" size={20} color={colors.white} />
      </RoundedButton>
      <RoundedButton
        size={80}
        title="15 min"
        onPress={() => onChangeTime(15)}
      >
        <Ionicons name="timer-outline" size={20} color={colors.white} />
      </RoundedButton>
      <RoundedButton
        size={80}
        title="20 min"
        onPress={() => onChangeTime(20)}
      >
        <Ionicons name="timer-outline" size={20} color={colors.white} />
      </RoundedButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
});
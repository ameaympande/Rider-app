import React, {type PropsWithChildren} from 'react';
import {StyleSheet, View, type ViewStyle} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

type ScreenProps = PropsWithChildren<{
  style?: ViewStyle;
  withGradient?: boolean;
}>;

export function Screen({children, style, withGradient}: ScreenProps): React.JSX.Element {
  const content = <View style={[styles.content, style]}>{children}</View>;

  if (withGradient) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0F172A', '#05070A']}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={styles.safeArea}>
          {content}
        </SafeAreaView>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
});

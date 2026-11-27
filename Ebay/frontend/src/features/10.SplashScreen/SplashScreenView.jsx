import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { BSLogo } from '../../components/BSLogo';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

export const SplashScreenView = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <BSLogo size="large" showTagline={true} variant="light" />
        <Text style={styles.campusBadge}>CAMPUS MARKETPLACE</Text>
        <Text style={styles.tagline}>Buy & Sell Books, Gadgets & Hostel Gear</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  campusBadge: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.headingBold,
    letterSpacing: 2,
    marginTop: 18,
  },
  tagline: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    fontFamily: fonts.bodyMedium,
    marginTop: 6,
  },
});

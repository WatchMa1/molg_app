import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const LoadingAnimation = () => {
  const animation1 = useRef(new Animated.Value(0)).current;
  const animation2 = useRef(new Animated.Value(0)).current;
  const animation3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (animation, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 600,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animate(animation1, 0);
    animate(animation2, 200);
    animate(animation3, 400);
  }, []);

  const circleStyle = (animation) => ({
    opacity: animation,
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1],
        }),
      },
    ],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, circleStyle(animation1)]} />
      <Animated.View style={[styles.circle, circleStyle(animation2)]} />
      <Animated.View style={[styles.circle, circleStyle(animation3)]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#FFA500',
    margin: 5,
  },
});

export default LoadingAnimation;
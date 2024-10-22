import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const StartupScreen = ({ onTimeout }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onTimeout) onTimeout();
    }, 5000); // 5 seconds

    return () => {
      clearTimeout(timer); // Clean up the timer on component unmount
    };
  }, [onTimeout]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1b2c00',
  },
  logo: {
    width: '80%', // Adjust this percentage as needed
    height: 200, // Adjust this value as needed
  },
});

export default StartupScreen;

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const ResetPasswordWithOTP = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/forgot-password.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.message}>
        To reset your password, contact support on:
        {'\n'}+260 975 434795
        {'\n'}+260 964 978222
        {'\n'}Email: nyumbayanga33@gmail.com
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: 200,
    marginBottom: 20,
  },
  message: {
    fontSize: 21,
    textAlign: 'center',
    color: '#333',
  },
});

export default ResetPasswordWithOTP;

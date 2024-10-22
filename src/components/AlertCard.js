import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AlertCard = ({ message, type, show }) => {
  if (!show) return null;

  return (
    <View style={[styles.alertContainer, styles[type]]}>
      <Ionicons
        name={type === 'success' ? 'checkmark-circle' : 'warning'}
        size={24}
        color="#fff"
        style={styles.icon}
      />
      <Text style={styles.alertText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    position: 'absolute',
    top: 20,
    left: '10%',
    right: '10%',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 500, // Ensure it's on top
  },
  alertText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  success: {
    backgroundColor: '#4CAF50', // Green background for success
  },
  error: {
    backgroundColor: '#F44336', // Red background for error
  },
});

export default AlertCard;

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import LoadingAnimation from '../components/LoadingAnimation';
import SearchBar from '../components/SearchBar';


const ChartsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingAnimation />
      </View>
    );
  }

  return (
    <View style={styles.container}>

    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 10,
  },
});

export default ChartsScreen;
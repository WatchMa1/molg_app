import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';

import LoadingAnimation from '../components/LoadingAnimation';

const HomeScreen = ({ navigation, }) => {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingAnimation />
      </View>
    );
  }


  return (
    <SafeAreaView style={styles.container}>
      <SearchBar screen="Home" />
      <PropertyCard />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContentContainer: {
    paddingBottom: 20, // Adjust padding to ensure space for the last item
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    alignSelf: 'flex-start',
    color: '#070d2d',
  },
  itemPrice: {
    fontSize: 16,
    color: '#FFA500',
    alignSelf: 'flex-end',
  },
  cardfoot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});

export default HomeScreen;

import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import SearchBar from '../components/SearchBar';


const TablesScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.container}>
      <SearchBar screen="Tables" />
      <FlatList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TablesScreen;
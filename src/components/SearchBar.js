import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getCurrentUserRole } from '../utils/utils';

const SearchBar = ({
  showSearch,
  setShowSearch,
  onSearch,
  clearSearch,
  screen,
  onSellPress,
  searchPlaceholder
}) => {
  const [query, setQuery] = useState('');
  const animation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const [userRole, setUserRole] = useState('');
  const searchTimeout = useRef(null);



  useEffect(() => {
    Animated.timing(animation, {
      toValue: showSearch ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showSearch]);

  const handleSearchChange = (text) => {
    setQuery(text);

    // Clear any existing timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Set a new timeout to perform search after user stops typing
    searchTimeout.current = setTimeout(() => {
      performSearch(text);
    }, 500);
  };

  const performSearch = (searchText) => {
    const trimmedQuery = searchText.trim();
    if (trimmedQuery === '') {
      clearSearch();
    } else {
      onSearch(trimmedQuery);
    }
  };

  const handleSearchSubmit = () => {
    performSearch(query);
  };

  const handleClearSearch = () => {
    setQuery('');
    clearSearch();
  };

  const inputHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 40],
  });

  const inputOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const navigateToListing = () => {
    navigation.navigate('MyListings');
  };

  const navigateToWishlist = () => {
    navigation.navigate('Wishlist');
  };

  const navigateToSell = () => {
    if (onSellPress) {
      onSellPress();
    }
  };

  const navigateToCart = () => {
    navigation.navigate('Cart');
  };

  const getSearchPlaceholder = () => {
    if (screen === 'Home') {
      return 'Search by location, price, or type...';
    } else if (screen === 'Market') {
      return 'Search by name, category, location, or price...';
    }
    return 'Search...';
  };

  const renderSearchInput = () => (
    <Animated.View
      style={[
        styles.searchInputContainer,
        { opacity: inputOpacity, height: inputHeight },
      ]}
    >
      {showSearch && (
        <View style={styles.searchInputWrapper}>
          <TextInput
            placeholder={getSearchPlaceholder()}
            placeholderTextColor="#FFA50080"
            style={styles.searchInput}
            value={query}
            onChangeText={handleSearchChange}
            onSubmitEditing={handleSearchSubmit}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={handleClearSearch}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </Animated.View>
  );

  const renderButtons = () => {
    const leftButtons = [];
    const rightButtons = [];

    leftButtons.push(
      <TouchableOpacity
        key="search"
        onPress={() => setShowSearch(!showSearch)}
        style={styles.searchButton}
      >
        <Ionicons name="search" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    );

    if (screen === 'Home') {
      if (userRole === 'agent' || userRole === 'landlord') {
        rightButtons.push(
          <TouchableOpacity
            key="listing"
            onPress={navigateToListing}
            style={styles.actionButton}
          >
            <Ionicons name="list" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        );
      }
      rightButtons.push(
        <TouchableOpacity
          key="wishlist"
          onPress={navigateToWishlist}
          style={styles.actionButton}
        >
          <Ionicons name="heart-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      );
    }

    if (screen === 'Market') {
      rightButtons.push(
        <TouchableOpacity
          key="listings"
          onPress={navigateToListing}
          style={styles.actionButton}
        >
          <Ionicons name="list" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      );

      rightButtons.push(
        <TouchableOpacity
          key="sell"
          onPress={navigateToSell}
          style={styles.actionButton}
        >
          <Ionicons name="cash-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      );

      // Add Cart button next to Sell button
      rightButtons.push(
        <TouchableOpacity
          key="cart"
          onPress={navigateToCart}
          style={styles.actionButton}
        >
          <Ionicons name="cart-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      );
    }

    return { leftButtons, rightButtons };
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {renderButtons().leftButtons}
      </View>
      {renderSearchInput()}
      <View style={styles.rightContainer}>
        {renderButtons().rightButtons}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4e5e6b',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  searchInputContainer: {
    flex: 1,
    overflow: 'hidden',
    marginHorizontal: 12,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 6,
    paddingLeft: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    paddingRight: 8,
    height: '100%',
  },
  clearButton: {
    padding: 8,
  },
  searchButton: {
    padding: 4,
    borderRadius: 4,
  },
  actionButton: {
    padding: 6,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default SearchBar;

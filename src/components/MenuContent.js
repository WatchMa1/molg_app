import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MenuContent = () => {
  return (
    <View style={styles.menuContainer}>
      <View style={styles.userInfo}>
        <Image source={null} style={styles.avatar} />
        <Text
          style={styles.userName}
        >Simbarashe Kapundu</Text>
      </View>
      <TouchableOpacity style={styles.menuItem} onPress={onChangePassword}>
        <Ionicons name="key-outline" size={24} color="#FFA500" />
        <Text style={styles.menuItemText}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} >
        <Ionicons name="log-out-outline" size={24} color="#FFA500" />
        <Text style={styles.menuItemText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    backgroundColor: '#070d2d',
    padding: 20,
    flex: 1,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    color: '#FFA500',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuItemText: {
    color: '#FFA500',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default MenuContent;

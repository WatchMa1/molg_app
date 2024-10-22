import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const ProfileMenu = ({ onClose }) => {
  return (
    <View style={styles.menu}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeText}>X</Text>
      </TouchableOpacity>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: 'https://placekitten.com/100/100' }} // Replace with user avatar URL
          style={styles.avatar}
        />
        <Text style={styles.name}>Full name</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => alert('Change Password')}
        >
          <Text style={styles.menuText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => alert('Logout')}
        >
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    padding: 20,
    zIndex: 999, // Make sure it appears on top
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  closeText: {
    color: 'white',
    fontSize: 20,
  },
  profileContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ProfileMenu;

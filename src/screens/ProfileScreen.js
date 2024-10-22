import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput,
  Button,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';


const ProfileScreen = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false); // State for showing password fields

  return (
    <>
      <Image source={{ uri: null }} style={styles.image} />
      <Text style={styles.name}>
        Simbarashe Kapundu
      </Text>
      <Text style={styles.info}>Username: Kapundu</Text>
      <Text style={styles.info}>Phone Number: 0999</Text>
      <Text style={styles.info}>NRC Number: 2233</Text>

      {/* Conditional rendering for password reset fields */}
      {showPasswordFields && (
        <>
          <Text style={styles.sectionTitle}>Change Password</Text>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <Button title="Update Password" onPress={null} />
        </>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowPasswordFields((prev) => !prev)} // Toggle password fields visibility
      >
        <Text style={styles.buttonText}>
          {showPasswordFields ? 'Hide Password Fields' : 'Reset Password'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={null}>
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={null}>
        <Text style={styles.buttonText}>Disable Account</Text>
      </TouchableOpacity>
    </>
  );


  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#070d2d', '#070d2d', '#000']}
        style={styles.gradientContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>{renderContent()}</View>
        </ScrollView>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home" size={24} color="#FFA500" />
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#070d2d',
  },
  gradientContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    paddingBottom: 120, // Add extra padding at the bottom for the home button
  },
  container: {
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    color: '#FFA500',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    color: '#FFA500',
    fontSize: 18,
    marginBottom: 5,
  },
  loading: {
    color: '#FFA500',
    fontSize: 18,
  },
  sectionTitle: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  homeButton: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    backgroundColor: '#1a2346',
    padding: 20,
    borderRadius: 30,
    zIndex: 1,
  },
  button: {
    backgroundColor: '#FFA500',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#070d2d',
    fontSize: 18,
  },
});

export default ProfileScreen;

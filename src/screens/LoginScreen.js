import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar'; // Import StatusBar
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { Asset } from 'expo-asset';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from "@react-native-community/netinfo";
import { updateIsLoginRequired } from '../utils/utils';

const footerLogo = Asset.fromModule(require('../assets/just-Jr.png')).uri;

const LoginScreen = ({ route, navigation, setUser, setIsLoginRequired }) => {
  const [username, setUsername] = useState(route.params?.username || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');

    if (!isConnected) {
      setError('No internet connection. Please check your network and try again.');
      setIsLoading(false);
      return;
    }

    try {
      const sanitizedUsername = username.toLowerCase().replace(/[^a-z0-9]/g, '');
      const email = `${sanitizedUsername}@nyumbayanga.com`;

      const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);

      setUser(true);
      updateIsLoginRequired(setIsLoginRequired, false);
      navigation.navigate('MainTabs', { screen: 'Home' });
    } catch (error) {
      console.log(error); // Log the full error object to see its contents

      switch (error.code) {
        case 'auth/invalid-email':
          setError('Invalid email format.');
          break;
        case 'auth/user-disabled':
          setError('User account is disabled.');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Incorrect username or password.');
          break;
        case 'auth/network-request-failed':
          setError('Network request failed. Please check your internet connection and try again.');
          break;
        default:
          setError('An error occurred. Check your network, Username or Password and try again.');
      }
    } finally {
      setIsLoading(false);
    }


  };

  const handleForgotPassword = () => {
    navigation.navigate('ResetPasswordWithOTP');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <StatusBar style="light" />
      <LinearGradient colors={['#070d2d', '#070d2d', '#000']} style={styles.gradientContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <Image
              source={Asset.fromModule(require('../assets/nyumba-yanga-logo-trans-BG-text1.png'))}
              style={styles.logo}
              resizeMode="contain"
            />
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#FFA500"
                value={username}
                onChangeText={setUsername}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#FFA500"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Ionicons
                  name={passwordVisible ? 'eye-off' : 'eye'}
                  size={24}
                  color="#FFA500"
                />
              </TouchableOpacity>
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.clickableText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.clickableText}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Image source={{ uri: footerLogo }} style={styles.footerLogo} />
              <Text style={styles.footerText}>POWERED BY JR Innovations</Text>
            </View>
          </View>
        </ScrollView>

        {isLoading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#FFA500" />
          </View>
        )}
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  container: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  logo: {
    width: '80%',
    height: 100,
    alignSelf: 'center',
    marginBottom: 80,
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  input: {
    color: '#FFA500',
    borderBottomWidth: 1,
    borderBottomColor: '#FFA500',
    paddingVertical: 10,
    paddingHorizontal: 5,
    fontSize: 13,
  },
  eyeIcon: {
    position: 'absolute',
    right: 0,
    bottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#FFA500',
    alignSelf: 'center',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15,
  },
  clickableText: {
    color: '#FFA500',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    paddingVertical: 10,
  },
  footerLogo: {
    width: '2.6%',
    height: 30,
    marginRight: 10,
  },
  footerText: {
    color: 'white',
    fontSize: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;

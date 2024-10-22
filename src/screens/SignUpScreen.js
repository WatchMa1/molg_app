import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { signOut } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const CustomInput = ({ icon, ...props }) => (
  <View style={styles.inputContainer}>
    <Ionicons name={icon} size={20} color="#FFA500" style={styles.inputIcon} />
    <TextInput {...props} style={styles.input} placeholderTextColor="#FFA500" />
  </View>
);

const CustomButton = ({ title, onPress, disabled, style }) => (
  <TouchableOpacity
    style={[styles.button, disabled && styles.disabledButton, style]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const SignupScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nrcNumber, setNrcNumber] = useState('');
  const [photo, setPhoto] = useState(null);
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    validateForm();
  }, [firstName, lastName, username, phoneNumber, nrcNumber, photo, password, role]);

  const validateForm = () => {
    const isValid =
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      username.trim() !== '' &&
      phoneNumber.trim() !== '' &&
      nrcNumber.trim() !== '' &&
      photo !== null &&
      password.trim().length > 4 &&
      role !== '';
    setIsFormValid(isValid);
    return isValid;
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (text.length <= 4) {
      setPasswordError('Password must be longer than 4 characters');
    } else {
      setPasswordError('');
    }
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      setError('All fields are required and password must be longer than 4 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    const sanitizedUsername = username.toLowerCase().replace(/[^a-z0-9]/g, '');
    const email = `${sanitizedUsername}@nyumbayanga.com`;

    try {
      const usersRef = collection(FIRESTORE_DB, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError('This username is already taken. Please choose another.');
        setIsLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      const userId = userCredential.user.uid;

      let photoURL = null;
      if (photo) {
        const storage = getStorage();
        const photoRef = ref(storage, `userPhotos/${userId}/Profile.jpg`);
        const response = await fetch(photo);

        if (!response.ok) {
          throw new Error('Failed to fetch the image for upload');
        }

        const blob = await response.blob();
        await uploadBytes(photoRef, blob);
        photoURL = await getDownloadURL(photoRef);
      }

      await setDoc(doc(FIRESTORE_DB, 'users', userId), {
        firstName,
        lastName,
        username,
        phoneNumber,
        nrcNumber,
        photoURL,
        userId,
        email,
        role,
      });

      await signOut(FIREBASE_AUTH);
      alert('Account created successfully! Please log in.');
      navigation.navigate('Login', { username: username });
    } catch (authError) {
      if (authError.code === 'auth/email-already-in-use') {
        setError(
          'An account with this username already exists. Please choose another.'
        );
      } else {
        setError('An error occurred during signup. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async (sourceType) => {
    let permissionResult;
    if (sourceType === 'camera') {
      permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    } else {
      permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    if (permissionResult.granted === false) {
      alert(`Permission to access ${sourceType} was denied`);
      return;
    }

    let result;
    if (sourceType === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (!result.canceled) {
      const uri =
        result.assets && result.assets.length > 0 ? result.assets[0].uri : null;
      setPhoto(uri);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#070d2d', '#0c1959', '#161e3c']}
        style={styles.gradientContainer}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={10}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Create an Account</Text>
            </View>

            <CustomInput
              icon="person-outline"
              placeholder="First Name *"
              value={firstName}
              onChangeText={setFirstName}
            />
            <CustomInput
              icon="person-outline"
              placeholder="Last Name *"
              value={lastName}
              onChangeText={setLastName}
            />
            <CustomInput
              icon="at"
              placeholder="Username *"
              value={username}
              onChangeText={setUsername}
            />
            <CustomInput
              icon="call-outline"
              placeholder="Phone Number *"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <CustomInput
              icon="card-outline"
              placeholder="NRC Number *"
              value={nrcNumber}
              onChangeText={setNrcNumber}
            />

            <View style={styles.photoContainer}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.image} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Ionicons name="camera-outline" size={40} color="#FFA500" />
                </View>
              )}
              <View style={styles.photoButtonContainer}>
                <CustomButton
                  title="Take Selfie"
                  onPress={() => pickImage('camera')}
                  style={styles.photoButton}
                />
                <CustomButton
                  title="Choose Photo"
                  onPress={() => pickImage('library')}
                  style={styles.photoButton}
                />
              </View>
            </View>

            <View style={styles.passwordContainer}>
              <CustomInput
                icon="lock-closed-outline"
                placeholder="Password *"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#FFA500"
                />
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

            <View style={styles.pickerContainer}>
              <Ionicons name="people-outline" size={20} color="#FFA500" style={styles.pickerIcon} />
              <Picker
                selectedValue={role}
                style={styles.picker}
                onValueChange={setRole}
              >
                <Picker.Item label="Choose Account Type" value="" />
                <Picker.Item label="Client" value="client" />
                <Picker.Item label="Property Owner" value="property_owner" />
                <Picker.Item label="Agent" value="agent" />
              </Picker>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <CustomButton
              style={styles.button}
              title="Sign Up"
              onPress={handleSignup}
              disabled={!isFormValid || isLoading}
            />

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>Already have an account? Login</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>

        {isLoading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#FFA500" />
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#070d2d',
  },
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingBottom: 40, // Add extra padding at the bottom
  },
  titleContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    color: '#FFA500',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFA500',
    paddingVertical: 12,
    fontSize: 14,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  photoButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  photoButton: {
    flex: 0.48,
    backgroundColor: 'rgba(255, 165, 0, 0.5)',
    borderWidth: 1,
    borderColor: '#FFA500',
    paddingVertical: 10,
  },
  passwordContainer: {
    marginBottom: 12,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 12,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginBottom: 12,
    paddingLeft: 15,
  },
  pickerIcon: {
    marginRight: 10,
  },
  picker: {
    flex: 1,
    color: '#FFA500',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#FFA500',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#070d2d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 165, 0, 0.5)',
  },
  error: {
    color: '#FF6347',
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
  },
  loginText: {
    color: '#FFA500',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignupScreen;
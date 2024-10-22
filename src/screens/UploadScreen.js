import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  Image, SafeAreaView, Alert, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { FIRESTORE_DB, FIREBASE_STORAGE, FIREBASE_AUTH } from '../FirebaseConfig';
import { collection, addDoc, Timestamp, updateDoc, doc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Ionicons } from '@expo/vector-icons';
import uuid from 'react-native-uuid';
import DropDownPicker from 'react-native-dropdown-picker';
import LoadingAnimation from '../components/LoadingAnimation';

const UploadScreen = ({ navigation }) => {
  const [propertyTitle, setPropertyTitle] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [contact, setContact] = useState('');
  const [description, setDescription] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'House', value: 'house' },
    { label: 'Shop', value: 'shop' },
    { label: 'Boarding House', value: 'boarding-house' },
    { label: 'Business Space', value: 'business-space' },
    { label: 'Land', value: 'land' },
    { label: 'Farm', value: 'farm' },
  ]);

  const [openType, setOpenType] = useState(false);
  const [typeItems, setTypeItems] = useState([
    { label: 'Rent', value: 'rent' },
    { label: 'Sell', value: 'buy' },
  ]);

  // Function to pick images
  const pickImage = async (isMain = false) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: isMain,
      aspect: isMain ? [4, 3] : undefined,
      quality: 1,
      allowsMultipleSelection: !isMain,
    });

    if (!result.canceled) {
      if (isMain) {
        setMainImage(result.assets[0].uri);
        setErrors(prev => ({ ...prev, mainImage: null }));
      } else {
        const newImages = result.assets.map(asset => asset.uri);
        setGalleryImages(prevImages => [...prevImages, ...newImages]);
        setErrors(prev => ({ ...prev, galleryImages: null }));
      }
    }
  };

  // Function to upload a single image
  const uploadImage = async (uri, houseId, folder = 'gallery') => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = folder === 'main' ? 'mainImage.jpg' : `${uuid.v4()}.jpg`;
      const storageRef = ref(FIREBASE_STORAGE, `houses/${houseId}/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          null,
          (error) => reject(error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      throw error;
    }
  };

  // Function to clear all input fields
  const clearFields = () => {
    setPropertyTitle('');
    setLocation('');
    setPrice('');
    setType('');
    setCategory('');
    setContact('');
    setDescription('');
    setMainImage(null);
    setGalleryImages([]);
    setErrors({});
  };

  // Helper function to check for forbidden number sequences
  const hasForbiddenSequence = (text) => {
    const forbiddenSequences = [
      '0973', '0974', '0975', '0976', '0977', '0978', '0979', '0970',
      '0963', '0964', '0965', '0966', '0967', '0968', '0969', '0960',
      '0777', '077', '076', '075', '0950', '0955', '0956', '0957',
      '0958', '0959', '095'
    ];
    return forbiddenSequences.some(seq => text.includes(seq));
  };
  // Function to validate input fields
  const validateFields = () => {
    let newErrors = {};

    if (!propertyTitle.trim()) newErrors.propertyTitle = 'Property Title is required';
    else if (hasForbiddenSequence(propertyTitle)) newErrors.propertyTitle = 'Property Title contains forbidden number sequence';

    if (!location.trim()) newErrors.location = 'Location is required';
    else if (hasForbiddenSequence(location)) newErrors.location = 'Location contains forbidden number sequence';

    if (!price.trim()) newErrors.price = 'Price is required';
    else if (hasForbiddenSequence(price)) newErrors.price = 'Price contains forbidden number sequence';

    if (!type.trim()) newErrors.type = 'Type is required';
    else if (hasForbiddenSequence(type)) newErrors.type = 'Type contains forbidden number sequence';

    if (!category) newErrors.category = 'Category is required';
    else if (hasForbiddenSequence(category)) newErrors.category = 'Category contains forbidden number sequence';

    if (!contact.trim()) newErrors.contact = 'Contact is required';
    // Note: We don't check for forbidden sequences in the contact field

    if (!description.trim()) newErrors.description = 'Description is required';
    else if (hasForbiddenSequence(description)) newErrors.description = 'Description contains forbidden number sequence';

    if (!mainImage) newErrors.mainImage = 'Main Image is required';
    if (galleryImages.length === 0) newErrors.galleryImages = 'At least one gallery image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle upload
  const handleUpload = async () => {
    if (!validateFields()) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    // Check if user is authenticated
    const currentUser = FIREBASE_AUTH.currentUser;
    if (!currentUser) {
      Alert.alert("Authentication Error", "You must be logged in to upload a property.");
      return;
    }

    setIsUploading(true);
    try {
      // Step 1: Create a Firestore document to get the houseId
      const houseDocRef = await addDoc(collection(FIRESTORE_DB, 'houses'), {
        propertyTitle,
        location,
        price: Number(price),
        type,
        category,
        contact,
        description,
        createdAt: Timestamp.now(),
        isAvailable: false,
        createdBy: currentUser.uid,
      });

      const houseId = houseDocRef.id;

      // Step 2: Upload main image
      const mainImageURL = await uploadImage(mainImage, houseId, 'main');

      // Step 3: Upload gallery images
      const galleryImageURLs = await Promise.all(
        galleryImages.map((uri) => uploadImage(uri, houseId, 'gallery'))
      );

      // Step 4: Update Firestore document with image URLs
      await updateDoc(houseDocRef, {
        image: mainImageURL,
        gallery: galleryImageURLs,
      });

      // Step 5: Notify user of success
      Alert.alert("Success", "Property Listed Successfully!");

      // Step 6: Clear input fields and navigate
      clearFields();
      navigation.navigate('MyListings');
    } catch (e) {
      Alert.alert("Upload Failed", `Error: ${e.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Upload Property</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, errors.propertyTitle && styles.inputError]}
              placeholder="Property Title *"
              value={propertyTitle}
              onChangeText={(text) => {
                setPropertyTitle(text);
                setErrors(prev => ({ ...prev, propertyTitle: null }));
              }}
              placeholderTextColor="#8e8e8e"
            />
            {errors.propertyTitle && <Text style={styles.errorText}>{errors.propertyTitle}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, errors.location && styles.inputError]}
              placeholder="Location (e.g 6722, Chiwalamabwe Olympia, Lusaka) *"
              value={location}
              onChangeText={(text) => {
                setLocation(text);
                setErrors(prev => ({ ...prev, location: null }));
              }}
              placeholderTextColor="#8e8e8e"
            />
            {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, errors.price && styles.inputError]}
              placeholder="Price *"
              value={price}
              onChangeText={(text) => {
                setPrice(text);
                setErrors(prev => ({ ...prev, price: null }));
              }}
              keyboardType="numeric"
              placeholderTextColor="#8e8e8e"
            />
            {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
          </View>

          <View style={[styles.pickerContainer, { zIndex: 3000 }]}>
            <DropDownPicker
              open={openType}
              value={type}
              items={typeItems}
              setOpen={setOpenType}
              setValue={(value) => {
                setType(value);
                setErrors(prev => ({ ...prev, type: null }));
              }}
              setItems={setTypeItems}
              placeholder="Select Type *"
              style={[styles.dropdown, errors.type && styles.inputError]}
              placeholderStyle={styles.placeholderStyle}
              dropDownContainerStyle={styles.dropDownContainerStyle}
              containerStyle={styles.dropdownContainer}
              textStyle={styles.dropdownText}
              zIndex={3000}
            />
            {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
          </View>

          <View style={[styles.pickerContainer, { zIndex: 2000 }]}>
            <DropDownPicker
              open={open}
              value={category}
              items={items}
              setOpen={setOpen}
              setValue={(value) => {
                setCategory(value);
                setErrors(prev => ({ ...prev, category: null }));
              }}
              setItems={setItems}
              placeholder="Select Category *"
              style={[styles.dropdown, errors.category && styles.inputError]}
              placeholderStyle={styles.placeholderStyle}
              dropDownContainerStyle={styles.dropDownContainerStyle}
              containerStyle={styles.dropdownContainer}
              textStyle={styles.dropdownText}
              zIndex={2000}
            />
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, errors.contact && styles.inputError]}
              placeholder="Contact *"
              value={contact}
              onChangeText={(text) => {
                setContact(text);
                setErrors(prev => ({ ...prev, contact: null }));
              }}
              placeholderTextColor="#8e8e8e"
            />
            {errors.contact && <Text style={styles.errorText}>{errors.contact}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errors.description && styles.inputError
              ]}
              placeholder="Property Description *"
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                setErrors(prev => ({ ...prev, description: null }));
              }}
              placeholderTextColor="#8e8e8e"
              multiline={true}
              numberOfLines={4}
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>

          <TouchableOpacity style={styles.button} onPress={() => pickImage(true)}>
            <Text style={styles.buttonText}>Pick Main Image *</Text>
          </TouchableOpacity>
          {mainImage && <Image source={{ uri: mainImage }} style={styles.image} />}
          {errors.mainImage && <Text style={styles.errorText}>{errors.mainImage}</Text>}

          <TouchableOpacity style={styles.button} onPress={() => pickImage(false)}>
            <Text style={styles.buttonText}>Add Gallery Image *</Text>
          </TouchableOpacity>
          <View style={styles.gallery}>
            {galleryImages.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.galleryImage} />
            ))}
          </View>
          {errors.galleryImages && <Text style={styles.errorText}>{errors.galleryImages}</Text>}

          <TouchableOpacity
            style={[styles.button, styles.uploadButton, isUploading && styles.disabledButton]}
            onPress={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color="#070d2d" />
            ) : (
              <Text style={styles.buttonText}>Upload Property</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name="home" size={24} color="#FFA500" />
      </TouchableOpacity>

      {isUploading && (
        <View style={styles.overlay}>
          <LoadingAnimation />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070d2d',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  homeButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#1a2346',
    padding: 15,
    borderRadius: 30,
    zIndex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1a2346',
    color: '#FFA500',
    padding: 15,
    borderRadius: 10,
    fontSize: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#FFA500',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  uploadButton: {
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#8B6914',
  },
  buttonText: {
    color: '#070d2d',
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginTop: 10,
    borderRadius: 10,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  galleryImage: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: '#1a2346',
    borderColor: '#8e8e8e',
  },
  dropdownContainer: {
    height: 50,
  },
  placeholderStyle: {
    color: "#8e8e8e",
    fontSize: 16,
  },
  dropDownContainerStyle: {
    backgroundColor: '#1a2346',
    borderColor: '#8e8e8e',
  },
  dropdownText: {
    color: '#FFA500',
    fontSize: 16,
  },
});

export default UploadScreen;

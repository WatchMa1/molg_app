// DetailsScreen.js

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Switch,
  Linking,
  Dimensions,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import { FIRESTORE_DB, FIREBASE_STORAGE, FIREBASE_AUTH } from '../FirebaseConfig';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, deleteDoc, setDoc } from 'firebase/firestore';
import ImageView from 'react-native-image-viewing';
import * as Animatable from 'react-native-animatable';
import AlertCard from '../components/AlertCard';
import { getCurrentUserRole } from '../utils/utils';
import { Snackbar } from 'react-native-paper';
import Modal from 'react-native-modal';
import axios from 'axios';
import qs from 'qs';

const { width } = Dimensions.get('window');

const DetailsScreen = ({ route, }) => {
  const navigation = useNavigation();
  const { property } = route.params;

  // State variables
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [region, setRegion] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [userPhoneNumber, setUserPhoneNumber] = useState('');
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [transactionReference, setTransactionReference] = useState(null);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [showVerifyButton, setShowVerifyButton] = useState(false);
  const [sellerPhoneNumber, setSellerPhoneNumber] = useState(property?.contact);




  // New state variables for availability and uploader
  const [isAvailable, setIsAvailable] = useState(property?.isAvailable);
  const [isUploader, setIsUploader] = useState(false);
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploaderInfo, setUploaderInfo] = useState(null);

  // References for animations
  const heartIconRef = useRef(null); // Reference for heart icon
  const deleteAnimationRef = useRef(null); // Reference for delete animation
  const [userRole, setUserRole] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const role = await getCurrentUserRole();
        setUserRole(role);
      } catch (error) {

      }
    };

    fetchUserRole();
  }, []);
  useEffect(() => {
    // Initialize Geocoding
    Geocoder.init('AIzaSyCLVWmVX_QI0V6rxeQxiyoWnNy77l9hZwk'); // Your API key

    // Geocode the location
    if (property && property.location) {
      Geocoder.from(property.location)
        .then((json) => {
          if (json.results.length > 0) {
            const location = json.results[0].geometry.location;
            setRegion({
              latitude: location.lat,
              longitude: location.lng,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            });
          } else {
            throw new Error('No results found');
          }
        })
        .catch((error) => {
          Alert.alert(
            'Location Not Found',
            "We couldn't find the exact location on the map. Showing a default location.",
            [{ text: 'OK' }]
          );
          // Set a default location (e.g., center of Zambia)
          setRegion({
            latitude: -13.133897,
            longitude: 27.849332,
            latitudeDelta: 5,
            longitudeDelta: 5,
          });
        });
    }

    // Check if the property is in the user's wishlist
    const checkWishlist = async () => {
      const userId = FIREBASE_AUTH.currentUser?.uid;
      if (userId) {
        const userRef = doc(FIRESTORE_DB, 'users', userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const wishlist = userDoc.data().wishlist || [];
          setIsInWishlist(wishlist.includes(property.id));
        }
      }
    };

    // Fetch uploader info and check if current user is uploader
    const fetchUploaderInfo = async () => {
      if (property.createdBy) {
        try {
          const uploaderRef = doc(FIRESTORE_DB, 'users', property.createdBy);
          const uploaderDoc = await getDoc(uploaderRef);
          if (uploaderDoc.exists()) {
            setUploaderInfo(uploaderDoc.data());
          } else {
          }
        } catch (error) {
        }
      }
    };

    const checkIfUploader = () => {
      const currentUserId = FIREBASE_AUTH.currentUser?.uid;
      setIsUploader(currentUserId === property.createdBy);
    };

    checkWishlist();
    fetchUploaderInfo();
    checkIfUploader();

  }, [property]);

  // Function to toggle wishlist
  const toggleWishlist = async () => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) {
      Alert.alert('Error', 'You must be logged in to add to wishlist');
      return;
    }

    setLoadingWishlist(true);

    const userRef = doc(FIRESTORE_DB, 'users', userId);
    try {
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, { wishlist: [] });
      }

      if (isInWishlist) {
        await updateDoc(userRef, {
          wishlist: arrayRemove(property.id),
        });
        setIsInWishlist(false);
        setAlertMessage('Removed from wishlist');
      } else {
        await updateDoc(userRef, {
          wishlist: arrayUnion(property.id),
        });
        setIsInWishlist(true);
        setAlertMessage('Added to wishlist');
      }

      // Show alert and animate the heart icon
      setShowAlert(true);
      heartIconRef.current?.bounceIn(800);

      setTimeout(() => setShowAlert(false), 2000);
      // Animate the heart icon

    } catch (error) {
      Alert.alert('Error', 'Failed to update wishlist');
    } finally {
      setLoadingWishlist(false);
    }
  };

  // Function to open image viewer
  const openImageViewer = (index) => {
    setCurrentImageIndex(index);
    setImageViewerVisible(true);
  };

  // All images including main and gallery
  const allImages = [property.image, ...(property.gallery || [])];

  // Function to handle availability toggle
  const handleAvailabilityToggle = async () => {
    if (!isUploader) return;

    if (isAvailable) {
      setIsDialogVisible(true);
    } else {
      setIsDeleting(true);
      deleteAnimationRef.current?.bounceIn(800);

      setTimeout(async () => {
        try {
          const propertyRef = doc(FIRESTORE_DB, 'houses', property.id);
          await updateDoc(propertyRef, {
            isAvailable: false
          });
          setIsAvailable(false);
          setSnackbarMessage('Property marked as unavailable');
          setVisible(true);
        } catch (error) {
          setSnackbarMessage('Error updating property availability');
          setVisible(true);
        } finally {
          setIsDeleting(false);
        }
      }, 2000); // Delay to allow animation to play
    }
  };

  // Function to handle delete confirmation
  const handleDeleteConfirm = async () => {
    setIsDialogVisible(false);
    setIsDeleting(true);
    deleteAnimationRef.current?.bounceIn(800);

    setTimeout(async () => {
      try {
        const propertyRef = doc(FIRESTORE_DB, 'houses', property.id);
        await deleteDoc(propertyRef);
        setSnackbarMessage('Property has been deleted');
        setVisible(true);
        setTimeout(() => navigation.goBack(), 1500);
      } catch (error) {
        setSnackbarMessage('Error deleting property');
        setVisible(true);
      } finally {
        setIsDeleting(false);
      }
    }, 2000); // Delay to allow animation to play
  };

  // Function to handle the payment process
  const handlePayment = async () => {
    if (!userPhoneNumber || userPhoneNumber.length !== 10) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number.');
      return;
    }

    setIsPaymentProcessing(true);
    try {
      const data = qs.stringify({
        'muid': '01JA3RH6QEPV92TJN8Y64890TX',
        'phone_number': userPhoneNumber,
        'amount': '5'
      });

      const config = {
        method: 'post',
        url: 'https://api.moneyunify.com/v2/request_payment',
        headers: {
          'User-Agent': 'Apidog/1.0.0 (https://apidog.com)',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
      };
      const response = await axios(config);

      if (response.data.data.status === 'successful') {
        setIsPaymentSuccessful(true);
        setTransactionReference(response.data.data.reference);
        Alert.alert('Payment Successful', 'You can now call the seller.');
        setIsPaymentModalVisible(false);
      } else if (response.data.data.status === 'pay-offline') {
        setTransactionReference(response.data.data.reference);
        Alert.alert('Payment Initiated', 'Please complete the payment on your phone. We will verify the transaction shortly.');
        await verifyTransaction(response.data.data.reference);
      } else {
        throw new Error(response.data.message || 'Payment failed');
      }
    } catch (error) {
      Alert.alert('Payment Failed', error.message || 'Unable to process the payment. Please try again.');
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  const verifyTransaction = async (reference) => {
    try {
      const verifyData = qs.stringify({
        'muid': '01JA3RH6QEPV92TJN8Y64890TX',
        'reference': reference
      });

      const verifyConfig = {
        method: 'post',
        url: 'https://api.moneyunify.com/v2/verify_transaction',
        headers: {
          'User-Agent': 'Apidog/1.0.0 (https://apidog.com)',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: verifyData
      };

      const verifyResponse = await axios(verifyConfig);

      if (verifyResponse.data.data.status === 'successful') {
        setIsPaymentSuccessful(true);
        Alert.alert('Payment Successful', 'You can now call the seller.');
        setIsPaymentModalVisible(false);
      } else if (verifyResponse.data.data.status === 'pay-offline') {
        setVerificationAttempts(prev => prev + 1);
        if (verificationAttempts < 3) {
          setTimeout(() => verifyTransaction(reference), 5000); // Retry after 5 seconds
        } else {
          setShowVerifyButton(true);
          Alert.alert('Payment Pending', 'The payment is still processing. Please try verifying manually after a few minutes.');
        }
      } else {
        throw new Error('Transaction verification failed');
      }
    } catch (error) {
      setShowVerifyButton(true);
      Alert.alert('Verification Failed', 'Unable to verify the transaction. Please try manual verification after a few minutes.');
    }
  };

  //Function to handle Manual Verification
  const ManualVerifyButton = () => (
    <TouchableOpacity
      style={styles.verifyButton}
      onPress={() => verifyTransaction(transactionReference)}
    >
      <Text style={styles.verifyButtonText}>Verify Payment</Text>
    </TouchableOpacity>
  );



  // Function to handle initiating the payment process
  const initiatePayment = () => {
    setIsPaymentModalVisible(true);
  };

  // Function to handle calling the seller
  const handleCallSeller = () => {
    if (isPaymentSuccessful) {
      if (property.contact) {
        Linking.openURL(`tel:${property.contact}`);
      } else {
        Alert.alert("Unable to call", "Phone number is not available.");
      }
    } else {
      initiatePayment();
    }
  };
  // Function to format the upload date
  const formatDate = (date) => {
    if (!date) return 'Unknown date';

    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return 'Invalid date';

      const now = new Date();
      const diffTime = Math.abs(now - dateObj);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
    } catch (error) {
      return 'Unknown date';
    }
  };

  // Render a fallback view if property data is missing
  if (!property) {
    return (
      <View style={styles.container}>
        <Text>No property data available.</Text>
      </View>
    );
  }
  useEffect(() => {
    const checkAuth = () => {
      const user = FIREBASE_AUTH.currentUser;
      setIsAuthenticated(!!user);

      if (!user) {
        Alert.alert(
          "Authentication Required",
          "Please sign up or log in to view property details.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Sign Up", onPress: () => navigation.navigate('Signup') }
          ]
        );
      }
    };

    checkAuth();
  }, []);

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text>Please sign up or log in to view property details.</Text>
      </View>
    );
  }

  return (


    <SafeAreaView style={styles.safeArea}>
      {/* Alert Card */}
      <AlertCard message={alertMessage} type="success" show={showAlert} />

      {/* Snackbar for notifications */}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>

      {/* Confirmation Modal for Deletion */}
      <Modal isVisible={isDialogVisible} onBackdropPress={() => setIsDialogVisible(false)}>
        <View style={styles.dialogContainer}>
          <Text style={styles.dialogTitle}>Delete Property</Text>
          <Text style={styles.dialogMessage}>
            Marking the property as unavailable will delete it. Are you sure?
          </Text>
          <View style={styles.dialogButtonContainer}>
            <TouchableOpacity
              style={[styles.dialogButton, styles.cancelButton]}
              onPress={() => setIsDialogVisible(false)}
            >
              <Text style={styles.dialogButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dialogButton, styles.deleteButton]}
              onPress={handleDeleteConfirm}
            >
              <Text style={styles.dialogButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Deleting Overlay */}
      {isDeleting && (
        <View style={styles.deletingOverlay}>
          <Animatable.View ref={deleteAnimationRef} style={styles.deletingContent}>
            <ActivityIndicator size="large" color="#FFA500" />
            <Text style={styles.deletingText}>Processing...</Text>
          </Animatable.View>
        </View>
      )}

      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          onPress={() => navigation.goBack()}
          style={styles.backIcon}
        />
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {property.propertyTitle}
        </Text>
        {/* Wishlist Button */}
        <TouchableOpacity onPress={toggleWishlist} style={styles.wishlistButton}>
          {loadingWishlist ? (
            <ActivityIndicator size="small" color="red" />
          ) : (
            <Animatable.View ref={heartIconRef}>
              <Ionicons
                name={isInWishlist ? 'heart' : 'heart-outline'}
                size={24}
                color={isInWishlist ? 'red' : 'black'}
              />
            </Animatable.View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Main Image */}
        {property.image && (
          <TouchableOpacity onPress={() => openImageViewer(0)}>
            <Image source={{ uri: property.image }} style={styles.mainImage} />
          </TouchableOpacity>
        )}

        {/* Gallery Images */}
        {property.gallery && property.gallery.length > 0 && (
          <View style={styles.galleryContainer}>
            <FlatList
              data={property.gallery}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => openImageViewer(index + 1)}>
                  <Image source={{ uri: item }} style={styles.galleryImage} />
                </TouchableOpacity>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}

        {/* Property Details */}
        <View style={styles.detailsContent}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{property.location}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Price:</Text>
            <Text style={styles.detailValue}>K{property.price}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Type:</Text>
            <Text style={styles.detailValue}>{property.type}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Description:</Text>
            <Text style={styles.detailValue}>{property.description}</Text>
          </View>
          {property.createdAt && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Uploaded:</Text>
              <Text style={styles.detailValue}>
                {property.createdAt instanceof Date
                  ? property.createdAt.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                  : 'Invalid Date'}
              </Text>
            </View>
          )}
        </View>



        {/* Payment Modal */}
        <Modal isVisible={isPaymentModalVisible} onBackdropPress={() => setIsPaymentModalVisible(false)}>
          <View style={styles.paymentModalContainer}>
            <Text style={styles.paymentModalTitle}>Enter Your Phone Number</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder="Enter 10-digit phone number"
              keyboardType="phone-pad"
              value={userPhoneNumber}
              onChangeText={setUserPhoneNumber}
              maxLength={10}
            />
            <TouchableOpacity
              style={[styles.paymentButton, isPaymentProcessing && styles.disabledButton]}
              onPress={handlePayment}
              disabled={isPaymentProcessing}
            >
              {isPaymentProcessing ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.paymentButtonText}>Make Payment</Text>
              )}
            </TouchableOpacity>
          </View>
        </Modal>

        {/* "Call Seller" Button */}
        <TouchableOpacity
          style={[styles.callButton, isPaymentProcessing && styles.disabledButton]}
          onPress={handleCallSeller}
          disabled={isPaymentProcessing}
        >
          <Ionicons name="call" size={24} color="white" />
          <Text style={styles.callButtonText}>
            {isPaymentSuccessful ? `Call ${sellerPhoneNumber}` : "Get Contact"}
          </Text>
        </TouchableOpacity>

        {/* Availability Toggle (Visible only to uploader) */}
        {isUploader && (
          <View style={styles.availabilityContainer}>
            <Text style={styles.availabilityText}>
              {isAvailable ? "Property Available" : "Mark as Unavailable"}
            </Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isAvailable ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={handleAvailabilityToggle}
              value={isAvailable}
              disabled={isDeleting}
            />
          </View>
        )}

        {/* Map */}
        {region && (
          <View style={styles.mapContainer}>
            <MapView style={styles.map} region={region}>
              <Marker
                coordinate={{
                  latitude: region.latitude,
                  longitude: region.longitude,
                }}
              />
            </MapView>
            <Text style={styles.mapDisclaimer}>
              {region.latitudeDelta > 1
                ? 'Exact location not available. Showing approximate area.'
                : 'Location may not be exact.'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Image Viewer */}
      <ImageView
        images={allImages.map((uri) => ({ uri }))}
        imageIndex={currentImageIndex}
        visible={imageViewerVisible}
        onRequestClose={() => setImageViewerVisible(false)}
      />
      {showVerifyButton && <ManualVerifyButton />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  verifyButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  verifyButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    zIndex: 1,
  },
  backIcon: {
    marginRight: 15,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  wishlistButton: {
    paddingHorizontal: 8,
  },
  scrollView: {
    paddingHorizontal: 10,
  },
  mainImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginVertical: 10,
  },
  galleryContainer: {
    marginVertical: 10,
  },
  galleryImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
  detailsContent: {
    marginVertical: 15,
    padding: 15,
    backgroundColor: '#ffe497',
    borderRadius: 10
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailLabel: {
    fontWeight: 'bold',
    width: 100,
  },
  detailValue: {
    flex: 1,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  callButtonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  availabilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  availabilityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  mapContainer: {
    marginVertical: 20,
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  mapDisclaimer: {
    textAlign: 'center',
    fontSize: 12,
    color: 'grey',
    marginTop: 5,
  },
  snackbar: {
    position: 'absolute',
    bottom: 0,
  },
  dialogContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  dialogMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  dialogButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dialogButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
  },
  dialogButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deletingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deletingContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  deletingText: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
  },
  paymentModalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  paymentModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  phoneInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  paymentButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  paymentButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
  contactButton: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DetailsScreen;

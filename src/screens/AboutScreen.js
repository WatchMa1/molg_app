import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Asset } from 'expo-asset';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Import the footer logo
const footerLogo = Asset.fromModule(require('../assets/just-Jr.png')).uri;

const AboutScreen = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={['#070d2d', '#070d2d', '#000']}
      style={styles.gradientContainer}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home" size={24} color="#FFA500" />
        </TouchableOpacity>
        <Image
          source={Asset.fromModule(
            require('../assets/nyumba-yanga-logo-trans-BG-text1.png')
          )}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.text}>
          Welcome to Provincial statistical application, this application will do alot of things
        </Text>
        <View style={styles.footer}>
          <Image source={{ uri: footerLogo }} style={styles.footerLogo} />
          <Text style={styles.footerText}>POWERED BY Avensus</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'transparent',
  },
  logo: {
    width: '100%',
    height: 130,
    alignSelf: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  text: {
    color: '#FFA500',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    paddingVertical: 10,
  },
  footerLogo: {
    width: '5%',
    height: 30,
    marginRight: 10,
  },
  footerText: {
    color: 'white',
    fontSize: 12,
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
});

export default AboutScreen;

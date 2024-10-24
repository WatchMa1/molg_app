import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Card, Icon, Image } from 'react-native-elements';

const PropertyCard = ({ property, onPress, formatDate }) => {
  const [userRole, setUserRole] = useState('admin');
  const [isAvailable, setIsAvailable] = useState(false);




  // Do not render the card if the user is not an admin and the property is not available
  if (userRole !== 'admin' && !isAvailable) {
    return null;
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <Card containerStyle={styles.card}>
        <Image
          source={null}
          style={styles.image}
          onError={(e) => console.log(e.nativeEvent.error + ': pic')}
        />

        <Card.Title style={styles.title}>
          Prototype
        </Card.Title>
        <Text style={styles.formatDate}>
          2023-10-1
        </Text>
        <View style={styles.cardfoot}>
          <Text>Category: ____</Text>
          {userRole === 'admin' ? (
            // Show switch for admin
            <View style={styles.switchContainer}>
              <Switch value={isAvailable} />
              <Text style={styles.switchLabel}>
                {isAvailable ? true : false}
              </Text>
            </View>
          ) : (
            // Show availability status for landlord and customer
            <View style={styles.statusContainer}>
              <Icon
                name='check-circle'
                type="font-awesome"
                color='green'
                size={20}
              />
              <Text style={styles.statusText}>
                Available
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.itemPrice}>ZMK 100</Text>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    alignSelf: 'flex-start',
    color: '#070d2d',
    paddingBottom: 0,
    marginBottom: 0,
  },
  itemPrice: {
    fontSize: 18,
    color: '#FFA500',
    alignSelf: 'flex-end',
  },
  cardfoot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: '500',
    color: '#070d2d',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 6,
    fontSize: 14,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  formatDate: {
    fontStyle: 'italic',
    color: 'green',
  },
});

export default PropertyCard;

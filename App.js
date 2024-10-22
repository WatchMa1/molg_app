import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import RentScreen from './src/screens/ChartsScreen';
import BuyScreen from './src/screens/TablesScreen';
import CustomHeader from './src/components/CustomHeader';
import ProfileScreen from './src/screens/ProfileScreen';
import UploadScreen from './src/screens/UploadScreen';
import StartupScreen from './src/screens/StartupScreen';
import AboutScreen from './src/screens/AboutScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  const [showSearch, setShowSearch] = React.useState(false);
  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        header: ({ navigation }) => (
          <CustomHeader
            title={route.name}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
          />
        ),
      })}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}

function RentStack() {
  const [showSearch, setShowSearch] = React.useState(false);

  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        header: ({ navigation }) => (
          <CustomHeader
            title={route.name}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
          />
        ),
      })}
    >
      <Stack.Screen name="Rent" component={RentScreen} />
    </Stack.Navigator>
  );
}

function BuyStack() {
  const [showSearch, setShowSearch] = React.useState(false);

  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        header: ({ navigation }) => (
          <CustomHeader
            title={route.name}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
          />
        ),
      })}
    >
      <Stack.Screen name="Buy" component={BuyScreen} />
    </Stack.Navigator>
  );
}

function MarketStack() {
  const [showSearch, setShowSearch] = React.useState(false);

  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        header: ({ navigation }) => (
          <CustomHeader
            title={route.name}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
          />
        ),
      })}
    >
      <Stack.Screen name="Market" component={MarketScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ headerShown: true, title: 'Product Details' }}
      />
    </Stack.Navigator>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: '#1b2c00',
        },
        tabBarActiveTintColor: '#f4f0f4',
        tabBarInactiveTintColor: '#f46500',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Rent') {
            iconName = focused ? 'key' : 'key-outline';
          } else if (route.name === 'Buy') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Market') {
            iconName = focused ? 'storefront' : 'storefront-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        children={(props) => <HomeStack {...props} />}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Rent"
        component={RentStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Buy"
        component={BuyStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Market"
        children={(props) => <MarketStack {...props} />}
        options={{ headerShown: false }}
      />
      {/* <Tab.Screen name="Chat" component={ChatScreen} /> */}
    </Tab.Navigator>
  );
}
function MainStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        header: ({ navigation }) => (
          <CustomHeader
            title={route.name}
            showSearch={false}
            setShowSearch={() => { }}
            setUser={setUser}

          />
        ),
      })}
    >
      <Stack.Screen
        name="MainTabs"
        children={(props) => <MainTabNavigator {...props} />}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Upload" component={UploadScreen} />
      <Stack.Screen name="About" component={AboutScreen} />

      <Stack.Screen name="Details" component={DetailsScreen} />

    </Stack.Navigator>
  );
}

function App() {

  const [isLoading, setIsLoading] = React.useState(true);


  // Handle the startup screen timeout
  const handleStartupScreenTimeout = () => {
    setIsLoading(false);
  };

  // Show startup screen if loading
  if (isLoading) {
    return <StartupScreen onTimeout={handleStartupScreenTimeout} />;
  }

  return (
    <NavigationContainer>
      <MainStackNavigator />
    </NavigationContainer>
  );
}



export default App;
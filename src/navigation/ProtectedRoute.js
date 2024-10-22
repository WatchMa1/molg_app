function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return <AuthStackNavigator />;
  }

  return children;
}

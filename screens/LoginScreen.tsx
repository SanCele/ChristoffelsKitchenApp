// Import React and the useState hook for managing component state
import React, { useState } from 'react';
// Import React Native components for building the user interface
// View: A container for other components
// Text: Component for displaying text
// TouchableOpacity: A touchable button that becomes slightly transparent when pressed
// ImageBackground: Component that allows you to use an image as a background
// ScrollView: A scrollable container for content that may not fit on one screen
// TextInput: Component for text input (username and password fields)
// KeyboardAvoidingView: Automatically adjusts content position when keyboard appears
// Platform: Helps detect if the app is running on iOS or Android
// StyleSheet: For creating organized and efficient styles
import { View, Text, TouchableOpacity, ImageBackground, ScrollView, TextInput, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
// Import the User type from App.tsx to ensure type consistency
import { User } from '../App';

// Define the props (properties) that this component expects to receive
interface LoginScreenProps {
  setCurrentScreen: (screen: string) => void;  // Function to change which screen is displayed
  setUser: (user: User) => void;                // Function to set the logged-in user
}

// LoginScreen Component
// This screen handles user authentication (login)
// It accepts two types of users:
// 1. Chef (username: "Christoffel", password: "Christoffel2025") - can manage menu items
// 2. Customer (username: "customer", password: "customer123") - can browse and order
const LoginScreen: React.FC<LoginScreenProps> = ({
  setCurrentScreen,
  setUser,
}) => {
  // State: Stores the username entered by the user
  // useState('') initializes it as an empty string
  const [username, setUsername] = useState('');
  
  // State: Stores the password entered by the user
  const [password, setPassword] = useState('');

  // handleLogin Function
  // This function runs when the user presses the LOGIN button
  // It checks the credentials and logs the user in if they're correct
  const handleLogin = () => {
    // Check if the credentials match the chef account
    // toLowerCase() makes the username check case-insensitive
    if (username.toLowerCase() === 'christoffel' && password === 'Christoffel2025') {
      setUser({ username: 'chef' });        // Set user type to 'chef'
      setCurrentScreen('home');             // Navigate to home screen
    // Check if the credentials match the customer account
    } else if (username.toLowerCase() === 'customer' && password === 'customer123') {
      setUser({ username: 'customer' });    // Set user type to 'customer'
      setCurrentScreen('home');             // Navigate to home screen
    } else {
      // If neither set of credentials match, show an error message
      alert('Invalid username or password.');
    }
  };

  return (
    // ImageBackground: Display a background image behind all the content
    <ImageBackground
      source={require('../assets/Rest of the screen background.png')} // Background image file
      style={styles.backgroundImage} // Style to make it fill the screen
    >
      {/* KeyboardAvoidingView: Automatically moves content up when keyboard appears */}
      {/* This prevents the keyboard from covering the input fields */}
      {}
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header Container: Top section with back button and page title */}
        <View style={styles.headerContainer}>
          {/* Back Button: Takes user back to home screen */}
          <TouchableOpacity onPress={() => setCurrentScreen('home')} style={styles.backButton}>
            <Text style={styles.backButtonText}>HOME</Text>
          </TouchableOpacity>
          {/* Page Title: Shows the user what page they are on */}
          <Text style={styles.pageTitle}>LOGIN</Text>
        </View>

        {/* ScrollView: Makes the content scrollable if needed */}
        {/* showsVerticalScrollIndicator={false} hides the scroll bar */}
        <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
          
          {/* Login Card: The main container for the login form */}
          <View style={styles.chefCard}>
            {/* Welcome Message */}
            <Text style={styles.chefTitle}>Welcome!</Text>
            {/* Instructions for the user */}
            <Text style={styles.chefSubtitle}>Please enter your credentials to login</Text>

            {/* Form Container: Wraps all form elements */}
            <View style={styles.formContainer}>
              
              {/* Username Input Group */}
              <View style={styles.inputGroup}>
                {/* Label for the username field */}
                <Text style={styles.inputLabel}>Username</Text>
                {/* TextInput: Field where user types their username */}
                <TextInput
                  style={styles.textInput}
                  value={username}                          // Current value from state
                  onChangeText={setUsername}                // Update state when user types
                  placeholder="customer or chef"            // Hint text when field is empty
                  placeholderTextColor="#999"               // Gray color for hint text
                  autoCapitalize="none"                     // Don't automatically capitalize
                  autoCorrect={false}                       // Don't auto-correct the username
                />
              </View>

              {/* Password Input Group */}
              <View style={styles.inputGroup}>
                {/* Label for the password field */}
                <Text style={styles.inputLabel}>Password</Text>
                {/* TextInput: Field where user types their password */}
                <TextInput
                  style={styles.textInput}
                  value={password}                          // Current value from state
                  onChangeText={setPassword}                // Update state when user types
                  placeholder="customer123 or chef123"      // Hint text when field is empty
                  placeholderTextColor="#999"               // Gray color for hint text
                  secureTextEntry={true}                    // Hide the password (show dots/asterisks)
                  autoCapitalize="none"                     // Don't automatically capitalize
                  autoCorrect={false}                       // Don't auto-correct the password
                />
              </View>

              {/* Login Button: When pressed, it calls handleLogin function */}
              <TouchableOpacity style={styles.addMealButton} onPress={handleLogin}>
                <Text style={styles.addMealButtonText}>LOGIN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

// Styles: Define how each component should look
const styles = StyleSheet.create({
  // backgroundImage: Makes the background image fill the entire screen
  backgroundImage: {
    flex: 1,              // Take up all available space
    width: '100%',        // Full width of the screen
    height: '100%',       // Full height of the screen
  },
  // overlay: A dark semi-transparent layer on top of the background
  overlay: {
    ...StyleSheet.absoluteFillObject,      // Spread to fill parent completely
    backgroundColor: 'rgba(0,0,0,0.7)',     // Black with 70% opacity (semi-transparent)
  },
  // headerContainer: Container for the back button and page title
  headerContainer: {
    flexDirection: 'row',                   // Arrange children horizontally (side by side)
    justifyContent: 'space-between',        // Spread children apart with space between
    alignItems: 'center',                   // Center children vertically
    paddingHorizontal: 20,                  // 20 units of space on left and right
    paddingTop: Platform.OS === 'ios' ? 50 : 40,  // More space on top for iOS (for notch)
    paddingBottom: 15,                      // 15 units of space on bottom
  },
  // backButton: Clickable area for the back button
  backButton: {
    padding: 10,          // 10 units of space inside the button (makes it easier to press)
  },
  // backButtonText: Style for the text inside the back button
  backButtonText: {
    color: '#fff',        // White color for visibility
    fontSize: 24,         // Text size
    fontWeight: 'bold',   // Make the text thick and bold
  },
  // pageTitle: Style for the "LOGIN" title
  pageTitle: {
    color: '#fff',        // White color for visibility
    fontSize: 40,         // Large text size for prominence
    fontWeight: 'bold',   // Bold text for emphasis
    flex: 1,              // Take up remaining space
    textAlign: 'center',  // Center the text horizontally
  },
  // contentContainer: Container for the scrollable content
  contentContainer: {
    flex: 1,              // Take up all available space
    padding: 20,          // 20 units of space on all sides
  },
  // chefCard: The main login form container
  chefCard: {
    backgroundColor: 'rgba(0,0,0,0.7)',  // Semi-transparent black background
    borderRadius: 20,                     // Rounded corners (20 units)
    padding: 25,                          // 25 units of space inside the card
    borderColor: '#FFD700',               // Gold border color
    borderWidth: 1,                       // 1 unit thick border
  },
  // chefTitle: Style for the "Welcome!" heading
  chefTitle: {
    fontSize: 40,         // Very large text
    fontWeight: 'bold',   // Bold for emphasis
    color: '#FFD700',     // Gold color
    marginBottom: 10,     // 10 units of space below
    textAlign: 'center',  // Center the text
  },
  // chefSubtitle: Style for the instructions text
  chefSubtitle: {
    fontSize: 32,         // Large text size
    color: '#fff',        // White color
    marginBottom: 20,     // 20 units of space below
    textAlign: 'center',  // Center the text
  },
  // formContainer: Container that wraps all form elements
  formContainer: {
    width: '100%',        // Take up full width of parent
  },
  // inputGroup: Container for each input field (label + text input)
  inputGroup: {
    marginBottom: 20,     // 20 units of space below each input group
  },
  // inputLabel: Style for the labels ("Username", "Password")
  inputLabel: {
    fontSize: 18,         // Text size
    color: '#FFD700',     // Gold color to match theme
    marginBottom: 10,     // 10 units of space below the label
  },
  // textInput: Style for the text input fields (username and password)
  textInput: {
    backgroundColor: 'rgba(0,0,0,0.3)',  // Semi-transparent black background
    color: '#fff',                        // White text color
    borderRadius: 10,                     // Rounded corners
    paddingHorizontal: 15,                // 15 units of space on left and right inside the field
    paddingVertical: 12,                  // 12 units of space on top and bottom
    fontSize: 24,                         // Text size
    borderWidth: 1,                       // 1 unit thick border
    borderColor: '#FFD700',               // Gold border color
  },
  // addMealButton: Style for the LOGIN button
  addMealButton: {
    backgroundColor: '#C41E3A',  // Dark red background color
    paddingVertical: 18,          // 18 units of space on top and bottom
    borderRadius: 10,             // Rounded corners
    alignItems: 'center',         // Center the text horizontally
    marginTop: 15,                // 15 units of space above the button
  },
  // addMealButtonText: Style for the text inside the LOGIN button
  addMealButtonText: {
    color: '#fff',        // White text color
    fontSize: 24,         // Text size
    fontWeight: 'bold',   // Bold text
  },
});

// Export the LoginScreen component so it can be used in other files
export default LoginScreen;

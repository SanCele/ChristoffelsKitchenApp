// Import necessary components from React and React Native
import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, ScrollView, StyleSheet, Platform } from 'react-native';

// Define what props this screen needs
interface AboutScreenProps {
  setCurrentScreen: (screen: string) => void; // Function to navigate to different screens
}

// AboutScreen component - displays information about the restaurant
const AboutScreen: React.FC<AboutScreenProps> = ({ setCurrentScreen }) => (
  // Background image for the screen
  <ImageBackground
    source={require('../assets/Rest of the screen background.png')}
    style={styles.backgroundImage}
    resizeMode="cover"
  >
    {/* Dark overlay for better text readability */}
    <View style={styles.overlay}>
      {/* Header with back button and title */}
      <View style={styles.headerContainer}>
        {/* Button to go back to home screen */}
        <TouchableOpacity onPress={() => setCurrentScreen('home')} style={styles.backButton}>
          <Text style={styles.backButtonText}>HOME</Text>
        </TouchableOpacity>
        {/* Page title */}
        <Text style={styles.pageTitle}>ABOUT US</Text>
      </View>

      {/* Scrollable content area */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Card containing all the about information */}
        <View style={styles.aboutCard}>
          {/* Main title */}
          <Text style={styles.aboutTitle}>Welcome to Christoffel's Kitchen</Text>
          {/* Restaurant description */}
          <Text style={styles.aboutText}>
           Christoffels kitchen is a restaurant located in Sengwayo Road, Hammarsdale, KwaZulu - Natal. The restaurant is eco - friendly and  offers a wide variety of food, sea to land food. Why wait? come to experience stomach filling nutriments.
          </Text>

          {/* Section heading */}
          <Text style={styles.aboutSubheading}>Form of communication</Text>
          {/* Contact information */}
          <Text style={styles.aboutText}>
            Please contact us by email at christoffel@gmail.com
          </Text>

        </View>
      </ScrollView>
    </View>
  </ImageBackground>
);

// Styles for the AboutScreen
const styles = StyleSheet.create({
  // Background image styling
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  // Dark overlay on background
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)', // Semi-transparent dark overlay
  },
  // Header container at the top
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 40, // Different padding for iOS vs Android
    paddingBottom: 15,
  },
  // Back button styling
  backButton: {
    padding: 10,
  },
  // Back button text
  backButtonText: {
    color: '#FFD700', // Gold color
    fontSize: 24,
    fontWeight: 'bold',
  },
  // Page title styling
  pageTitle: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  // Main content container
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  // Card containing about information
  aboutCard: {
    backgroundColor: 'rgba(0,0,0,0.7)', // Dark semi-transparent background
    borderRadius: 20, // Rounded corners
    padding: 25,
    borderColor: '#FFD700', // Gold border
    borderWidth: 1,
  },
  // Main title text
  aboutTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFD700', // Gold color
    marginBottom: 20,
    textAlign: 'center',
  },
  // Section subheading
  aboutSubheading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700', // Gold color
    marginTop: 20,
    marginBottom: 10,
  },
  // Regular text paragraphs
  aboutText: {
    fontSize: 24,
    color: '#fff', // White text
    lineHeight: 24,
    marginBottom: 15,
  },
});

export default AboutScreen;

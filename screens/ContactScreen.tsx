// Import React library - needed for creating React components
import React from 'react';
// Import React Native components for building the user interface
// View: A container for other components
// Text: Component for displaying text
// TouchableOpacity: A touchable button that becomes slightly transparent when pressed
// ImageBackground: Component that allows you to use an image as a background
// ScrollView: A scrollable container for content that may not fit on one screen
// StyleSheet: For creating organized and efficient styles
// Platform: Helps detect if the app is running on iOS or Android
import { View, Text, TouchableOpacity, ImageBackground, ScrollView, StyleSheet, Platform } from 'react-native';

// Define the props (properties) that this component expects to receive
// setCurrentScreen: A function to change which screen the user sees
interface ContactScreenProps {
  setCurrentScreen: (screen: string) => void;
}

// ContactScreen Component
// This screen displays all the restaurant's contact information including:
// - Physical address
// - Phone number
// - Email address
// - Operating hours
const ContactScreen: React.FC<ContactScreenProps> = ({ setCurrentScreen }) => (
  // ImageBackground: Display a background image behind all the content
  <ImageBackground
    source={require('../assets/Rest of the screen background.png')} // Background image file
    style={styles.backgroundImage} // Style to make it fill the screen
    resizeMode="cover" // Scale the image to cover the entire area
  >
    {/* Overlay: A semi-transparent dark layer on top of the background image */}
    {/* This makes the text easier to read by darkening the background */}
    <View style={styles.overlay}>
      
      {/* Header Container: Top section with back button and page title */}
      <View style={styles.headerContainer}>
        {/* Back Button: Takes user back to home screen when pressed */}
        <TouchableOpacity onPress={() => setCurrentScreen('home')} style={styles.backButton}>
          <Text style={styles.backButtonText}>HOME</Text>
        </TouchableOpacity>
        {/* Page Title: Shows the user what page they are on */}
        <Text style={styles.pageTitle}>CONTACT US</Text>
      </View>

      {/* ScrollView: Makes the content scrollable if it's too long for the screen */}
      {/* showsVerticalScrollIndicator={false} hides the scroll bar */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        
        {/* Contact Card: The main content area with a styled container */}
        <View style={styles.contactCard}>
          {/* Main heading for the contact information */}
          <Text style={styles.contactTitle}>Get in Touch</Text>

          {/* Location Section: Display the restaurant's physical address */}
          <View style={styles.contactSection}>
            <Text style={styles.contactHeading}>LOCATION</Text>
            <Text style={styles.contactDetail}>
              Sengwayo Road{'\n'}             {/* {'\n'} creates a new line */}
              Hammrasdale unit 6{'\n'}
              Durban,3699{'\n'}
              South Africa
            </Text>
          </View>

          {/* Phone Section: Display the restaurant's phone number */}
          <View style={styles.contactSection}>
            <Text style={styles.contactHeading}>PHONE</Text>
            <Text style={styles.contactDetail}>+27 67 481 1405</Text>
          </View>

          {/* Email Section: Display the restaurant's email address */}
          <View style={styles.contactSection}>
            <Text style={styles.contactHeading}>EMAIL</Text>
            <Text style={styles.contactDetail}>christoffel@gmail.com</Text>
          </View>

          {/* Hours Section: Display the restaurant's operating hours */}
          <View style={styles.contactSection}>
            <Text style={styles.contactHeading}>HOURS</Text>
            <Text style={styles.contactDetail}>
              Monday - Thursday: 08:00 - 22:00{'\n'}
              Friday - Saturday: 07:00 - 23:00{'\n'}
              Sunday: 09:00 - 21:00
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  </ImageBackground>
);

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
    color: '#FFD700',     // Gold color to match the restaurant's theme
    fontSize: 16,         // Size of the text
    fontWeight: 'bold',   // Make the text thick and bold
  },
  // pageTitle: Style for the "CONTACT US" title
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
  // contactCard: The main content box with contact information
  contactCard: {
    backgroundColor: 'rgba(0,0,0,0.7)',  // Semi-transparent black background
    borderRadius: 20,                     // Rounded corners (20 units)
    padding: 25,                          // 25 units of space inside the card
    borderColor: '#FFD700',               // Gold border color
    borderWidth: 1,                       // 1 unit thick border
  },
  // contactTitle: Style for the "Get in Touch" heading
  contactTitle: {
    fontSize: 40,         // Very large text
    fontWeight: 'bold',   // Bold for emphasis
    color: '#FFD700',     // Gold color
    marginBottom: 30,     // 30 units of space below
    textAlign: 'center',  // Center the text
  },
  // contactSection: Container for each contact information section
  contactSection: {
    marginBottom: 25,     // 25 units of space below each section
  },
  // contactHeading: Style for section headings (LOCATION, PHONE, etc.)
  contactHeading: {
    fontSize: 32,         // Large text size
    fontWeight: 'bold',   // Bold text
    color: '#FFD700',     // Gold color
    marginBottom: 8,      // 8 units of space below the heading
  },
  // contactDetail: Style for the actual contact information
  contactDetail: {
    fontSize: 24,         // Medium-large text size
    color: '#fff',        // White color for visibility
    lineHeight: 24,       // Space between lines of text
  },
});

// Export the ContactScreen component so it can be used in other files
export default ContactScreen;

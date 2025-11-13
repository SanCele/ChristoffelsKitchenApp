import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, ScrollView, StyleSheet, Platform } from 'react-native';

// Define the props (properties) that this component expects to receive
// setCurrentScreen: A function to change which screen the user sees
interface ContactScreenProps {
  setCurrentScreen: (screen: string) => void;
}

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
  
  backgroundImage: {
    flex: 1,              
    width: '100%',        
    height: '100%',       
  },
  // overlay: A dark semi-transparent layer on top of the background
  overlay: {
    ...StyleSheet.absoluteFillObject,      
    backgroundColor: 'rgba(0,0,0,0.7)',     
  },
  // headerContainer: Container for the back button and page title
  headerContainer: {
    flexDirection: 'row',                   
    justifyContent: 'space-between',       
    alignItems: 'center',                   
    paddingHorizontal: 20,                  
    paddingTop: Platform.OS === 'ios' ? 50 : 40,  
    paddingBottom: 15,                      
  },
  // backButton: Clickable area for the back button
  backButton: {
    padding: 10,          
  },
  // backButtonText: Style for the text inside the back button
  backButtonText: {
    color: '#FFD700',     
    fontSize: 24,         
    fontWeight: 'bold',   
  },
  // pageTitle: Style for the "CONTACT US" title
  pageTitle: {
    color: '#fff',        
    fontSize: 40,         
    fontWeight: 'bold',   
    flex: 1,              
    textAlign: 'center',  
  },
  // contentContainer: Container for the scrollable content
  contentContainer: {
    flex: 1,              
    padding: 20,          
  },
  // contactCard: The main content box with contact information
  contactCard: {
    backgroundColor: 'rgba(0,0,0,0.7)',  
    borderRadius: 20,                    
    padding: 25,                          
    borderColor: '#FFD700',              
    borderWidth: 1,                       
  },
  // contactTitle: Style for the "Get in Touch" heading
  contactTitle: {
    fontSize: 40,         
    fontWeight: 'bold',   
    color: '#FFD700',     
    marginBottom: 30,     
    textAlign: 'center',  
  },
  // contactSection: Container for each contact information section
  contactSection: {
    marginBottom: 25,     
  },
  // contactHeading: Style for section headings (LOCATION, PHONE, etc.)
  contactHeading: {
    fontSize: 32,        
    fontWeight: 'bold',   
    color: '#FFD700',     
    marginBottom: 8,      
    textAlign: 'center',
  },
  // contactDetail: Style for the actual contact information
  contactDetail: {
    fontSize: 24,         
    color: '#fff',       
    lineHeight: 24,       
    textAlign: 'center',
  },
});

// Export the ContactScreen component so it can be used in other files
export default ContactScreen;

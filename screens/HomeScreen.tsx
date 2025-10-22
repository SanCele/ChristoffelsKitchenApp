// Import necessary components from React and React Native
import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, ScrollView, Image, StyleSheet } from 'react-native';
import { Meal, User } from '../App';

// Define what props this screen needs to work
interface HomeScreenProps {
  setCurrentScreen: (screen: string) => void; // Function to navigate to different screens
  user: User | null; // Currently logged-in user (null if not logged in)
  menuItems: Meal[]; // List of all food and drinks available
  addToCart: (item: Meal) => void; // Function to add items to shopping cart
}

// Main HomeScreen component - this is what users see first
const HomeScreen: React.FC<HomeScreenProps> = ({
  setCurrentScreen,
  user,
  menuItems,
  addToCart,
}) => {
  // Function to display a section of menu items (like "Meals" or "Beverages")
  const renderMenuSection = (title: string, items: Meal[]) => {
    // If there are no items in this section, don't show anything
    if (items.length === 0) return null;

    return (
      <View style={styles.menuSection}>
        {/* Section title (e.g., "Our Delicious Meals") */}
        <Text style={styles.sectionTitle}>{title}</Text>
        {/* Loop through each item and display it */}
        {items.map((item) => (
          <View key={item.id} style={styles.menuItemCard}>
            {/* Show the food/drink image if available */}
            {item.image ? (
              <Image source={item.image} style={styles.foodImage} />
            ) : (
              // If no image, show a placeholder with the item name
              <View style={styles.placeholderFood}>
                <Text style={styles.placeholderText}>
                  {item.name.substring(0, 15)}
                </Text>
              </View>
            )}
            <View style={styles.menuItemInfo}>
              {/* Item name */}
              <Text style={styles.dishName}>{item.name}</Text>
              {/* Item description */}
              <Text style={styles.dishDescription}>{item.description}</Text>
              <View style={styles.priceRow}>
                {/* Item price */}
                <Text style={styles.dishPrice}>{item.price}</Text>
                {/* Only show "Add to Cart" button if user is logged in */}
                {user && (
                  <TouchableOpacity
                    style={styles.addToCartBtn}
                    onPress={() => addToCart(item)}
                  >
                    <Text style={styles.addToCartText}>ADD TO CART</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  // Separate menu items into meals and beverages
  const meals = menuItems.filter(item => item.type === 'meal');
  const beverages = menuItems.filter(item => item.type === 'beverage');

  return (
    // Background image for the entire screen
    <ImageBackground
      source={require('../assets/Home Screen background.png')}
      style={styles.backgroundImage}
    >
      {/* Dark overlay to make text more readable */}
      <View style={styles.overlay} />
      {/* Scrollable content area */}
      <ScrollView style={styles.contentContainer}>
        {/* Restaurant logo and name section */}
        <View style={styles.logoContainer}>
          <Text style={styles.christoffelsText}>CHRISTOFFEL'S</Text>
          <Text style={styles.kitchenText}>KITCHEN</Text>
          <View style={styles.divider} />
          <Text style={styles.tagline}>Finest Dining Experience</Text>
        </View>

        {/* Navigation buttons section */}
        <View style={styles.navigationContainer}>
          {/* Show different buttons depending on if user is logged in */}
          {user ? (
            <>
              {/* Button to view shopping cart (only visible when logged in) */}
              <TouchableOpacity
                style={[styles.navButton, styles.cartButton]}
                onPress={() => setCurrentScreen('cart')}
              >
                <Text style={styles.cartButtonText}>VIEW CART</Text>
              </TouchableOpacity>
              {/* Chef Panel button (only visible if logged in as chef) */}
              {user.username === 'chef' && (
                <TouchableOpacity
                  style={[styles.navButton, styles.chefButton]}
                  onPress={() => setCurrentScreen('chef')}
                >
                  <Text style={styles.chefButtonText}>CHEF PANEL</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
              {/* Login button (only visible when NOT logged in) */}
              <TouchableOpacity
                style={[styles.navButton, styles.primaryButton]}
                onPress={() => setCurrentScreen('login')}
              >
                <Text style={styles.primaryButtonText}>USER LOGIN</Text>
              </TouchableOpacity>
            </>
          )}
          {/* About Us button (always visible) */}
          <TouchableOpacity
            style={[styles.navButton, styles.secondaryButton]}
            onPress={() => setCurrentScreen('about')}
          >
            <Text style={styles.secondaryButtonText}>ABOUT US</Text>
          </TouchableOpacity>
          {/* Contact button (always visible) */}
          <TouchableOpacity
            style={[styles.navButton, styles.secondaryButton]}
            onPress={() => setCurrentScreen('contact')}
          >
            <Text style={styles.secondaryButtonText}>CONTACT</Text>
          </TouchableOpacity>
        </View>

        {/* Display the meals menu section */}
        {renderMenuSection('Our Delicious Meals', meals)}
        {/* Display the beverages menu section */}
        {renderMenuSection('Refreshing Beverages', beverages)}
      </ScrollView>
    </ImageBackground>
  );
};

// Styles for the HomeScreen - controls how everything looks
const styles = StyleSheet.create({
  // Background image styling
  backgroundImage: {
    flex: 1, // Take up full screen
    width: '100%',
    height: '100%',
  },
  // Dark overlay on top of background image for better text readability
  overlay: {
    ...StyleSheet.absoluteFillObject, // Cover entire screen
    backgroundColor: 'rgba(0,0,0,0.6)', // Semi-transparent black
  },
  // Main scrollable content area
  contentContainer: {
    flex: 1,
  },
  // Restaurant logo and name area
  logoContainer: {
    alignItems: 'center', // Center everything horizontally
    paddingTop: 80,
    paddingBottom: 40,
  },
  // Logo image style
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  // "CHRISTOFFEL'S" text style
  christoffelsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF', // White color
    letterSpacing: 2, // Space between letters
  },
  // "KITCHEN" text style
  kitchenText: {
    fontSize: 24,
    color: '#FFD700', // Gold color
    letterSpacing: 4, // More space between letters
    marginTop: -10, // Move closer to text above
  },
  // Horizontal line divider
  divider: {
    width: '60%',
    height: 1,
    backgroundColor: '#FFD700', // Gold line
    marginVertical: 15,
  },
  // Tagline text style
  tagline: {
    fontSize: 16,
    color: '#FFF',
    fontStyle: 'italic',
  },
  // Container for navigation buttons
  navigationContainer: {
    flexDirection: 'row', // Arrange buttons horizontally
    flexWrap: 'wrap', // Wrap to next line if needed
    justifyContent: 'center', // Center buttons
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  // Base style for all navigation buttons
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25, // Rounded corners
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Gold button style (for login)
  primaryButton: {
    backgroundColor: '#FFD700', // Gold background
  },
  // Text for primary buttons
  primaryButtonText: {
    color: '#000', // Black text
    fontWeight: 'bold',
    fontSize: 24,
  },
  // Transparent button with gold border
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFD700', // Gold border
  },
  // Text for secondary buttons
  secondaryButtonText: {
    color: '#FFD700', // Gold text
    fontWeight: 'bold',
    fontSize: 24,
  },
  // Green cart button style
  cartButton: {
    backgroundColor: '#4CAF50', // Green background
  },
  // Text for cart button
  cartButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Red chef button style
  chefButton: {
    backgroundColor: '#f44336', // Red background
  },
  // Text for chef button
  chefButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 24,
  },
  // Container for menu sections (meals or beverages)
  menuSection: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  // Section title style (e.g., "Our Delicious Meals")
  sectionTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 15,
    borderLeftWidth: 4, // Gold line on the left
    borderLeftColor: '#FFD700',
    paddingLeft: 10,
  },
  // Individual menu item card
  menuItemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden', // Keep content within rounded corners
    flexDirection: 'row', // Image on left, info on right
  },
  // Food/drink image
  foodImage: {
    width: 100,
    height: '100%',
  },
  // Placeholder if no image is available
  placeholderFood: {
    width: 100,
    height: 100,
    backgroundColor: '#333', // Dark gray
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Text inside placeholder
  placeholderText: {
    color: '#888', // Light gray
  },
  // Information section (name, description, price, button)
  menuItemInfo: {
    flex: 1, // Take remaining space
    padding: 15,
  },
  // Menu item name
  dishName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  // Menu item description
  dishDescription: {
    fontSize: 24,
    color: '#CCC', // Light gray
    marginVertical: 5,
  },
  // Container for price and "Add to Cart" button
  priceRow: {
    flexDirection: 'row', // Side by side
    justifyContent: 'space-between', // Space between price and button
    alignItems: 'center',
    marginTop: 10,
  },
  // Price text
  dishPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700', // Gold color
  },
  // "Add to Cart" button
  addToCartBtn: {
    backgroundColor: '#FFD700', // Gold background
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20, // Rounded button
  },
  // Text inside "Add to Cart" button
  addToCartText: {
    color: '#000', // Black text
    fontWeight: 'bold',
    fontSize: 24,
  },
});

export default HomeScreen;

// Import React and the useState hook for managing component state
import React, { useState } from 'react';
// Import React Native components for building the user interface
// View: A container for other components
// Text: Component for displaying text
// TouchableOpacity: A touchable button that becomes slightly transparent when pressed
// ImageBackground: Component that allows you to use an image as a background
// ScrollView: A scrollable container for content that may not fit on one screen
// TextInput: Component for text input (item details)
// KeyboardAvoidingView: Automatically adjusts content position when keyboard appears
// Platform: Helps detect if the app is running on iOS or Android
// StyleSheet: For creating organized and efficient styles
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
// Import types from App.tsx for type safety
import { Meal, User } from '../App';

// Define the props (properties) that this component expects to receive
interface ChefScreenProps {
  setCurrentScreen: (screen: string) => void;      // Function to change screens
  setUser: (user: User | null) => void;             // Function to set/clear user (for logout)
  menuItems: Meal[];                                 // Array of all menu items
  addMenuItem: (newItem: Omit<Meal, 'id'>) => void; // Function to add a new item (without id)
  removeMenuItem: (itemId: string) => void;          // Function to remove an item by its id
}

// ChefScreen Component
// This is the admin panel where the chef can:
// 1. Add new menu items (meals or beverages)
// 2. View all existing menu items
// 3. Remove menu items
// 4. Logout
const ChefScreen: React.FC<ChefScreenProps> = ({
  setCurrentScreen,
  setUser,
  menuItems,
  addMenuItem,
  removeMenuItem,
}) => {
  // State: Stores the name of the new item being added
  const [name, setName] = useState('');
  
  // State: Stores the description of the new item
  const [description, setDescription] = useState('');
  
  // State: Stores the price of the new item (as a string before adding "R" prefix)
  const [price, setPrice] = useState('');
  
  // State: Stores the category of the new item (e.g., "Starters", "Mains")
  const [category, setCategory] = useState('');
  
  // State: Stores whether the item is a 'meal' or 'beverage'
  const [type, setType] = useState<'meal' | 'beverage'>('meal');

  // handleAddItem Function
  // This function runs when the chef presses the "ADD ITEM" button
  // It validates the form and adds the new item to the menu
  const handleAddItem = () => {
    // Check if all fields are filled
    if (!name || !description || !price || !category) {
      alert('Please fill all fields correctly.');
      return; // Exit the function if validation fails
    }
    
    // Call the addMenuItem function passed from App.tsx
    // Add "R" prefix to the price for South African Rands
    addMenuItem({ name, description, price: `R${price}`, category, type });
    
    // Reset all form fields to empty after adding the item
    setName('');
    setDescription('');
    setPrice('');
    setCategory('');
  };

  // handleLogout Function
  // This function logs out the chef and returns to the home screen
  const handleLogout = () => {
    setUser(null);              // Clear the current user
    setCurrentScreen('home');   // Navigate back to home screen
  };

  // renderItemList Function
  // This function displays a list of menu items (either meals or beverages)
  // It takes a title and an array of items to display
  const renderItemList = (title: string, items: Meal[]) => (
    <View style={styles.managementSection}>
      {/* Section title (e.g., "Meals" or "Beverages") */}
      <Text style={styles.managementCategoryTitle}>{title}</Text>
      
      {/* Loop through each item and display it */}
      {items.map(item => (
        <View key={item.id} style={styles.mealItem}>
          {/* Item information container */}
          <View style={styles.mealInfo}>
            <Text style={styles.mealName}>{item.name}</Text>
            <Text style={styles.mealDescription}>{item.description}</Text>
            <Text style={styles.mealPrice}>{item.price}</Text>
          </View>
          {/* Remove button - deletes the item when pressed */}
          <TouchableOpacity
            style={styles.removeMealButton}
            onPress={() => removeMenuItem(item.id)}
          >
            <Text style={styles.removeMealButtonText}>REMOVE</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
  
  // Filter menuItems to separate meals and beverages
  const meals = menuItems.filter(item => item.type === 'meal');
  const beverages = menuItems.filter(item => item.type === 'beverage');

  return (
    // ImageBackground: Display a background image behind all the content
    <ImageBackground
      source={require('../assets/Rest of the screen background.png')}
      style={styles.backgroundImage}
    >
      {/* KeyboardAvoidingView: Automatically moves content up when keyboard appears */}
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header Container: Top section with navigation and logout */}
        <View style={styles.headerContainer}>
          {/* Back Button: Returns to home screen */}
          <TouchableOpacity onPress={() => setCurrentScreen('home')} style={styles.backButton}>
            <Text style={styles.backButtonText}>← HOME</Text>
          </TouchableOpacity>
          {/* Page Title */}
          <Text style={styles.pageTitle}>CHEF PANEL</Text>
          {/* Logout Button: Logs out the chef */}
          <TouchableOpacity onPress={handleLogout} style={styles.backButton}>
            <Text style={styles.backButtonText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>

        {/* ScrollView: Makes the content scrollable */}
        <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
          
          {/* ADD NEW ITEM CARD: Form for adding a new menu item */}
          <View style={styles.chefCard}>
            <Text style={styles.chefTitle}>Add New Item</Text>
            <View style={styles.formContainer}>
              
              {/* Item Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Item Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={name}                          // Current value from state
                  onChangeText={setName}                // Update state when user types
                  placeholder="e.g., Steak Frites"      // Hint text
                  placeholderTextColor="#999"           // Gray hint color
                />
              </View>
              
              {/* Description Input - multiline for longer text */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.textInput, styles.textAreaInput]}  // Apply multiple styles
                  value={description}
                  onChangeText={setDescription}
                  placeholder="A short description"
                  placeholderTextColor="#999"
                  multiline                              // Allow multiple lines of text
                />
              </View>
              
              {/* Price Input - numeric keyboard for entering numbers */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Price</Text>
                <TextInput
                  style={styles.textInput}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="e.g., 12.99"
                  keyboardType="numeric"                 // Show number keyboard on mobile
                />
              </View>
              
              {/* Category Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category</Text>
                <TextInput
                  style={styles.textInput}
                  value={category}
                  onChangeText={setCategory}
                  placeholder="e.g., Starters, Mains"
                />
              </View>
              
              {/* Type Selector - Choose between Meal or Beverage */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Type</Text>
                <View style={styles.typeSelector}>
                  {/* Meal Button */}
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      type === 'meal' && styles.typeButtonSelected  // Apply selected style if active
                    ]}
                    onPress={() => setType('meal')}
                  >
                    <Text style={styles.typeButtonText}>Meal</Text>
                  </TouchableOpacity>
                  {/* Beverage Button */}
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      type === 'beverage' && styles.typeButtonSelected
                    ]}
                    onPress={() => setType('beverage')}
                  >
                    <Text style={styles.typeButtonText}>Beverage</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Add Button - Submits the form */}
              <TouchableOpacity style={styles.addMealButton} onPress={handleAddItem}>
                <Text style={styles.addMealButtonText}>ADD ITEM</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* MANAGE MENU CARD: Display and manage existing menu items */}
          <View style={styles.chefCard}>
            <Text style={styles.chefTitle}>Manage Menu</Text>
            {/* Display list of meals */}
            {renderItemList("Meals", meals)}
            {/* Display list of beverages */}
            {renderItemList("Beverages", beverages)}
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
    width: '100%',        // Full width
    height: '100%'        // Full height
  },
  // overlay: A dark semi-transparent layer on top of the background
  overlay: { 
    ...StyleSheet.absoluteFillObject,        // Fill the entire parent
    backgroundColor: 'rgba(0,0,0,0.7)'       // Black with 70% opacity
  },
  // headerContainer: Container for the back button, title, and logout button
  headerContainer: { 
    flexDirection: 'row',                    // Arrange children horizontally
    justifyContent: 'space-between',         // Space items apart
    alignItems: 'center',                    // Center vertically
    paddingHorizontal: 20,                   // 20 units padding on sides
    paddingTop: Platform.OS === 'ios' ? 50 : 40,  // More padding on iOS for notch
    paddingBottom: 15                        // Bottom padding
  },
  // backButton: Clickable area for back/logout buttons
  backButton: { 
    padding: 10           // 10 units of padding to make button easier to press
  },
  // backButtonText: Style for back and logout button text
  backButtonText: { 
    color: '#fff',        // White color
    fontSize: 16,         // Text size
    fontWeight: 'bold'    // Bold text
  },
  // pageTitle: Style for the "CHEF PANEL" title
  pageTitle: { 
    color: '#fff',        // White color
    fontSize: 22,         // Text size
    fontWeight: 'bold'    // Bold text
  },
  // contentContainer: Container for the scrollable content
  contentContainer: { 
    flex: 1,              // Take up all available space
    padding: 20           // 20 units of padding on all sides
  },
  // chefCard: Container for form and menu management sections
  chefCard: { 
    backgroundColor: 'rgba(0,0,0,0.7)',  // Semi-transparent black background
    borderRadius: 20,                     // Rounded corners
    padding: 25,                          // 25 units of internal padding
    marginBottom: 30,                     // 30 units of space below
    borderColor: '#FFD700',               // Gold border
    borderWidth: 1                        // 1 unit thick border
  },
  // chefTitle: Style for section headings ("Add New Item", "Manage Menu")
  chefTitle: { 
    fontSize: 40,         // Very large text
    fontWeight: 'bold',   // Bold text
    color: '#FFD700',     // Gold color
    marginBottom: 20,     // 20 units of space below
    textAlign: 'center'   // Center the text
  },
  // formContainer: Container that wraps all form elements
  formContainer: { 
    width: '100%'         // Take up full width
  },
  // inputGroup: Container for each input field (label + input)
  inputGroup: { 
    marginBottom: 20      // 20 units of space below each group
  },
  // inputLabel: Style for input field labels
  inputLabel: { 
    fontSize: 24,         // Text size
    color: '#FFD700',     // Gold color
    marginBottom: 10      // 10 units of space below
  },
  // textInput: Style for text input fields
  textInput: { 
    backgroundColor: 'rgba(0,0,0,0.3)',  // Semi-transparent black background
    color: '#fff',                        // White text
    borderRadius: 10,                     // Rounded corners
    paddingHorizontal: 15,                // 15 units horizontal padding
    paddingVertical: 12,                  // 12 units vertical padding
    fontSize: 16,                         // Text size
    borderWidth: 1,                       // 1 unit border thickness
    borderColor: '#FFD700'                // Gold border
  },
  // textAreaInput: Additional style for multiline description field
  textAreaInput: { 
    height: 100,                   // Fixed height for multiline input
    textAlignVertical: 'top'       // Start text at the top (Android)
  },
  // typeSelector: Container for meal/beverage selector buttons
  typeSelector: { 
    flexDirection: 'row',          // Arrange buttons horizontally
    justifyContent: 'space-around', // Space buttons evenly
    marginVertical: 10             // 10 units vertical margin
  },
  // typeButton: Style for type selector buttons (Meal/Beverage)
  typeButton: { 
    paddingVertical: 12,           // 12 units vertical padding
    paddingHorizontal: 20,         // 20 units horizontal padding
    borderRadius: 25,              // Rounded corners
    borderWidth: 1,                // 1 unit border thickness
    borderColor: '#FFD700'         // Gold border
  },
  // typeButtonSelected: Additional style when button is selected
  typeButtonSelected: { 
    backgroundColor: '#FFD700'     // Gold background when selected
  },
  // typeButtonText: Style for text inside type buttons
  typeButtonText: { 
    color: '#FFD700',              // Gold color (changes when selected)
    fontWeight: 'bold'             // Bold text
  },
  // addMealButton: Style for the "ADD ITEM" button
  addMealButton: { 
    backgroundColor: '#C41E3A',    // Dark red background
    paddingVertical: 18,           // 18 units vertical padding
    borderRadius: 10,              // Rounded corners
    alignItems: 'center',          // Center text horizontally
    marginTop: 15                  // 15 units space above
  },
  // addMealButtonText: Style for text inside add button
  addMealButtonText: { 
    color: '#fff',                 // White text
    fontSize: 18,                  // Text size
    fontWeight: 'bold'             // Bold text
  },
  // managementSection: Container for meal/beverage list sections
  managementSection: { 
    marginTop: 20                  // 20 units space above
  },
  // managementCategoryTitle: Style for "Meals" and "Beverages" headings
  managementCategoryTitle: { 
    fontSize: 22,                  // Text size
    fontWeight: 'bold',            // Bold text
    color: '#FFD700',              // Gold color
    marginBottom: 15,              // 15 units space below
    borderBottomColor: '#FFD700',  // Gold bottom border
    borderBottomWidth: 1,          // 1 unit thick bottom border
    paddingBottom: 5               // 5 units padding before border
  },
  // mealItem: Container for each menu item in the list
  mealItem: { 
    backgroundColor: 'rgba(0,0,0,0.3)',  // Semi-transparent black background
    borderRadius: 10,                     // Rounded corners
    padding: 15,                          // 15 units internal padding
    flexDirection: 'row',                 // Arrange children horizontally
    justifyContent: 'space-between',      // Space apart (info on left, button on right)
    alignItems: 'center',                 // Center vertically
    marginBottom: 10,                     // 10 units space below
    borderColor: '#FFD700',               // Gold border
    borderWidth: 1                        // 1 unit thick border
  },
  // mealInfo: Container for item information (name, description, price)
  mealInfo: { 
    flex: 1,              // Take up remaining space
    marginRight: 10       // 10 units space on right (before button)
  },
  // mealName: Style for item names
  mealName: { 
    color: '#FFD700',     // Gold color
    fontSize: 32,         // Large text
    fontWeight: 'bold'    // Bold text
  },
  // mealDescription: Style for item descriptions
  mealDescription: { 
    color: '#eee',        // Off-white color
    fontSize: 24,         // Text size
    fontStyle: 'italic',  // Italic text
    marginVertical: 4     // 4 units vertical margin
  },
  // mealPrice: Style for item prices
  mealPrice: { 
    color: '#fff',        // White color
    fontSize: 24          // Text size
  },
  // removeMealButton: Style for the remove button
  removeMealButton: { 
    backgroundColor: '#C41E3A',  // Dark red background
    paddingVertical: 10,          // 10 units vertical padding
    paddingHorizontal: 15,        // 15 units horizontal padding
    borderRadius: 8               // Rounded corners
  },
  // removeMealButtonText: Style for text inside remove button
  removeMealButtonText: { 
    color: '#fff',                // White text
    fontWeight: 'bold',           // Bold text
    fontSize: 24                  // Text size
  },
});

// Export the ChefScreen component so it can be used in other files
export default ChefScreen;

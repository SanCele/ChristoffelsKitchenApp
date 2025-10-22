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
// Import the CartItem type from App.tsx to ensure type consistency
import { CartItem } from '../App';

// Define the props (properties) that this component expects to receive
interface CartScreenProps {
  setCurrentScreen: (screen: string) => void;           // Function to change screens
  cart: CartItem[];                                      // Array of items in the cart
  updateCartQuantity: (itemId: string, newQuantity: number) => void;  // Function to change item quantity
  removeFromCart: (itemId: string) => void;             // Function to remove an item from cart
}

// CartScreen Component
// This screen displays the user's shopping cart with:
// 1. List of all items added to cart
// 2. Quantity controls (+/- buttons)
// 3. Remove buttons for each item
// 4. Total price calculation
// 5. Checkout button
const CartScreen: React.FC<CartScreenProps> = ({
  setCurrentScreen,
  cart,
  updateCartQuantity,
  removeFromCart,
}) => {
  // calculateTotal Function
  // This function calculates the total price of all items in the cart
  // It loops through each cart item, extracts the numeric price (removes "R"),
  // multiplies by quantity, and sums everything up
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      // Remove the "R" prefix and convert price string to a number
      const price = parseFloat(item.price.replace('R', ''));
      // Add (price × quantity) to the running total
      return total + price * item.quantity;
    }, 0);  // Start with 0 as the initial total
  };

  return (
    // ImageBackground: Display a background image behind all the content
    <ImageBackground
      source={require('../assets/Rest of the screen background.png')}  // Background image file
      style={styles.backgroundImage}
    >
      {/* Overlay: A semi-transparent dark layer on top of the background */}
      <View style={styles.overlay}>
        
        {/* Header Container: Top section with back button and page title */}
        <View style={styles.headerContainer}>
          {/* Back Button: Takes user back to home screen */}
          <TouchableOpacity onPress={() => setCurrentScreen('home')} style={styles.backButton}>
            <Text style={styles.backButtonText}>← HOME</Text>
          </TouchableOpacity>
          {/* Page Title */}
          <Text style={styles.pageTitle}>YOUR CART</Text>
          {/* Empty placeholder view for layout balance (keeps title centered) */}
          <View style={{ width: 60 }} />
        </View>

        {/* ScrollView: Makes the content scrollable */}
        <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
          
          {/* Conditional Rendering: Show different content based on whether cart is empty */}
          {cart.length === 0 ? (
            // If cart is empty, display this message
            <Text style={styles.emptyCartText}>Your cart is empty.</Text>
          ) : (
            // If cart has items, display the cart contents
            <>
              {/* Loop through each item in the cart and display it */}
              {cart.map(item => (
                <View key={item.id} style={styles.cartItem}>
                  
                  {/* Item Information: Name, Type, and Price */}
                  <View style={styles.cartItemInfo}>
                    <Text style={styles.cartItemName}>{item.name}</Text>
                    <Text style={styles.cartItemType}>{item.type}</Text>
                    <Text style={styles.cartItemPrice}>{item.price}</Text>
                  </View>
                  
                  {/* Item Controls: Quantity buttons and Remove button */}
                  <View style={styles.cartItemControls}>
                    {/* Decrease Quantity Button (-) */}
                    <TouchableOpacity
                      style={styles.quantityBtn}
                      onPress={() => updateCartQuantity(item.id, item.quantity - 1)}
                    >
                      <Text style={styles.quantityBtnText}>-</Text>
                    </TouchableOpacity>
                    
                    {/* Display Current Quantity */}
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    
                    {/* Increase Quantity Button (+) */}
                    <TouchableOpacity
                      style={styles.quantityBtn}
                      onPress={() => updateCartQuantity(item.id, item.quantity + 1)}
                    >
                      <Text style={styles.quantityBtnText}>+</Text>
                    </TouchableOpacity>
                    
                    {/* Remove Item Button */}
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => removeFromCart(item.id)}
                    >
                      <Text style={styles.removeBtnText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              {/* Cart Total: Display the total price */}
              <View style={styles.cartTotal}>
                {/* Calculate total and format to 2 decimal places */}
                <Text style={styles.cartTotalText}>Total: R{calculateTotal().toFixed(2)}</Text>
              </View>

              {/* Checkout Button: Proceed to payment (not yet implemented) */}
              <TouchableOpacity 
                style={styles.checkoutBtn} 
                onPress={() => alert('Checkout functionality not implemented yet!')}
              >
                <Text style={styles.checkoutBtnText}>PROCEED TO CHECKOUT</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
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
  // headerContainer: Container for the back button and page title
  headerContainer: { 
    flexDirection: 'row',                    // Arrange children horizontally
    justifyContent: 'space-between',         // Space items apart
    alignItems: 'center',                    // Center vertically
    paddingHorizontal: 20,                   // 20 units padding on sides
    paddingTop: Platform.OS === 'ios' ? 50 : 40,  // More padding on iOS for notch
    paddingBottom: 15                        // Bottom padding
  },
  // backButton: Clickable area for the back button
  backButton: { 
    padding: 10           // 10 units of padding to make button easier to press
  },
  // backButtonText: Style for the back button text
  backButtonText: { 
    color: '#fff',        // White color
    fontSize: 16,         // Text size
    fontWeight: 'bold'    // Bold text
  },
  // pageTitle: Style for the "YOUR CART" title
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
  // emptyCartText: Style for "Your cart is empty" message
  emptyCartText: { 
    color: '#FFD700',     // Gold color
    fontSize: 20,         // Text size
    textAlign: 'center',  // Center the text horizontally
    marginTop: 50,        // 50 units of space above
    fontStyle: 'italic'   // Italic text style
  },
  // cartItem: Container for each item in the cart
  cartItem: { 
    flexDirection: 'row',                           // Arrange info and controls horizontally
    justifyContent: 'space-between',                // Space them apart
    alignItems: 'center',                           // Center vertically
    paddingVertical: 20,                            // 20 units padding top and bottom
    borderBottomWidth: 1,                           // 1 unit thick bottom border
    borderBottomColor: 'rgba(255, 215, 0, 0.3)'    // Semi-transparent gold border
  },
  // cartItemInfo: Container for item details (left side)
  cartItemInfo: { 
    flex: 1               // Take up remaining space on the left
  },
  // cartItemName: Style for the item name
  cartItemName: { 
    color: '#FFD700',     // Gold color
    fontSize: 20,         // Text size
    fontWeight: 'bold'    // Bold text
  },
  // cartItemType: Style for item type ("meal" or "beverage")
  cartItemType: { 
    color: '#ccc',               // Light gray color
    fontSize: 14,                // Smaller text size
    fontStyle: 'italic',         // Italic style
    textTransform: 'capitalize'  // Capitalize first letter
  },
  // cartItemPrice: Style for the item price
  cartItemPrice: { 
    color: '#eee',        // Off-white color
    fontSize: 16,         // Text size
    marginTop: 8          // 8 units of space above
  },
  // cartItemControls: Container for quantity controls and remove button (right side)
  cartItemControls: { 
    flexDirection: 'row',        // Arrange buttons horizontally
    alignItems: 'center'         // Center vertically
  },
  // quantityBtn: Style for the + and - buttons
  quantityBtn: { 
    width: 35,                              // 35 units wide
    height: 35,                             // 35 units tall (square)
    borderRadius: 17.5,                     // Half of width/height makes it circular
    backgroundColor: 'rgba(255, 215, 0, 0.2)',  // Semi-transparent gold background
    justifyContent: 'center',               // Center text vertically
    alignItems: 'center',                   // Center text horizontally
    marginHorizontal: 5                     // 5 units spacing on left and right
  },
  // quantityBtnText: Style for + and - text inside buttons
  quantityBtnText: { 
    color: '#FFD700',     // Gold color
    fontSize: 20,         // Text size
    fontWeight: 'bold'    // Bold text
  },
  // quantityText: Style for the number showing current quantity
  quantityText: { 
    color: '#fff',        // White color
    fontSize: 18,         // Text size
    fontWeight: 'bold',   // Bold text
    marginHorizontal: 15  // 15 units spacing on left and right
  },
  // removeBtn: Style for the Remove button
  removeBtn: { 
    marginLeft: 15,       // 15 units space on the left
    padding: 8            // 8 units internal padding
  },
  // removeBtnText: Style for "Remove" text
  removeBtnText: { 
    color: '#C41E3A',     // Dark red color
    fontSize: 14,         // Text size
    fontWeight: 'bold'    // Bold text
  },
  // cartTotal: Container for the total price display
  cartTotal: { 
    marginTop: 30,                             // 30 units space above
    paddingTop: 20,                            // 20 units padding inside at top
    borderTopWidth: 1,                         // 1 unit thick top border
    borderTopColor: 'rgba(255, 215, 0, 0.5)',  // Semi-transparent gold border
    alignItems: 'flex-end'                     // Align content to the right
  },
  // cartTotalText: Style for the total price text
  cartTotalText: { 
    color: '#FFD700',     // Gold color
    fontSize: 22,         // Large text size
    fontWeight: 'bold'    // Bold text
  },
  // checkoutBtn: Style for the "PROCEED TO CHECKOUT" button
  checkoutBtn: { 
    backgroundColor: '#C41E3A',  // Dark red background
    paddingVertical: 18,          // 18 units vertical padding
    borderRadius: 10,             // Rounded corners
    alignItems: 'center',         // Center text horizontally
    marginTop: 30                 // 30 units space above
  },
  // checkoutBtnText: Style for the checkout button text
  checkoutBtnText: { 
    color: '#fff',        // White text
    fontSize: 18,         // Text size
    fontWeight: 'bold',   // Bold text
    letterSpacing: 1      // 1 unit of space between letters
  },
});

// Export the CartScreen component so it can be used in other files
export default CartScreen;

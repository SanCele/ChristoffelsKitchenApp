import React, { useState, useCallback } from 'react';
import { ImageBackground, View, StatusBar, StyleSheet, Alert, Platform, ToastAndroid, Modal, Text, Pressable } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import AboutScreen from './screens/AboutScreen';
import ContactScreen from './screens/ContactScreen';
import ChefScreen from './screens/ChefScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';

// Define the structure for a user object
export type User = {
  username: string;
};

// Define the structure for a menu item
export type Meal = {
  id: string;
  name: string;
  description: string;
  price: string;
  type: 'meal' | 'beverage';
  category: string;
  image?: any;
};

// A cart item is a meal with an added quantity property
export type CartItem = Meal & {
  quantity: number;
};

// GLOBAL VARIABLES - Used across the application
 
export let totalOrdersProcessed: number = 0;
export let totalRevenue: number = 0;
export let customerVisitCount: number = 0;
export let popularItemsCache: string[] = [];

// UTILITY FUNCTIONS - Using loops to organize code

// Function: Calculate total cart value using a FOR LOOP
// Iterates through cart items and sums up (price * quantity)
 
export function calculateCartTotal(cart: CartItem[]): number {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    const price = parseFloat(item.price.replace('R', ''));
    total += price * item.quantity;
  }
  return total;
}

// Function: Count items in cart using a WHILE LOOP
// Returns total number of individual items (considering quantities)
 
export function countCartItems(cart: CartItem[]): number {
  let count = 0;
  let i = 0;
  while (i < cart.length) {
    count += cart[i].quantity;
    i++;
  }
  return count;
}

// Function: Filter menu items by category using a FOR LOOP
// Returns array of items matching the specified category
export function filterMenuByCategory(items: Meal[], category: string): Meal[] {
  const filtered: Meal[] = [];
  for (let i = 0; i < items.length; i++) {
    if (items[i].category === category) {
      filtered.push(items[i]);
    }
  }
  return filtered;
}


// Function: Finding most expensive item using a WHILE LOOP
//  Iterates through menu to find the highest priced item
export function findMostExpensiveItem(items: Meal[]): Meal | null {
  if (items.length === 0) return null;
  
  let mostExpensive = items[0];
  let i = 1;
  while (i < items.length) {
    const currentPrice = parseFloat(items[i].price.replace('R', ''));
    const maxPrice = parseFloat(mostExpensive.price.replace('R', ''));
    if (currentPrice > maxPrice) {
      mostExpensive = items[i];
    }
    i++;
  }
  return mostExpensive;
}

// Function: Search menu items by name using FOR LOOP
// Case-insensitive search through menu items
export function searchMenuItems(items: Meal[], searchTerm: string): Meal[] {
  const results: Meal[] = [];
  const lowerSearch = searchTerm.toLowerCase();
  
  for (let i = 0; i < items.length; i++) {
    if (items[i].name.toLowerCase().includes(lowerSearch) ||
        items[i].description.toLowerCase().includes(lowerSearch)) {
      results.push(items[i]);
    }
  }
  return results;
}

// Function: Get all unique categories using FOR LOOP
// Extracts and returns unique category names
 
export function getUniqueCategories(items: Meal[]): string[] {
  const categories: string[] = [];
  for (let i = 0; i < items.length; i++) {
    if (!categories.includes(items[i].category)) {
      categories.push(items[i].category);
    }
  }
  return categories;
}


// Function: Calculate average price using WHILE LOOP
// Returns the average price of all menu items
 
export function calculateAveragePrice(items: Meal[]): number {
  if (items.length === 0) return 0;
  
  let total = 0;
  let i = 0;
  while (i < items.length) {
    total += parseFloat(items[i].price.replace('R', ''));
    i++;
  }
  return total / items.length;
}

// Function: Update global revenue (modifies global variable)

export function updateGlobalRevenue(amount: number): void {
  totalRevenue += amount;
}

// Function: Increment global orders counter

export function incrementOrdersProcessed(): void {
  totalOrdersProcessed++;
}

// Function: Track customer visit (updates global variable)

export function trackCustomerVisit(): void {
  customerVisitCount++;
}

//  Function: Update popular items cache using FOR LOOP
//  Analyzes cart history and updates global cache

export function updatePopularItemsCache(cart: CartItem[]): void {
  popularItemsCache = [];
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].quantity > 1) {
      popularItemsCache.push(cart[i].name);
    }
  }
}

// Function: Validate menu item using WHILE LOOP
// Checks if item meets all requirements
 
export function validateMenuItem(item: Omit<Meal, 'id'>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const checks = [
    { condition: item.name.length < 3, message: 'Name must be at least 3 characters' },
    { condition: item.description.length < 10, message: 'Description must be at least 10 characters' },
    { condition: !item.price || item.price === 'R0', message: 'Price must be set' },
    { condition: !item.category, message: 'Category is required' }
  ];
  
  let i = 0;
  while (i < checks.length) {
    if (checks[i].condition) {
      errors.push(checks[i].message);
    }
    i++;
  }
  
  return { valid: errors.length === 0, errors };
}

//  Function: Apply discount to cart using FOR LOOP
//  Applies percentage discount to all items
export function applyDiscountToCart(cart: CartItem[], discountPercent: number): number {
  let discountedTotal = 0;
  for (let i = 0; i < cart.length; i++) {
    const price = parseFloat(cart[i].price.replace('R', ''));
    const itemTotal = price * cart[i].quantity;
    discountedTotal += itemTotal * (1 - discountPercent / 100);
  }
  return discountedTotal;
}

// Function: Generate order summary using WHILE LOOP
// Creates a formatted string of all cart items

export function generateOrderSummary(cart: CartItem[]): string {
  let summary = 'Order Summary:\n\n';
  let i = 0;
  while (i < cart.length) {
    const item = cart[i];
    summary += `${item.name} x${item.quantity} - ${item.price}\n`;
    i++;
  }
  summary += `\nTotal Items: ${countCartItems(cart)}`;
  summary += `\nTotal: R${calculateCartTotal(cart).toFixed(2)}`;
  return summary;
}

// INITIAL MENU ITEMS

const initialMenuItems: Meal[] = [
  { id: '1', name: 'Tomato Soup', description: 'A classic creamy tomato soup.', price: 'R7.50', type: 'meal', category: 'Starters', image: require('./assets/Tomato Soup.jpg') },
  { id: '2', name: 'Classic Bruschetta', description: 'Toasted bread with fresh tomatoes, garlic, and basil.', price: 'R38.00', type: 'meal', category: 'Starters', image: require('./assets/Classic Bruschetta.png') },
  { id: '3', name: 'Grilled Ribeye Steak', description: 'Juicy ribeye steak grilled to perfection.', price: 'R25.00', type: 'meal', category: 'Mains', image: require('./assets/Grilled Ribeye Steak.png') },
  { id: '4', name: 'Pan-seared Salmon', description: 'Fresh salmon fillet with a crispy skin.', price: 'R22.50', type: 'meal', category: 'Mains', image: require('./assets/Pan-seared Salmon.png') },
  { id: '5', name: 'Classic Tiramisu', description: 'A coffee-flavored Italian dessert.', price: 'R20', type: 'meal', category: 'Desserts', image: require('./assets/Classic Tiramisu.jpg') },
  { id: '6', name: 'Espresso', description: 'A strong shot of coffee.', price: 'R3.50', type: 'beverage', category: 'Hot Drinks', image: require('./_Images/Espresso.jpg') },
  { id: '7', name: 'Real Espresso', description: 'A real strong shot of coffee.', price: 'R13.50', type: 'beverage', category: 'Hot Drinks', image: require('./_Images/Real Espresso.png') },
  { id: '8', name: 'Fresh Orange Juice', description: 'Freshly squeezed orange juice.', price: 'R14.50', type: 'beverage', category: 'Cold Drinks', image: require('./_Images/Fresh Orange Juice.png') },
  { id: '9', name: 'Craft Beer', description: 'A locally brewed craft beer.', price: 'R26.50', type: 'beverage', category: 'Alcoholic', image: require('./_Images/Craft Beer.jpg') },
  { id: '10', name: 'Home Housewine', description: 'A glass of our finest house wine.', price: 'R37.00', type: 'beverage', category: 'Alcoholic', image: require('./_Images/Home Housewine.png') },
];

// MAIN APP UI

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [menuItems, setMenuItems] = useState<Meal[]>(initialMenuItems);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [checkoutSummaryText, setCheckoutSummaryText] = useState('');
  const [checkoutTotalAmount, setCheckoutTotalAmount] = useState<number | null>(null);

  // Track customer visit when app loads (using global variable)
  React.useEffect(() => {
    trackCustomerVisit();
    console.log(`Total customer visits: ${customerVisitCount}`);
  }, []);

  const addMenuItem = useCallback((newItem: Omit<Meal, 'id'>) => {
    // Validating item before adding using our validation function
    const validation = validateMenuItem(newItem);
    if (!validation.valid) {
      Alert.alert('Invalid Item', validation.errors.join('\n'));
      return;
    }
    
    const itemToAdd = { ...newItem, id: Date.now().toString() };
    setMenuItems(prev => [...prev, itemToAdd]);
  }, []);

  const removeMenuItem = useCallback((itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const addToCart = useCallback((item: Meal) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  }, []);

  const updateCartQuantity = useCallback((itemId: string, newQuantity: number) => {
    setCart(prevCart => {
      if (newQuantity <= 0) {
        return prevCart.filter(item => item.id !== itemId);
      }
      return prevCart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
    });
  }, []);

  // Enhanced checkout handler using our utility functions
  const proceedToCheckout = useCallback(() => {
    if (!user) {
      setCurrentScreen('login');
      return;
    }

    if (cart.length === 0) {
      if (Platform.OS === 'android') {
        ToastAndroid.show('Cart is empty — add items before checkout', ToastAndroid.SHORT);
      } else {
        Alert.alert('Cart is empty', 'Add items to your cart before checking out.');
      }
      return;
    }

    // Calculating the total using our FOR LOOP function
    const total = calculateCartTotal(cart);
    
    // Counting items using our WHILE LOOP function
    const itemCount = countCartItems(cart);
    
    // Update global variables
    updateGlobalRevenue(total);
    incrementOrdersProcessed();
    updatePopularItemsCache(cart);
    
    // Generate order summary
    const summary = generateOrderSummary(cart);
    
    // Log statistics (for demonstration)
    console.log('=== Order Statistics ===');
    console.log(summary);
    console.log(`Total Revenue Today: R${totalRevenue.toFixed(2)}`);
    console.log(`Total Orders Processed: ${totalOrdersProcessed}`);
    console.log(`Popular Items: ${popularItemsCache.join(', ')}`);
    
    // Clear cart and show a modal with the order summary
    setCart([]);
    setCheckoutSummaryText(summary);
    setCheckoutTotalAmount(total);
    setCheckoutModalVisible(true);
  }, [user, cart]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen 
                  setCurrentScreen={setCurrentScreen} 
                  setUser={setUser}
                  user={user} 
                  menuItems={menuItems} 
                  addToCart={addToCart} 
                />;
      case 'about':
        return <AboutScreen setCurrentScreen={setCurrentScreen} />;
      case 'contact':
        return <ContactScreen setCurrentScreen={setCurrentScreen} />;
      case 'login':
        return <LoginScreen setCurrentScreen={setCurrentScreen} setUser={setUser} />;
      case 'chef':
        return <ChefScreen 
                 setCurrentScreen={setCurrentScreen} 
                 menuItems={menuItems} 
                 addMenuItem={addMenuItem} 
                 removeMenuItem={removeMenuItem} 
                 setUser={setUser} 
               />;
      case 'cart':
        return <CartScreen 
                 setCurrentScreen={setCurrentScreen} 
                 cart={cart} 
                 removeFromCart={removeFromCart} 
                 updateCartQuantity={updateCartQuantity}
                 proceedToCheckout={proceedToCheckout}
               />;
      default:
        return <HomeScreen 
                  setCurrentScreen={setCurrentScreen} 
                  setUser={setUser}
                  user={user} 
                  menuItems={menuItems}
                  addToCart={addToCart} 
                />;
    }
  };

  const closeCheckoutModal = () => {
    setCheckoutModalVisible(false);
    // After closing modal, go back to home screen
    setCurrentScreen('home');
  };

  return (
    <ImageBackground source={require('./assets/Home Screen background.png')} style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <StatusBar barStyle="light-content" />
      {renderScreen()}

      {/* Checkout success modal shown after a successful purchase */}
      <Modal
        visible={checkoutModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeCheckoutModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Purchase Successful</Text>
            <Text style={styles.modalText}>
              {checkoutSummaryText}
            </Text>
            {checkoutTotalAmount !== null && (
              <Text style={styles.modalText}>Total Paid: {`R${checkoutTotalAmount.toFixed(2)}`}</Text>
            )}
            <Pressable style={styles.modalCloseButton} onPress={closeCheckoutModal}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 40,
    fontWeight: '700',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalCloseButton: {
    marginTop: 12,
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 24,
  },
});
import React, { useState, useCallback } from 'react';
import { ImageBackground, View, StatusBar, StyleSheet } from 'react-native';
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

// Set up the initial list of all menu items
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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [menuItems, setMenuItems] = useState<Meal[]>(initialMenuItems);
  const [cart, setCart] = useState<CartItem[]>([]);

  const addMenuItem = useCallback((newItem: Omit<Meal, 'id'>) => {
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

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen 
                  setCurrentScreen={setCurrentScreen} 
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
               />;
      default:
        return <HomeScreen 
                  setCurrentScreen={setCurrentScreen} 
                  user={user} 
                  menuItems={menuItems}
                  addToCart={addToCart} 
                />;
    }
  };

  return (
    <ImageBackground source={require('./assets/Home Screen background.png')} style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <StatusBar barStyle="light-content" />
      {renderScreen()}
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
});
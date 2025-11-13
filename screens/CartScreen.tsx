import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { CartItem } from '../App';

// Global Variable 
let cartVisits = 0; // counts how many times the cart was opened

// Function: turning string like "R25.00" into a number 25.00
function parseRand(value: string | number): number {
  if (typeof value === 'number') {
    return value;
  } else {
    const cleaned = value.replace('R', '');
    return parseFloat(cleaned);
  }
}

// Function: formating a number into Rand currency
function formatRand(amount: number): string {
  return `R${amount.toFixed(2)}`;
}

// Function: using a for loop to add up all prices
function getTotalWithForLoop(prices: number[]) {
  let total = 0;
  for (let i = 0; i < prices.length; i++) {
    total += prices[i];
  }
  return total;
}

// Function: use a while loop to count how many expensive items there are
function countExpensiveItems(prices: number[]) {
  let count = 0;
  let i = 0;
  while (i < prices.length) {
    if (prices[i] > 50) {
      count++;
    }
    i++;
  }
  return count;
}

// Function: another for loop to make a list of item names
function getItemNames(cart: CartItem[]) {
  const names: string[] = [];
  for (let i = 0; i < cart.length; i++) {
    names.push(cart[i].name);
  }
  return names;
}

// Function that uses global variable and other functions
function getCartStats(cart: CartItem[]) {
  cartVisits++; // using global variable
  const prices = cart.map(item => parseRand(item.price));
  const total = getTotalWithForLoop(prices);
  const expensiveCount = countExpensiveItems(prices);
  const names = getItemNames(cart).join(', ');

  return `Visit ${cartVisits} | Total: R${total} | Expensive items: ${expensiveCount} | Items: ${names}`;
}

// Main Component 
interface CartScreenProps {
  setCurrentScreen: (screen: string) => void;
  cart: CartItem[];
  updateCartQuantity: (itemId: string, newQuantity: number) => void;
  removeFromCart: (itemId: string) => void;
  proceedToCheckout?: () => void;
}

const CartScreen: React.FC<CartScreenProps> = ({
  setCurrentScreen,
  cart,
  updateCartQuantity,
  removeFromCart,
  proceedToCheckout,
}) => {
  // Function to calculate total using function and for loop
  function calculateTotal() {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
      const price = parseRand(cart[i].price);
      total += price * cart[i].quantity;
    }
    return total;
  }

  // Get cart info text (using global var + loops)
  const infoText = getCartStats(cart);

  return (
    <ImageBackground
      source={require('../assets/Rest of the screen background.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => setCurrentScreen('home')} style={styles.backButton}>
            <Text style={styles.backButtonText}>HOME</Text>
          </TouchableOpacity>
          <Text style={styles.pageTitle}>YOUR CART</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
          {/* Style display of logic output */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>{infoText}</Text>
          </View>

          {cart.length === 0 ? (
            <Text style={styles.emptyCartText}>Your cart is empty.</Text>
          ) : (
            <>
              {cart.map(item => (
                <View key={item.id} style={styles.cartItem}>
                  <View style={styles.cartItemInfo}>
                    <Text style={styles.cartItemName}>{item.name}</Text>
                    <Text style={styles.cartItemType}>{item.type}</Text>
                    <Text style={styles.cartItemPrice}>{item.price}</Text>
                  </View>

                  <View style={styles.cartItemControls}>
                    <TouchableOpacity
                      style={styles.quantityBtn}
                      onPress={() =>
                        updateCartQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                    >
                      <Text style={styles.quantityBtnText}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.quantityText}>{item.quantity}</Text>

                    <TouchableOpacity
                      style={styles.quantityBtn}
                      onPress={() => updateCartQuantity(item.id, item.quantity + 1)}
                    >
                      <Text style={styles.quantityBtnText}>+</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => removeFromCart(item.id)}
                    >
                      <Text style={styles.removeBtnText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <View style={styles.cartTotal}>
                <Text style={styles.cartTotalText}>Total: {formatRand(calculateTotal())}</Text>
              </View>

              <TouchableOpacity
                style={styles.checkoutBtn}
                onPress={() => {
                  if (typeof proceedToCheckout === 'function') {
                    proceedToCheckout();
                  } else {
                    Alert.alert('Checkout', 'Checkout not ready yet!');
                  }
                }}
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

// Styles for the cart screen
const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)' },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 15,
  },
  backButton: { padding: 10 },
  backButtonText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  pageTitle: { color: '#fff', fontSize: 40, fontWeight: 'bold' },
  contentContainer: { flex: 1, padding: 20 },
  emptyCartText: {
    color: '#FFD700',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
  },
  infoBox: {
    backgroundColor: 'rgba(0, 0, 0, 1)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  infoText: { color: '#FFD700', fontSize: 24 },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,215,0,0.3)',
  },
  cartItemInfo: { flex: 1 },
  cartItemName: { color: '#FFD700', fontSize: 32, fontWeight: 'bold' },
  cartItemType: { color: '#ccc', fontSize: 24, fontStyle: 'italic' },
  cartItemPrice: { color: '#eee', fontSize: 24, marginTop: 5 },
  cartItemControls: { flexDirection: 'row', alignItems: 'center' },
  quantityBtn: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(255,215,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  quantityBtnText: { color: '#FFD700', fontSize: 24, fontWeight: 'bold' },
  quantityText: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginHorizontal: 10 },
  removeBtn: { marginLeft: 15 },
  removeBtnText: { color: '#C41E3A', fontSize: 24, fontWeight: 'bold' },
  cartTotal: {
    marginTop: 25,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,215,0,0.4)',
    alignItems: 'flex-end',
  },
  cartTotalText: { color: '#FFD700', fontSize: 24, fontWeight: 'bold' },
  checkoutBtn: {
    backgroundColor: '#C41E3A',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
  },
  checkoutBtnText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
});

export default CartScreen;


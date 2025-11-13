import React, { useState } from 'react';
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
  Alert,
} from 'react-native';

// Defining types for this screen
interface Meal {
  id: string;
  name: string;
  description: string;
  price: string | number;
  category: string;
  type: 'meal' | 'beverage';
}

interface User {
  username: string;
  role: string;
}



// FUNCTIONS for price Parsing/Formatting 
function parseRand(value: string | number): number {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const cleaned = value.toString().replace(/[^0-9.\-\.]/g, '');
  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatRand(amount: number): string {
  if (!Number.isFinite(amount)) amount = 0;
  return `R${amount.toFixed(2)}`;
}

// FOR LOOP 
// Function: Calculating total menu value using for loop
function calculateTotalMenuValue(items: Meal[]): number {
  let total = 0;
  // FOR LOOP: Iterate through all items
  for (let i = 0; i < items.length; i++) {
    total += parseRand(items[i].price);
  }
  return total;
}

// Function: Calculating average price using for loop
function calculateAveragePrice(items: Meal[]): number {
  if (items.length === 0) return 0;
  let sum = 0;
  // FOR LOOP: Sum of all prices
  for (let i = 0; i < items.length; i++) {
    sum += parseRand(items[i].price);
  }
  return sum / items.length;
}

// Function: Finding most expensive item using for loop
function findMostExpensiveItem(items: Meal[]): Meal | null {
  if (items.length === 0) return null;
  let maxItem = items[0];
  let maxPrice = parseRand(items[0].price);
  
  // FOR LOOP: Comparing all items
  for (let i = 1; i < items.length; i++) {
    const currentPrice = parseRand(items[i].price);
    if (currentPrice > maxPrice) {
      maxPrice = currentPrice;
      maxItem = items[i];
    }
  }
  return maxItem;
}

// WHILE LOOP 
// Function: Finding items by category using while loop
function findItemsByCategory(items: Meal[], searchCategory: string): Meal[] {
  const results: Meal[] = [];
  let index = 0;
  
  // WHILE LOOP: Search through items
  while (index < items.length) {
    if (items[index].category.toLowerCase() === searchCategory.toLowerCase()) {
      results.push(items[index]);
    }
    index++;
  }
  return results;
}

// Function: Counting items in price range using while loop
function countItemsInPriceRange(items: Meal[], min: number, max: number): number {
  let count = 0;
  let index = 0;
  
  // WHILE LOOP: Counting items within range
  while (index < items.length) {
    const price = parseRand(items[index].price);
    if (price >= min && price <= max) {
      count++;
    }
    index++;
  }
  return count;
}

// Function: Finding first item above price using while loop
function findFirstItemAbovePrice(items: Meal[], threshold: number): Meal | null {
  let index = 0;
  
  // WHILE LOOP: Searching until condition met
  while (index < items.length) {
    if (parseRand(items[index].price) > threshold) {
      return items[index];
    }
    index++;
  }
  return null;
}

//  NESTED FOR LOOP 
// Function: Category summary using nested loops
function getCategorySummary(items: Meal[]): string {
  const categories = ['Starters', 'Mains', 'Desserts', 'Beverages'];
  let summary = '';
  
  // FOR LOOP: Iterating through categories
  for (let i = 0; i < categories.length; i++) {
    let categoryCount = 0;
    let categoryTotal = 0;
    
    // FOR LOOP: Counting items in each category
    for (let j = 0; j < items.length; j++) {
      if (items[j].category === categories[i]) {
        categoryCount++;
        categoryTotal += parseRand(items[j].price);
      }
    }
    
    if (categoryCount > 0) {
      summary += `${categories[i]}: ${categoryCount} items (${formatRand(categoryTotal)})\n`;
    }
  }
  
  return summary || 'No items in standard categories';
}

// Function: Creating price comparison matrix
function generatePriceComparison(items: Meal[]): string {
  const limit = Math.min(items.length, 3); // Limit to 3x3 for readability
  let matrix = 'Price Differences (first 3 items):\n\n';
  
  if (limit === 0) return 'No items to compare';
  
  // NESTED FOR LOOPS: Creating comparison matrix
  for (let i = 0; i < limit; i++) {
    let row = '';
    for (let j = 0; j < limit; j++) {
      const price1 = parseRand(items[i].price);
      const price2 = parseRand(items[j].price);
      const diff = Math.abs(price1 - price2);
      row += `${formatRand(diff)} `;
    }
    matrix += row + '\n';
  }
  
  return matrix;
}

// Function: Finding similar priced items using nested loops
function findSimilarPricedItems(items: Meal[], tolerance: number): string {
  let pairs = '';
  
  // NESTED FOR LOOPS: Comparing all pairs
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const price1 = parseRand(items[i].price);
      const price2 = parseRand(items[j].price);
      const diff = Math.abs(price1 - price2);
      
      if (diff <= tolerance) {
        pairs += `${items[i].name} & ${items[j].name} (Diff: ${formatRand(diff)})\n`;
      }
    }
  }
  
  return pairs || 'No similar priced items found';
}

// FUNCTIONS for validation
// Function: Validating price input
function isValidPrice(price: string): boolean {
  const numPrice = parseFloat(price);
  return !isNaN(numPrice) && numPrice > 0;
}

// Function: Validating all form fields
function validateFormFields(name: string, description: string, price: string, category: string): boolean {
  if (!name || name.trim().length === 0) return false;
  if (!description || description.trim().length === 0) return false;
  if (!category || category.trim().length === 0) return false;
  if (!isValidPrice(price)) return false;
  return true;
}

// COMPONENT PROPS INTERFACE 
interface ChefScreenProps {
  setCurrentScreen: (screen: string) => void;
  setUser: (user: User | null) => void;
  menuItems: Meal[];
  // addMenuItem now returns the created Meal so callers can store it
  addMenuItem: (newItem: Omit<Meal, 'id'>) => Meal | undefined;
  removeMenuItem: (itemId: string) => void;
}

// CHEF SCREEN UI
const ChefScreen: React.FC<ChefScreenProps> = ({
  setCurrentScreen,
  setUser,
  menuItems,
  addMenuItem,
  removeMenuItem,
}) => {
  // State for form inputs
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'meal' | 'beverage'>('meal');
  // Local array to track items added during this session in the chef panel
  const [addedItems, setAddedItems] = useState<Meal[]>([]);

  // DEFINED FUNCTION: Handle adding new item
  const handleAddItem = () => {
    // Validating using defined function
    if (!validateFormFields(name, description, price, category)) {
      Alert.alert('Validation Error', 'Please fill all fields correctly with valid data.');
      return;
    }
    
    // Add item to app-level menu (returns created item)
    const created = addMenuItem({ name, description, price: `R${price}`, category, type });
    // Save created item in a local array as well
    if (created) {
      setAddedItems(prev => [...prev, created]);
    }
    
    // Reset form
    setName('');
    setDescription('');
    setPrice('');
    setCategory('');
    
    Alert.alert('Success', 'Item added successfully!');
  };

  // FUNCTION: Handle removing item
  const handleRemoveItem = (itemId: string) => {
    removeMenuItem(itemId);
    Alert.alert('Success', 'Item removed!');
  };

  // FUNCTION: Handle logout
  const handleLogout = () => {
    // Logout: clear user and return home
    setUser(null);
    setCurrentScreen('home');
  };

  // FUNCTION: Render item list with remove functionality
  const renderItemList = (title: string, items: Meal[]) => {
    // Use FOR LOOP to render items
    const itemElements = [];
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      itemElements.push(
        <View key={item.id} style={styles.mealItem}>
          <View style={styles.mealInfo}>
            <Text style={styles.mealName}>{item.name}</Text>
            <Text style={styles.mealDescription}>{item.description}</Text>
            <Text style={styles.mealPrice}>{formatRand(parseRand(item.price))}</Text>
            <Text style={styles.mealCategory}>Category: {item.category}</Text>
          </View>
          <TouchableOpacity
            style={styles.removeMealButton}
            onPress={() => handleRemoveItem(item.id)}
          >
            <Text style={styles.removeMealButtonText}>REMOVE</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <View style={styles.managementSection}>
        <Text style={styles.managementCategoryTitle}>{title}</Text>
        {items.length === 0 ? (
          <Text style={styles.emptyMessage}>No items in this category</Text>
        ) : (
          <>{itemElements}</>
        )}
      </View>
    );
  };
  
  // Filter menuItems using WHILE LOOP
  const meals: Meal[] = [];
  const beverages: Meal[] = [];
  let idx = 0;
  
  while (idx < menuItems.length) {
    if (menuItems[idx].type === 'meal') {
      meals.push(menuItems[idx]);
    } else {
      beverages.push(menuItems[idx]);
    }
    idx++;
  }

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200' }}
      style={styles.backgroundImage}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => setCurrentScreen('home')} style={styles.backButton}>
            <Text style={styles.backButtonText}>HOME</Text>
          </TouchableOpacity>
          <Text style={styles.pageTitle}>CHEF PANEL</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.backButton}>
            <Text style={styles.backButtonText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>

          {/* Add New Item Card */}
          <View style={styles.chefCard}>
            <Text style={styles.chefTitle}>Add New Item</Text>
            <View style={styles.formContainer}>
              
              {/* Item Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Item Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g., Steak Frites"
                  placeholderTextColor="#999"
                />
              </View>
              
              {/* Description Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.textInput, styles.textAreaInput]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="A short description"
                  placeholderTextColor="#999"
                  multiline
                />
              </View>
              
              {/* Price Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Price (Numbers only)</Text>
                <TextInput
                  style={styles.textInput}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="e.g., 12.99"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>
              
              {/* Category Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category</Text>
                <TextInput
                  style={styles.textInput}
                  value={category}
                  onChangeText={setCategory}
                  placeholder="e.g., Starters, Mains, Desserts"
                  placeholderTextColor="#999"
                />
              </View>
              
              {/* Type Selector */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Type</Text>
                <View style={styles.typeSelector}>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      type === 'meal' && styles.typeButtonSelected
                    ]}
                    onPress={() => setType('meal')}
                  >
                    <Text style={[
                      styles.typeButtonText,
                      type === 'meal' && styles.typeButtonTextSelected
                    ]}>Meal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      type === 'beverage' && styles.typeButtonSelected
                    ]}
                    onPress={() => setType('beverage')}
                  >
                    <Text style={[
                      styles.typeButtonText,
                      type === 'beverage' && styles.typeButtonTextSelected
                    ]}>Beverage</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Add Button */}
              <TouchableOpacity style={styles.addMealButton} onPress={handleAddItem}>
                <Text style={styles.addMealButtonText}>ADD ITEM</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Manage Menu Card */}
          <View style={styles.chefCard}>
            <Text style={styles.chefTitle}>Manage Menu</Text>
            <Text style={styles.managementSubtitle}>
              Total Value: {formatRand(calculateTotalMenuValue(menuItems))} | 
              Avg Price: {formatRand(calculateAveragePrice(menuItems))}
            </Text>
            {renderItemList("Meals", meals)}
            {renderItemList("Beverages", beverages)}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

// Styles for the chef screen
const styles = StyleSheet.create({
  backgroundImage: { 
    flex: 1,
    width: '100%',
    height: '100%'
  },
  overlay: { 
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  headerContainer: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 15
  },
  backButton: { 
    padding: 10
  },
  backButtonText: { 
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold'
  },
  pageTitle: { 
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold'
  },
  contentContainer: { 
    flex: 1,
    padding: 20
  },
  chefCard: { 
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    borderColor: '#FFD700',
    borderWidth: 1
  },
  chefTitle: { 
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 20,
    textAlign: 'center'
  },
  managementSubtitle: {
    fontSize: 24,
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 15,
    fontStyle: 'italic'
  },
  formContainer: { 
    width: '100%'
  },
  inputGroup: { 
    marginBottom: 20
  },
  inputLabel: { 
    fontSize: 24,
    color: '#FFD700',
    marginBottom: 8
  },
  textInput: { 
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#FFD700'
  },
  textAreaInput: { 
    height: 100,
    textAlignVertical: 'top'
  },
  typeSelector: { 
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10
  },
  typeButton: { 
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFD700',
    backgroundColor: 'transparent'
  },
  typeButtonSelected: { 
    backgroundColor: '#FFD700'
  },
  typeButtonText: { 
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 24,
  },
  typeButtonTextSelected: {
    color: '#000'
  },
  addMealButton: { 
    backgroundColor: '#C41E3A',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15
  },
  addMealButtonText: { 
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold'
  },
  managementSection: { 
    marginTop: 20
  },
  managementCategoryTitle: { 
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
    borderBottomColor: '#FFD700',
    borderBottomWidth: 1,
    paddingBottom: 5
  },
  emptyMessage: {
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10
  },
  mealItem: { 
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderColor: '#FFD700',
    borderWidth: 1
  },
  mealInfo: { 
    flex: 1,
    marginRight: 10
  },
  mealName: { 
    color: '#FFD700',
    fontSize: 32,
    fontWeight: 'bold'
  },
  mealDescription: { 
    color: '#eee',
    fontSize: 24,
    fontStyle: 'italic',
    marginVertical: 4
  },
  mealPrice: { 
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold'
  },
  mealCategory: {
    color: '#13b3c2ff',
    fontSize: 24,
    marginTop: 4
  },
  removeMealButton: { 
    backgroundColor: '#C41E3A',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8
  },
  removeMealButtonText: { 
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24
  },
});

export default ChefScreen;
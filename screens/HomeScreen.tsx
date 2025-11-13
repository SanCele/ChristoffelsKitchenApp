import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, ScrollView, Image, StyleSheet, Alert } from 'react-native';
import { Meal, User } from '../App';

function parseRand(value: string | number): number {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  // Remove any non-numeric characters like currency symbol and commas
  const cleaned = value.toString().replace(/[^0-9.\-]/g, '');
  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatRand(amount: number): string {
  if (!Number.isFinite(amount)) amount = 0;
  return `R${amount.toFixed(2)}`;
}

// UTILITY FUNCTIONS using FOR and WHILE loops



// Function: Calculate total menu value using FOR LOOP
// Sums up all menu item prices

function calculateTotalMenuValue(items: Meal[]): number {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += parseRand(items[i].price);
  }
  return total;
}

// Function: Find cheapest item using WHILE LOOP
//  Iterates through menu to find lowest priced item

function findCheapestItem(items: Meal[]): Meal | null {
  if (items.length === 0) return null;
  
  let cheapest = items[0];
  let i = 1;
  
  while (i < items.length) {
    const currentPrice = parseRand(items[i].price);
    const cheapestPrice = parseRand(cheapest.price);
    
    if (currentPrice < cheapestPrice) {
      cheapest = items[i];
    }
    i++;
  }
  
  return cheapest;
}


// Function: Filter items by price range using FOR LOOP
// Returns items within specified price range
 
function filterByPriceRange(items: Meal[], minPrice: number, maxPrice: number): Meal[] {
  const filtered: Meal[] = [];
  
  for (let i = 0; i < items.length; i++) {
    const price = parseRand(items[i].price);
    if (price >= minPrice && price <= maxPrice) {
      filtered.push(items[i]);
    }
  }
  
  return filtered;
}


// Function: Count items by type using WHILE LOOP
// Returns count of meals vs beverages
 
function countItemsByType(items: Meal[]): { meals: number; beverages: number } {
  let mealCount = 0;
  let beverageCount = 0;
  let i = 0;
  
  while (i < items.length) {
    if (items[i].type === 'meal') {
      mealCount++;
    } else if (items[i].type === 'beverage') {
      beverageCount++;
    }
    i++;
  }
  
  return { meals: mealCount, beverages: beverageCount };
}

// Function: Sort items by price using FOR LOOP
// Returns sorted array (ascending order)

function sortItemsByPrice(items: Meal[], ascending: boolean = true): Meal[] {
  const sorted = [...items];
  
  // Bubble sort implementation using for loops
  for (let i = 0; i < sorted.length - 1; i++) {
    for (let j = 0; j < sorted.length - i - 1; j++) {
      const price1 = parseRand(sorted[j].price);
      const price2 = parseRand(sorted[j + 1].price);
      
      if (ascending ? price1 > price2 : price1 < price2) {
        // Swap elements
        const temp = sorted[j];
        sorted[j] = sorted[j + 1];
        sorted[j + 1] = temp;
      }
    }
  }
  
  return sorted;
}

//  Function: Geting items by category using WHILE LOOP
//  Returns all items in specified category
 
function getItemsByCategory(items: Meal[], targetCategory: string): Meal[] {
  const results: Meal[] = [];
  let i = 0;
  
  while (i < items.length) {
    if (items[i].category.toLowerCase() === targetCategory.toLowerCase()) {
      results.push(items[i]);
    }
    i++;
  }
  
  return results;
}


//  Function: Calculating average price by category using FOR LOOP
//  Returns average price for each category
 
function calculateAveragePriceByCategory(items: Meal[]): { [category: string]: number } {
  const categoryTotals: { [key: string]: number } = {};
  const categoryCounts: { [key: string]: number } = {};
  
  for (let i = 0; i < items.length; i++) {
    const category = items[i].category;
    const price = parseRand(items[i].price);
    
    if (!categoryTotals[category]) {
      categoryTotals[category] = 0;
      categoryCounts[category] = 0;
    }
    
    categoryTotals[category] += price;
    categoryCounts[category]++;
  }
  
  const averages: { [key: string]: number } = {};
  for (const category in categoryTotals) {
    averages[category] = categoryTotals[category] / categoryCounts[category];
  }
  
  return averages;
}

// Function: Searching items by keyword using WHILE LOOP
// Searches through name and description

function searchItems(items: Meal[], keyword: string): Meal[] {
  const results: Meal[] = [];
  const lowerKeyword = keyword.toLowerCase();
  let i = 0;
  
  while (i < items.length) {
    const item = items[i];
    if (item.name.toLowerCase().includes(lowerKeyword) ||
        item.description.toLowerCase().includes(lowerKeyword)) {
      results.push(item);
    }
    i++;
  }
  
  return results;
}

// Featured deals helper removed

// Function: Generating menu statistics using FOR LOOP
// Creating comprehensive statistics report

function generateMenuStatistics(items: Meal[]): string {
  const stats = countItemsByType(items);
  const cheapest = findCheapestItem(items);
  const totalValue = calculateTotalMenuValue(items);
  const averages = calculateAveragePriceByCategory(items);
  
  let report = '=== Menu Statistics ===\n';
  report += `Total Items: ${items.length}\n`;
  report += `Meals: ${stats.meals}\n`;
  report += `Beverages: ${stats.beverages}\n`;
  report += `Total Menu Value: ${formatRand(totalValue)}\n`;
  report += `Cheapest Item: ${cheapest?.name || 'N/A'} - ${cheapest ? formatRand(parseRand(cheapest.price)) : 'N/A'}\n`;
  report += `\nAverage Prices by Category:\n`;
  
  for (const category in averages) {
    report += `  ${category}: ${formatRand(averages[category])}\n`;
  }
  
  return report;
}

// Function: Validate menu items using WHILE LOOP
// Checks for any invalid items in the menu
 
function validateMenuItems(items: Meal[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  let i = 0;
  
  while (i < items.length) {
    const item = items[i];
    if (!item.name || item.name.length < 2) {
      errors.push(`Item at index ${i} has invalid name`);
    }
    if (!item.price || parseRand(item.price) <= 0) {
      errors.push(`${item.name} has invalid price`);
    }
    if (!item.category) {
      errors.push(`${item.name} has no category`);
    }
    i++;
  }
  
  return { valid: errors.length === 0, errors };
}

// COMPONENT INTERFACE
interface HomeScreenProps {
  setCurrentScreen: (screen: string) => void;
  user: User | null;
  menuItems: Meal[];
  addToCart: (item: Meal) => void;
  setUser: (user: User | null) => void;
}

// HOMESCREEN COMPONENT
const HomeScreen: React.FC<HomeScreenProps> = ({
  setCurrentScreen,
  user,
  menuItems,
  addToCart,
  setUser,
}) => {
  
  const [priceFilter, setPriceFilter] = useState<'all' | 'budget' | 'premium'>('all');

  // Track screen view on component mount
  useEffect(() => {
    // Validating menu items
    const validation = validateMenuItems(menuItems);
    if (!validation.valid) {
      console.warn('Menu validation errors:', validation.errors);
    }
    
    // Log statistics
    console.log(generateMenuStatistics(menuItems));
  }, [menuItems]);

  // Enhanced add to cart handler using utility functions
   
  const handleAddToCart = (item: Meal) => {
    // Call the original addToCart function
    addToCart(item);
  };

   // Function: Get filtered menu items based on price filter
  const getFilteredItems = (): Meal[] => {
    if (priceFilter === 'budget') {
      return filterByPriceRange(menuItems, 0, 20);
    } else if (priceFilter === 'premium') {
      return filterByPriceRange(menuItems, 20, 1000);
    }
    return menuItems;
  };

   // Function: Render menu item card
  const renderMenuItem = (item: Meal) => {
    return (
      <View key={item.id} style={styles.menuItemCard}>
        {item.image ? (
          <Image source={item.image} style={styles.foodImage} />
        ) : (
          <View style={styles.placeholderFood}>
            <Text style={styles.placeholderText}>
              {item.name.substring(0, 15)}
            </Text>
          </View>
        )}
        <View style={styles.menuItemInfo}>
          <Text style={styles.dishName}>{item.name}</Text>
          <Text style={styles.dishDescription}>{item.description}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.dishPrice}>{formatRand(parseRand(item.price))}</Text>
            {user && user.username !== 'chef' && (
              <TouchableOpacity
                style={styles.addToCartBtn}
                onPress={() => handleAddToCart(item)}
              >
                <Text style={styles.addToCartText}>ADD TO CART</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

// Function: Render course section with items
   
  const renderCourseSection = (courseTitle: string, items: Meal[]) => {
    if (items.length === 0) return null;
    
    // Calculate average price for this course using our function
    const averages = calculateAveragePriceByCategory(items);
    const avgPrice = averages[courseTitle] || 0;
    
    return (
      <View key={courseTitle} style={styles.courseContainer}>
        <View style={styles.courseTitleContainer}>
          <Text style={styles.courseTitle}>{courseTitle}</Text>
          <Text style={styles.courseAverage}>Avg: {formatRand(avgPrice)}</Text>
        </View>
        {items.map((item) => renderMenuItem(item))}
      </View>
    );
  };

  // Get filtered items
  const filteredItems = getFilteredItems();
  
  // Separate into meals and beverages using our counting function
  const meals = filteredItems.filter(item => item.type === 'meal');
  const beverages = filteredItems.filter(item => item.type === 'beverage');

  // Get unique categories
  const mealCategories = Array.from(new Set(meals.map(m => m.category)));
  const beverageCategories = Array.from(new Set(beverages.map(b => b.category)));

  // Featured deals removed

  // Count items by type
  const itemCounts = countItemsByType(filteredItems);

  return (
    <ImageBackground
      source={require('../assets/Home Screen background.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay} />
      <ScrollView style={styles.contentContainer}>
        {/* Restaurant logo and name section */}
        <View style={styles.logoContainer}>
          <Text style={styles.christoffelsText}>CHRISTOFFEL'S</Text>
          <Text style={styles.kitchenText}>KITCHEN</Text>
          <View style={styles.divider} />
          <Text style={styles.tagline}>Finest Dining Experience</Text>
        </View>

        {/* Statistics feature removed */}

        {/* Navigation buttons section */}
        <View style={styles.navigationContainer}>
          {user ? (
            <>
              {user.username !== 'chef' && (
                <TouchableOpacity
                  style={[styles.navButton, styles.cartButton]}
                  onPress={() => setCurrentScreen('cart')}
                >
                  <Text style={styles.cartButtonText}>VIEW CART</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.navButton, styles.logoutButton]}
                onPress={() => {
                  // Log the user out and return to home view
                  setUser(null);
                  setCurrentScreen('home');
                }}
              >
                <Text style={styles.logoutButtonText}>LOGOUT</Text>
              </TouchableOpacity>
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
            <TouchableOpacity
              style={[styles.navButton, styles.primaryButton]}
              onPress={() => setCurrentScreen('login')}
            >
              <Text style={styles.primaryButtonText}>USER LOGIN</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.navButton, styles.secondaryButton]}
            onPress={() => setCurrentScreen('about')}
          >
            <Text style={styles.secondaryButtonText}>ABOUT US</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, styles.secondaryButton]}
            onPress={() => setCurrentScreen('contact')}
          >
            <Text style={styles.secondaryButtonText}>CONTACT</Text>
          </TouchableOpacity>
          {/* Show-stats button removed */}
        </View>

        {/* Price Filter Section */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filter by Price:</Text>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[styles.filterButton, priceFilter === 'all' && styles.filterButtonActive]}
              onPress={() => setPriceFilter('all')}
            >
              <Text style={styles.filterButtonText}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, priceFilter === 'budget' && styles.filterButtonActive]}
              onPress={() => setPriceFilter('budget')}
            >
              <Text style={styles.filterButtonText}>Budget (&lt;R20)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, priceFilter === 'premium' && styles.filterButtonActive]}
              onPress={() => setPriceFilter('premium')}
            >
              <Text style={styles.filterButtonText}>Expensive(≥R20)</Text>
            </TouchableOpacity>
          </View>
        </View>

         {/* Display meals grouped by course */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>
            Our Delicious Meals ({itemCounts.meals})
          </Text>
          {mealCategories.map(cat => 
            renderCourseSection(cat, meals.filter(m => m.category === cat))
          )}
        </View>

        {/* Display beverages grouped by course */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>
            Refreshing Beverages ({itemCounts.beverages})
          </Text>
          {beverageCategories.map(cat => 
            renderCourseSection(cat, beverages.filter(b => b.category === cat))
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};


// Styles for the HomeScreen
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  contentContainer: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  christoffelsText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 2,
  },
  kitchenText: {
    fontSize: 40,
    color: '#FFD700',
    letterSpacing: 4,
    marginTop: -10,
  },
  divider: {
    width: '60%',
    height: 1,
    backgroundColor: '#FFD700',
    marginVertical: 15,
  },
  tagline: {
    fontSize: 32,
    color: '#FFF',
    fontStyle: 'italic',
  },
  navigationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#FFD700',
  },
  primaryButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 24,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  secondaryButtonText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 24,
  },
  cartButton: {
    backgroundColor: '#4CAF50',
  },
  cartButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 24,
  },
  chefButton: {
    backgroundColor: '#f44336',
  },
  chefButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 24,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 24,
    color: '#FFD700',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  filterButtonActive: {
    backgroundColor: '#FFD700',
  },
  filterButtonText: {
    color: '#FFF',
    fontSize: 24,
  },
  menuSection: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
    paddingLeft: 10,
  },
  courseContainer: {
    marginBottom: 18,
  },
  courseTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFF',
    paddingLeft: 6,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(255,215,0,0.6)',
  },
  courseAverage: {
    fontSize: 24,
    color: '#FFD700',
    fontStyle: 'italic',
  },
  menuItemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  foodImage: {
    width: 100,
    height: '100%',
  },
  placeholderFood: {
    width: 100,
    height: 100,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
  },
  menuItemInfo: {
    flex: 1,
    padding: 15,
  },
  dishName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  dishDescription: {
    fontSize: 24,
    color: '#CCC',
    marginVertical: 5,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  dishPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  addToCartBtn: {
    backgroundColor: '#FFD700',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  addToCartText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 24,
  },
  logoutButton: {
    backgroundColor: '#e53935',
  },
  logoutButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 24,
  },
});

export default HomeScreen;

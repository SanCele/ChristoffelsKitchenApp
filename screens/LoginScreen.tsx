import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, ScrollView, TextInput, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { User } from '../App';

// GLOBAL VARIABLES for LoginScreen
let totalLoginAttempts: number = 0;
let successfulLogins: number = 0;
let failedLogins: number = 0;
let loginHistory: string[] = [];

// UTILITY FUNCTIONS using FOR and WHILE loops

// Function: Validate username length using FOR LOOP
// Checks if username meets minimum length requirement

function validateUsernameLength(username: string, minLength: number = 3): boolean {
  let validChars = 0;
  for (let i = 0; i < username.length; i++) {
    if (username[i].trim() !== '') {
      validChars++;
    }
  }
  return validChars >= minLength;
}

// Function: Validating password strength using WHILE LOOP
// Checks password complexity requirements
 
function validatePasswordStrength(password: string): { valid: boolean; message: string } {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  
  let hasLetter = false;
  let hasNumber = false;
  let i = 0;
  
  while (i < password.length) {
    const char = password[i];
    if (char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z') {
      hasLetter = true;
    }
    if (char >= '0' && char <= '9') {
      hasNumber = true;
    }
    i++;
  }
  
  if (!hasLetter) {
    return { valid: false, message: 'Password must contain letters' };
  }
  if (!hasNumber) {
    return { valid: false, message: 'Password must contain numbers' };
  }
  
  return { valid: true, message: 'Password is strong' };
}

// Function: Count login attempts for a user using FOR LOOP
// Searches through login history

function countUserLoginAttempts(username: string): number {
  let count = 0;
  for (let i = 0; i < loginHistory.length; i++) {
    if (loginHistory[i].includes(username)) {
      count++;
    }
  }
  return count;
}

//  Function: Check if user is locked out using WHILE LOOP
// Checks last N failed attempts

function isUserLockedOut(username: string, maxAttempts: number = 5): boolean {
  let recentFailures = 0;
  let i = loginHistory.length - 1;
  
  while (i >= 0 && recentFailures < maxAttempts) {
    if (loginHistory[i].includes(username) && loginHistory[i].includes('FAILED')) {
      recentFailures++;
    } else if (loginHistory[i].includes(username) && loginHistory[i].includes('SUCCESS')) {
      break; // Stop if there's a successful login
    }
    i--;
  }
  
  return recentFailures >= maxAttempts;
}


// Function: Sanitize input using FOR LOOP
// Removes potentially harmful characters
 
function sanitizeInput(input: string): string {
  const forbidden = ['<', '>', '"', "'", '/', '\\', ';'];
  let sanitized = '';
  
  for (let i = 0; i < input.length; i++) {
    let isForbidden = false;
    for (let j = 0; j < forbidden.length; j++) {
      if (input[i] === forbidden[j]) {
        isForbidden = true;
        break;
      }
    }
    if (!isForbidden) {
      sanitized += input[i];
    }
  }
  
  return sanitized;
}

// Function: Log login attempt (updates global variables)
function logLoginAttempt(username: string, success: boolean): void {
  totalLoginAttempts++;
  
  if (success) {
    successfulLogins++;
    loginHistory.push(`${username} - SUCCESS - ${new Date().toISOString()}`);
  } else {
    failedLogins++;
    loginHistory.push(`${username} - FAILED - ${new Date().toISOString()}`);
  }
  
  // Keep only last 50 entries to prevent memory issues
  if (loginHistory.length > 50) {
    loginHistory.shift();
  }
}

// Function: Calculate success rate using global variables
function calculateSuccessRate(): number {
  if (totalLoginAttempts === 0) return 0;
  return (successfulLogins / totalLoginAttempts) * 100;
}

//  Function: Generate login statistics report

function generateLoginStats(): string {
  return `
// Login Statistics

Total Attempts: ${totalLoginAttempts}
Successful Logins: ${successfulLogins}
Failed Logins: ${failedLogins}
Success Rate: ${calculateSuccessRate().toFixed(1)}%
Recent History: ${loginHistory.slice(-5).join(', ')}
  `.trim();
}

// Function: Check credential match using FOR LOOP
// Compares against valid credentials
 
function checkCredentials(username: string, password: string): { valid: boolean; userType: string } {
  const validCredentials = [
    { user: 'christoffel', pass: 'Christoffel2025', type: 'chef' },
    { user: 'customer', pass: 'customer123', type: 'customer' }
  ];
  
  for (let i = 0; i < validCredentials.length; i++) {
    if (username.toLowerCase() === validCredentials[i].user && password === validCredentials[i].pass) {
      return { valid: true, userType: validCredentials[i].type };
    }
  }
  
  return { valid: false, userType: '' };
}

// Function: Formating username using WHILE LOOP
// Removes extra spaces and formats properly

function formatUsername(input: string): string {
  let formatted = '';
  let i = 0;
  let lastWasSpace = false;
  
  while (i < input.length) {
    const char = input[i];
    if (char === ' ') {
      if (!lastWasSpace && formatted.length > 0) {
        formatted += ' ';
        lastWasSpace = true;
      }
    } else {
      formatted += char;
      lastWasSpace = false;
    }
    i++;
  }
  
  return formatted.trim();
}

// Function: Geting recent login activity using FOR LOOP
// Returns last N login entries
 
function getRecentActivity(count: number = 5): string[] {
  const recent: string[] = [];
  const startIndex = Math.max(0, loginHistory.length - count);
  
  for (let i = startIndex; i < loginHistory.length; i++) {
    recent.push(loginHistory[i]);
  }
  
  return recent;
}

// COMPONENT INTERFACE
interface LoginScreenProps {
  setCurrentScreen: (screen: string) => void;
  setUser: (user: User) => void;
}

// LOGINSCREEN COMPONENT
const LoginScreen: React.FC<LoginScreenProps> = ({
  setCurrentScreen,
  setUser,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

// Enhanced handleLogin function using utility functions
// Validates input, checks credentials, and logs attempt
  const handleLogin = () => {
    // Clear previous error
    setErrorMessage('');

    // Sanitize inputs using FOR LOOP function
    const cleanUsername = sanitizeInput(username);
    const cleanPassword = sanitizeInput(password);

    // Format username using WHILE LOOP function
    const formattedUsername = formatUsername(cleanUsername);

    // Validate username length using FOR LOOP function
    if (!validateUsernameLength(formattedUsername)) {
      setErrorMessage('Username must be at least 3 characters');
      logLoginAttempt(formattedUsername, false);
      return;
    }

    // Check if user is locked out using WHILE LOOP function
    if (isUserLockedOut(formattedUsername)) {
      setErrorMessage('Account locked due to too many failed attempts. Please try again later.');
      return;
    }

    // Validate password strength using WHILE LOOP function
    const passwordValidation = validatePasswordStrength(cleanPassword);
    if (!passwordValidation.valid) {
      setErrorMessage(passwordValidation.message);
      logLoginAttempt(formattedUsername, false);
      return;
    }

    // Check credentials using FOR LOOP function
    const credentialCheck = checkCredentials(formattedUsername, cleanPassword);
    
    if (credentialCheck.valid) {
      // Log successful login
      logLoginAttempt(formattedUsername, true);
      
      // Set user and navigate to home
      setUser({ username: credentialCheck.userType });
      
      // Log statistics to console
      console.log(generateLoginStats());
      console.log(`User "${formattedUsername}" logged in as ${credentialCheck.userType}`);
      
      setCurrentScreen('home');
    } else {
      // Log failed login
      logLoginAttempt(formattedUsername, false);
      
      // Show error message
      setErrorMessage('Invalid username or password.');
      
      // Log current stats
      console.log(generateLoginStats());
    }
  };

  // Function: Handle username input change
  // Updates state and provides real-time validation
  const handleUsernameChange = (text: string) => {
    setUsername(text);
    setErrorMessage(''); // Clear error when user types
  };


  // Function: Handles password input change
  // Updates state and provides real-time validation

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setErrorMessage(''); // Clear error when user types
  };

  return (
    <ImageBackground
      source={require('../assets/Rest of the screen background.png')}
      style={styles.backgroundImage}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header Container */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => setCurrentScreen('home')} style={styles.backButton}>
            <Text style={styles.backButtonText}>HOME</Text>
          </TouchableOpacity>
          <Text style={styles.pageTitle}>LOGIN</Text>
        </View>

        <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
          {/* Login Card */}
          <View style={styles.chefCard}>
            <Text style={styles.chefTitle}>Welcome!</Text>
            <Text style={styles.chefSubtitle}>Please enter your credentials to login</Text>

            {/* Login Statistics Display */}
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>Login Attempts: {totalLoginAttempts}</Text>
              <Text style={styles.statsText}>Success Rate: {calculateSuccessRate().toFixed(1)}%</Text>
            </View>

            <View style={styles.formContainer}>
              {/* Username Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Username</Text>
                <TextInput
                  style={styles.textInput}
                  value={username}
                  onChangeText={handleUsernameChange}
                  placeholder="customer or Christoffel"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {username.length > 0 && (
                  <Text style={styles.helperText}>
                    Length: {username.length} characters
                  </Text>
                )}
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.textInput}
                  value={password}
                  onChangeText={handlePasswordChange}
                  placeholder="customer123 or Christoffel2025"
                  placeholderTextColor="#999"
                  secureTextEntry={true}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {password.length > 0 && (
                  <Text style={styles.helperText}>
                    Strength: {password.length >= 6 ? 'Good' : 'Too short'}
                  </Text>
                )}
              </View>

              {/* Error Message Display */}
              {errorMessage !== '' && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              )}

              {/* Login Button */}
              <TouchableOpacity style={styles.addMealButton} onPress={handleLogin}>
                <Text style={styles.addMealButtonText}>LOGIN</Text>
              </TouchableOpacity>

              {/* Hint Text */}
              <View style={styles.hintContainer}>
                <Text style={styles.hintText}>Valid Credentials:</Text>
                <Text style={styles.hintText}>- Chef: Christoffel / Christoffel2025</Text>
                <Text style={styles.hintText}>- Customer: customer / customer123</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

// Styles for the login screen
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 15,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  pageTitle: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  chefCard: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    padding: 25,
    borderColor: '#FFD700',
    borderWidth: 1,
  },
  chefTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
    textAlign: 'center',
  },
  chefSubtitle: {
    fontSize: 32,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  statsText: {
    color: '#FFD700',
    fontSize: 24,
    marginBottom: 5,
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 24,
    color: '#FFD700',
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 24,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  helperText: {
    color: '#999',
    fontSize: 24,
    marginTop: 5,
    marginLeft: 5,
  },
  errorContainer: {
    backgroundColor: 'rgba(196, 30, 58, 0.3)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#C41E3A',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  addMealButton: {
    backgroundColor: '#C41E3A',
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  addMealButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  hintContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
    borderRadius: 10,
  },
  hintText: {
    color: '#999',
    fontSize: 24,
    marginBottom: 5,
  },
});

export default LoginScreen;
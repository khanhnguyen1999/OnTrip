import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  Switch,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<any>>()

  const handleSignIn = () => {
    // Navigate to Register screen when Sign In is clicked
    navigation.navigate("(tabs)/index")
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header with time and status icons */}
      <View style={styles.header}>
        <Text style={styles.headerTime}>9:41</Text>
        <View style={styles.headerIcons}>
          <Feather name="wifi" size={14} color="#000" />
          <Feather name="battery" size={14} color="#000" style={{ marginLeft: 5 }} />
        </View>
      </View>

      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <Image
          source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-24%20at%2023.43.11-9pSfINbDKIDL6xA0j6j595wKsqtIfu.png' }}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      {/* Title Section */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Register</Text>
        <Text style={styles.subtitle}>Please register to login.</Text>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        {/* Username Input */}
        <View style={styles.inputContainer}>
          <Feather name="user" size={20} color="#8E8E93" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Username..."
            value={username}
            onChangeText={setUsername}
          />
        </View>

        {/* Mobile Number Input */}
        <View style={styles.inputContainer}>
          <Feather name="user" size={20} color="#8E8E93" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Firstname..."
            value={firstname}
            onChangeText={setFirstname}
          />
        </View>

        <View style={styles.inputContainer}>
          <Feather name="user" size={20} color="#8E8E93" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Lastname..."
            value={lastname}
            onChangeText={setLastname}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} color="#8E8E93" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password..."
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity 
            style={styles.passwordToggle}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        {/* Remember Me Toggle */}
        <View style={styles.rememberContainer}>
          <Text style={styles.rememberText}>Remember me next time</Text>
          <Switch
            value={rememberMe}
            onValueChange={setRememberMe}
            trackColor={{ false: '#D1D1D6', true: '#1A2F4B' }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#D1D1D6"
          />
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.signUpButton}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Sign In Link */}
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have account? </Text>
          <TouchableOpacity onPress={handleSignIn}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerTime: {
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  illustrationContainer: {
    alignItems: 'center',
    marginTop: 20,
    height: 200,
  },
  illustration: {
    width: '80%',
    height: '100%',
  },
  titleContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A2F4B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#1A2F4B',
  },
  passwordToggle: {
    padding: 8,
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  signUpButton: {
    backgroundColor: '#1A2F4B',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  signInLink: {
    fontSize: 14,
    color: '#1A2F4B',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
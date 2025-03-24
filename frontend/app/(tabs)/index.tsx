"use client"

import { useState } from "react"
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Switch,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

export default function LoginScreen() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const navigation = useNavigation<NativeStackNavigationProp<any>>()

  const handleSignIn = () => {
    // Navigate to Register screen when Sign In is clicked
    navigation.navigate("explore")
  }

  const handleSignUp = () => {
    // Also navigate to Register screen when Sign Up is clicked
    navigation.navigate("(tabs)/explore")
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.imageContainer}>
            <Image
                source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-24%20at%2023.41.48-lxy29OsV7derVKJEtTTGy1Y32nJZqg.png' }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            <View style={styles.headerContainer}>
              <Text style={styles.title}>Login</Text>
              <Text style={styles.subtitle}>Please sign in to continue.</Text>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Feather name="user" size={20} color="#8E8E93" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputWrapper}>
                <Feather name="lock" size={20} color="#8E8E93" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#8E8E93" />
                </TouchableOpacity>
              </View>

              <View style={styles.rememberContainer}>
                <Text style={styles.rememberText}>Remember me next time</Text>
                <Switch
                  value={rememberMe}
                  onValueChange={setRememberMe}
                  trackColor={{ false: "#D1D1D6", true: "#1E3A5F" }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
              <Text style={styles.signInText}>Sign in</Text>
            </TouchableOpacity>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have account? </Text>
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.signUpLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  inner: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  image: {
    width: 200,
    height: 200,
  },
  headerContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E3A5F",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#1E3A5F",
  },
  eyeIcon: {
    padding: 8,
  },
  rememberContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  rememberText: {
    fontSize: 14,
    color: "#8E8E93",
  },
  signInButton: {
    backgroundColor: "#1E3A5F",
    borderRadius: 10,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  signInText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signUpText: {
    fontSize: 14,
    color: "#8E8E93",
  },
  signUpLink: {
    fontSize: 14,
    color: "#1E3A5F",
    fontWeight: "bold",
  },
})


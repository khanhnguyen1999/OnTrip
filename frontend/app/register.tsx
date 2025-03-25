import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from "@expo/vector-icons";

export default function RegisterScreen() {
  const [email, setEmail] = useState("dominiktyka@icloud.com");
  const [firstName, setFirstName] = useState("Dominik");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleSignIn = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.starIcon}>✦</Text>
            <Text style={styles.logoText}>homly</Text>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <Text style={styles.title}>Create account</Text>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email address</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#666666"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>First name</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholderTextColor="#666666"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#666666"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Feather
                      name={showPassword ? "eye" : "eye-off"}
                      size={20}
                      color="#666666"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.createButton}>
              <Text style={styles.createButtonText}>Create account</Text>
            </TouchableOpacity>

            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleSignIn}>
                <Text style={styles.signInLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Pagination Indicator */}
          <View style={styles.paginationContainer}>
            <View style={styles.paginationIndicator} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
    backgroundColor: "#000000",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  starIcon: {
    fontSize: 16,
    color: "#E8C558",
    marginRight: 4,
  },
  logoText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  mainContent: {
    flex: 1,
    justifyContent: "flex-start",
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 40,
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    color: "#AAAAAA",
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    color: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
    paddingVertical: 8,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    paddingVertical: 8,
  },
  eyeIcon: {
    padding: 8,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  createButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  signInText: {
    fontSize: 14,
    color: "#AAAAAA",
  },
  signInLink: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  paginationContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  paginationIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },
});

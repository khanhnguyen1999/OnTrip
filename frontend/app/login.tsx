import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleEmailSignIn = () => {
    navigation.navigate("Register");
  };

  const handleSignIn = () => {
    navigation.navigate("Register");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.starIcon}>✦</Text>
          <Text style={styles.logoText}>homly</Text>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Circular Image */}
          <View style={styles.circleImageContainer}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" }}
              style={styles.circleImage}
              resizeMode="cover"
            />
          </View>

          {/* Headline */}
          <Text style={styles.headline}>
            manage{"\n"}
            your home{"\n"}
            easyly &{"\n"}
            quickly
          </Text>

          {/* Description */}
          <Text style={styles.description}>
            There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.appleButton}>
            <Text style={styles.appleButtonText}>Continue with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.emailButton} onPress={handleEmailSignIn}>
            <Text style={styles.emailButtonText}>Start with e-mail</Text>
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
  );
}

const { width } = Dimensions.get('window');
const circleSize = width * 0.6;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
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
    justifyContent: "center",
  },
  circleImageContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    overflow: "hidden",
    zIndex: 1,
  },
  circleImage: {
    width: "100%",
    height: "100%",
  },
  headline: {
    fontSize: 40,
    fontWeight: "600",
    color: "#FFFFFF",
    lineHeight: 48,
    marginBottom: 20,
    zIndex: 2,
  },
  description: {
    fontSize: 14,
    color: "#AAAAAA",
    lineHeight: 20,
    marginBottom: 40,
    maxWidth: "80%",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 20,
  },
  appleButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  appleButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  emailButton: {
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#333333",
  },
  emailButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
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

import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { colors } from "@/constants/colors";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useAuthStore } from "@/store/authStore";
import { 
  Mail, 
  Lock, 
  DollarSign, 
  Globe, 
  AlertTriangle 
} from "lucide-react-native";
import { currentUser } from "@/mocks/users";

export default function AccountSettingsScreen() {
  const { updateProfile, isLoading } = useAuthStore();
  
  const [email, setEmail] = useState(currentUser.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [preferredCurrency, setPreferredCurrency] = useState(currentUser.preferredCurrency);
  
  const handleUpdateEmail = async () => {
    if (!email) {
      Alert.alert("Error", "Email cannot be empty");
      return;
    }
    
    try {
      await updateProfile({ email });
      Alert.alert("Success", "Email updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update email");
    }
  };
  
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "All password fields are required");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }
    
    try {
      // In a real app, this would call an API to change the password
      Alert.alert("Success", "Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      Alert.alert("Error", "Failed to change password");
    }
  };
  
  const handleUpdateCurrency = async () => {
    try {
      await updateProfile({ preferredCurrency });
      Alert.alert("Success", "Preferred currency updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update preferred currency");
    }
  };
  
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // In a real app, this would call an API to delete the account
            Alert.alert("Account Deleted", "Your account has been deleted");
          },
        },
      ]
    );
  };
  
  return (
    <>
      <Stack.Screen options={{ title: "Account Settings" }} />
      
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Email Address</Text>
              <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                leftIcon={<Mail size={20} color={colors.inactive} />}
              />
              <Button
                title="Update Email"
                onPress={handleUpdateEmail}
                loading={isLoading}
                disabled={!email || email === currentUser.email}
              />
            </Card>
            
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Change Password</Text>
              <Input
                placeholder="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                leftIcon={<Lock size={20} color={colors.inactive} />}
              />
              <Input
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                leftIcon={<Lock size={20} color={colors.inactive} />}
              />
              <Input
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                leftIcon={<Lock size={20} color={colors.inactive} />}
              />
              <Button
                title="Change Password"
                onPress={handleChangePassword}
                disabled={!currentPassword || !newPassword || !confirmPassword}
              />
            </Card>
            
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Preferred Currency</Text>
              <Input
                placeholder="Currency Code (e.g., USD, EUR)"
                value={preferredCurrency}
                onChangeText={setPreferredCurrency}
                leftIcon={<DollarSign size={20} color={colors.inactive} />}
              />
              <Button
                title="Update Currency"
                onPress={handleUpdateCurrency}
                loading={isLoading}
                disabled={!preferredCurrency || preferredCurrency === currentUser.preferredCurrency}
              />
            </Card>
            
            <Card style={styles.dangerSection}>
              <Text style={styles.dangerTitle}>Danger Zone</Text>
              <Text style={styles.dangerText}>
                Deleting your account will remove all your data and cannot be undone.
              </Text>
              <Button
                title="Delete Account"
                onPress={handleDeleteAccount}
                variant="danger"
                icon={<AlertTriangle size={18} color={colors.white} />}
              />
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  dangerSection: {
    marginBottom: 20,
    borderColor: colors.danger,
    borderWidth: 1,
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.danger,
    marginBottom: 8,
  },
  dangerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
});
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { colors } from "@/constants/colors";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { useAuthStore } from "@/store/authStore";
import { User, Phone, Camera } from "lucide-react-native";
import { currentUser } from "@/mocks/users";

export default function ProfileSettingsScreen() {
  const { updateProfile, isLoading } = useAuthStore();
  
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone || "");
  const [avatar, setAvatar] = useState(currentUser.avatar);
  
  const handleUpdateProfile = async () => {
    if (!name) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }
    
    try {
      await updateProfile({
        name,
        phone: phone || undefined,
        avatar,
      });
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    }
  };
  
  const handleChangeAvatar = () => {
    // In a real app, this would open the image picker
    // For now, we'll just use a sample avatar
    const sampleAvatars = [
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61",
    ];
    
    const randomAvatar = sampleAvatars[Math.floor(Math.random() * sampleAvatars.length)];
    setAvatar(randomAvatar);
  };
  
  return (
    <>
      <Stack.Screen options={{ title: "Edit Profile" }} />
      
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.avatarContainer}>
              <Avatar
                uri={avatar}
                name={name}
                size="large"
                showBorder
              />
              <TouchableOpacity
                style={styles.changeAvatarButton}
                onPress={handleChangeAvatar}
              >
                <Camera size={20} color={colors.white} />
              </TouchableOpacity>
            </View>
            
            <Input
              label="Full Name"
              placeholder="Your name"
              value={name}
              onChangeText={setName}
              leftIcon={<User size={20} color={colors.inactive} />}
            />
            
            <Input
              label="Phone Number (optional)"
              placeholder="Your phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              leftIcon={<Phone size={20} color={colors.inactive} />}
            />
            
            <Button
              title="Save Changes"
              onPress={handleUpdateProfile}
              loading={isLoading}
              disabled={!name}
              style={styles.saveButton}
            />
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
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  changeAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },
  saveButton: {
    marginTop: 16,
  },
});
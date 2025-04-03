import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { colors } from "@/constants/colors";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useGroupStore } from "@/store/groupStore";
import { 
  Users, 
  FileText, 
  Image as ImageIcon,
  Check,
} from "lucide-react-native";

export default function EditGroupScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const { currentGroup, fetchGroupById, updateGroup, isLoading } = useGroupStore();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  
  useEffect(() => {
    if (id) {
      fetchGroupById(id);
    }
  }, [id]);
  
  useEffect(() => {
    if (currentGroup) {
      setName(currentGroup.name);
      setDescription(currentGroup.description || "");
      setCoverImage(currentGroup.coverImage || null);
    }
  }, [currentGroup]);
  
  const handleUpdateGroup = async () => {
    if (!name) {
      Alert.alert("Error", "Group name cannot be empty");
      return;
    }
    
    try {
      await updateGroup(id, {
        name,
        description: description || undefined,
        coverImage: coverImage || undefined,
      });
      
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to update group");
    }
  };
  
  const handleChangeCoverImage = () => {
    // In a real app, this would open the image picker
    // For now, we'll just use a sample cover image
    const sampleCoverImages = [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
    ];
    
    const randomCoverImage = sampleCoverImages[Math.floor(Math.random() * sampleCoverImages.length)];
    setCoverImage(randomCoverImage);
  };
  
  if (!currentGroup) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading group details...</Text>
      </View>
    );
  }
  
  return (
    <>
      <Stack.Screen options={{ title: "Edit Group" }} />
      
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <Input
                label="Group Name"
                placeholder="e.g., Trip to Bali, Apartment Bills"
                value={name}
                onChangeText={setName}
                leftIcon={<Users size={20} color={colors.inactive} />}
              />
              
              <Input
                label="Description (optional)"
                placeholder="What is this group for?"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                style={styles.descriptionInput}
                leftIcon={<FileText size={20} color={colors.inactive} />}
              />
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Cover Image (optional)</Text>
                
                {coverImage ? (
                  <View style={styles.coverImageContainer}>
                    <Image
                      source={{ uri: coverImage }}
                      style={styles.coverImage}
                    />
                    <TouchableOpacity
                      style={styles.changeCoverButton}
                      onPress={handleChangeCoverImage}
                    >
                      <ImageIcon size={20} color={colors.white} />
                      <Text style={styles.changeCoverText}>Change</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.uploadCoverImage}
                    onPress={handleChangeCoverImage}
                  >
                    <ImageIcon size={24} color={colors.primary} />
                    <Text style={styles.uploadText}>Upload Cover Image</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              <Button
                title="Save Changes"
                onPress={handleUpdateGroup}
                loading={isLoading}
                disabled={!name}
                style={styles.saveButton}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 12,
  },
  descriptionInput: {
    height: 80,
    paddingTop: 12,
  },
  coverImageContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    height: 200,
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  changeCoverButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  changeCoverText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
  },
  uploadCoverImage: {
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.primary,
  },
  saveButton: {
    marginTop: 8,
  },
});
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Stack } from "expo-router";
import { colors } from "@/constants/colors";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { useGroupStore } from "@/store/groupStore";
import { useFriendStore } from "@/store/friendStore";
import { 
  Users, 
  FileText, 
  Image as ImageIcon,
  Check,
  X,
  Plus
} from "lucide-react-native";
import { currentUser } from "@/mocks/users";

export default function CreateGroupScreen() {
  const router = useRouter();
  
  const { createGroup, isLoading } = useGroupStore();
  const { friends } = useFriendStore();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  
  const handleCreateGroup = async () => {
    if (!name) {
      // Show validation error
      return;
    }
    
    try {
      // Get selected friends data
      const members = [
        currentUser,
        ...friends
          .filter(f => selectedFriends.includes(f.id))
          .map(f => f.user),
      ];
      
      const newGroup = await createGroup({
        name,
        description,
        members,
        coverImage: coverImage || undefined,
      });
      
      // Navigate to the new group
      router.push(`/groups/${newGroup.id}`);
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  };
  
  const toggleFriendSelection = (friendId: string) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter(id => id !== friendId));
    } else {
      setSelectedFriends([...selectedFriends, friendId]);
    }
  };
  
  // Sample cover images
  const sampleCoverImages = [
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
    "https://images.unsplash.com/photo-1533105079780-92b9be482077",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
  ];
  
  return (
    <>
      <Stack.Screen options={{ title: "Create Group" }} />
      
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <Text style={styles.title}>Create a new group</Text>
              
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
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.coverImagesContainer}
                >
                  {sampleCoverImages.map((image, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.coverImageOption,
                        coverImage === image && styles.selectedCoverImage,
                      ]}
                      onPress={() => setCoverImage(image)}
                    >
                      <Image
                        source={{ uri: image }}
                        style={styles.coverImageThumbnail}
                      />
                      {coverImage === image && (
                        <View style={styles.selectedCoverImageOverlay}>
                          <Check size={24} color={colors.white} />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                  
                  <TouchableOpacity
                    style={styles.uploadCoverImage}
                    onPress={() => {
                      // In a real app, this would open the image picker
                    }}
                  >
                    <ImageIcon size={24} color={colors.primary} />
                    <Text style={styles.uploadText}>Upload</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Add Friends</Text>
                <View style={styles.selectedFriendsContainer}>
                  {selectedFriends.length > 0 ? (
                    selectedFriends.map((friendId) => {
                      const friend = friends.find(f => f.id === friendId);
                      if (!friend) return null;
                      
                      return (
                        <View key={friendId} style={styles.selectedFriendChip}>
                          <Avatar
                            uri={friend.user.avatar}
                            name={friend.user.name}
                            size="small"
                          />
                          <Text style={styles.selectedFriendName}>
                            {friend.user.name}
                          </Text>
                          <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => toggleFriendSelection(friendId)}
                          >
                            <X size={16} color={colors.textSecondary} />
                          </TouchableOpacity>
                        </View>
                      );
                    })
                  ) : (
                    <Text style={styles.noFriendsText}>
                      No friends added yet
                    </Text>
                  )}
                </View>
                
                <Text style={styles.subLabel}>Your Friends</Text>
                <View style={styles.friendsList}>
                  {friends.map((friend) => (
                    <TouchableOpacity
                      key={friend.id}
                      style={[
                        styles.friendOption,
                        selectedFriends.includes(friend.id) && styles.selectedFriendOption,
                      ]}
                      onPress={() => toggleFriendSelection(friend.id)}
                    >
                      <View style={styles.friendOptionContent}>
                        <Avatar
                          uri={friend.user.avatar}
                          name={friend.user.name}
                          size="small"
                        />
                        <Text style={styles.friendOptionText}>
                          {friend.user.name}
                        </Text>
                      </View>
                      {selectedFriends.includes(friend.id) ? (
                        <Check size={20} color={colors.primary} />
                      ) : (
                        <Plus size={20} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <Button
                title="Create Group"
                onPress={handleCreateGroup}
                loading={isLoading}
                disabled={!name}
                style={styles.submitButton}
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
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  subLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  descriptionInput: {
    height: 80,
    paddingTop: 12,
  },
  coverImagesContainer: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  coverImageOption: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedCoverImage: {
    borderColor: colors.primary,
  },
  coverImageThumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  selectedCoverImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadCoverImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
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
  selectedFriendsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    minHeight: 40,
  },
  selectedFriendChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lightGray,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  selectedFriendName: {
    marginLeft: 8,
    marginRight: 4,
    fontSize: 14,
    color: colors.text,
  },
  removeButton: {
    padding: 4,
  },
  noFriendsText: {
    color: colors.textSecondary,
    fontStyle: "italic",
  },
  friendsList: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: 300,
  },
  friendOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedFriendOption: {
    backgroundColor: colors.primary + "10", // 10% opacity
  },
  friendOptionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  friendOptionText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  submitButton: {
    marginTop: 8,
  },
});
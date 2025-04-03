import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useGroupStore } from "@/store/groupStore";
import { 
  Edit, 
  Image as ImageIcon, 
  Users, 
  Trash2, 
  LogOut, 
  AlertTriangle 
} from "lucide-react-native";

export default function GroupSettingsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const { currentGroup, updateGroup, deleteGroup, isLoading } = useGroupStore();
  
  const handleEditGroup = () => {
    router.push(`/groups/${id}/edit`);
  };
  
  const handleChangeCoverImage = () => {
    // In a real app, this would open the image picker
    Alert.alert("Change Cover Image", "This feature would allow you to change the group cover image.");
  };
  
  const handleLeaveGroup = () => {
    Alert.alert(
      "Leave Group",
      "Are you sure you want to leave this group? You will no longer have access to the group's expenses.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Leave",
          style: "destructive",
          onPress: () => {
            // In a real app, this would call an API to leave the group
            router.replace("/groups");
          },
        },
      ]
    );
  };
  
  const handleDeleteGroup = async () => {
    Alert.alert(
      "Delete Group",
      "Are you sure you want to delete this group? This action cannot be undone and all group data will be lost.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteGroup(id);
              router.replace("/groups");
            } catch (error) {
              Alert.alert("Error", "Failed to delete group");
            }
          },
        },
      ]
    );
  };
  
  if (!currentGroup) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading group settings...</Text>
      </View>
    );
  }
  
  return (
    <>
      <Stack.Screen options={{ title: "Group Settings" }} />
      
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Group Information</Text>
              
              <TouchableOpacity style={styles.settingItem} onPress={handleEditGroup}>
                <View style={styles.settingInfo}>
                  <Edit size={20} color={colors.primary} />
                  <Text style={styles.settingText}>Edit Group Details</Text>
                </View>
                <Text style={styles.settingValue}>{currentGroup.name}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingItem} onPress={handleChangeCoverImage}>
                <View style={styles.settingInfo}>
                  <ImageIcon size={20} color={colors.primary} />
                  <Text style={styles.settingText}>Change Cover Image</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.settingItem} 
                onPress={() => router.push(`/groups/${id}/members`)}
              >
                <View style={styles.settingInfo}>
                  <Users size={20} color={colors.primary} />
                  <Text style={styles.settingText}>Manage Members</Text>
                </View>
                <Text style={styles.settingValue}>{currentGroup.members.length} members</Text>
              </TouchableOpacity>
            </Card>
            
            <Card style={styles.dangerSection}>
              <Text style={styles.dangerTitle}>Danger Zone</Text>
              
              <Button
                title="Leave Group"
                onPress={handleLeaveGroup}
                variant="outline"
                icon={<LogOut size={18} color={colors.danger} />}
                style={styles.dangerButton}
                textStyle={styles.dangerButtonText}
              />
              
              <Button
                title="Delete Group"
                onPress={handleDeleteGroup}
                variant="danger"
                icon={<Trash2 size={18} color={colors.white} />}
                style={styles.deleteButton}
                loading={isLoading}
              />
              
              <Text style={styles.dangerNote}>
                <AlertTriangle size={14} color={colors.danger} /> Deleting the group will permanently remove all expenses and data associated with it.
              </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 14,
    color: colors.textSecondary,
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
    marginBottom: 16,
  },
  dangerButton: {
    marginBottom: 12,
    borderColor: colors.danger,
  },
  dangerButtonText: {
    color: colors.danger,
  },
  deleteButton: {
    marginBottom: 12,
  },
  dangerNote: {
    fontSize: 12,
    color: colors.danger,
    lineHeight: 18,
  },
});
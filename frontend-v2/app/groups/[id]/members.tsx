import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { colors } from "@/constants/colors";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useGroupStore } from "@/store/groupStore";
import { useFriendStore } from "@/store/friendStore";
import { Search, UserPlus, UserMinus, Check } from "lucide-react-native";
import { currentUser } from "@/mocks/users";

export default function GroupMembersScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const { currentGroup, fetchGroupById, addMemberToGroup, removeMemberFromGroup, isLoading } = useGroupStore();
  const { friends, fetchFriends } = useFriendStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddMembers, setShowAddMembers] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetchGroupById(id);
      fetchFriends();
    }
  }, [id]);
  
  const handleRemoveMember = async (userId: string) => {
    if (userId === currentUser.id) {
      Alert.alert(
        "Cannot Remove Yourself",
        "You cannot remove yourself from the group. To leave the group, use the 'Leave Group' option in group settings."
      );
      return;
    }
    
    Alert.alert(
      "Remove Member",
      "Are you sure you want to remove this member from the group?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await removeMemberFromGroup(id, userId);
              fetchGroupById(id);
            } catch (error) {
              Alert.alert("Error", "Failed to remove member");
            }
          },
        },
      ]
    );
  };
  
  const handleAddMember = async (userId: string) => {
    try {
      await addMemberToGroup(id, userId);
      fetchGroupById(id);
    } catch (error) {
      Alert.alert("Error", "Failed to add member");
    }
  };
  
  // Filter friends who are not already in the group
  const availableFriends = friends.filter(
    friend => !currentGroup?.members.some(member => member.id === friend.user.id)
  );
  
  const filteredAvailableFriends = searchQuery
    ? availableFriends.filter(friend => 
        friend.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableFriends;
  
  if (!currentGroup) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading group members...</Text>
      </View>
    );
  }
  
  return (
    <>
      <Stack.Screen options={{ title: "Group Members" }} />
      
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        {showAddMembers ? (
          <>
            <View style={styles.header}>
              <Input
                placeholder="Search friends..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                leftIcon={<Search size={20} color={colors.inactive} />}
                containerStyle={styles.searchContainer}
              />
              
              <Button
                title="Done"
                onPress={() => setShowAddMembers(false)}
                variant="outline"
                size="small"
              />
            </View>
            
            <FlatList
              data={filteredAvailableFriends}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.friendItem}>
                  <View style={styles.friendInfo}>
                    <Avatar
                      uri={item.user.avatar}
                      name={item.user.name}
                      size="medium"
                    />
                    <View style={styles.friendDetails}>
                      <Text style={styles.friendName}>{item.user.name}</Text>
                      <Text style={styles.friendEmail}>{item.user.email}</Text>
                    </View>
                  </View>
                  
                  <Button
                    title="Add"
                    onPress={() => handleAddMember(item.user.id)}
                    icon={<UserPlus size={16} color={colors.white} />}
                    size="small"
                    loading={isLoading}
                  />
                </View>
              )}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyTitle}>No friends to add</Text>
                  <Text style={styles.emptyText}>
                    {searchQuery
                      ? "Try a different search term"
                      : "All your friends are already in this group or you need to add more friends"}
                  </Text>
                </View>
              }
            />
          </>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Members ({currentGroup.members.length})</Text>
              
              <Button
                title="Add Members"
                onPress={() => setShowAddMembers(true)}
                icon={<UserPlus size={18} color={colors.white} />}
                size="small"
              />
            </View>
            
            <FlatList
              data={currentGroup.members}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.memberItem}>
                  <View style={styles.memberInfo}>
                    <Avatar
                      uri={item.avatar}
                      name={item.name}
                      size="medium"
                    />
                    <View style={styles.memberDetails}>
                      <Text style={styles.memberName}>
                        {item.name} {item.id === currentUser.id && "(You)"}
                      </Text>
                      <Text style={styles.memberEmail}>{item.email}</Text>
                    </View>
                  </View>
                  
                  {item.id !== currentUser.id && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveMember(item.id)}
                    >
                      <UserMinus size={20} color={colors.danger} />
                    </TouchableOpacity>
                  )}
                </View>
              )}
              contentContainerStyle={styles.listContent}
            />
          </>
        )}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  searchContainer: {
    flex: 1,
    marginRight: 12,
    marginBottom: 0,
  },
  listContent: {
    padding: 20,
  },
  memberItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  memberDetails: {
    marginLeft: 12,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  memberEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  removeButton: {
    padding: 8,
  },
  friendItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  friendInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  friendDetails: {
    marginLeft: 12,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  friendEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
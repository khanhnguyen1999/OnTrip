import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Stack } from "expo-router";
import { colors } from "@/constants/colors";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { useFriendStore } from "@/store/friendStore";
import { Search, UserPlus, Check } from "lucide-react-native";

export default function AddFriendScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  const { 
    searchResults, 
    searchUsers, 
    addFriend, 
    friends, 
    clearSearchResults, 
    isLoading 
  } = useFriendStore();
  
  useEffect(() => {
    return () => {
      clearSearchResults();
    };
  }, []);
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    await searchUsers(searchQuery);
    setIsSearching(false);
  };
  
  const handleAddFriend = async (userId: string) => {
    try {
      await addFriend(userId);
      router.back();
    } catch (error) {
      console.error("Failed to add friend:", error);
    }
  };
  
  const isAlreadyFriend = (userId: string) => {
    return friends.some(friend => friend.user.id === userId);
  };
  
  return (
    <>
      <Stack.Screen options={{ title: "Add a Friend" }} />
      
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search by name or email"
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Search size={20} color={colors.inactive} />}
            containerStyle={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          
          <Button
            title="Search"
            onPress={handleSearch}
            loading={isSearching}
            disabled={!searchQuery.trim()}
          />
        </View>
        
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <View style={styles.userInfo}>
                <Avatar
                  uri={item.avatar}
                  name={item.name}
                  size="medium"
                />
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{item.name}</Text>
                  <Text style={styles.userEmail}>{item.email}</Text>
                </View>
              </View>
              
              {isAlreadyFriend(item.id) ? (
                <View style={styles.alreadyFriendButton}>
                  <Check size={16} color={colors.white} />
                  <Text style={styles.alreadyFriendText}>Friend</Text>
                </View>
              ) : (
                <Button
                  title="Add"
                  onPress={() => handleAddFriend(item.id)}
                  icon={<UserPlus size={16} color={colors.white} />}
                  size="small"
                  loading={isLoading}
                />
              )}
            </View>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              {searchQuery ? (
                <>
                  <Text style={styles.emptyTitle}>No users found</Text>
                  <Text style={styles.emptyText}>
                    Try a different search term or invite them to join
                  </Text>
                  <Button
                    title="Send Invite"
                    onPress={() => {}}
                    style={styles.inviteButton}
                  />
                </>
              ) : (
                <Text style={styles.emptyText}>
                  Search for friends by name or email
                </Text>
              )}
            </View>
          }
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: 20,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  searchInput: {
    flex: 1,
    marginRight: 12,
    marginBottom: 0,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  userItem: {
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
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userDetails: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  alreadyFriendButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.success,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  alreadyFriendText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 4,
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
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  inviteButton: {
    width: 200,
  },
});
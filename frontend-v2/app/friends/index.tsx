import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { FriendItem } from "@/components/FriendItem";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useFriendStore } from "@/store/friendStore";
import { useRouter } from "expo-router";
import { Plus, Search, UserPlus } from "lucide-react-native";

export default function FriendsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { friends, fetchFriends, isLoading } = useFriendStore();
  
  useEffect(() => {
    fetchFriends();
  }, []);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFriends();
    setRefreshing(false);
  };
  
  const filteredFriends = searchQuery
    ? friends.filter(friend => 
        friend.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : friends;
  
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Input
          placeholder="Search friends..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color={colors.inactive} />}
          containerStyle={styles.searchContainer}
        />
        
        <Button
          title="Add"
          onPress={() => router.push("/add-friend")}
          icon={<Plus size={18} color={colors.white} />}
          size="small"
        />
      </View>
      
      <FlatList
        data={filteredFriends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FriendItem
            friend={item}
            onPress={() => router.push(`/friends/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No friends found</Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? "Try a different search term"
                : "Add friends to start tracking shared expenses"}
            </Text>
            {!searchQuery && (
              <Button
                title="Add a friend"
                onPress={() => router.push("/add-friend")}
                icon={<UserPlus size={18} color={colors.white} />}
                style={styles.addButton}
              />
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchContainer: {
    flex: 1,
    marginRight: 12,
    marginBottom: 0,
  },
  listContent: {
    padding: 20,
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
  addButton: {
    width: 200,
  },
});
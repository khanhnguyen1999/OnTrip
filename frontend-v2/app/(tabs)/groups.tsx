import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { GroupItem } from "@/components/GroupItem";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useGroupStore } from "@/store/groupStore";
import { useRouter } from "expo-router";
import { Plus, Search } from "lucide-react-native";

export default function GroupsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { groups, fetchGroups, isLoading } = useGroupStore();
  
  useEffect(() => {
    fetchGroups();
  }, []);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGroups();
    setRefreshing(false);
  };
  
  const filteredGroups = searchQuery
    ? groups.filter(group => 
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : groups;
  
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Input
          placeholder="Search groups..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color={colors.inactive} />}
          containerStyle={styles.searchContainer}
        />
        
        <Button
          title="Create"
          onPress={() => router.push("/create-group")}
          icon={<Plus size={18} color={colors.white} />}
          size="small"
        />
      </View>
      
      <FlatList
        data={filteredGroups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GroupItem
            group={item}
            onPress={() => router.push(`/groups/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No groups found</Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? "Try a different search term"
                : "Create a group to start tracking expenses together"}
            </Text>
            {!searchQuery && (
              <Button
                title="Create a group"
                onPress={() => router.push("/create-group")}
                icon={<Plus size={18} color={colors.white} />}
                style={styles.createButton}
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
  createButton: {
    width: 200,
  },
});
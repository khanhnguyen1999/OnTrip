import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { colors } from "@/constants/colors";
import { ExpenseItem } from "@/components/ExpenseItem";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useGroupStore } from "@/store/groupStore";
import { useExpenseStore } from "@/store/expenseStore";
import { Plus, Search } from "lucide-react-native";

export default function GroupExpensesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { currentGroup, fetchGroupById } = useGroupStore();
  const { expenses, fetchGroupExpenses, isLoading } = useExpenseStore();
  
  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);
  
  const loadData = async () => {
    await Promise.all([
      fetchGroupById(id),
      fetchGroupExpenses(id),
    ]);
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  
  const filteredExpenses = searchQuery
    ? expenses.filter(expense => 
        expense.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : expenses;
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: currentGroup ? `${currentGroup.name} Expenses` : "Group Expenses",
        }} 
      />
      
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.header}>
          <Input
            placeholder="Search expenses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Search size={20} color={colors.inactive} />}
            containerStyle={styles.searchContainer}
          />
          
          <Button
            title="Add"
            onPress={() => router.push({
              pathname: "/add-expense",
              params: { groupId: id }
            })}
            icon={<Plus size={18} color={colors.white} />}
            size="small"
          />
        </View>
        
        <FlatList
          data={filteredExpenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExpenseItem
              expense={item}
              onPress={() => router.push(`/expenses/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No expenses found</Text>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? "Try a different search term"
                  : "Add an expense to get started"}
              </Text>
              {!searchQuery && (
                <Button
                  title="Add an expense"
                  onPress={() => router.push({
                    pathname: "/add-expense",
                    params: { groupId: id }
                  })}
                  icon={<Plus size={18} color={colors.white} />}
                  style={styles.addButton}
                />
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
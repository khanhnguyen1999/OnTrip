import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { ExpenseItem } from "@/components/ExpenseItem";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useExpenseStore } from "@/store/expenseStore";
import { useRouter } from "expo-router";
import { Plus, Search, Filter } from "lucide-react-native";

export default function ExpensesScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { expenses, fetchExpenses, isLoading } = useExpenseStore();
  
  useEffect(() => {
    fetchExpenses();
  }, []);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExpenses();
    setRefreshing(false);
  };
  
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = searchQuery
      ? expense.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesCategory = selectedCategory
      ? expense.category === selectedCategory
      : true;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Input
          placeholder="Search expenses..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color={colors.inactive} />}
          containerStyle={styles.searchContainer}
        />
        
        <Button
          title=""
          onPress={() => setShowFilters(!showFilters)}
          variant="outline"
          size="small"
          icon={<Filter size={20} color={colors.primary} />}
          style={styles.filterButton}
        />
        
        <Button
          title="Add"
          onPress={() => router.push("/add-expense")}
          icon={<Plus size={18} color={colors.white} />}
          size="small"
        />
      </View>
      
      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filtersTitle}>Filter by category:</Text>
          <View style={styles.categoryFilters}>
            {["all", "food", "transportation", "housing", "utilities", "entertainment", "other"].map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryFilter,
                  (selectedCategory === category || (category === "all" && !selectedCategory)) && 
                    styles.selectedCategoryFilter,
                ]}
                onPress={() => setSelectedCategory(category === "all" ? null : category)}
              >
                <Text 
                  style={[
                    styles.categoryFilterText,
                    (selectedCategory === category || (category === "all" && !selectedCategory)) && 
                      styles.selectedCategoryFilterText,
                  ]}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      
      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExpenseItem
            expense={item}
            onPress={() => router.push(`/expenses/${item.id}`)}
            showGroup
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
              {searchQuery || selectedCategory
                ? "Try different search terms or filters"
                : "Add an expense to get started"}
            </Text>
            {!searchQuery && !selectedCategory && (
              <Button
                title="Add an expense"
                onPress={() => router.push("/add-expense")}
                icon={<Plus size={18} color={colors.white} />}
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
  filterButton: {
    marginRight: 8,
    width: 40,
    height: 40,
    padding: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  filtersContainer: {
    padding: 16,
    backgroundColor: colors.lightGray,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filtersTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  categoryFilters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryFilter: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedCategoryFilter: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryFilterText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedCategoryFilterText: {
    color: colors.white,
    fontWeight: "600",
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
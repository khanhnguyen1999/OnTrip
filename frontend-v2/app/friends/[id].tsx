import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { colors } from "@/constants/colors";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { ExpenseItem } from "@/components/ExpenseItem";
import { Card } from "@/components/Card";
import { useFriendStore } from "@/store/friendStore";
import { useExpenseStore } from "@/store/expenseStore";
import { formatCurrency } from "@/utils/formatters";
import { 
  Plus, 
  ArrowRight, 
  UserMinus, 
  MessageCircle, 
  ArrowDownRight, 
  ArrowUpRight 
} from "lucide-react-native";
import { mockExpenses } from "@/mocks/expenses";

export default function FriendDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  
  const { friends, fetchFriends, removeFriend, isLoading: friendLoading } = useFriendStore();
  const { expenses, fetchUserExpenses, isLoading: expensesLoading } = useExpenseStore();
  
  const friend = friends.find(f => f.id === id);
  
  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);
  
  const loadData = async () => {
    await Promise.all([
      fetchFriends(),
      fetchUserExpenses(friend?.user.id || ""),
    ]);
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  
  const handleRemoveFriend = async () => {
    if (id) {
      await removeFriend(id);
      router.back();
    }
  };
  
  if (!friend) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading friend details...</Text>
      </View>
    );
  }
  
  // Filter expenses with this friend
  const friendExpenses = mockExpenses.filter(e => 
    e.splitBetween.some(s => s.userId === friend.user.id) ||
    e.paidBy.some(p => p.userId === friend.user.id)
  );
  
  const isPositiveBalance = friend.balance > 0;
  const isZeroBalance = friend.balance === 0;
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: friend.user.name,
          headerRight: () => (
            <TouchableOpacity 
              onPress={handleRemoveFriend}
              style={styles.headerButton}
            >
              <UserMinus size={20} color={colors.danger} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.content}>
            <View style={styles.profileHeader}>
              <Avatar
                uri={friend.user.avatar}
                name={friend.user.name}
                size="large"
              />
              <View style={styles.profileInfo}>
                <Text style={styles.name}>{friend.user.name}</Text>
                <Text style={styles.email}>{friend.user.email}</Text>
              </View>
            </View>
            
            <Card style={styles.balanceCard}>
              <Text style={styles.balanceTitle}>Balance</Text>
              
              <View style={styles.balanceRow}>
                {!isZeroBalance && (
                  <View style={styles.balanceIconContainer}>
                    {isPositiveBalance ? (
                      <ArrowDownRight size={24} color={colors.success} />
                    ) : (
                      <ArrowUpRight size={24} color={colors.danger} />
                    )}
                  </View>
                )}
                
                <Text
                  style={[
                    styles.balanceAmount,
                    isPositiveBalance && styles.positiveBalance,
                    !isPositiveBalance && !isZeroBalance && styles.negativeBalance,
                    isZeroBalance && styles.zeroBalance,
                  ]}
                >
                  {isPositiveBalance
                    ? `${friend.user.name} owes you ${formatCurrency(Math.abs(friend.balance))}`
                    : isZeroBalance
                    ? "All settled up"
                    : `You owe ${friend.user.name} ${formatCurrency(Math.abs(friend.balance))}`}
                </Text>
              </View>
            </Card>
            
            <View style={styles.actionsContainer}>
              <Button
                title="Add expense"
                onPress={() => router.push({
                  pathname: "/add-expense",
                  params: { friendId: id }
                })}
                icon={<Plus size={18} color={colors.white} />}
                style={styles.actionButton}
              />
              <Button
                title="Settle up"
                onPress={() => router.push({
                  pathname: "/settle",
                  params: { friendId: id }
                })}
                variant="outline"
                style={styles.actionButton}
              />
              <Button
                title="Message"
                onPress={() => router.push(`/messages/${friend.user.id}`)}
                variant="outline"
                icon={<MessageCircle size={18} color={colors.primary} />}
                style={styles.actionButton}
              />
            </View>
            
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Expenses</Text>
                <Button
                  title="See all"
                  onPress={() => router.push(`/friends/${id}/expenses`)}
                  variant="outline"
                  size="small"
                  icon={<ArrowRight size={14} color={colors.primary} />}
                />
              </View>
              
              {friendExpenses.length > 0 ? (
                friendExpenses.slice(0, 5).map((expense) => (
                  <ExpenseItem
                    key={expense.id}
                    expense={expense}
                    onPress={() => router.push(`/expenses/${expense.id}`)}
                  />
                ))
              ) : (
                <Text style={styles.emptyText}>No expenses yet</Text>
              )}
            </View>
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
  headerButton: {
    padding: 8,
  },
  content: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  profileInfo: {
    marginLeft: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  balanceCard: {
    marginBottom: 24,
  },
  balanceTitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  balanceIconContainer: {
    marginRight: 8,
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: "700",
  },
  positiveBalance: {
    color: colors.success,
  },
  negativeBalance: {
    color: colors.danger,
  },
  zeroBalance: {
    color: colors.text,
  },
  actionsContainer: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  emptyText: {
    textAlign: "center",
    color: colors.textSecondary,
    paddingVertical: 20,
  },
});
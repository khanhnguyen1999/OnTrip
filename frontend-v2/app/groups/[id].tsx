import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { colors } from "@/constants/colors";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { ExpenseItem } from "@/components/ExpenseItem";
import { BalanceSummary } from "@/components/BalanceSummary";
import { useGroupStore } from "@/store/groupStore";
import { useExpenseStore } from "@/store/expenseStore";
import { 
  Plus, 
  MessageCircle, 
  Users, 
  Settings, 
  ArrowRight 
} from "lucide-react-native";

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  
  const { currentGroup, fetchGroupById, isLoading: groupLoading } = useGroupStore();
  const { expenses, fetchGroupExpenses, isLoading: expensesLoading } = useExpenseStore();
  
  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);
  
  const loadData = async () => {
    if (id) {
      await Promise.all([
        fetchGroupById(id),
        fetchGroupExpenses(id),
      ]);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
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
      <Stack.Screen 
        options={{ 
          title: currentGroup.name,
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => router.push(`/groups/${id}/settings`)}
              style={styles.headerButton}
            >
              <Settings size={20} color={colors.text} />
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
          {currentGroup.coverImage && (
            <Image
              source={{ uri: currentGroup.coverImage }}
              style={styles.coverImage}
            />
          )}
          
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.groupName}>{currentGroup.name}</Text>
              {currentGroup.description && (
                <Text style={styles.description}>{currentGroup.description}</Text>
              )}
            </View>
            
            <View style={styles.actionsContainer}>
              <Button
                title="Add expense"
                onPress={() => router.push({
                  pathname: "/add-expense",
                  params: { groupId: id }
                })}
                icon={<Plus size={18} color={colors.white} />}
                style={styles.actionButton}
              />
              <Button
                title="Chat"
                onPress={() => router.push(`/groups/${id}/chat`)}
                variant="outline"
                icon={<MessageCircle size={18} color={colors.primary} />}
                style={styles.actionButton}
              />
            </View>
            
            <View style={styles.balanceContainer}>
              <BalanceSummary
                totalBalance={currentGroup.totalBalance}
                youOwe={75.25}
                youAreOwed={125.50}
              />
            </View>
            
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Members</Text>
                <Button
                  title="Manage"
                  onPress={() => router.push(`/groups/${id}/members`)}
                  variant="outline"
                  size="small"
                  icon={<Users size={14} color={colors.primary} />}
                />
              </View>
              
              <View style={styles.membersContainer}>
                {currentGroup.members.map((member) => (
                  <View key={member.id} style={styles.memberItem}>
                    <Avatar
                      uri={member.avatar}
                      name={member.name}
                      size="small"
                    />
                    <Text style={styles.memberName}>{member.name}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Expenses</Text>
                <Button
                  title="See all"
                  onPress={() => router.push(`/groups/${id}/expenses`)}
                  variant="outline"
                  size="small"
                  icon={<ArrowRight size={14} color={colors.primary} />}
                />
              </View>
              
              {expenses.length > 0 ? (
                expenses.slice(0, 5).map((expense) => (
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
  coverImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  groupName: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  actionsContainer: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  balanceContainer: {
    marginBottom: 24,
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
  membersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  memberItem: {
    alignItems: "center",
    width: 70,
  },
  memberName: {
    fontSize: 12,
    color: colors.text,
    marginTop: 4,
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    color: colors.textSecondary,
    paddingVertical: 20,
  },
});
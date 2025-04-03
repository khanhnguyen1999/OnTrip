import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { colors } from "@/constants/colors";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useExpenseStore } from "@/store/expenseStore";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import { getCategoryIcon } from "@/utils/categoryIcons";
import { 
  Edit2, 
  Trash2, 
  Receipt, 
  FileText, 
  Calendar, 
  Tag 
} from "lucide-react-native";
import { mockUsers } from "@/mocks/users";

export default function ExpenseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const { currentExpense, fetchExpenseById, deleteExpense, isLoading } = useExpenseStore();
  
  useEffect(() => {
    if (id) {
      fetchExpenseById(id);
    }
  }, [id]);
  
  const handleDelete = async () => {
    if (id) {
      await deleteExpense(id);
      router.back();
    }
  };
  
  if (!currentExpense) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading expense details...</Text>
      </View>
    );
  }
  
  const CategoryIcon = getCategoryIcon(currentExpense.category);
  
  // Find users from mock data
  const getUserById = (userId: string) => {
    return mockUsers.find(u => u.id === userId) || null;
  };
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Expense Details",
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                onPress={() => router.push(`/expenses/${id}/edit`)}
                style={styles.headerButton}
              >
                <Edit2 size={20} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleDelete}
                style={styles.headerButton}
              >
                <Trash2 size={20} color={colors.danger} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Card style={styles.expenseCard}>
              <View style={styles.expenseHeader}>
                <View style={styles.iconContainer}>
                  <CategoryIcon size={24} color={colors.white} />
                </View>
                <View style={styles.expenseInfo}>
                  <Text style={styles.expenseTitle}>{currentExpense.title}</Text>
                  <Text style={styles.expenseAmount}>
                    {formatCurrency(currentExpense.amount, currentExpense.currency)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                  <Calendar size={16} color={colors.textSecondary} />
                  <Text style={styles.detailText}>
                    {formatDateTime(currentExpense.date)}
                  </Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Tag size={16} color={colors.textSecondary} />
                  <Text style={styles.detailText}>
                    {currentExpense.category.charAt(0).toUpperCase() + currentExpense.category.slice(1)}
                  </Text>
                </View>
                
                {currentExpense.groupId && (
                  <View style={styles.detailItem}>
                    <FileText size={16} color={colors.textSecondary} />
                    <Text style={styles.detailText}>
                      Group: Trip to Bali
                    </Text>
                  </View>
                )}
              </View>
            </Card>
            
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Paid by</Text>
              {currentExpense.paidBy.map((payment) => {
                const user = getUserById(payment.userId);
                return (
                  <View key={payment.userId} style={styles.userItem}>
                    <View style={styles.userInfo}>
                      <Avatar
                        uri={user?.avatar}
                        name={user?.name || ""}
                        size="small"
                      />
                      <Text style={styles.userName}>
                        {user?.name || "Unknown User"}
                      </Text>
                    </View>
                    <Text style={styles.userAmount}>
                      {formatCurrency(payment.amount, currentExpense.currency)}
                    </Text>
                  </View>
                );
              })}
            </Card>
            
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Split between</Text>
              {currentExpense.splitBetween.map((split) => {
                const user = getUserById(split.userId);
                return (
                  <View key={split.userId} style={styles.userItem}>
                    <View style={styles.userInfo}>
                      <Avatar
                        uri={user?.avatar}
                        name={user?.name || ""}
                        size="small"
                      />
                      <Text style={styles.userName}>
                        {user?.name || "Unknown User"}
                      </Text>
                    </View>
                    <Text style={styles.userAmount}>
                      {formatCurrency(split.amount, currentExpense.currency)}
                    </Text>
                  </View>
                );
              })}
            </Card>
            
            {currentExpense.notes && (
              <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Notes</Text>
                <Text style={styles.notesText}>{currentExpense.notes}</Text>
              </Card>
            )}
            
            {currentExpense.receipt && (
              <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Receipt</Text>
                <Button
                  title="View Receipt"
                  onPress={() => {}}
                  variant="outline"
                  icon={<Receipt size={18} color={colors.primary} />}
                />
              </Card>
            )}
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
  headerButtons: {
    flexDirection: "row",
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    padding: 20,
  },
  expenseCard: {
    marginBottom: 20,
  },
  expenseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary,
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
    gap: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  userAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  notesText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
});
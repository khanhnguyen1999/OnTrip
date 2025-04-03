import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Expense } from "@/types";
import { colors } from "@/constants/colors";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { getCategoryIcon } from "@/utils/categoryIcons";

interface ExpenseItemProps {
  expense: Expense;
  onPress?: () => void;
  showGroup?: boolean;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({
  expense,
  onPress,
  showGroup = false,
}) => {
  const CategoryIcon = getCategoryIcon(expense.category);
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.iconContainer}>
        <CategoryIcon size={24} color={colors.primary} />
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {expense.title}
          </Text>
          <Text style={styles.amount}>
            {formatCurrency(expense.amount, expense.currency)}
          </Text>
        </View>
        
        <View style={styles.detailsRow}>
          <Text style={styles.date}>
            {formatDate(expense.date)}
          </Text>
          
          {expense.paidBy.length > 0 && (
            <Text style={styles.paidBy}>
              Paid by {expense.paidBy[0].userId === "user1" ? "you" : "others"}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  paidBy: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
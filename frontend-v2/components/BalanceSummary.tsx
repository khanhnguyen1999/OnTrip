import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";
import { formatCurrency } from "@/utils/formatters";

interface BalanceSummaryProps {
  totalBalance: number;
  youOwe?: number;
  youAreOwed?: number;
  currency?: string;
}

export const BalanceSummary: React.FC<BalanceSummaryProps> = ({
  totalBalance,
  youOwe = 0,
  youAreOwed = 0,
  currency = "USD",
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Balance</Text>
        <Text
          style={[
            styles.totalAmount,
            totalBalance > 0 && styles.positiveAmount,
            totalBalance < 0 && styles.negativeAmount,
          ]}
        >
          {formatCurrency(totalBalance, currency)}
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>You owe</Text>
          <Text style={[styles.detailAmount, styles.negativeAmount]}>
            {formatCurrency(youOwe, currency)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>You are owed</Text>
          <Text style={[styles.detailAmount, styles.positiveAmount]}>
            {formatCurrency(youAreOwed, currency)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  totalContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flex: 1,
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  detailAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  positiveAmount: {
    color: colors.success,
  },
  negativeAmount: {
    color: colors.danger,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
});
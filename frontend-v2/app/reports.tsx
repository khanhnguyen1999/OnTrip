import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { colors } from "@/constants/colors";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useExpenseStore } from "@/store/expenseStore";
import { formatCurrency } from "@/utils/formatters";
import { 
  BarChart, 
  PieChart, 
  Calendar, 
  Download, 
  ChevronDown 
} from "lucide-react-native";
import { mockExpenses } from "@/mocks/expenses";

export default function ReportsScreen() {
  const { expenses } = useExpenseStore();
  const [timeRange, setTimeRange] = useState("month"); // "week", "month", "year"
  const [showTimeRangePicker, setShowTimeRangePicker] = useState(false);
  
  // Calculate total expenses by category
  const expensesByCategory = mockExpenses.reduce((acc: any, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += expense.amount;
    return acc;
  }, {});
  
  // Sort categories by amount
  const sortedCategories = Object.entries(expensesByCategory)
    .sort(([, a]: any, [, b]: any) => b - a)
    .map(([category, amount]: any) => ({
      category,
      amount,
      percentage: (amount / mockExpenses.reduce((sum, e) => sum + e.amount, 0)) * 100,
    }));
  
  // Calculate total expenses
  const totalExpenses = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Get time range label
  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case "week":
        return "This Week";
      case "month":
        return "This Month";
      case "year":
        return "This Year";
      default:
        return "This Month";
    }
  };
  
  return (
    <>
      <Stack.Screen options={{ title: "Expense Reports" }} />
      
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Expense Reports</Text>
              
              <TouchableOpacity
                style={styles.timeRangeButton}
                onPress={() => setShowTimeRangePicker(!showTimeRangePicker)}
              >
                <Calendar size={16} color={colors.primary} />
                <Text style={styles.timeRangeText}>{getTimeRangeLabel()}</Text>
                <ChevronDown size={16} color={colors.primary} />
              </TouchableOpacity>
              
              {showTimeRangePicker && (
                <View style={styles.timeRangePicker}>
                  {["week", "month", "year"].map((range) => (
                    <TouchableOpacity
                      key={range}
                      style={[
                        styles.timeRangeOption,
                        timeRange === range && styles.selectedTimeRangeOption,
                      ]}
                      onPress={() => {
                        setTimeRange(range);
                        setShowTimeRangePicker(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.timeRangeOptionText,
                          timeRange === range && styles.selectedTimeRangeOptionText,
                        ]}
                      >
                        {range === "week" ? "This Week" : range === "month" ? "This Month" : "This Year"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Total Expenses</Text>
              <Text style={styles.summaryAmount}>{formatCurrency(totalExpenses)}</Text>
              <Text style={styles.summaryPeriod}>{getTimeRangeLabel()}</Text>
            </Card>
            
            <Card style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <PieChart size={20} color={colors.primary} />
                  <Text style={styles.sectionTitle}>Expenses by Category</Text>
                </View>
              </View>
              
              {sortedCategories.map((item, index) => (
                <View key={index} style={styles.categoryItem}>
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryName}>
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </Text>
                    <Text style={styles.categoryPercentage}>
                      {item.percentage.toFixed(1)}%
                    </Text>
                  </View>
                  
                  <View style={styles.categoryBarContainer}>
                    <View
                      style={[
                        styles.categoryBar,
                        { width: `${item.percentage}%`, backgroundColor: getCategoryColor(item.category) },
                      ]}
                    />
                  </View>
                  
                  <Text style={styles.categoryAmount}>
                    {formatCurrency(item.amount)}
                  </Text>
                </View>
              ))}
            </Card>
            
            <Button
              title="Export Report"
              onPress={() => {}}
              variant="outline"
              icon={<Download size={18} color={colors.primary} />}
              style={styles.exportButton}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

// Helper function to get color for category
const getCategoryColor = (category: any) => {
  const colors: any = {
    food: "#4A6FA5",
    transportation: "#6BBF59",
    housing: "#FF6B6B",
    utilities: "#FFD166",
    entertainment: "#06D6A0",
    shopping: "#118AB2",
    health: "#EF476F",
    travel: "#073B4C",
    education: "#9B5DE5",
    other: "#ADB5BD",
  };
  
  return colors[category] || colors.other;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
    position: "relative",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
  },
  timeRangeButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: colors.primary + "15", // 15% opacity
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    marginHorizontal: 8,
  },
  timeRangePicker: {
    position: "absolute",
    top: 70,
    left: 0,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  timeRangeOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedTimeRangeOption: {
    backgroundColor: colors.primary + "10", // 10% opacity
  },
  timeRangeOptionText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedTimeRangeOptionText: {
    fontWeight: "600",
    color: colors.primary,
  },
  summaryCard: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: colors.primary,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 4,
  },
  summaryPeriod: {
    fontSize: 14,
    color: colors.white + "CC", // 80% opacity
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 8,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  categoryPercentage: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  categoryBarContainer: {
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    marginBottom: 4,
    overflow: "hidden",
  },
  categoryBar: {
    height: "100%",
    borderRadius: 4,
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    textAlign: "right",
  },
  exportButton: {
    marginBottom: 20,
  },
});
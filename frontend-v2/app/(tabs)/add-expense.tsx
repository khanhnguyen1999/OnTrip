import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useExpenseStore } from "@/store/expenseStore";
import { useGroupStore } from "@/store/groupStore";
import { useFriendStore } from "@/store/friendStore";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { categoryOptions } from "@/utils/categoryIcons";
import { 
  DollarSign, 
  Calendar, 
  Users, 
  Tag, 
  FileText, 
  Image as ImageIcon,
  ChevronDown,
  Check
} from "lucide-react-native";

export default function AddExpenseScreen() {
  const router = useRouter();
  const { createExpense, isLoading } = useExpenseStore();
  const { groups } = useGroupStore();
  const { friends } = useFriendStore();
  const { user } = useAuthStore();
  
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("other");
  const [notes, setNotes] = useState("");
  const [splitType, setSplitType] = useState("equal");
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  
  const handleCreateExpense = async () => {
    if (!title || !amount) {
      // Show validation error
      return;
    }
    
    try {
      const numericAmount = parseFloat(amount);
      
      if (isNaN(numericAmount) || numericAmount <= 0) {
        // Show amount validation error
        return;
      }
      
      // Get members from selected group or default to current user
      const members = selectedGroup
        ? groups.find(g => g.id === selectedGroup)?.members || []
        : [];
      
      // Create paidBy array (current user paid full amount)
      const paidBy = [
        {
          userId: user?.id || "user1", // Default to user1 for mock data
          amount: numericAmount,
        },
      ];
      
      // Create splitBetween array based on split type
      // For simplicity, we're just doing equal split in this example
      const splitBetween = [
        {
          userId: user?.id || "user1",
          amount: numericAmount / (members.length || 1),
        },
        ...members
          .filter(m => m.id !== (user?.id || "user1"))
          .map(member => ({
            userId: member.id,
            amount: numericAmount / (members.length || 1),
          })),
      ];
      
      const newExpense = await createExpense({
        title,
        amount: numericAmount,
        currency: "USD",
        paidBy,
        splitBetween,
        date: new Date(date).toISOString(),
        category: selectedCategory as any,
        notes,
        groupId: selectedGroup || undefined,
      });
      
      // Navigate back or to expense details
      router.back();
    } catch (error) {
      console.error("Failed to create expense:", error);
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.title}>Add a new expense</Text>
            
            <Input
              label="Title"
              placeholder="What was this expense for?"
              value={title}
              onChangeText={setTitle}
              leftIcon={<FileText size={20} color={colors.inactive} />}
            />
            
            <Input
              label="Amount"
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              leftIcon={<DollarSign size={20} color={colors.inactive} />}
            />
            
            <Input
              label="Date"
              placeholder="YYYY-MM-DD"
              value={date}
              onChangeText={setDate}
              leftIcon={<Calendar size={20} color={colors.inactive} />}
            />
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Category</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowCategoryPicker(!showCategoryPicker)}
              >
                {categoryOptions.find(c => c.value === selectedCategory) && (
                  <View style={styles.selectedCategory}>
                    {React.createElement(
                      categoryOptions.find(c => c.value === selectedCategory)?.icon || Tag,
                      { size: 20, color: colors.primary }
                    )}
                    <Text style={styles.selectedCategoryText}>
                      {categoryOptions.find(c => c.value === selectedCategory)?.label}
                    </Text>
                  </View>
                )}
                <ChevronDown size={20} color={colors.inactive} />
              </TouchableOpacity>
              
              {showCategoryPicker && (
                <View style={styles.categoryPicker}>
                  {categoryOptions.map((category) => (
                    <TouchableOpacity
                      key={category.value}
                      style={styles.categoryOption}
                      onPress={() => {
                        setSelectedCategory(category.value);
                        setShowCategoryPicker(false);
                      }}
                    >
                      <View style={styles.categoryOptionContent}>
                        {React.createElement(category.icon, {
                          size: 20,
                          color: colors.primary,
                        })}
                        <Text style={styles.categoryOptionText}>
                          {category.label}
                        </Text>
                      </View>
                      {selectedCategory === category.value && (
                        <Check size={20} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Group (optional)</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => {
                  // In a real app, show a group picker
                }}
              >
                <View style={styles.selectedCategory}>
                  <Users size={20} color={colors.primary} />
                  <Text style={styles.selectedCategoryText}>
                    {selectedGroup
                      ? groups.find(g => g.id === selectedGroup)?.name
                      : "No group selected"}
                  </Text>
                </View>
                <ChevronDown size={20} color={colors.inactive} />
              </TouchableOpacity>
            </View>
            
            <Input
              label="Notes (optional)"
              placeholder="Add any additional details"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              style={styles.notesInput}
            />
            
            <View style={styles.buttonContainer}>
              <Button
                title="Add Receipt Photo"
                onPress={() => {}}
                variant="outline"
                icon={<ImageIcon size={18} color={colors.primary} />}
                style={styles.photoButton}
              />
              
              <Button
                title="Save Expense"
                onPress={handleCreateExpense}
                loading={isLoading}
                disabled={!title || !amount}
                style={styles.saveButton}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 6,
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  selectedCategory: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedCategoryText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  categoryPicker: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  categoryOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryOptionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryOptionText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  notesInput: {
    height: 80,
    paddingTop: 12,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  photoButton: {
    marginBottom: 8,
  },
  saveButton: {},
});
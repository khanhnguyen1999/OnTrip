import React, { useState, useEffect } from "react";
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
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { colors } from "@/constants/colors";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { useSettlementStore } from "@/store/settlementStore";
import { useFriendStore } from "@/store/friendStore";
import { 
  DollarSign, 
  Calendar, 
  FileText, 
  CreditCard, 
  Wallet, 
  Ban,
  Check,
  ChevronDown
} from "lucide-react-native";

export default function SettleScreen() {
  const { friendId } = useLocalSearchParams<{ friendId?: string }>();
  const router = useRouter();
  
  const { createSettlement, isLoading } = useSettlementStore();
  const { friends } = useFriendStore();
  
  const [selectedFriend, setSelectedFriend] = useState<string | null>(friendId || null);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online" | "bank">("cash");
  const [showFriendPicker, setShowFriendPicker] = useState(false);
  
  useEffect(() => {
    if (friendId) {
      setSelectedFriend(friendId);
    }
  }, [friendId]);
  
  const handleCreateSettlement = async () => {
    if (!selectedFriend || !amount) {
      // Show validation error
      return;
    }
    
    try {
      const numericAmount = parseFloat(amount);
      
      if (isNaN(numericAmount) || numericAmount <= 0) {
        // Show amount validation error
        return;
      }
      
      const friend = friends.find(f => f.id === selectedFriend);
      
      if (!friend) {
        // Show friend validation error
        return;
      }
      
      // Determine who is paying whom based on the balance
      const fromUserId = friend.balance > 0 ? friend.user.id : "user1";
      const toUserId = friend.balance > 0 ? "user1" : friend.user.id;
      
      const newSettlement = await createSettlement({
        fromUserId,
        toUserId,
        amount: numericAmount,
        currency: "USD",
        date: new Date(date).toISOString(),
        status: "pending",
        method: paymentMethod,
        notes,
      });
      
      // Navigate back or to settlement details
      router.back();
    } catch (error) {
      console.error("Failed to create settlement:", error);
    }
  };
  
  const getPaymentMethodIcon = (method: "cash" | "online" | "bank") => {
    switch (method) {
      case "cash":
        return <Wallet size={20} color={colors.primary} />;
      case "online":
        return <CreditCard size={20} color={colors.primary} />;
      case "bank":
        return <Ban size={20} color={colors.primary} />;
    }
  };
  
  const selectedFriendData = friends.find(f => f.id === selectedFriend);
  
  return (
    <>
      <Stack.Screen options={{ title: "Settle Up" }} />
      
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <Text style={styles.title}>Record a payment</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Friend</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowFriendPicker(!showFriendPicker)}
                >
                  {selectedFriendData ? (
                    <View style={styles.selectedFriend}>
                      <Avatar
                        uri={selectedFriendData.user.avatar}
                        name={selectedFriendData.user.name}
                        size="small"
                      />
                      <Text style={styles.selectedFriendText}>
                        {selectedFriendData.user.name}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.placeholderText}>Select a friend</Text>
                  )}
                  <ChevronDown size={20} color={colors.inactive} />
                </TouchableOpacity>
                
                {showFriendPicker && (
                  <View style={styles.friendPicker}>
                    {friends.map((friend) => (
                      <TouchableOpacity
                        key={friend.id}
                        style={styles.friendOption}
                        onPress={() => {
                          setSelectedFriend(friend.id);
                          setShowFriendPicker(false);
                        }}
                      >
                        <View style={styles.friendOptionContent}>
                          <Avatar
                            uri={friend.user.avatar}
                            name={friend.user.name}
                            size="small"
                          />
                          <Text style={styles.friendOptionText}>
                            {friend.user.name}
                          </Text>
                        </View>
                        {selectedFriend === friend.id && (
                          <Check size={20} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              
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
                <Text style={styles.label}>Payment Method</Text>
                <View style={styles.paymentMethods}>
                  {(["cash", "online", "bank"] as const).map((method) => (
                    <TouchableOpacity
                      key={method}
                      style={[
                        styles.paymentMethod,
                        paymentMethod === method && styles.selectedPaymentMethod,
                      ]}
                      onPress={() => setPaymentMethod(method)}
                    >
                      {getPaymentMethodIcon(method)}
                      <Text
                        style={[
                          styles.paymentMethodText,
                          paymentMethod === method && styles.selectedPaymentMethodText,
                        ]}
                      >
                        {method.charAt(0).toUpperCase() + method.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
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
                leftIcon={<FileText size={20} color={colors.inactive} />}
              />
              
              <Button
                title="Record Payment"
                onPress={handleCreateSettlement}
                loading={isLoading}
                disabled={!selectedFriend || !amount}
                style={styles.submitButton}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
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
  selectedFriend: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedFriendText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  placeholderText: {
    fontSize: 16,
    color: colors.inactive,
  },
  friendPicker: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    maxHeight: 200,
  },
  friendOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  friendOptionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  friendOptionText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  paymentMethods: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  paymentMethod: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  selectedPaymentMethod: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "10", // 10% opacity
  },
  paymentMethodText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.text,
  },
  selectedPaymentMethodText: {
    color: colors.primary,
    fontWeight: "600",
  },
  notesInput: {
    height: 80,
    paddingTop: 12,
  },
  submitButton: {
    marginTop: 24,
  },
});
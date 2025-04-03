import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Friend } from "@/types";
import { colors } from "@/constants/colors";
import { formatCurrency } from "@/utils/formatters";
import { Avatar } from "./Avatar";
import { ArrowDownRight, ArrowUpRight } from "lucide-react-native";

interface FriendItemProps {
  friend: Friend;
  onPress: () => void;
}

export const FriendItem: React.FC<FriendItemProps> = ({ friend, onPress }) => {
  const isPositiveBalance = friend.balance > 0;
  const isZeroBalance = friend.balance === 0;
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Avatar
        uri={friend.user.avatar}
        name={friend.user.name}
        size="medium"
      />
      
      <View style={styles.contentContainer}>
        <Text style={styles.name}>{friend.user.name}</Text>
        
        <View style={styles.balanceContainer}>
          {!isZeroBalance && (
            <View style={styles.iconContainer}>
              {isPositiveBalance ? (
                <ArrowDownRight size={16} color={colors.success} />
              ) : (
                <ArrowUpRight size={16} color={colors.danger} />
              )}
            </View>
          )}
          
          <Text
            style={[
              styles.balanceText,
              isPositiveBalance && styles.positiveBalance,
              !isPositiveBalance && !isZeroBalance && styles.negativeBalance,
              isZeroBalance && styles.zeroBalance,
            ]}
          >
            {isPositiveBalance
              ? `owes you ${formatCurrency(Math.abs(friend.balance))}`
              : isZeroBalance
              ? "settled up"
              : `you owe ${formatCurrency(Math.abs(friend.balance))}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
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
  contentContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 4,
  },
  balanceText: {
    fontSize: 14,
    fontWeight: "500",
  },
  positiveBalance: {
    color: colors.success,
  },
  negativeBalance: {
    color: colors.danger,
  },
  zeroBalance: {
    color: colors.textSecondary,
  },
});
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Activity } from "@/types";
import { colors } from "@/constants/colors";
import { formatRelativeTime } from "@/utils/formatters";
import { Avatar } from "./Avatar";
import { 
  Receipt, 
  HandCoins, 
  Users, 
  UserPlus 
} from "lucide-react-native";

interface ActivityItemProps {
  activity: Activity;
  onPress: () => void;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ 
  activity, 
  onPress 
}) => {
  const getActivityIcon = () => {
    switch (activity.type) {
      case "expense":
        return <Receipt size={20} color={colors.primary} />;
      case "settlement":
        return <HandCoins size={20} color={colors.secondary} />;
      case "group":
        return <Users size={20} color={colors.primary} />;
      case "friend":
        return <UserPlus size={20} color={colors.secondary} />;
      default:
        return null;
    }
  };

  const getActivityTitle = () => {
    switch (activity.type) {
      case "expense":
        return `New expense: ${activity.data.title}`;
      case "settlement":
        return "Settlement recorded";
      case "group":
        return `New group: ${activity.data.name}`;
      case "friend":
        return "New friend added";
      default:
        return "Activity";
    }
  };

  const getActivityDescription = () => {
    switch (activity.type) {
      case "expense":
        return `${activity.data.amount} ${activity.data.currency}`;
      case "settlement":
        return `${activity.data.amount} ${activity.data.currency}`;
      case "group":
        return `${activity.data.members.length} members`;
      case "friend":
        return "";
      default:
        return "";
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, !activity.read && styles.unread]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {getActivityIcon()}
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {getActivityTitle()}
          </Text>
          <Text style={styles.time}>
            {formatRelativeTime(activity.date)}
          </Text>
        </View>
        
        {getActivityDescription() !== "" && (
          <Text style={styles.description}>
            {getActivityDescription()}
          </Text>
        )}
      </View>
      
      {!activity.read && <View style={styles.unreadIndicator} />}
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
  unread: {
    backgroundColor: colors.lightGray,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
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
  time: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    position: "absolute",
    top: 16,
    right: 16,
  },
});
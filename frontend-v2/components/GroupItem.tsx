import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Group } from "@/types";
import { colors } from "@/constants/colors";
import { formatCurrency } from "@/utils/formatters";
import { Avatar } from "./Avatar";
import { Users } from "lucide-react-native";

interface GroupItemProps {
  group: Group;
  onPress: () => void;
}

export const GroupItem: React.FC<GroupItemProps> = ({ group, onPress }) => {
  const renderMemberAvatars = () => {
    const maxDisplayed = 3;
    const displayMembers = group.members.slice(0, maxDisplayed);
    const remainingCount = group.members.length - maxDisplayed;

    return (
      <View style={styles.membersContainer}>
        {displayMembers.map((member, index) => (
          <View key={member.id} style={[styles.avatarWrapper, { zIndex: 10 - index }]}>
            <Avatar
              uri={member.avatar}
              name={member.name}
              size="small"
              showBorder
            />
          </View>
        ))}
        
        {remainingCount > 0 && (
          <View style={styles.remainingCount}>
            <Text style={styles.remainingCountText}>+{remainingCount}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        {group.coverImage ? (
          <Image source={{ uri: group.coverImage }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Users size={24} color={colors.primary} />
          </View>
        )}
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {group.name}
        </Text>
        
        {group.description && (
          <Text style={styles.description} numberOfLines={1}>
            {group.description}
          </Text>
        )}
        
        <View style={styles.footer}>
          {renderMemberAvatars()}
          
          <Text style={styles.balance}>
            {formatCurrency(group.totalBalance)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: 100,
    height: 100,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  membersContainer: {
    flexDirection: "row",
  },
  avatarWrapper: {
    marginRight: -8,
  },
  remainingCount: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
    borderWidth: 2,
    borderColor: colors.white,
  },
  remainingCountText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  balance: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
  },
});
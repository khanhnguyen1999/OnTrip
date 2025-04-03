import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { ActivityItem } from "@/components/ActivityItem";
import { Button } from "@/components/Button";
import { useActivityStore } from "@/store/activityStore";
import { useRouter } from "expo-router";
import { Check } from "lucide-react-native";

export default function ActivityScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  
  const { 
    activities, 
    fetchActivities, 
    markActivityAsRead, 
    markAllAsRead, 
    isLoading 
  } = useActivityStore();
  
  useEffect(() => {
    fetchActivities();
  }, []);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchActivities();
    setRefreshing(false);
  };
  
  const handleActivityPress = (activityId: string) => {
    // Mark as read
    markActivityAsRead(activityId);
    
    // Navigate based on activity type
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;
    
    switch (activity.type) {
      case "expense":
        router.push(`/expenses/${activity.data.id}`);
        break;
      case "settlement":
        router.push(`/settlements/${activity.data.id}`);
        break;
      case "group":
        router.push(`/groups/${activity.data.id}`);
        break;
      case "friend":
        router.push(`/friends/${activity.data.id}`);
        break;
    }
  };
  
  const unreadActivities = activities.filter(a => !a.read);
  const hasUnread = unreadActivities.length > 0;
  
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
        
        {hasUnread && (
          <Button
            title="Mark all as read"
            onPress={() => markAllAsRead()}
            variant="outline"
            size="small"
            icon={<Check size={16} color={colors.primary} />}
          />
        )}
      </View>
      
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ActivityItem
            activity={item}
            onPress={() => handleActivityPress(item.id)}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No activity yet</Text>
            <Text style={styles.emptyText}>
              Your recent activity will appear here
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  listContent: {
    padding: 20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
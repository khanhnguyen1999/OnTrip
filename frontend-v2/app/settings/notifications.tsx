import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { colors } from "@/constants/colors";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export default function NotificationsSettingsScreen() {
  const [newExpenseEnabled, setNewExpenseEnabled] = useState(true);
  const [newSettlementEnabled, setNewSettlementEnabled] = useState(true);
  const [newGroupEnabled, setNewGroupEnabled] = useState(true);
  const [newFriendEnabled, setNewFriendEnabled] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  
  const handleSaveSettings = () => {
    // In a real app, this would save the notification settings to the server
    // For now, we'll just show a success message
    alert("Notification settings saved successfully");
  };
  
  return (
    <>
      <Stack.Screen options={{ title: "Notification Settings" }} />
      
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Notification Types</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>New Expenses</Text>
                  <Text style={styles.settingDescription}>
                    Get notified when someone adds a new expense
                  </Text>
                </View>
                <Switch
                  value={newExpenseEnabled}
                  onValueChange={setNewExpenseEnabled}
                  trackColor={{ false: colors.inactive, true: colors.primary }}
                  thumbColor={colors.white}
                />
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Settlements</Text>
                  <Text style={styles.settingDescription}>
                    Get notified about new settlements and payment confirmations
                  </Text>
                </View>
                <Switch
                  value={newSettlementEnabled}
                  onValueChange={setNewSettlementEnabled}
                  trackColor={{ false: colors.inactive, true: colors.primary }}
                  thumbColor={colors.white}
                />
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Group Activity</Text>
                  <Text style={styles.settingDescription}>
                    Get notified about new groups and group updates
                  </Text>
                </View>
                <Switch
                  value={newGroupEnabled}
                  onValueChange={setNewGroupEnabled}
                  trackColor={{ false: colors.inactive, true: colors.primary }}
                  thumbColor={colors.white}
                />
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Friend Requests</Text>
                  <Text style={styles.settingDescription}>
                    Get notified when someone adds you as a friend
                  </Text>
                </View>
                <Switch
                  value={newFriendEnabled}
                  onValueChange={setNewFriendEnabled}
                  trackColor={{ false: colors.inactive, true: colors.primary }}
                  thumbColor={colors.white}
                />
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Payment Reminders</Text>
                  <Text style={styles.settingDescription}>
                    Get weekly reminders about outstanding balances
                  </Text>
                </View>
                <Switch
                  value={reminderEnabled}
                  onValueChange={setReminderEnabled}
                  trackColor={{ false: colors.inactive, true: colors.primary }}
                  thumbColor={colors.white}
                />
              </View>
            </Card>
            
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Notification Channels</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Email Notifications</Text>
                  <Text style={styles.settingDescription}>
                    Receive notifications via email
                  </Text>
                </View>
                <Switch
                  value={emailEnabled}
                  onValueChange={setEmailEnabled}
                  trackColor={{ false: colors.inactive, true: colors.primary }}
                  thumbColor={colors.white}
                />
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Push Notifications</Text>
                  <Text style={styles.settingDescription}>
                    Receive push notifications on your device
                  </Text>
                </View>
                <Switch
                  value={pushEnabled}
                  onValueChange={setPushEnabled}
                  trackColor={{ false: colors.inactive, true: colors.primary }}
                  thumbColor={colors.white}
                />
              </View>
            </Card>
            
            <Button
              title="Save Settings"
              onPress={handleSaveSettings}
              style={styles.saveButton}
            />
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
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  saveButton: {
    marginBottom: 20,
  },
});
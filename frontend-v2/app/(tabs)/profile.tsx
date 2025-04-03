import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import { 
  User, 
  Settings, 
  CreditCard, 
  FileText, 
  Bell, 
  HelpCircle, 
  LogOut,
  ChevronRight
} from "lucide-react-native";
import { currentUser } from "@/mocks/users";

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, isLoading } = useAuthStore();
  
  const handleLogout = async () => {
    router.push('/auth/login')

    // Alert.alert(
    //   "Logout",
    //   "Are you sure you want to logout?",
    //   [
    //     {
    //       text: "Cancel",
    //       style: "cancel",
    //     },
    //     {
    //       text: "Logout",
    //       onPress: async () => {
    //         await logout();
    //         router.push('/auth/login')
    //         // In a real app, this would navigate to login screen
    //       },
    //     },
    //   ]
    // );
  };
  
  const menuItems = [
    {
      icon: <User size={20} color={colors.primary} />,
      title: "Account Settings",
      onPress: () => router.push("/settings/account"),
    },
    {
      icon: <CreditCard size={20} color={colors.primary} />,
      title: "Payment Methods",
      onPress: () => router.push("/settings/payment"),
    },
    {
      icon: <FileText size={20} color={colors.primary} />,
      title: "Expense Reports",
      onPress: () => router.push("/reports"),
    },
    {
      icon: <Bell size={20} color={colors.primary} />,
      title: "Notifications",
      onPress: () => router.push("/settings/notifications"),
    },
    {
      icon: <HelpCircle size={20} color={colors.primary} />,
      title: "Help & Support",
      onPress: () => router.push("/help"),
    },
  ];
  
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <Avatar
              uri={currentUser.avatar}
              name={currentUser.name}
              size="large"
              showBorder
            />
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{currentUser.name}</Text>
              <Text style={styles.email}>{currentUser.email}</Text>
            </View>
          </View>
          
          <Button
            title="Edit Profile"
            onPress={() => router.push("/settings/profile")}
            variant="outline"
            size="small"
          />
        </View>
        
        <Card style={styles.balanceCard}>
          <Text style={styles.balanceTitle}>Account Balance</Text>
          <Text style={styles.balanceAmount}>$124.50</Text>
          <Button
            title="Add Funds"
            onPress={() => router.push("/add-funds")}
            style={styles.addFundsButton}
          />
        </Card>
        
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                {item.icon}
                <Text style={styles.menuItemTitle}>{item.title}</Text>
              </View>
              <ChevronRight size={20} color={colors.inactive} />
            </TouchableOpacity>
          ))}
        </View>
        
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          icon={<LogOut size={18} color={colors.danger} />}
          style={styles.logoutButton}
          textStyle={styles.logoutButtonText}
          loading={isLoading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  nameContainer: {
    marginLeft: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  balanceCard: {
    margin: 20,
    alignItems: "center",
  },
  balanceTitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 16,
  },
  addFundsButton: {
    width: "100%",
  },
  menuContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemTitle: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  logoutButton: {
    marginHorizontal: 20,
    marginBottom: 40,
    borderColor: colors.danger,
  },
  logoutButtonText: {
    color: colors.danger,
  },
});
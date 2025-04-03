import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { colors } from "@/constants/colors";
import { Card } from "@/components/Card";
import { 
  HelpCircle, 
  MessageCircle, 
  FileText, 
  Mail, 
  ChevronRight 
} from "lucide-react-native";

export default function HelpScreen() {
  const router = useRouter();
  
  const faqItems = [
    {
      question: "How do I add an expense?",
      answer: "To add an expense, tap the '+' button in the middle of the bottom navigation bar or go to the Expenses tab and tap 'Add' in the top right corner."
    },
    {
      question: "How do I settle up with a friend?",
      answer: "Go to your friend's profile, then tap 'Settle up'. You can also tap 'Settle up' on the home screen and select the friend you want to settle with."
    },
    {
      question: "How do I create a group?",
      answer: "Go to the Groups tab and tap 'Create' in the top right corner. Enter a name for your group, add a description and cover image if you want, and select friends to add to the group."
    },
    {
      question: "How are expenses split?",
      answer: "By default, expenses are split equally among all members of a group or between you and a friend. You can customize the split when adding an expense."
    },
    {
      question: "Can I change my currency?",
      answer: "Yes, you can change your preferred currency in Account Settings."
    },
  ];
  
  return (
    <>
      <Stack.Screen options={{ title: "Help & Support" }} />
      
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Card style={styles.section}>
              <View style={styles.sectionHeader}>
                <HelpCircle size={24} color={colors.primary} />
                <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
              </View>
              
              {faqItems.map((item, index) => (
                <View key={index} style={styles.faqItem}>
                  <Text style={styles.question}>{item.question}</Text>
                  <Text style={styles.answer}>{item.answer}</Text>
                </View>
              ))}
            </Card>
            
            <Text style={styles.contactTitle}>Need more help?</Text>
            
            <TouchableOpacity style={styles.contactOption}>
              <View style={styles.contactOptionIcon}>
                <MessageCircle size={24} color={colors.primary} />
              </View>
              <View style={styles.contactOptionContent}>
                <Text style={styles.contactOptionTitle}>Chat with Support</Text>
                <Text style={styles.contactOptionDescription}>
                  Get help from our support team via chat
                </Text>
              </View>
              <ChevronRight size={20} color={colors.inactive} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.contactOption}>
              <View style={styles.contactOptionIcon}>
                <FileText size={24} color={colors.primary} />
              </View>
              <View style={styles.contactOptionContent}>
                <Text style={styles.contactOptionTitle}>Documentation</Text>
                <Text style={styles.contactOptionDescription}>
                  Browse our help articles and guides
                </Text>
              </View>
              <ChevronRight size={20} color={colors.inactive} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.contactOption}>
              <View style={styles.contactOptionIcon}>
                <Mail size={24} color={colors.primary} />
              </View>
              <View style={styles.contactOptionContent}>
                <Text style={styles.contactOptionTitle}>Email Support</Text>
                <Text style={styles.contactOptionDescription}>
                  Send us an email at support@splitwise.com
                </Text>
              </View>
              <ChevronRight size={20} color={colors.inactive} />
            </TouchableOpacity>
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
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 12,
  },
  faqItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  question: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  answer: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  contactOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  contactOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  contactOptionContent: {
    flex: 1,
  },
  contactOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  contactOptionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
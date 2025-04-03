import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, Stack } from "expo-router";
import { colors } from "@/constants/colors";
import { Input } from "@/components/Input";
import { Avatar } from "@/components/Avatar";
import { messageService } from "@/services/messageService";
import { useGroupStore } from "@/store/groupStore";
import { formatTime } from "@/utils/formatters";
import { Send, Image as ImageIcon } from "lucide-react-native";
import { currentUser } from "@/mocks/users";
import { mockMessages } from "@/mocks/messages";

export default function GroupChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { currentGroup, fetchGroupById } = useGroupStore();
  
  const [messages, setMessages] = useState(mockMessages.filter(m => m.groupId === id));
  const [messageText, setMessageText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetchGroupById(id);
      loadMessages();
    }
  }, [id]);
  
  const loadMessages = async () => {
    try {
      const groupMessages = await messageService.getGroupMessages(id);
      setMessages(groupMessages);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };
  
  const handleSendMessage = async () => {
    if (!messageText.trim() || !currentUser) return;
    
    setIsLoading(true);
    
    try {
      const newMessage = await messageService.sendMessage({
        groupId: id,
        senderId: currentUser.id,
        text: messageText,
      });
      
      setMessages([...messages, newMessage]);
      setMessageText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderMessage = ({ item }: any) => {
    const isCurrentUser = item.senderId === currentUser.id;
    const sender = currentGroup?.members.find(m => m.id === item.senderId);
    
    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
        ]}
      >
        {!isCurrentUser && (
          <View style={styles.messageAvatar}>
            <Avatar
              uri={sender?.avatar}
              name={sender?.name || ""}
              size="small"
            />
          </View>
        )}
        
        <View
          style={[
            styles.messageBubble,
            isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
          ]}
        >
          {!isCurrentUser && (
            <Text style={styles.messageSender}>{sender?.name}</Text>
          )}
          
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.messageTime}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: currentGroup?.name || "Group Chat",
        }} 
      />
      
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messagesList}
            inverted={false}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No messages yet</Text>
                <Text style={styles.emptySubtext}>
                  Start the conversation by sending a message
                </Text>
              </View>
            }
          />
          
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachButton}>
              <ImageIcon size={24} color={colors.primary} />
            </TouchableOpacity>
            
            <Input
              placeholder="Type a message..."
              value={messageText}
              onChangeText={setMessageText}
              containerStyle={styles.inputWrapper}
              inputStyle={styles.input}
            />
            
            <TouchableOpacity
              style={[
                styles.sendButton,
                !messageText.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!messageText.trim() || isLoading}
            >
              <Send size={20} color={!messageText.trim() ? colors.inactive : colors.white} />
            </TouchableOpacity>
          </View>
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
  messagesList: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 16,
    maxWidth: "80%",
  },
  currentUserMessage: {
    alignSelf: "flex-end",
  },
  otherUserMessage: {
    alignSelf: "flex-start",
  },
  messageAvatar: {
    marginRight: 8,
    alignSelf: "flex-end",
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
  },
  currentUserBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    backgroundColor: colors.lightGray,
    borderBottomLeftRadius: 4,
  },
  messageSender: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 10,
    color: colors.textSecondary,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  attachButton: {
    padding: 8,
  },
  inputWrapper: {
    flex: 1,
    marginBottom: 0,
  },
  input: {
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: colors.lightGray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
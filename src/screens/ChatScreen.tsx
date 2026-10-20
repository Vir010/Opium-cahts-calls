import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { User } from '../types';

const COLORS = {
  bg: '#0F0E13',
  card: '#16151B',
  textMain: '#FFFFFF',
  textSub: '#656469',
  accent: '#8A56FF',
  inputBg: '#1A1920',
};

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

interface ChatScreenProps {
  visible: boolean;
  recipient: User | null;
  currentUserId: string;
  onClose: () => void;
}

export default function ChatScreen({ visible, recipient, currentUserId, onClose }: ChatScreenProps) {
  if (!visible || !recipient) return null;

  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', senderId: recipient.id, text: 'Привет! Это проект Opium?', timestamp: '14:20' },
    { id: 'm2', senderId: currentUserId, text: 'Да, привет! Пишу чат и интеграцию звонков.', timestamp: '14:22' },
    { id: 'm3', senderId: recipient.id, text: 'Круто, дизайн на SVG отлично выглядит!', timestamp: '14:23' },
  ]);

  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = () => {
    if (text.trim() === '') return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUserId,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setText('');

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path d="M15 19l-7-7 7-7" stroke="#A3A2A8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text style={styles.backText}>Назад</Text>
        </TouchableOpacity>
        
        <View style={styles.recipientInfo}>
          <Text style={styles.recipientName}>{recipient.name}</Text>
          <Text style={styles.recipientStatus}>@{recipient.username}</Text>
        </View>
        <View style={styles.headerSpacing} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={styles.keyboardView}
      >
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <View 
                key={msg.id} 
                style={isMe ? [styles.messageRow, styles.myRow] : [styles.messageRow, styles.theirRow]}
              >
                <View style={isMe ? [styles.bubble, styles.myBubble] : [styles.bubble, styles.theirBubble]}>
                  <Text style={styles.messageText}>{msg.text}</Text>
                  <Text style={styles.timestampText}>{msg.timestamp}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={`Написать @${recipient.username}`}
            placeholderTextColor="#4E4D53"
            value={text}
            onChangeText={setText}
            multiline
          />
          <TouchableOpacity 
            style={text.trim().length > 0 ? [styles.sendButton, styles.sendButtonActive] : styles.sendButton} 
            onPress={sendMessage}
          >
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="#FFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1A1920' },
  backButton: { flexDirection: 'row', alignItems: 'center', width: 80 },
  backText: { color: '#A3A2A8', fontSize: 16, marginLeft: 4 },
  recipientInfo: { alignItems: 'center' },
  recipientName: { color: COLORS.textMain, fontWeight: 'bold', fontSize: 16 },
  recipientStatus: { color: COLORS.accent, fontSize: 12, marginTop: 2 },
  headerSpacing: { width: 80 },
  keyboardView: { flex: 1 },
  messagesList: { padding: 16, paddingBottom: 24 },
  messageRow: { flexDirection: 'row', marginBottom: 14, width: '100%' },
  myRow: { justifyContent: 'flex-end' },
  theirRow: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '75%', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, position: 'relative' },
  myBubble: { backgroundColor: COLORS.accent, borderBottomRightRadius: 2 },
  theirBubble: { backgroundColor: COLORS.card, borderBottomLeftRadius: 2 },
  messageText: { color: COLORS.textMain, fontSize: 15, lineHeight: 20 },
  timestampText: { color: 'rgba(255,255,255,0.4)', fontSize: 10, textAlign: 'right', marginTop: 4, alignSelf: 'flex-end' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#121118', borderTopWidth: 1, borderTopColor: '#1A1920' },
  input: { flex: 1, backgroundColor: COLORS.inputBg, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, color: COLORS.textMain, fontSize: 15, maxHeight: 100 },
  sendButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#232229', justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  sendButtonActive: { backgroundColor: COLORS.accent },
});

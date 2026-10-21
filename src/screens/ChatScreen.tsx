import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  SafeAreaView,
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
  status?: 'sent' | 'read'; // 'sent' - отправлено, 'read' - прочитано
}

interface ChatScreenProps {
  visible: boolean;
  recipient: User | null;
  currentUserId: string;
  onClose: () => void;
}

export default function ChatScreen({
  visible,
  recipient,
  currentUserId,
  onClose,
}: ChatScreenProps) {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const scrollViewRef = useRef<React.ComponentRef<typeof ScrollView>>(null);

  if (!visible || !recipient) return null;

  const handleGreet = () => {
    const greetingMsg: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUserId,
      text: 'Привет!',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'sent',
    };
    setMessages([greetingMsg]);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendMessage = () => {
    if (text.trim() === '') return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUserId,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'sent', // Изначально сообщение просто отправлено
    };

    setMessages([...messages, newMessage]);
    setText('');

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Симуляция прочтения сообщения собеседником через 2 секунды
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'read' } : msg,
        ),
      );
    }, 2000);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Шапка чата */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M15 19l-7-7 7-7"
                stroke="#A3A2A8"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
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
            contentContainerStyle={
              messages.length === 0
                ? styles.emptyMessagesList
                : styles.messagesList
            }
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: false })
            }
          >
            {messages.length === 0 ? (
              <View style={styles.emptyStateContainer}>
                <View style={styles.emptyIconCircle}>
                  <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                      stroke={COLORS.textSub}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </View>
                <Text style={styles.emptyStateTitle}>
                  Это начало вашей переписки с {recipient.name}
                </Text>
                <Text style={styles.emptyStateSubtitle}>
                  Напишите сообщение или отправьте приветствие.
                </Text>

                <TouchableOpacity
                  style={styles.greetButton}
                  onPress={handleGreet}
                >
                  <Text style={styles.greetButtonText}>Поприветствовать</Text>
                </TouchableOpacity>
              </View>
            ) : (
              messages.map(msg => {
                const isMe = msg.senderId === currentUserId;
                return (
                  <View
                    key={msg.id}
                    style={
                      isMe
                        ? [styles.messageRow, styles.myRow]
                        : [styles.messageRow, styles.theirRow]
                    }
                  >
                    <View
                      style={
                        isMe
                          ? [styles.bubble, styles.myBubble]
                          : [styles.bubble, styles.theirBubble]
                      }
                    >
                      <Text style={styles.messageText}>{msg.text}</Text>

                      {/* Блок времени и статуса */}
                      <View style={styles.timeAndStatusRow}>
                        <Text style={styles.timestampText}>
                          {msg.timestamp}
                        </Text>

                        {/* Индикатор отображается только на моих сообщениях справа */}
                        {isMe && (
                          <View style={styles.statusTickWrapper}>
                            {msg.status === 'read' ? (
                              /* Две зеленые галочки (Прочитано) */
                              <Svg
                                width={14}
                                height={14}
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <Path
                                  d="M2 12l5 5L18 6M9 17l5 5L22 11"
                                  stroke="#00C853"
                                  strokeWidth={2.5}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </Svg>
                            ) : (
                              /* Одна голубая галочка (Отправлено) */
                              <Svg
                                width={14}
                                height={14}
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <Path
                                  d="M5 12l5 5L20 7"
                                  stroke="#00B0FF"
                                  strokeWidth={2.5}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </Svg>
                            )}
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })
            )}
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
              style={
                text.trim().length > 0
                  ? [styles.sendButton, styles.sendButtonActive]
                  : styles.sendButton
              }
              onPress={sendMessage}
            >
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                  stroke="#FFF"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1920',
  },
  backButton: { flexDirection: 'row', alignItems: 'center', width: 80 },
  backText: { color: '#A3A2A8', fontSize: 16, marginLeft: 4 },
  recipientInfo: { alignItems: 'center' },
  recipientName: { color: COLORS.textMain, fontWeight: 'bold', fontSize: 16 },
  recipientStatus: { color: COLORS.accent, fontSize: 12, marginTop: 2 },
  headerSpacing: { width: 80 },
  keyboardView: { flex: 1 },
  messagesList: { padding: 16, paddingBottom: 24 },

  emptyMessagesList: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    color: COLORS.textMain,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    color: COLORS.textSub,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  greetButton: {
    backgroundColor: COLORS.card,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#2A2933',
  },
  greetButtonText: { color: COLORS.textMain, fontSize: 15, fontWeight: '600' },

  messageRow: { flexDirection: 'row', marginBottom: 14, width: '100%' },
  myRow: { justifyContent: 'flex-end' },
  theirRow: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '75%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    position: 'relative',
  },
  myBubble: { backgroundColor: COLORS.accent, borderBottomRightRadius: 2 },
  theirBubble: { backgroundColor: COLORS.card, borderBottomLeftRadius: 2 },
  messageText: { color: COLORS.textMain, fontSize: 15, lineHeight: 20 },

  // Стили для времени и статуса
  timeAndStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timestampText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    textAlign: 'right',
  },
  statusTickWrapper: {
    marginLeft: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#121118',
    borderTopWidth: 1,
    borderTopColor: '#1A1920',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.inputBg,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: COLORS.textMain,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#232229',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonActive: { backgroundColor: COLORS.accent },
});

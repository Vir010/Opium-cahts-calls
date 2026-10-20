import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { User } from '../types';

const COLORS = {
  bg: '#0F0E13',
  textMain: '#FFFFFF',
  textSub: '#656469',
  accent: '#8A56FF',
  inputBg: '#1A1920',
  online: '#00C853',
};

const MOCK_MEMBERS: User[] = [
  {
    id: 'usr_1',
    name: 'Аня Крылова',
    username: 'anya_kr',
    avatarText: 'AK',
    role: 'owner',
    roleColor: '#BD80FF',
    isOnline: true,
  },
  {
    id: 'usr_2',
    name: 'Илья Волков',
    username: 'volkov_i',
    avatarText: 'ИВ',
    role: 'moderator',
    roleColor: '#7064FF',
    isOnline: true,
  },
  {
    id: 'usr_3',
    name: 'Маша Соколова',
    username: 'mashasoko',
    avatarText: 'MC',
    role: 'member',
    isOnline: true,
  },
  {
    id: 'usr_4',
    name: 'Денис Морозов',
    username: 'den_moroz',
    avatarText: 'ДМ',
    role: 'member',
    isOnline: true,
  },
  {
    id: 'usr_5',
    name: 'Лев Антонов',
    username: 'lev_ant',
    avatarText: 'ЛА',
    role: 'member',
    isOnline: true,
  },
  {
    id: 'usr_6',
    name: 'Ника Белова',
    username: 'nika_bel',
    avatarText: 'НБ',
    role: 'member',
    isOnline: false,
  },
];

interface MembersScreenProps {
  currentUserId: string;
  onStartCall: (targetUserId: string) => void;
  onOpenChat: (targetUserId: string) => void;
}

export default function MembersScreen({
  currentUserId,
  onStartCall,
  onOpenChat,
}: MembersScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = MOCK_MEMBERS.filter(member => {
    const query = searchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(query) ||
      member.username.toLowerCase().includes(query)
    );
  });

  const renderMemberRow = (member: User) => {
    const isMe = member.id === currentUserId;

    return (
      <View
        key={member.id}
        style={[styles.memberRow, !member.isOnline && { opacity: 0.4 }]}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{member.avatarText}</Text>
          </View>
          {member.isOnline ? <View style={styles.statusDot} /> : null}
        </View>
        <View style={styles.memberInfo}>
          <View style={styles.nameRow}>
            <Text
              style={[
                styles.memberName,
                member.roleColor
                  ? { color: member.roleColor }
                  : { color: COLORS.textMain },
              ]}
            >
              {member.name} {isMe ? '(Вы)' : ''}
            </Text>
            {member.role === 'owner' ? (
              <Svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="#E6A23C"
                style={{ marginLeft: 4 }}
              >
                <Path d="M2 4l3 5 7-6 7 6 3-5v14H2V4z" />
              </Svg>
            ) : null}
          </View>
          <Text style={styles.usernameText}>@{member.username}</Text>
        </View>

        {!isMe && member.isOnline ? (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onOpenChat && onOpenChat(member.id)}
            >
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"
                  stroke="#A3A2A8"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.callButton]}
              onPress={() => onStartCall && onStartCall(member.id)}
            >
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
                  stroke="#8A56FF"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };

  const owners = filteredMembers.filter(m => m.role === 'owner');
  const moderators = filteredMembers.filter(m => m.role === 'moderator');
  const onlineMembers = filteredMembers.filter(
    m => m.role === 'member' && m.isOnline,
  );
  const offlineMembers = filteredMembers.filter(
    m => m.role === 'member' && !m.isOnline,
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M15 19l-7-7 7-7"
              stroke="#A3A2A8"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={styles.backText}>Назад</Text>
        </TouchableOpacity>
        <Text style={styles.logoText}>OPIUM</Text>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Участники</Text>
        <Text style={styles.subtitle}>
          Opium Server · {MOCK_MEMBERS.length} участников
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Найти по имени или @username"
          placeholderTextColor="#4E4D53"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <ScrollView style={styles.scroll}>
        {owners.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Владелец</Text>
            {owners.map(renderMemberRow)}
          </>
        ) : null}
        {moderators.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Модераторы</Text>
            {moderators.map(renderMemberRow)}
          </>
        ) : null}
        {onlineMembers.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>В сети</Text>
            {onlineMembers.map(renderMemberRow)}
          </>
        ) : null}
        {offlineMembers.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Не в сети</Text>
            {offlineMembers.map(renderMemberRow)}
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
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
  },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { color: '#A3A2A8', fontSize: 16, marginLeft: 4 },
  logoText: { color: COLORS.accent, fontWeight: 'bold', letterSpacing: 1 },
  titleContainer: { paddingHorizontal: 16, marginTop: 8 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.textMain },
  subtitle: { color: COLORS.textSub, fontSize: 13, marginTop: 4 },
  searchContainer: { paddingHorizontal: 16, marginTop: 16, marginBottom: 12 },
  searchInput: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.textMain,
    fontSize: 15,
  },
  scroll: { paddingHorizontal: 16 },
  sectionTitle: {
    color: COLORS.textSub,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    justifyContent: 'space-between',
  },
  avatarContainer: { position: 'relative' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#232229',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: COLORS.textMain, fontWeight: '600', fontSize: 14 },
  statusDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.online,
    borderWidth: 2,
    borderColor: COLORS.bg,
  },
  memberInfo: { marginLeft: 12, flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  memberName: { fontWeight: '600', fontSize: 15 },
  usernameText: { color: COLORS.textSub, fontSize: 13, marginTop: 1 },
  actionsRow: { flexDirection: 'row', alignItems: 'center' },
  actionButton: {
    padding: 8,
    marginLeft: 4,
    backgroundColor: '#16151B',
    borderRadius: 8,
  },
  callButton: { backgroundColor: '#1F192E' },
});

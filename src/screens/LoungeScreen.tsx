import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { CallParticipant, User } from '../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const COLORS = {
  bg: '#0F0E13',
  card: '#16151B',
  textMain: '#FFFFFF',
  textSub: '#656469',
  accent: '#6236FF',
};

const MicIcon = ({ isMuted = false, size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 1a4 4 0 00-4 4v7a4 4 0 008 0V5a4 4 0 00-4-4z" fill={isMuted ? '#656469' : '#FFF'} />
    <Path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke={isMuted ? '#656469' : '#FFF'} strokeWidth={2} strokeLinecap="round" />
    {isMuted ? <Path d="M3 3l18 18" stroke="#FF3B30" strokeWidth={2} strokeLinecap="round" /> : null}
  </Svg>
);

const HeadphoneIcon = ({ isDeafened = false, size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 14c0-4.97 4.03-9 9-9s9 4.03 9 9v4a3 3 0 01-3 3h-2v-6h5v-2c0-3.87-3.13-7-7-7S5 10.13 5 14v2h5v6H8a3 3 0 01-3-3v-4z" fill={isDeafened ? '#656469' : '#FFF'} />
    {isDeafened ? <Path d="M3 3l18 18" stroke="#FF3B30" strokeWidth={2} strokeLinecap="round" /> : null}
  </Svg>
);

const PhoneOffIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M10.68 13.31a16 16 0 003.48 3.48M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.42 19.42 0 01-3.33-2.67m-2.67-3.34a19.79 19.79 0 01-3.07-8.63A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91M23 1L1 23" stroke="#FFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

interface LoungeScreenProps {
  visible: boolean;
  participants: CallParticipant[];
  currentUserId: string;
  isCallConnected: boolean;
  formattedTime: string;
  netSpeed: string;
  availableUsersToInvite: User[];
  onInviteUser: (userId: string) => void;
  onMinimize: () => void;
  onDisconnect: () => void;
}

export default function LoungeScreen({ 
  visible, 
  participants, 
  currentUserId, 
  isCallConnected, 
  formattedTime,
  netSpeed,
  availableUsersToInvite,
  onInviteUser,
  onMinimize, 
  onDisconnect 
}: LoungeScreenProps) {
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);

  useEffect(() => { if (isDeafened) setIsMicMuted(true); }, [isDeafened]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onMinimize} style={styles.backButton}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M19 9l-7 7-7-7" stroke="#A3A2A8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.backText}>Свернуть</Text>
          </TouchableOpacity>
          
          <Text style={styles.logoText}>OPIUM CALL</Text>

          <TouchableOpacity onPress={() => setIsInviteModalVisible(true)} style={styles.inviteHeaderButton}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M8.5 11a4 4 0 100-8 4 4 0 000 8zM19 8v6M22 11h-6" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
        </View>

        <View style={styles.roomContainer}>
          <Text style={styles.roomTitle}>{isCallConnected ? 'Разговор идет' : 'Ожидание ответа...'}</Text>
          <Text style={styles.roomSubtitle}>{isCallConnected ? `Длительность: ${formattedTime}` : 'Вызов отправлен пользователю'}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.grid}>
          {participants.map((user) => {
            const isMe = user.id === currentUserId;
            const finalMicState = isMe ? !isMicMuted : user.isMicOn;
            const finalSpeaking = isMe ? (user.isSpeaking && !isMicMuted) : user.isSpeaking;

            return (
              <View key={user.id} style={finalSpeaking ? [styles.card, styles.cardSpeaking] : styles.card}>
                <View style={finalSpeaking ? [styles.avatar, styles.avatarSpeaking] : styles.avatar}>
                  <Text style={styles.avatarText}>{user.avatarText}</Text>
                  <View style={!finalMicState ? [styles.badgeBase, styles.badgeMuted] : [styles.badgeBase, styles.badgeMicOn]}>
                    <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
                      <Path d={finalMicState ? "M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z" : "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"} fill="#FFF" />
                    </Svg>
                  </View>
                </View>
                <Text style={styles.cardName} numberOfLines={1}>{user.name}</Text>
                <Text style={finalSpeaking ? styles.statusSpeaking : styles.cardStatus}>
                  {finalSpeaking ? 'Говорит' : !finalMicState ? 'Микрофон выкл.' : isCallConnected ? 'Подключен' : 'Вызов...'}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.bottomBar}>
          <Text style={styles.connStatus}>
            {isCallConnected ? `Сеть: ${netSpeed}` : 'Статус соединения: Вызов'}
          </Text>
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.controlBtn} onPress={() => setIsMicMuted(!isMicMuted)}>
              <View style={isMicMuted ? [styles.iconCircle, styles.activeRedCircle] : styles.iconCircle}><MicIcon isMuted={isMicMuted} /></View>
              <Text style={styles.btnLabel}>Микрофон</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlBtn} onPress={() => setIsDeafened(!isDeafened)}>
              <View style={isDeafened ? [styles.iconCircle, styles.activeRedCircle] : styles.iconCircle}><HeadphoneIcon isDeafened={isDeafened} /></View>
              <Text style={styles.btnLabel}>Наушники</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlBtn} onPress={onDisconnect}>
              <View style={[styles.iconCircle, styles.declineCircle]}>
                <PhoneOffIcon />
              </View>
              <Text style={styles.btnLabel}>Отключиться</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal transparent visible={isInviteModalVisible} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.inviteContent}>
              <Text style={styles.modalTitle}>Добавить в звонок</Text>
              <ScrollView style={styles.inviteScroll}>
                {availableUsersToInvite.map(u => (
                  <View key={u.id} style={styles.inviteRow}>
                    <View style={styles.inviteUserLeft}>
                      <View style={styles.miniAvatar}><Text style={styles.miniAvatarText}>{u.avatarText}</Text></View>
                      <Text style={styles.inviteUserName}>{u.name}</Text>
                    </View>
                    <TouchableOpacity style={styles.addBtn} onPress={() => {
                      onInviteUser(u.id);
                      setIsInviteModalVisible(false);
                    }}>
                      <Text style={styles.addBtnText}>Позвать</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                {availableUsersToInvite.length === 0 ? (
                  <Text style={styles.noUsersText}>Все доступные участники уже добавлены.</Text>
                ) : null}
              </ScrollView>
              <TouchableOpacity style={styles.closeModalBtn} onPress={() => setIsInviteModalVisible(false)}>
                <Text style={styles.closeModalBtnText}>Закрыть</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0E13' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backButton: { flexDirection: 'row', alignItems: 'center', width: 90 },
  backText: { color: '#A3A2A8', fontSize: 16, marginLeft: 4 },
  logoText: { color: '#8A56FF', fontWeight: 'bold', letterSpacing: 1 },
  inviteHeaderButton: { width: 90, alignItems: 'flex-end', paddingRight: 4 },
  roomContainer: { paddingHorizontal: 20, marginTop: 8, marginBottom: 16 },
  roomTitle: { fontSize: 26, fontWeight: 'bold', color: '#FFFFFF' },
  roomSubtitle: { color: '#656469', fontSize: 14, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 160 },
  card: { width: CARD_WIDTH, height: CARD_WIDTH * 1.15, backgroundColor: '#16151B', borderRadius: 16, marginBottom: 16, justifyContent: 'center', alignItems: 'center', padding: 12 },
  cardSpeaking: { borderWidth: 2, borderColor: '#6236FF' },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#232229', justifyContent: 'center', alignItems: 'center', marginBottom: 12, position: 'relative' },
  avatarSpeaking: { borderWidth: 2, borderColor: '#6236FF' },
  avatarText: { color: '#FFFFFF', fontSize: 20, fontWeight: '600' },

cardName: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginBottom: 4, textAlign: 'center', width: '100%' },
cardStatus: { color: '#656469', fontSize: 11, textAlign: 'center' },
statusSpeaking: { color: '#6236FF', fontSize: 11, textAlign: 'center', fontWeight: '500' },
badgeBase: { position: 'absolute', bottom: -2, right: -2, borderRadius: 10, padding: 4 },
badgeMicOn: { backgroundColor: '#2D7F34' },
badgeMuted: { backgroundColor: '#FF3B30' },
bottomBar: { backgroundColor: '#121118', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 12, paddingBottom: 24, paddingHorizontal: 24, position: 'absolute', bottom: 0, left: 0, right: 0 },
connStatus: { color: '#00C853', fontSize: 12, textAlign: 'center', marginBottom: 16 },
btnRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
controlBtn: { alignItems: 'center' },
iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#1C1B22', justifyContent: 'center', alignItems: 'center' },
activeRedCircle: { backgroundColor: '#5A1A1A' },
declineCircle: { backgroundColor: '#FF3B30' },
btnLabel: { color: '#656469', fontSize: 11, marginTop: 8 },
modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 24 },
inviteContent: { width: '100%', maxHeight: '70%', backgroundColor: '#16151B', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#232229' },
modalTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
inviteScroll: { marginVertical: 8 },
inviteRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, backgroundColor: '#1C1A24', padding: 10, borderRadius: 12 },
inviteUserLeft: { flexDirection: 'row', alignItems: 'center' },
miniAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#232229', justifyContent: 'center', alignItems: 'center' },
miniAvatarText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
inviteUserName: { color: '#FFF', marginLeft: 10, fontSize: 14, fontWeight: '500' },
addBtn: { backgroundColor: '#8A56FF', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
addBtnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
noUsersText: { color: '#656469', textAlign: 'center', marginVertical: 20 },
closeModalBtn: { backgroundColor: '#232229', padding: 12, borderRadius: 12, marginTop: 10 },
closeModalBtnText: { color: '#A3A2A8', textAlign: 'center', fontWeight: '600' }
});

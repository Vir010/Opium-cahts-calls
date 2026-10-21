import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import MembersScreen from './src/screens/MembersScreen';
import LoungeScreen from './src/screens/LoungeScreen';
import ChatScreen from './src/screens/ChatScreen';
import ChannelsScreen from './src/screens/ChannelsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { CallParticipant, User } from './src/types';

const CURRENT_USER: User = { id: 'usr_1', name: 'Аня Крылова', username: 'anya_kr', avatarText: 'AK', role: 'owner', isOnline: true };
const ALL_USERS_DB: User[] = [
  { id: 'usr_1', name: 'Аня Крылова', username: 'anya_kr', avatarText: 'AK', role: 'owner', isOnline: true },
  { id: 'usr_2', name: 'Илья Волков', username: 'volkov_i', avatarText: 'ИВ', role: 'moderator', isOnline: true },
  { id: 'usr_3', name: 'Маша Соколова', username: 'mashasoko', avatarText: 'MC', role: 'member', isOnline: true },
  { id: 'usr_4', name: 'Денис Морозов', username: 'den_moroz', avatarText: 'ДМ', role: 'member', isOnline: true },
  { id: 'usr_5', name: 'Лев Антонов', username: 'lev_ant', avatarText: 'ЛА', role: 'member', isOnline: true },
  { id: 'usr_6', name: 'Ника Белова', username: 'nika_bel', avatarText: 'НБ', role: 'member', isOnline: false },
];

export default function App() {
  // Навигационный стейт между тремя главными вкладками: 'channels' | 'members' | 'profile'
  const [currentScreen, setCurrentScreen] = useState<'channels' | 'members' | 'profile'>('channels');

  const [isCallActive, setIsCallActive] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isCallConnected, setIsCallConnected] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [activeParticipants, setActiveParticipants] = useState<CallParticipant[]>([]);
  const [speedText, setSpeedText] = useState('64 Кбит/с · 24мс');
  
  const [isChatActive, setIsChatActive] = useState(false);
  const [activeChatRecipient, setActiveChatRecipient] = useState<User | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isCallActive) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const nextSec = prev + 1;
          const mockKbps = Math.floor(62 + Math.random() * 10);
          const mockPing = Math.floor(19 + Math.random() * 12);
          setSpeedText(`${mockKbps} Кбит/с · ${mockPing}мс`);
          return nextSec;
        });
      }, 1000);
    } else {
      setSeconds(0);
      setSpeedText('64 Кбит/с · 24мс');
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isCallActive]);

  useEffect(() => {
    if (isCallActive && seconds >= 3) {
      setIsCallConnected(true);
    }
  }, [seconds, isCallActive]);

  const handleStartCall = (targetUserId: string) => {
    const targetUser = ALL_USERS_DB.find(u => u.id === targetUserId);
    if (!targetUser) return;

    setActiveParticipants([
      { ...CURRENT_USER, isSpeaking: false, isMicOn: true, isDeafened: false, isScreenSharing: false },
      { ...targetUser, isSpeaking: true, isMicOn: true, isDeafened: false, isScreenSharing: false }
    ]);
    
    setSeconds(0);
    setIsCallActive(true);
    setIsMinimized(false);
    setIsCallConnected(false);
  };

  const handleDisconnect = () => {
    setIsCallActive(false);
    setIsMinimized(false);
    setIsCallConnected(false);
    setSeconds(0);
    setActiveParticipants([]);
  };

  const handleOpenChat = (targetUserId: string) => {
    const targetUser = ALL_USERS_DB.find(u => u.id === targetUserId);
    if (!targetUser) return;
    
    setActiveChatRecipient(targetUser);
    setIsChatActive(true);
  };

  const handleInviteUserToCall = (userId: string) => {
    const userToAdd = ALL_USERS_DB.find(u => u.id === userId);
    if (!userToAdd || activeParticipants.some(p => p.id === userId)) return;

    setActiveParticipants([
      ...activeParticipants,
      { ...userToAdd, isSpeaking: false, isMicOn: true, isDeafened: false, isScreenSharing: false }
    ]);
  };

  const getAvailableUsersToInvite = () => {
    return ALL_USERS_DB.filter(user => 
      user.id !== CURRENT_USER.id && 
      user.isOnline && 
      !activeParticipants.some(p => p.id === user.id)
    );
  };

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      {/* Контент текущего выбранного экрана */}
      <View style={styles.screenWrapper}>
        {currentScreen === 'channels' ? (
          <ChannelsScreen 
            onOpenCall={() => isCallActive ? setIsMinimized(false) : handleStartCall('usr_3')}
            onOpenProfile={() => setCurrentScreen('profile')}
          />
        ) : currentScreen === 'members' ? (
          <MembersScreen 
            currentUserId={CURRENT_USER.id}
            onStartCall={handleStartCall}
            onOpenChat={handleOpenChat}
          />
        ) : (
          <ProfileScreen 
            onBackToChannels={() => setCurrentScreen('channels')}
          />
        )}
      </View>

      {/* Единый сквозной нижний Таб-бар для переключения вкладок */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setCurrentScreen('channels')}>
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke={currentScreen === 'channels' ? '#8A56FF' : '#656469'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
        
        {/* Кнопка переключения на вашу вкладку ПОИСКА И СПИСКА УЧАСТНИКОВ */}
        <TouchableOpacity style={styles.tabItem} onPress={() => setCurrentScreen('members')}>
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke={currentScreen === 'members' ? '#8A56FF' : '#656469'} strokeWidth={2} />
          </Svg>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem}>
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#656469" strokeWidth={2} strokeLinecap="round" />
          </Svg>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => setCurrentScreen('profile')}>
          <View style={[styles.tabAvatar, currentScreen === 'profile' && styles.tabAvatarActive]}><Text style={styles.tabAvatarText}>AK</Text></View>
        </TouchableOpacity>
      </View>
      
      {/* Чат модалка */}
      <ChatScreen 
        visible={isChatActive}
        recipient={activeChatRecipient}
        currentUserId={CURRENT_USER.id}
        onClose={() => {
          setIsChatActive(false);
          setActiveChatRecipient(null);
        }}
      />

      {/* Окно активного вызова */}
      <LoungeScreen 
        visible={isCallActive && !isMinimized} 
        participants={activeParticipants}
        currentUserId={CURRENT_USER.id}
        isCallConnected={isCallConnected}
        formattedTime={formatTime()}
        netSpeed={speedText}
        availableUsersToInvite={getAvailableUsersToInvite()}
        onInviteUser={handleInviteUserToCall}
        onMinimize={() => setIsMinimized(true)}
        onDisconnect={handleDisconnect} 
      />

      {/* Плавающий мини-виджет свернутого звонка (доступен поверх всех трех вкладок) */}
      {isCallActive && isMinimized ? (
        <TouchableOpacity style={styles.miniWidget} onPress={() => setIsMinimized(false)}>
          <View style={styles.miniWidgetLeft}>
            <View style={styles.signalIconWrapper}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Rect x={2} y={16} width={3} height={5} rx={1} fill={isCallConnected ? '#00C853' : '#E6A23C'} />
                <Rect x={7} y={12} width={3} height={9} rx={1} fill={isCallConnected ? '#00C853' : '#E6A23C'} />
                <Rect x={12} y={8} width={3} height={13} rx={1} fill={isCallConnected ? '#00C853' : '#E6A23C'} />
                <Rect x={17} y={3} width={3} height={18} rx={1} fill={isCallConnected ? '#00C853' : 'rgba(255,255,255,0.2)'} />
              </Svg>
            </View>
            <View>
              <Text style={styles.widgetTitle}>
                {isCallConnected ? 'Opium созвон' : 'Ожидание ответа...'}
              </Text>
              <Text style={styles.widgetMeta}>
                {isCallConnected ? `${formatTime()} · ${speedText}` : 'Вызов отправлен'}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.widgetHangup} onPress={handleDisconnect}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M18 6L6 18M6 6l12 12" stroke="#FFF" strokeWidth={2.5} strokeLinecap="round" />
            </Svg>
          </TouchableOpacity>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0E13' },
  screenWrapper: { flex: 1, paddingBottom: 60 },
  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, backgroundColor: '#121118', borderTopWidth: 1, borderTopColor: '#1A1920', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', zIndex: 999 },
  tabItem: { padding: 12 },
  tabAvatar: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#656469', justifyContent: 'center', alignItems: 'center' },
  tabAvatarActive: { backgroundColor: '#8A56FF' },
  tabAvatarText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
miniWidget: { position: 'absolute', bottom: 76, left: 16, right: 16, backgroundColor: '#1C1A24', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#2F2A3F', elevation: 5, zIndex: 9999 },
miniWidgetLeft: { flexDirection: 'row', alignItems: 'center' },
signalIconWrapper: { marginRight: 10, justifyContent: 'center', alignItems: 'center' },
widgetTitle: { color: '#FFF', fontWeight: '600', fontSize: 14 },
widgetMeta: { color: '#656469', fontSize: 11, marginTop: 2 },
widgetHangup: { backgroundColor: '#FF3B30', padding: 10, borderRadius: 20 },
});

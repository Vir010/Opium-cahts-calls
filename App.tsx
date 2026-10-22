import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import MembersScreen from './src/screens/MembersScreen';
import LoungeScreen from './src/screens/LoungeScreen';
import ChatScreen from './src/screens/ChatScreen';
import ChannelsScreen from './src/screens/ChannelsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { CallParticipant, User } from './src/types';

interface ServerNode {
  id: string;
  name: string;
  shortName: string;
}

const CURRENT_USER: User = {
  id: 'usr_1',
  name: 'Аня Крылова',
  username: 'anya_kr',
  avatarText: 'AK',
  role: 'owner',
  isOnline: true,
};

const ALL_USERS_DB: User[] = [
  {
    id: 'usr_1',
    name: 'Аня Крылова',
    username: 'anya_kr',
    avatarText: 'AK',
    role: 'owner',
    isOnline: true,
  },
  {
    id: 'usr_2',
    name: 'Илья Волков',
    username: 'volkov_i',
    avatarText: 'ИВ',
    role: 'moderator',
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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    'channels' | 'members' | 'profile'
  >('channels');

  const [servers, setServers] = useState<ServerNode[]>([
    { id: 'srv_1', name: 'Мастерская', shortName: 'МС' },
    { id: 'srv_2', name: 'Клуб Дизайна', shortName: 'КД' },
    { id: 'srv_3', name: 'Программирование Топ', shortName: 'ПТ' },
  ]);
  const [activeServerId, setActiveServerId] = useState<string>('srv_1');

  const [isCreateServerVisible, setIsCreateServerVisible] = useState(false);
  const [newServerName, setNewServerName] = useState('');

  const [isCallActive, setIsCallActive] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isCallConnected, setIsCallConnected] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [activeParticipants, setActiveParticipants] = useState<
    CallParticipant[]
  >([]);
  const [speedText, setSpeedText] = useState('64 Кбит/с · 24мс');
  const [isChatActive, setIsChatActive] = useState(false);
  const [activeChatRecipient, setActiveChatRecipient] = useState<User | null>(
    null,
  );

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isCallActive) {
      interval = setInterval(() => {
        setSeconds(prev => {
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
    return () => {
      if (interval) clearInterval(interval);
    };
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
      {
        ...CURRENT_USER,
        isSpeaking: false,
        isMicOn: true,
        isDeafened: false,
        isScreenSharing: false,
      },
      {
        ...targetUser,
        isSpeaking: true,
        isMicOn: true,
        isDeafened: false,
        isScreenSharing: false,
      },
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
      {
        ...userToAdd,
        isSpeaking: false,
        isMicOn: true,
        isDeafened: false,
        isScreenSharing: false,
      },
    ]);
  };

  const handleCreateServer = () => {
    if (newServerName.trim() === '') {
      Alert.alert('Ошибка', 'Введите название сервера');
      return;
    }
    const words = newServerName.trim().split(' ');
    const shortName =
      words.length > 1
        ? (words[0][0] + words[1][0]).toUpperCase()
        : newServerName.trim().substring(0, 2).toUpperCase();

    const newServer: ServerNode = {
      id: `srv_${Date.now()}`,
      name: newServerName.trim(),
      shortName,
    };

    setServers([...servers, newServer]);
    setActiveServerId(newServer.id);
    setNewServerName('');
    setIsCreateServerVisible(false);
  };

  const handleUpdateServer = (id: string, newName: string) => {
    if (!newName.trim()) return;
    const words = newName.trim().split(' ');
    const shortName =
      words.length > 1
        ? (words[0][0] + words[1][0]).toUpperCase()
        : newName.trim().substring(0, 2).toUpperCase();

    setServers(prev =>
      prev.map(s => (s.id === id ? { ...s, name: newName, shortName } : s)),
    );
  };

  const handleDeleteServer = (id: string) => {
    if (servers.length <= 1) {
      Alert.alert('Ошибка', 'Нельзя удалить единственный сервер.');
      return;
    }
    const newServers = servers.filter(s => s.id !== id);
    setServers(newServers);
    if (activeServerId === id) {
      setActiveServerId(newServers[0].id);
    }
  };

  const getAvailableUsersToInvite = () => {
    return ALL_USERS_DB.filter(
      user =>
        user.id !== CURRENT_USER.id &&
        user.isOnline &&
        !activeParticipants.some(p => p.id === user.id),
    );
  };

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentActiveServer =
    servers.find(s => s.id === activeServerId) || servers[0];

  return (
    <View style={styles.container}>
      {currentScreen !== 'profile' && (
        <View style={styles.leftSidebarContainer}>
          <ScrollView contentContainerStyle={styles.sidebarScroll}>
            {servers.map(server => {
              const isActive = server.id === activeServerId;
              return (
                <TouchableOpacity
                  key={server.id}
                  style={
                    isActive
                      ? [styles.sidebarIcon, styles.sidebarIconActive]
                      : styles.sidebarIcon
                  }
                  onPress={() => {
                    setActiveServerId(server.id);
                    setCurrentScreen('channels');
                  }}
                >
                  {isActive && <View style={styles.activeIndicator} />}
                  <Text style={styles.sidebarText}>{server.shortName}</Text>
                </TouchableOpacity>
              );
            })}

            <View style={styles.sidebarDivider} />

            <TouchableOpacity
              style={styles.sidebarAddButton}
              onPress={() => setIsCreateServerVisible(true)}
            >
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 5v14M5 12h14"
                  stroke="#8A56FF"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              </Svg>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      <View
        style={
          currentScreen === 'profile'
            ? styles.screenWrapperFull
            : styles.screenWrapperWithSidebar
        }
      >
        {currentScreen === 'channels' ? (
          <ChannelsScreen
            activeServer={currentActiveServer}
            onOpenCall={() =>
              isCallActive ? setIsMinimized(false) : handleStartCall('usr_3')
            }
            onUpdateServer={handleUpdateServer}
            onDeleteServer={handleDeleteServer}
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

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setCurrentScreen('channels')}
        >
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke={currentScreen === 'channels' ? '#8A56FF' : '#656469'}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setCurrentScreen('members')}
        >
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path
              d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"
              stroke={currentScreen === 'members' ? '#8A56FF' : '#656469'}
              strokeWidth={2}
            />
          </Svg>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() =>
            Alert.alert('Уведомления', 'У вас нет новых системных уведомлений')
          }
        >
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path
              d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
              stroke="#656469"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </Svg>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setCurrentScreen('profile')}
        >
          <View
            style={[
              styles.tabAvatar,
              currentScreen === 'profile' && styles.tabAvatarActive,
            ]}
          >
            <Text style={styles.tabAvatarText}>AK</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Modal transparent visible={isCreateServerVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Создать сервер</Text>
            <Text style={styles.modalDesc}>
              Дайте вашему новому серверу имя. Вы всегда сможете изменить его
              позже.
            </Text>
            <Text style={styles.inputLabel}>ИМЯ СЕРВЕРА</Text>
            <TextInput
              style={styles.textInput}
              value={newServerName}
              onChangeText={setNewServerName}
              placeholder="Например: Мой сервер"
              placeholderTextColor="#656469"
            />
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleCreateServer}
            >
              <Text style={styles.submitBtnText}>Создать</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setIsCreateServerVisible(false)}
            >
              <Text style={styles.cancelBtnText}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ChatScreen
        visible={isChatActive}
        recipient={activeChatRecipient}
        currentUserId={CURRENT_USER.id}
        onClose={() => {
          setIsChatActive(false);
          setActiveChatRecipient(null);
        }}
      />
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

      {isCallActive && isMinimized ? (
        <TouchableOpacity
          style={styles.miniWidget}
          onPress={() => setIsMinimized(false)}
        >
          <View style={styles.miniWidgetLeft}>
            <View style={styles.signalIconWrapper}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Rect
                  x={2}
                  y={16}
                  width={3}
                  height={5}
                  rx={1}
                  fill={isCallConnected ? '#00C853' : '#E6A23C'}
                />
                <Rect
                  x={7}
                  y={12}
                  width={3}
                  height={9}
                  rx={1}
                  fill={isCallConnected ? '#00C853' : '#E6A23C'}
                />
                <Rect
                  x={12}
                  y={8}
                  width={3}
                  height={13}
                  rx={1}
                  fill={isCallConnected ? '#00C853' : '#E6A23C'}
                />
                <Rect
                  x={17}
                  y={3}
                  width={3}
                  height={18}
                  rx={1}
                  fill={isCallConnected ? '#00C853' : 'rgba(255,255,255,0.2)'}
                />
              </Svg>
            </View>
            <View>
              <Text style={styles.widgetTitle}>Голосовой канал</Text>
              <Text style={styles.widgetMeta}>
                {isCallConnected
                  ? `${formatTime()} · ${speedText}`
                  : 'Ожидание...'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.widgetHangup}
            onPress={handleDisconnect}
          >
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path
                d="M10.68 13.31a16 16 0 003.48 3.48M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.42 19.42 0 01-3.33-2.67m-2.67-3.34a19.79 19.79 0 01-3.07-8.63A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91M23 1L1 23"
                stroke="#FFF"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0E13', flexDirection: 'row' },
  leftSidebarContainer: {
    width: 60,
    backgroundColor: '#16151B',
    borderRightWidth: 1,
    borderRightColor: '#1A1920',
    zIndex: 10,
  },
  sidebarScroll: { alignItems: 'center', paddingTop: 16 },
  sidebarIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#232229',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  sidebarIconActive: { borderRadius: 14, backgroundColor: '#8A56FF' },
  activeIndicator: {
    position: 'absolute',
    left: -8,
    width: 4,
    height: 24,
    backgroundColor: '#FFF',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  sidebarDivider: {
    width: 32,
    height: 2,
    backgroundColor: '#232229',
    marginBottom: 12,
  },
  sidebarText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  sidebarAddButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#232229',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#8A56FF',
  },
  screenWrapperWithSidebar: { flex: 1, paddingBottom: 60 },
  screenWrapperFull: { flex: 1, paddingBottom: 60 },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#121118',
    borderTopWidth: 1,
    borderTopColor: '#1A1920',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 999,
  },
  tabItem: { padding: 12 },
  tabAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#656469',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabAvatarActive: { backgroundColor: '#8A56FF' },
  tabAvatarText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  miniWidget: {
    position: 'absolute',
    bottom: 76,
    left: 16,
    right: 16,
    backgroundColor: '#1C1A24',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#2F2A3F',
    elevation: 5,
    zIndex: 9999,
  },
  miniWidgetLeft: { flexDirection: 'row', alignItems: 'center' },
  signalIconWrapper: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  widgetTitle: { color: '#FFF', fontWeight: '600', fontSize: 14 },
  widgetMeta: { color: '#656469', fontSize: 11, marginTop: 2 },
  widgetHangup: { backgroundColor: '#FF3B30', padding: 10, borderRadius: 20 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#16151B',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#232229',
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDesc: {
    color: '#656469',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputLabel: {
    color: '#A3A2A8',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: '#1A1920',
    color: '#FFF',
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#232229',
  },
  submitBtn: {
    backgroundColor: '#8A56FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  cancelBtn: { padding: 12, alignItems: 'center' },
  cancelBtnText: { color: '#656469', fontSize: 15, fontWeight: '500' },
});

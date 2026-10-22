import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const COLORS = {
  bg: '#0F0E13',
  activeChannel: '#23212C',
  textMain: '#FFFFFF',
  textSub: '#656469',
  accent: '#8A56FF',
  green: '#00C853',
};

interface ServerNode {
  id: string;
  name: string;
  shortName: string;
}

interface ChannelsScreenProps {
  activeServer: ServerNode;
  onOpenCall: () => void;
  onUpdateServer: (id: string, newName: string) => void;
  onDeleteServer: (id: string) => void;
}

export default function ChannelsScreen({ activeServer, onOpenCall, onUpdateServer, onDeleteServer }: ChannelsScreenProps) {
  const [activeChannel, setActiveChannel] = useState('general');
  
  // Стейты для модальных окон
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [editName, setEditName] = useState(activeServer.name);

  const handleSaveSettings = () => {
    if (!editName.trim()) {
      Alert.alert('Ошибка', 'Название сервера не может быть пустым');
      return;
    }
    onUpdateServer(activeServer.id, editName.trim());
    setIsSettingsModalVisible(false);
  };

  const handleDelete = () => {
    Alert.alert(
      'Удалить сервер',
      'Вы уверены, что хотите удалить этот сервер? Это действие нельзя отменить.',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Удалить', style: 'destructive', onPress: () => {
            setIsSettingsModalVisible(false);
            onDeleteServer(activeServer.id);
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M15 19l-7-7 7-7" stroke="#A3A2A8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.backText}>Назад</Text>
          </TouchableOpacity>
          <Text style={styles.logoText}>OPIUM</Text>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <View style={styles.serverHeader}>
            <View style={styles.serverTitleRow}>
              <Text style={styles.serverName}>{activeServer.name}</Text>
              <TouchableOpacity style={styles.settingsButton} onPress={() => {
                setEditName(activeServer.name);
                setIsSettingsModalVisible(true);
              }}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke={COLORS.textSub} strokeWidth={2} />
                  <Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke={COLORS.textSub} strokeWidth={2} />
                </Svg>
              </TouchableOpacity>
            </View>
            <Text style={styles.serverMeta}>5 в сети · 8 участников</Text>
          </View>

          <TouchableOpacity style={styles.inviteButton} onPress={() => setIsInviteModalVisible(true)}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={styles.iconMarginRight}>
              <Path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M8.5 11a4 4 0 100-8 4 4 0 000 8zM19 8v6M22 11h-6" stroke="#8A56FF" strokeWidth={2} strokeLinecap="round" />
            </Svg>
            <Text style={styles.inviteText}>Пригласить на сервер</Text>
          </TouchableOpacity>

          <Text style={styles.categoryTitle}>Информация</Text>
          <TouchableOpacity style={styles.channelRow}>
            <Text style={styles.hashTag}>#</Text>
            <Text style={styles.channelText}>welcome</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.channelRow}>
            <Text style={styles.hashTag}>#</Text>
            <Text style={styles.channelTextBold}>announcements</Text>
            <View style={styles.badge}><Text style={styles.badgeText}>2</Text></View>
          </TouchableOpacity>

          <Text style={styles.categoryTitle}>Общение</Text>
          <TouchableOpacity 
            style={activeChannel === 'general' ? [styles.channelRow, styles.channelRowActive] : styles.channelRow}
            onPress={() => setActiveChannel('general')}
          >
            <Text style={activeChannel === 'general' ? styles.hashTagActive : styles.hashTag}>#</Text>
            <Text style={activeChannel === 'general' ? styles.channelTextActive : styles.channelText}>general</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.channelRow}>
            <Text style={styles.hashTag}>#</Text>
            <Text style={styles.channelText}>design</Text>
            <View style={styles.badge}><Text style={styles.badgeText}>8</Text></View>
          </TouchableOpacity>

          <Text style={styles.categoryTitle}>Голосовые</Text>
          <TouchableOpacity style={styles.channelRow} onPress={onOpenCall}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={styles.iconMarginRight}>
              <Path d="M11 5L6 9H2v6h4l5 4V5z" fill="#656469" />
              <Path d="M15.54 8.46a5 5 0 010 7.07" stroke="#656469" strokeWidth={2} strokeLinecap="round" />
            </Svg>
            <Text style={styles.channelText}>lounge</Text>
          </TouchableOpacity>
          
          <View style={styles.voiceUsersRow}>
            <View style={styles.miniAvatar}><Text style={styles.miniAvatarText}>АК</Text></View>
            <View style={styles.miniAvatar}><Text style={styles.miniAvatarText}>МС</Text></View>
            <View style={styles.miniAvatar}><Text style={styles.miniAvatarText}>ИВ</Text></View>
            <Text style={styles.plusMoreText}>+1</Text>
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.activeCallBar} onPress={onOpenCall}>
          <View style={styles.callBarLeft}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" style={styles.iconMarginRight}>
              <Path d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke={COLORS.green} strokeWidth={2} strokeLinecap="round" />
            </Svg>
            <View>
              <Text style={styles.callBarTitle}>Вы в голосовом канале</Text>
              <Text style={styles.callBarSubtitle}>lounge · 4 участника</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Модалка приглашения */}
      <Modal transparent visible={isInviteModalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Пригласить на сервер</Text>
            <Text style={styles.modalDesc}>Отправьте эту ссылку друзьям, чтобы они присоединились к вашему серверу.</Text>
            
            <View style={styles.inviteLinkBox}>
              <Text style={styles.inviteLinkText}>opium.gg/invite/{activeServer.id}</Text>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={() => {
              Alert.alert('Успех', 'Ссылка-приглашение скопирована в буфер обмена!');
              setIsInviteModalVisible(false);
            }}>
              <Text style={styles.submitBtnText}>Копировать ссылку</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsInviteModalVisible(false)}>
              <Text style={styles.cancelBtnText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Модалка настроек сервера */}
      <Modal transparent visible={isSettingsModalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Настройки сервера</Text>
            
            <Text style={styles.inputLabel}>НАЗВАНИЕ СЕРВЕРА</Text>
            <TextInput
              style={styles.textInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Название"
              placeholderTextColor="#656469"
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleSaveSettings}>
              <Text style={styles.submitBtnText}>Сохранить изменения</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dangerBtn} onPress={handleDelete}>
              <Text style={styles.dangerBtnText}>Удалить сервер</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsSettingsModalVisible(false)}>
              <Text style={styles.cancelBtnText}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { flex: 1, position: 'relative' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { color: '#A3A2A8', fontSize: 16, marginLeft: 4 },
  logoText: { color: COLORS.accent, fontWeight: 'bold', letterSpacing: 1 },
  scroll: { flex: 1, paddingHorizontal: 16 },
  scrollContent: { paddingBottom: 80 },
  
  serverHeader: { marginTop: 12, marginBottom: 14 },
  serverTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  serverName: { color: COLORS.textMain, fontSize: 24, fontWeight: 'bold', flex: 1 },
  settingsButton: { padding: 4 },
  serverMeta: { color: COLORS.textSub, fontSize: 13, marginTop: 4 },
  
  inviteButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1F192E', borderRadius: 10, paddingVertical: 10, marginBottom: 20 },
  inviteText: { color: '#BD80FF', fontWeight: '600', fontSize: 14 },
  categoryTitle: { color: COLORS.textSub, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginTop: 18, marginBottom: 8, letterSpacing: 0.5 },
  channelRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderRadius: 8, marginBottom: 4, paddingHorizontal: 6 },
  channelRowActive: { backgroundColor: COLORS.activeChannel },
  hashTag: { color: '#4E4D53', fontSize: 18, fontWeight: 'bold', marginRight: 10, width: 12, textAlign: 'center' },
  hashTagActive: { color: COLORS.accent, fontSize: 18, fontWeight: 'bold', marginRight: 10, width: 12, textAlign: 'center' },
  channelText: { color: '#A3A2A8', fontSize: 16 },
  channelTextBold: { color: COLORS.textMain, fontSize: 16, fontWeight: '600' },
  channelTextActive: { color: COLORS.textMain, fontSize: 16, fontWeight: '600' },
  badge: { backgroundColor: COLORS.accent, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 'auto' },
  badgeText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  voiceUsersRow: { flexDirection: 'row', alignItems: 'center', marginLeft: 28, marginTop: 4, marginBottom: 12 },
  miniAvatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#232229', justifyContent: 'center', alignItems: 'center', marginRight: -6, borderWidth: 1.5, borderColor: COLORS.bg },
  miniAvatarText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },
  plusMoreText: { color: COLORS.textSub, fontSize: 12, marginLeft: 12, fontWeight: '600' },
  activeCallBar: { position: 'absolute', bottom: 12, left: 12, right: 12, backgroundColor: '#13211A', borderWidth: 1, borderColor: '#1B3527', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 },
  callBarLeft: { flexDirection: 'row', alignItems: 'center' },
  callBarTitle: { color: COLORS.green, fontWeight: '600', fontSize: 13 },
  callBarSubtitle: { color: '#A3A8A5', fontSize: 11, marginTop: 2 },
  iconMarginRight: { marginRight: 8 },

  // Стили для модальных окон
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { width: '100%', backgroundColor: '#16151B', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#232229' },
  modalTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  modalDesc: { color: '#656469', fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  inviteLinkBox: { backgroundColor: '#1A1920', padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: '#232229' },
  inviteLinkText: { color: '#BD80FF', fontSize: 16, textAlign: 'center', fontWeight: '600' },
  inputLabel: { color: '#A3A2A8', fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 },
  textInput: { backgroundColor: '#1A1920', color: '#FFF', padding: 14, borderRadius: 12, fontSize: 16, marginBottom: 24, borderWidth: 1, borderColor: '#232229' },
  submitBtn: { backgroundColor: '#8A56FF', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  submitBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  dangerBtn: { backgroundColor: '#FF3B30', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  dangerBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  cancelBtn: { padding: 12, alignItems: 'center' },
  cancelBtnText: { color: '#656469', fontSize: 15, fontWeight: '500' },
});

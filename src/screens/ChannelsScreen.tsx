import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

const COLORS = {
  bg: '#0F0E13',
  sidebar: '#16151B',
  activeChannel: '#23212C',
  textMain: '#FFFFFF',
  textSub: '#656469',
  accent: '#8A56FF',
  green: '#00C853',
};

interface ChannelsScreenProps {
  onOpenCall: () => void;
}

export default function ChannelsScreen({ onOpenCall }: ChannelsScreenProps) {
  const [activeChannel, setActiveChannel] = useState('general');
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [inviteLink, setInviteLink] = useState('opium.gg/masterskaya-777');

  // Функция имитации копирования ссылки
  const handleCopyInvite = () => {
    // В будущем здесь будет: Clipboard.setString(inviteLink);
    Alert.alert("Успешно", "Ссылка-приглашение скопирована в буфер обмена!");
    setIsInviteModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainLayout}>
        {/* Левая панель серверов */}
        <View style={styles.sidebar}>
          <TouchableOpacity style={styles.sidebarIconActive}>
            <View style={styles.activeIndicator} />
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path d="M4 6h16M4 12h16M4 18h16" stroke="#FFF" strokeWidth={2.5} strokeLinecap="round" />
            </Svg>
          </TouchableOpacity>
          <View style={styles.sidebarDivider} />
          <TouchableOpacity style={styles.sidebarIconText} onPress={() => Alert.alert("Opium", "Переключение на сервер КД")}><Text style={styles.sidebarText}>КД</Text></TouchableOpacity>
          <TouchableOpacity style={styles.sidebarIconText} onPress={() => Alert.alert("Opium", "Переключение на сервер ПТ")}><Text style={styles.sidebarText}>ПТ</Text></TouchableOpacity>
          <TouchableOpacity style={styles.sidebarAddButton} onPress={() => Alert.alert("Создание", "Интеграция создания нового сервера")}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M12 5v14M5 12h14" stroke="#8A56FF" strokeWidth={2.5} strokeLinecap="round" />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Список каналов */}
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => Alert.alert("Opium", "Возврат назад")}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path d="M15 19l-7-7 7-7" stroke="#A3A2A8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={styles.backText}>Назад</Text>
            </TouchableOpacity>
            <Text style={styles.logoText}>OPIUM</Text>
          </View>

          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
            <View style={styles.serverHeader}>
              <Text style={styles.serverName}>Мастерская</Text>
              <Text style={styles.serverMeta}>5 в сети · 8 участников</Text>
            </View>

            {/* Кнопка приглашения теперь открывает рабочее модальное окно */}
            <TouchableOpacity style={styles.inviteButton} onPress={() => setIsInviteModalVisible(true)}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}>
                <Path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M8.5 11a4 4 0 100-8 4 4 0 000 8zM19 8v6M22 11h-6" stroke="#8A56FF" strokeWidth={2} strokeLinecap="round" />
              </Svg>
              <Text style={styles.inviteText}>Пригласить на сервер</Text>
            </TouchableOpacity>

            <Text style={styles.categoryTitle}>Информация</Text>
            <TouchableOpacity style={styles.channelRow} onPress={() => setActiveChannel('welcome')}>
              <Text style={activeChannel === 'welcome' ? styles.hashTagActive : styles.hashTag}>#</Text>
              <Text style={activeChannel === 'welcome' ? styles.channelTextActive : styles.channelText}>welcome</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.channelRow} onPress={() => setActiveChannel('announcements')}>
              <Text style={activeChannel === 'announcements' ? styles.hashTagActive : styles.hashTag}>#</Text>
              <Text style={activeChannel === 'announcements' ? styles.channelTextActive : styles.channelTextBold}>announcements</Text>
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
            <TouchableOpacity style={styles.channelRow} onPress={() => setActiveChannel('design')}>
              <Text style={activeChannel === 'design' ? styles.hashTagActive : styles.hashTag}>#</Text>
              <Text style={activeChannel === 'design' ? styles.channelTextActive : styles.channelText}>design</Text>
              <View style={styles.badge}><Text style={styles.badgeText}>8</Text></View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.channelRow} onPress={() => setActiveChannel('resources')}>
              <Text style={activeChannel === 'resources' ? styles.hashTagActive : styles.hashTag}>#</Text>
              <Text style={activeChannel === 'resources' ? styles.channelTextActive : styles.channelText}>resources</Text>
            </TouchableOpacity>

            <Text style={styles.categoryTitle}>Голосовые</Text>
            <TouchableOpacity style={styles.channelRow} onPress={onOpenCall}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}>
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

          {/* Плашка активного вызова */}
          <TouchableOpacity style={styles.activeCallBar} onPress={onOpenCall}>
            <View style={styles.callBarLeft}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}>
                <Path d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke={COLORS.green} strokeWidth={2} strokeLinecap="round" />
              </Svg>
              <View>
                <Text style={styles.callBarTitle}>Вы в голосовом канале</Text>
                <Text style={styles.callBarSubtitle}>Мастерская / lounge · 4 участника</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Модальное окно генерации ссылки приглашения */}
      <Modal transparent visible={isInviteModalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Пригласить друзей</Text>
            <Text style={styles.modalDesc}>Отправьте эту ссылку пользователям, чтобы открыть им доступ к «Мастерской».</Text>
            
            <View style={styles.linkContainer}>
              <Text style={styles.linkText}>{inviteLink}</Text>
            </View>

            <TouchableOpacity style={styles.copyBtn} onPress={handleCopyInvite}>
              <Text style={styles.copyBtnText}>Копировать ссылку</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsInviteModalVisible(false)}>
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
  mainLayout: { flex: 1, flexDirection: 'row' },
  sidebar: { width: 60, backgroundColor: COLORS.sidebar, alignItems: 'center', paddingTop: 16 },
  sidebarIconActive: { width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center', position: 'relative', marginBottom: 12 },
  activeIndicator: { position: 'absolute', left: -8, width: 4, height: 24, backgroundColor: '#FFF', borderTopRightRadius: 4, borderBottomRightRadius: 4 },
  sidebarDivider: { width: 32, height: 2, backgroundColor: '#232229', marginBottom: 12 },
  sidebarIconText: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#232229', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  sidebarText: { color: COLORS.textMain, fontWeight: 'bold', fontSize: 13 },
  sidebarAddButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#232229', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderStyle: 'dashed', borderColor: COLORS.accent },

content: { flex: 1, position: 'relative' },
header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
backButton: { flexDirection: 'row', alignItems: 'center' },
backText: { color: '#A3A2A8', fontSize: 16, marginLeft: 4 },
logoText: { color: COLORS.accent, fontWeight: 'bold', letterSpacing: 1 },
scroll: { flex: 1, paddingHorizontal: 16 },
scrollContent: { paddingBottom: 80 },
serverHeader: { marginTop: 12, marginBottom: 14 },
serverName: { color: COLORS.textMain, fontSize: 24, fontWeight: 'bold' },
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
modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
modalContent: { backgroundColor: '#16151B', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, borderWidth: 1, borderColor: '#232229' },
modalTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
modalDesc: { color: COLORS.textSub, fontSize: 14, textAlign: 'center', marginBottom: 20, paddingHorizontal: 10 },
linkContainer: { backgroundColor: '#1A1920', padding: 16, borderRadius: 12, marginBottom: 16, alignItems: 'center' },
linkText: { color: '#BD80FF', fontSize: 16, fontWeight: '600' },
copyBtn: { backgroundColor: '#8A56FF', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
copyBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
cancelBtn: { padding: 14, alignItems: 'center' },
cancelBtnText: { color: COLORS.textSub, fontSize: 15, fontWeight: '500' },
});

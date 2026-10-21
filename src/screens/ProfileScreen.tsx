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
  Image,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import {
  pickAvatarFromLibrary,
  UploadedAvatar,
} from '../services/avatarService';

const COLORS = {
  bg: '#0F0E13',
  card: '#16151B',
  textMain: '#FFFFFF',
  textSub: '#656469',
  accent: '#4F5DED',
  brand: '#8A56FF',
  green: '#00C853',
};

interface ProfileScreenProps {
  onBackToChannels: () => void;
}

export default function ProfileScreen({
  onBackToChannels,
}: ProfileScreenProps) {
  const [activeTab, setActiveTab] = useState('main');
  const [displayName, setDisplayName] = useState('Blake');
  const [customStatus, setCustomStatus] = useState('Не могу дождаться...');

  const [avatarSource, setAvatarSource] = useState<string | null>(null);

  const [tempName, setTempName] = useState('');
  const [tempStatus, setTempStatus] = useState('');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const openEditModal = () => {
    setTempName(displayName);
    setTempStatus(customStatus);
    setIsEditModalVisible(true);
  };

  const handleSelectAvatar = async () => {
    try {
      const result: UploadedAvatar | null = await pickAvatarFromLibrary();
      if (result && result.uri) {
        setAvatarSource(result.uri);
        console.log('[Profile] Локальный URI аватара успешно обновлен');
      }
    } catch (error) {
      console.error('[Profile] Ошибка выбора аватара:', error);
      Alert.alert('Ошибка', 'Не удалось получить доступ к галерее устройства.');
    }
  };

  const handleSaveChanges = () => {
    if (tempName.trim() === '') {
      Alert.alert('Ошибка', 'Имя не может быть пустым.');
      return;
    }
    setDisplayName(tempName.trim());
    setCustomStatus(tempStatus.trim());
    setIsEditModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBackToChannels}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
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
        <Text style={styles.headerTitle}>Профиль</Text>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => Alert.alert('Опции', 'Меню настроек')}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Circle cx={5} cy={12} r={2} fill="#A3A2A8" />
            <Circle cx={12} cy={12} r={2} fill="#A3A2A8" />
            <Circle cx={19} cy={12} r={2} fill="#A3A2A8" />
          </Svg>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.userRow}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleSelectAvatar}
          >
            {avatarSource ? (
              <Image source={{ uri: avatarSource }} style={styles.userPhoto} />
            ) : (
              <Svg width={80} height={80} viewBox="0 0 80 80">
                <Circle
                  cx={40}
                  cy={40}
                  r={38}
                  fill="#23212C"
                  stroke="#4E4666"
                  strokeWidth={2}
                />
                <Path
                  d="M25 55L55 25"
                  stroke="#8A56FF"
                  strokeWidth={3}
                  strokeLinecap="round"
                />
                <Circle
                  cx={40}
                  cy={40}
                  r={16}
                  stroke="#8A56FF"
                  strokeWidth={2}
                  fill="none"
                />
              </Svg>
            )}
            <View style={styles.editAvatarBadge}>
              <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 5v14M5 12h14"
                  stroke="#FFF"
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              </Svg>
            </View>
          </TouchableOpacity>

          <View style={styles.userMeta}>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>В сети</Text>
            </View>
            <View style={styles.customStatusRow}>
              <Svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="none"
                style={styles.statusIcon}
              >
                <Circle
                  cx={12}
                  cy={12}
                  r={10}
                  stroke="#656469"
                  strokeWidth={2}
                />
                <Path
                  d="M12 6v6l4 2"
                  stroke="#656469"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </Svg>
              <Text style={styles.customStatusText} numberOfLines={1}>
                {customStatus ? customStatus : 'Статус не установлен'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.profileNameContainer}>
          <Text style={styles.displayName}>{displayName}</Text>
          <View style={styles.usernameRow}>
            <Text style={styles.usernameText}>postmenbet</Text>
            <Svg
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              style={styles.verifiedIcon}
            >
              <Path
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="#A3A2A8"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={openEditModal}>
          <Svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            style={styles.editIcon}
          >
            <Path
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              stroke="#FFF"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={styles.editButtonText}>Редактировать профиль</Text>
        </TouchableOpacity>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={
              activeTab === 'main'
                ? [styles.tabToggle, styles.tabToggleActive]
                : styles.tabToggle
            }
            onPress={() => setActiveTab('main')}
          >
            <Text
              style={
                activeTab === 'main'
                  ? styles.tabToggleTextActive
                  : styles.tabToggleText
              }
            >
              Главное
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              activeTab === 'wishlist'
                ? [styles.tabToggle, styles.tabToggleActive]
                : styles.tabToggle
            }
            onPress={() => setActiveTab('wishlist')}
          >
            <Text
              style={
                activeTab === 'wishlist'
                  ? styles.tabToggleTextActive
                  : styles.tabToggleText
              }
            >
              Вишлист
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.balanceCard}>
          <View style={styles.balanceLeft}>
            <Svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              style={styles.balanceIcon}
            >
              <Path
                d="M6 3h12l4 6-10 12L2 9l4-6z"
                stroke="#8A56FF"
                strokeWidth={2}
                strokeLinejoin="round"
              />
              <Path
                d="M11 3v17M2 9h20M6 3l6 6 6-6"
                stroke="#8A56FF"
                strokeWidth={1.5}
              />
            </Svg>
            <Text style={styles.balanceLabel}>Баланс Orbit</Text>
          </View>
          <View style={styles.balanceRight}>
            <Text style={styles.balanceValue}>800</Text>
            <Text style={styles.balanceCurrency}>ORB</Text>
          </View>
        </View>

        <Text style={styles.metaLabel}>В числе участников с</Text>
        <View style={styles.calendarRow}>
          <Svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            style={styles.calendarIcon}
          >
            <Rect
              x={3}
              y={4}
              width={18}
              height={18}
              rx={2}
              stroke="#656469"
              strokeWidth={2}
            />
            <Path d="M16 2v4M8 2v4M3 10h18" stroke="#656469" strokeWidth={2} />
          </Svg>
          <Text style={styles.calendarText}>21 марта 2026 г.</Text>
        </View>

        <TouchableOpacity
          style={styles.folderRow}
          onPress={() => Alert.alert('Opium', 'Загрузка списка друзей...')}
        >
          <View style={styles.folderLeft}>
            <Svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              style={styles.folderIcon}
            >
              <Path
                d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M8 11a4 4 0 100-8 4 4 0 000 8z"
                stroke="#A3A2A8"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </Svg>
            <Text style={styles.folderTitle}>Друзья</Text>
          </View>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path
              d="M9 5l7 7-7 7"
              stroke="#656469"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>

        <View style={styles.noteFolder}>
          <View style={styles.folderLeft}>
            <Svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              style={styles.noteIcon}
            >
              <Path
                d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                stroke="#A3A2A8"
                strokeWidth={2}
              />
              <Path
                d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
                stroke="#A3A2A8"
                strokeWidth={1.5}
              />
            </Svg>
            <View>
              <Text style={styles.folderTitle}>Заметка</Text>
              <Text style={styles.folderSubtitle}>Видна только вам</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.addNotePlus}
            onPress={() => Alert.alert('Заметка', 'Создать заметку')}
          >
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 5v14M5 12h14"
                stroke="#A3A2A8"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.profileTabBar}>
        <TouchableOpacity
          style={styles.profileTabItem}
          onPress={() => Alert.alert('Задания', 'Квесты')}
        >
          <Svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            style={styles.tabBarIcon}
          >
            <Path
              d="M22 11.08V12a10 10 0 11-5.93-9.14"
              stroke="#656469"
              strokeWidth={2}
            />
            <Path
              d="M22 4L12 14.01l-3-3"
              stroke="#656469"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={styles.profileTabLabel}>Задания</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileTabItem}
          onPress={() => Alert.alert('Магазин', 'Маркет')}
        >
          <Svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            style={styles.tabBarIcon}
          >
            <Path
              d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z"
              stroke="#656469"
              strokeWidth={2}
            />
            <Path
              d="M3 6h18M16 10a4 4 0 01-8 0"
              stroke="#656469"
              strokeWidth={2}
            />
          </Svg>
          <Text style={styles.profileTabLabel}>Магазин</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileTabItem}
          onPress={() => Alert.alert('Premium', 'Opium Nitro')}
        >
          <Svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            style={styles.tabBarIcon}
          >
            <Circle cx={12} cy={12} r={10} stroke="#656469" strokeWidth={2} />
            <Path
              d="M12 8v8M8 12h8"
              stroke="#656469"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </Svg>
          <Text style={styles.profileTabLabel}>Premium</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileTabItem}
          onPress={() => Alert.alert('Настройки', 'Конфигурация')}
        >
          <Svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            style={styles.tabBarIcon}
          >
            <Path
              d="M12 15a3 3 0 100-6 3 3 0 000 6z"
              stroke="#656469"
              strokeWidth={2}
            />
            <Path
              d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
              stroke="#656469"
              strokeWidth={2}
            />
          </Svg>
          <Text style={styles.profileTabLabel}>Настройки</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalMainTitle}>Редактировать профиль</Text>
          </View>

          <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>ОТОБРАЖАЕМОЕ ИМЯ</Text>
            <TextInput
              style={styles.textInput}
              value={tempName}
              onChangeText={setTempName}
              placeholder="Введите имя"
              placeholderTextColor="#656469"
            />
          </View>

          <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>СТАТУС</Text>
            <TextInput
              style={styles.textInput}
              value={tempStatus}
              onChangeText={setTempStatus}
              placeholder="Введите статус"
              placeholderTextColor="#656469"
            />
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveChanges}>
            <Text style={styles.saveBtnText}>Сохранить</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setIsEditModalVisible(false)}
          >
            <Text style={styles.closeBtnText}>Отмена</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
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
  headerTitle: { color: COLORS.textMain, fontWeight: 'bold', fontSize: 18 },
  moreButton: { width: 80, alignItems: 'flex-end', paddingRight: 4 },
  scroll: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  scrollContent: { paddingBottom: 80 },
  userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatarContainer: { marginRight: 16, position: 'relative' },
  userPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#4E4666',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.brand,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.bg,
  },
  userMeta: { flex: 1 },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.green,
    marginRight: 6,
  },
  statusText: { color: COLORS.textSub, fontSize: 13, fontWeight: '500' },
  customStatusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  statusIcon: { marginRight: 6 },
  customStatusText: { color: '#A3A2A8', fontSize: 14, maxWidth: '90%' },
  profileNameContainer: { marginBottom: 16 },
  displayName: { color: COLORS.textMain, fontSize: 26, fontWeight: 'bold' },
  usernameRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  usernameText: { color: COLORS.textSub, fontSize: 14 },
  verifiedIcon: { marginLeft: 4 },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F5DED',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 20,
  },
  editIcon: { marginRight: 8 },
  editButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#1A1920',
    marginBottom: 20,
  },
  tabToggle: { paddingBottom: 10, marginRight: 24, position: 'relative' },
  tabToggleActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.brand,
    marginBottom: -2,
  },
  tabToggleText: { color: COLORS.textSub, fontSize: 16, fontWeight: '600' },
  tabToggleTextActive: {
    color: COLORS.textMain,
    fontSize: 16,
    fontWeight: 'bold',
  },
  balanceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  balanceLeft: { flexDirection: 'row', alignItems: 'center' },
  balanceIcon: { marginRight: 10 },
  balanceLabel: { color: COLORS.textMain, fontSize: 15, fontWeight: '600' },
  balanceRight: { flexDirection: 'row', alignItems: 'center' },
  balanceValue: {
    color: COLORS.textMain,
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: 6,
  },
  balanceCurrency: { color: COLORS.textSub, fontSize: 12, fontWeight: '700' },
  metaLabel: { color: COLORS.textSub, fontSize: 12, marginBottom: 8 },
  calendarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  calendarIcon: { marginRight: 8 },
  calendarText: { color: COLORS.textMain, fontSize: 15, fontWeight: '500' },
  folderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  folderLeft: { flexDirection: 'row', alignItems: 'center' },
  folderIcon: { marginRight: 12 },
  folderTitle: { color: COLORS.textMain, fontSize: 15, fontWeight: '600' },
  folderSubtitle: { color: COLORS.textSub, fontSize: 12, marginTop: 2 },
  noteFolder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  noteIcon: { marginRight: 12, marginTop: 2 },
  addNotePlus: { padding: 4 },
  profileTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: '#121118',
    borderTopWidth: 1,
    borderTopColor: '#1A1920',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  profileTabItem: { alignItems: 'center', justifyContent: 'center' },
  tabBarIcon: { marginBottom: 4 },
  profileTabLabel: { color: COLORS.textSub, fontSize: 10, marginTop: 2 },
  modalContainer: { flex: 1, backgroundColor: '#0F0E13', padding: 20 },
  modalHeader: { paddingVertical: 20, marginBottom: 10 },
  modalMainTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputBlock: { marginBottom: 20 },
  inputLabel: {
    color: '#656469',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: '#16151B',
    color: '#FFF',
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#232229',
  },
  saveBtn: {
    backgroundColor: '#8A56FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  closeBtn: { padding: 14, alignItems: 'center' },
  closeBtnText: { color: '#656469', fontSize: 15 },
});

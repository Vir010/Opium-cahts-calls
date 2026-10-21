import { useState } from 'react';
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
  SafeAreaView,
} from 'react-native';
import Svg, { Path, Circle, Polygon } from 'react-native-svg';
import { pickAvatarFromLibrary, UploadedAvatar } from '../services/avatarService';

const COLORS = {
  bg: '#0F0E13',
  card: '#16151B',
  inputBg: '#1A1920',
  textMain: '#FFFFFF',
  textSub: '#656469',
  accent: '#5865F2', 
  brand: '#8A56FF',
  green: '#00C853',
  border: '#232229',
};

interface ProfileScreenProps {
  onBackToChannels: () => void;
}

export default function ProfileScreen({ onBackToChannels }: ProfileScreenProps) {
  const [activeTab, setActiveTab] = useState('main');
  
  const [displayName, setDisplayName] = useState('Blake');
  const [customStatus, setCustomStatus] = useState('Не могу дождаться...');
  const [pronouns, setPronouns] = useState('');
  const [serverNickname, setServerNickname] = useState('Blake');
  const [avatarSource, setAvatarSource] = useState<string | null>(null);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editSubTab, setEditSubTab] = useState<'base' | 'server'>('base');
  
  const [tempName, setTempName] = useState('');
  const [tempStatus, setTempStatus] = useState('');
  const [tempPronouns, setTempPronouns] = useState('');
  const [tempServerNickname, setTempServerNickname] = useState('');

  const openEditModal = () => {
    setTempName(displayName);
    setTempStatus(customStatus);
    setTempPronouns(pronouns);
    setTempServerNickname(serverNickname);
    setIsEditModalVisible(true);
  };

  const handleSelectAvatar = async () => {
    try {
      const result: UploadedAvatar | null = await pickAvatarFromLibrary();
      if (result && result.uri) {
        setAvatarSource(result.uri);
      }
    } catch (error) {
      console.error('[Profile] Ошибка выбора аватара:', error);
      Alert.alert("Ошибка", "Не удалось получить доступ к галерее устройства.");
    }
  };

  const handleSaveChanges = () => {
    if (tempName.trim() === '') {
      Alert.alert("Ошибка", "Имя не может быть пустым.");
      return;
    }
    setDisplayName(tempName.trim());
    setCustomStatus(tempStatus.trim());
    setPronouns(tempPronouns.trim());
    setServerNickname(tempServerNickname.trim());
    setIsEditModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBackToChannels}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path d="M15 19l-7-7 7-7" stroke="#A3A2A8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text style={styles.backText}>Назад</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Профиль</Text>
        <TouchableOpacity style={styles.moreButton} onPress={() => Alert.alert("Опции", "Меню настроек")}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Circle cx={5} cy={12} r={2} fill="#A3A2A8" />
            <Circle cx={12} cy={12} r={2} fill="#A3A2A8" />
            <Circle cx={19} cy={12} r={2} fill="#A3A2A8" />
          </Svg>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.userRow}>
          <TouchableOpacity style={styles.avatarContainer} onPress={handleSelectAvatar}>
            {avatarSource ? (
              <Image source={{ uri: avatarSource }} style={styles.userPhoto} />
            ) : (
              <Svg width={80} height={80} viewBox="0 0 80 80">
                <Circle cx={40} cy={40} r={38} fill="#23212C" stroke="#4E4666" strokeWidth={2} />
                <Path d="M25 55L55 25" stroke="#8A56FF" strokeWidth={3} strokeLinecap="round" />
                <Circle cx={40} cy={40} r={16} stroke="#8A56FF" strokeWidth={2} fill="none" />
              </Svg>
            )}
            <View style={styles.editAvatarBadge}>
              <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
                <Path d="M12 5v14M5 12h14" stroke="#FFF" strokeWidth={3} strokeLinecap="round" />
              </Svg>
            </View>
          </TouchableOpacity>
          
          <View style={styles.userMeta}>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>В сети</Text>
            </View>
            <View style={styles.customStatusRow}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" style={styles.statusIcon}>
                <Circle cx={12} cy={12} r={10} stroke="#656469" strokeWidth={2} />
                <Path d="M12 6v6l4 2" stroke="#656469" strokeWidth={2} strokeLinecap="round" />
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
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" style={styles.verifiedIcon}>
              <Path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#A3A2A8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={openEditModal}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={styles.editIcon}>
            <Path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke="#FFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text style={styles.editButtonText}>Редактировать профиль</Text>
        </TouchableOpacity>

        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={activeTab === 'main' ? [styles.tabToggle, styles.tabToggleActive] : styles.tabToggle} 
            onPress={() => setActiveTab('main')}
          >
            <Text style={activeTab === 'main' ? styles.tabToggleTextActive : styles.tabToggleText}>Главное</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={activeTab === 'wishlist' ? [styles.tabToggle, styles.tabToggleActive] : styles.tabToggle} 
            onPress={() => setActiveTab('wishlist')}
          >
            <Text style={activeTab === 'wishlist' ? styles.tabToggleTextActive : styles.tabToggleText}>Вишлист</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.balanceCard}>
          <View style={styles.balanceLeft}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={styles.balanceIcon}>
              <Path d="M6 3h12l4 6-10 12L2 9l4-6z" stroke="#8A56FF" strokeWidth={2} strokeLinejoin="round" />
              <Path d="M11 3v17M2 9h20M6 3l6 6 6-6" stroke="#8A56FF" strokeWidth={1.5} />
            </Svg>
            <Text style={styles.balanceLabel}>Баланс Orbit</Text>
          </View>
          <View style={styles.balanceRight}>
            <Text style={styles.balanceValue}>800</Text>
            <Text style={styles.balanceCurrency}>ORB</Text>
          </View>
        </View>
      </ScrollView>

      <Modal visible={isEditModalVisible} animationType="slide" presentationStyle="fullScreen">
        <SafeAreaView style={styles.modalBg}>
          <View style={styles.modalTopHeader}>
            <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
              <Text style={styles.modalCancelText}>Назад</Text>
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Профиль</Text>
            <TouchableOpacity onPress={handleSaveChanges}>
              <Text style={styles.modalSaveText}>Сохранить</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.subTabsRow}>
            <TouchableOpacity 
              style={[styles.subTabButton, editSubTab === 'base' && styles.subTabActive]} 
              onPress={() => setEditSubTab('base')}
            >
              <Text style={editSubTab === 'base' ? styles.subTabTextActive : styles.subTabText}>Основной профиль</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.subTabButton, editSubTab === 'server' && styles.subTabActive]} 
              onPress={() => setEditSubTab('server')}
            >
              <Text style={editSubTab === 'server' ? styles.subTabTextActive : styles.subTabText}>Профиль сервера</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent}>
            
            {editSubTab === 'server' && (
              <TouchableOpacity style={styles.serverSelectorRow}>
                <View style={styles.serverSelectorLeft}>
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={styles.starIcon}>
                    <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#8A56FF" />
                  </Svg>
                  <Text style={styles.serverSelectorTitle}>Elysium</Text>
                </View>
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                  <Path d="M9 5l7 7-7 7" stroke="#656469" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </TouchableOpacity>
            )}

            <View style={styles.modalAvatarBlock}>
              <View style={styles.bigAvatarWrapper}>
                <TouchableOpacity style={styles.bigAvatarCircle} onPress={handleSelectAvatar}>
                  {avatarSource ? (
                    <Image source={{ uri: avatarSource }} style={styles.bigAvatarImg} />
                  ) : (
                    <Svg width={70} height={70} viewBox="0 0 70 70">
                      <Circle cx={35} cy={35} r={35} fill="#1F1E26" />
                      <Path d="M25 45L45 25" stroke="#8A56FF" strokeWidth={2} strokeLinecap="round" />
                    </Svg>
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.addStatusBadgeButton} onPress={openEditModal}>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" style={styles.plusSvgWrapper}>
                  <Path d="M12 5v14M5 12h14" stroke="#A3A2A8" strokeWidth={2.5} strokeLinecap="round" />
                </Svg>
                <Text style={styles.addStatusBadgeText}>Добавить статус</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalUserTitleBlock}>
              <Text style={styles.modalDisplayUser}>{displayName}</Text>
              <Text style={styles.modalDisplayTag}>@postmenbet</Text>
            </View>

            {editSubTab === 'base' ? (
              <View style={styles.inputsGroup}>
                <Text style={styles.fieldLabel}>ОТОБРАЖАЕМОЕ ИМЯ</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.modalInput}
                    value={tempName}
                    onChangeText={setTempName}
                    placeholder="Введите имя"
                    placeholderTextColor="#656469"
                  />
                  {tempName.length > 0 && (
                    <TouchableOpacity style={styles.clearInputIcon} onPress={() => setTempName('')}>
                      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                        <Path d="M18 6L6 18M6 6l12 12" stroke="#656469" strokeWidth={2} strokeLinecap="round" />
                      </Svg>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.labelWithBadgeContainer}>
                  <Text style={styles.fieldLabelInline}>ПРОИЗНОШЕНИЕ</Text>
                  <View style={styles.newBadge}><Text style={styles.newBadgeText}>NEW</Text></View>
                </View>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.modalInput}
                    value={tempPronouns}
                    onChangeText={setTempPronouns}
                    placeholder="Например: он/его"
                    placeholderTextColor="#656469"
                  />
                  {tempPronouns.length > 0 && (
                    <TouchableOpacity style={styles.clearInputIcon} onPress={() => setTempPronouns('')}>
                      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                        <Path d="M18 6L6 18M6 6l12 12" stroke="#656469" strokeWidth={2} strokeLinecap="round" />
                      </Svg>
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.formDisclaimer}>Это будет отображаться в вашем профиле.</Text>

                <Text style={styles.fieldLabel}>О СЕБЕ</Text>
                <TextInput
                  style={styles.modalInputMultiline}
                  value={tempStatus}
                  onChangeText={setTempStatus}
                  placeholder="Расскажите о себе"
                  placeholderTextColor="#656469"
                  multiline
                />
              </View>
            ) : (
              <View style={styles.inputsGroup}>
                <Text style={styles.fieldLabel}>НИКНЕЙМ НА СЕРВЕРЕ</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.modalInput}
                    value={tempServerNickname}
                    onChangeText={setTempServerNickname}
                    placeholder="Введите никнейм"
                    placeholderTextColor="#656469"
                  />
                  {tempServerNickname.length > 0 && (
                    <TouchableOpacity style={styles.clearInputIcon} onPress={() => setTempServerNickname('')}>
                      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                        <Path d="M18 6L6 18M6 6l12 12" stroke="#656469" strokeWidth={2} strokeLinecap="round" />
                      </Svg>
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.formDisclaimer}>Отображается только на сервере Elysium.</Text>
              </View>
            )}

            <View style={styles.premiumPromoCard}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" style={styles.premiumIcon}>
                <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#D4C6FF" />
              </Svg>
              <Text style={styles.promoText}>Получите доступ к эксклюзивным функциям, анимированным аватарам и многому другому с Orbit Premium.</Text>
              <TouchableOpacity style={styles.promoBtn}>
                <Text style={styles.promoBtnText}>Оформить подписку</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1A1920' },
  backButton: { flexDirection: 'row', alignItems: 'center', width: 80 },
  backText: { color: '#A3A2A8', fontSize: 16, marginLeft: 4 },
  headerTitle: { color: COLORS.textMain, fontWeight: 'bold', fontSize: 18 },
  moreButton: { width: 80, alignItems: 'flex-end', paddingRight: 4 },
  scroll: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  scrollContent: { paddingBottom: 80 },
  userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatarContainer: { marginRight: 16, position: 'relative' },
  userPhoto: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: '#4E4666' },
  editAvatarBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.brand, width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.bg },
  userMeta: { flex: 1 },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.green, marginRight: 6 },
  statusText: { color: COLORS.textSub, fontSize: 13, fontWeight: '500' },
  customStatusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  statusIcon: { marginRight: 6 },
  customStatusText: { color: '#A3A2A8', fontSize: 14, maxWidth: '90%' },
  profileNameContainer: { marginBottom: 16 },
  displayName: { color: COLORS.textMain, fontSize: 26, fontWeight: 'bold' },
  usernameRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  usernameText: { color: COLORS.textSub, fontSize: 14 },
  verifiedIcon: { marginLeft: 4 },
  editButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4F5DED', borderRadius: 12, paddingVertical: 12, marginBottom: 20 },
  editIcon: { marginRight: 8 },
  editButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  tabsContainer: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: '#1A1920', marginBottom: 20 },
  tabToggle: { paddingBottom: 10, marginRight: 24, position: 'relative' },
  tabToggleActive: { borderBottomWidth: 2, borderBottomColor: COLORS.brand, marginBottom: -2 },
  tabToggleText: { color: COLORS.textSub, fontSize: 16, fontWeight: '600' },
  tabToggleTextActive: { color: COLORS.textMain, fontSize: 16, fontWeight: 'bold' },
  balanceCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.card, padding: 16, borderRadius: 16, marginBottom: 20 },
  balanceLeft: { flexDirection: 'row', alignItems: 'center' },
  balanceIcon: { marginRight: 10 },
  balanceLabel: { color: COLORS.textMain, fontSize: 15, fontWeight: '600' },
  balanceRight: { flexDirection: 'row', alignItems: 'center' },
  balanceValue: { color: COLORS.textMain, fontSize: 22, fontWeight: 'bold', marginRight: 6 },
  balanceCurrency: { color: COLORS.textSub, fontSize: 12, fontWeight: '700' },

  modalBg: { flex: 1, backgroundColor: '#09080C' },
  modalTopHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#14131A' },
  modalCancelText: { color: '#A3A2A8', fontSize: 16 },
  modalHeaderTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  modalSaveText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  subTabsRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#1A1920', paddingHorizontal: 8 },
  subTabButton: { paddingVertical: 14, paddingHorizontal: 12, marginRight: 10 },
  subTabActive: { borderBottomWidth: 2, borderBottomColor: '#FFF' },
  subTabText: { color: '#656469', fontSize: 15, fontWeight: '600' },
  subTabTextActive: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  modalScroll: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  modalScrollContent: { paddingBottom: 40 },
  serverSelectorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#16151B', padding: 14, borderRadius: 12, marginBottom: 20 },
  serverSelectorLeft: { flexDirection: 'row', alignItems: 'center' },
  starIcon: { marginRight: 10 },
  serverSelectorTitle: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  modalAvatarBlock: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  bigAvatarWrapper: { marginRight: 16 },
  bigAvatarCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#1F1E26', borderWidth: 2, borderColor: '#322E3D', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  bigAvatarImg: { width: 70, height: 70 },
  addStatusBadgeButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1920', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: '#26252E' },
  plusSvgWrapper: { marginRight: 6 },
  addStatusBadgeText: { color: '#A3A2A8', fontSize: 13, fontWeight: '600' },
  modalUserTitleBlock: { marginBottom: 24, paddingLeft: 4 },
  modalDisplayUser: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  modalDisplayTag: { color: '#656469', fontSize: 14, marginTop: 2 },
  inputsGroup: { marginBottom: 20 },
  fieldLabel: { color: '#A3A2A8', fontSize: 12, fontWeight: '700', marginBottom: 8, paddingLeft: 4, letterSpacing: 0.5 },
  inputWrapper: { position: 'relative', justifyContent: 'center', marginBottom: 16 },
  modalInput: { backgroundColor: '#16151B', color: '#FFF', padding: 14, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#232229' },
  clearInputIcon: { position: 'absolute', right: 14 },
  newBadge: { backgroundColor: '#8A56FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 8 },
  newBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  formDisclaimer: { color: '#4E4D53', fontSize: 12, paddingLeft: 4, marginTop: -8, marginBottom: 16, lineHeight: 16 },
  premiumPromoCard: { backgroundColor: '#1A1726', borderWidth: 1, borderColor: '#2B2347', borderRadius: 16, padding: 20, marginTop: 10, alignItems: 'center' },
  premiumIcon: { marginBottom: 8 },
  promoText: { color: '#D4C6FF', fontSize: 13, textAlign: 'center', marginBottom: 16, lineHeight: 18, fontWeight: '500' },
  promoBtn: { backgroundColor: '#4F5DED', width: '100%', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  promoBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  
  labelWithBadgeContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, paddingLeft: 4 },
  fieldLabelInline: { color: '#A3A2A8', fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  modalInputMultiline: { backgroundColor: '#16151B', color: '#FFF', padding: 14, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#232229', height: 100, textAlignVertical: 'top' },
});

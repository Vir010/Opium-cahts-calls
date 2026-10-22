/**import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { generateUserToken, saveUserSession } from '../services/authService';

const COLORS = {
  bg: '#0F0E13',
  card: '#16151B',
  inputBg: '#1A1920',
  textMain: '#FFFFFF',
  textSub: '#656469',
  accent: '#8A56FF',
  border: '#232229',
};

interface AuthScreenProps {
  onAuthSuccess: (userId: string, username: string, token: string) => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isLoginMode, setIsLoginMode] = useState(true); // true = Вход, false = Регистрация
  
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim() || (!isLoginMode && !username.trim())) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Ошибка', 'Пароль должен быть не менее 6 символов');
      return;
    }

    // Имитация ответа от бэкенда при успешной регистрации/входе
    const mockUserId = `usr_${Math.random().toString(36).substring(2, 9)}`;
    const finalUsername = isLoginMode ? email.split('@')[0] : username.trim().toLowerCase();
    
    // Генерация уникального токена на каждого пользователя через наш сервис
    const token = generateUserToken(mockUserId, finalUsername);

    // Сохраняем в нативное постоянное хранилище
    await saveUserSession({ userId: mockUserId, token, username: finalUsername });

    Alert.alert('Успешно', isLoginMode ? 'Вы вошли в аккаунт' : 'Аккаунт успешно создан!');
    onAuthSuccess(mockUserId, finalUsername, token);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
        <View style={styles.content}>
          
          
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>OPIUM</Text>
            <Text style={styles.logoSubtitle}>A I  ·  C H A T S  ·  C A L L S</Text>
          </View>

          
          <View style={styles.authCard}>
            <Text style={styles.cardTitle}>{isLoginMode ? 'С возвращением!' : 'Создать аккаунт'}</Text>
            <Text style={styles.cardDesc}>
              {isLoginMode ? 'Рады видеть вас снова. Войдите в свой профиль.' : 'Присоединяйтесь к серверу Opium прямо сейчас.'}
            </Text>

            
            <Text style={styles.inputLabel}>EMAIL</Text>
            <View style={styles.inputBlock}>
              <TextInput 
                style={styles.textInput} 
                value={email} 
                onChangeText={setEmail} 
                placeholder="example@opium.gg"
                placeholderTextColor="#4E4D53"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

       
            {!isLoginMode && (
              <View>
                <Text style={styles.inputLabel}>ИМЯ ПОЛЬЗОВАТЕЛЯ (@USERNAME)</Text>
                <View style={styles.inputBlock}>
                  <TextInput 
                    style={styles.textInput} 
                    value={username} 
                    onChangeText={setUsername} 
                    placeholder="blake_opium"
                    placeholderTextColor="#4E4D53"
                    autoCapitalize="none"
                  />
                </View>
              </View>
            )}

          
            <Text style={styles.inputLabel}>ПАРОЛЬ</Text>
            <View style={styles.inputBlock}>
              <TextInput 
                style={styles.textInput} 
                value={password} 
                onChangeText={setPassword} 
                placeholder="••••••••"
                placeholderTextColor="#4E4D53"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

         
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>{isLoginMode ? 'Войти в аккаунт' : 'Зарегистрироваться'}</Text>
            </TouchableOpacity>

     }
            <TouchableOpacity style={styles.switchModeBtn} onPress={() => setIsLoginMode(!isLoginMode)}>
              <Text style={styles.switchModeText}>
                {isLoginMode ? 'Впервые в Opium? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  keyboardView: { flex: 1, justifyContent: 'center' },
  content: { paddingHorizontal: 20, alignItems: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  logoText: { color: COLORS.accent, fontSize: 36, fontWeight: '900', letterSpacing: 3 },
  logoSubtitle: { color: COLORS.textSub, fontSize: 10, marginTop: 4, letterSpacing: 2, fontWeight: '700' },
  authCard: { width: '100%', backgroundColor: COLORS.card, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: COLORS.border, elevation: 4 },
  cardTitle: { color: COLORS.textMain, fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 6 },
  cardDesc: { color: COLORS.textSub, fontSize: 13, textAlign: 'center', marginBottom: 24, lineHeight: 18, paddingHorizontal: 10 },
  inputLabel: { color: '#A3A2A8', fontSize: 11, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 },
  inputBlock: { marginBottom: 18 },
  textInput: { backgroundColor: COLORS.inputBg, color: '#FFF', padding: 14, borderRadius: 12, fontSize: 15, borderWidth: 1, borderColor: COLORS.border },
  submitBtn: { backgroundColor: COLORS.accent, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10, marginBottom: 16 },
  submitBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  switchModeBtn: { padding: 4, alignItems: 'center' },
  switchModeText: { color: COLORS.textSub, fontSize: 13, fontWeight: '500' },
});
**/
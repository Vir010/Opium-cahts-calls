/**
 * Утилиты для форматирования данных профиля пользователя Blake.
 */

/**
 * Форматирует числовой баланс Orbit Premium с разделением разрядов.
 * Превращает 10000 в "10 000"
 */
export const formatOrbitBalance = (balance: number): string => {
  return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

/**
 * Возвращает кастомный текстовый совет для промо-блока Orbit Premium
 */
export const getPromoMessage = (subTab: 'base' | 'server'): string => {
  return subTab === 'base'
    ? 'Посмотрите, как мог бы выглядеть ваш профиль с Orbit Premium. Анимированные аватары и кастомные значки доступны уже сейчас.'
    : 'Настраивайте уникальный стиль, кастомные баннеры и никнеймы для каждого сервера отдельно с подпиской Premium!';
};

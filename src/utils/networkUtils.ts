/**
 * Утилиты для работы с сетевыми параметрами в голосовых вызовах WebRTC.
 */

export interface NetworkStatus {
  label: string;
  color: string;
  isStable: boolean;
}

/**
 * Вычисляет текстовый статус и цвет соединения на основе текущего пинга.
 * Полезно для динамического переключения цвета SVG-иконок связи.
 */
export const getNetworkStatusByPing = (pingMs: number): NetworkStatus => {
  if (pingMs <= 0) {
    return { label: 'Соединение...', color: '#656469', isStable: false };
  }
  if (pingMs < 30) {
    return { label: 'Отличное', color: '#00C853', isStable: true };
  }
  if (pingMs < 70) {
    return { label: 'Хорошее', color: '#A3A2A8', isStable: true };
  }
  if (pingMs < 150) {
    return { label: 'Нестабильное', color: '#E6A23C', isStable: false };
  }
  return { label: 'Плохое соединение', color: '#FF3B30', isStable: false };
};

/**
 * Рассчитывает примерный расход аудио-трафика за время звонка
 */
export const calculateDataUsage = (seconds: number, kbps: number): string => {
  const totalBits = seconds * kbps * 1000;
  const totalMegabytes = totalBits / (8 * 1024 * 1024);
  return totalMegabytes < 1 
    ? `${Math.floor(totalMegabytes * 1024)} КБ` 
    : `${totalMegabytes.toFixed(2)} МБ`;
};

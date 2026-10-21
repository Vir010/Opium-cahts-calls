import { User } from '../types';

/**
 * Продвинутый поисковый движок для списка участников сервера.
 * Поддерживает поиск по имени, юзернейму и специальным префиксам.
 */
export const smartFilterMembers = (members: User[], query: string): User[] => {
  const cleanQuery = query.trim().toLowerCase();
  
  if (!cleanQuery) return members;

  if (cleanQuery === 'в сети' || cleanQuery === 'online') {
    return members.filter(m => m.isOnline);
  }

  if (cleanQuery.startsWith('роль:') || cleanQuery.startsWith('role:')) { 
    const targetRole = cleanQuery.split(':')[1];
    return targetRole ? members.filter(m => m.role.toLowerCase() === targetRole.trim()) : members;
  }

  return members.filter(member => 
    member.name.toLowerCase().includes(cleanQuery) || 
    member.username.toLowerCase().includes(cleanQuery)
  );
};

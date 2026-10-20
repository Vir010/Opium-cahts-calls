export interface User {
  id: string;
  name: string;
  username: string; // Тег формата @username
  avatarText: string;
  role: 'owner' | 'moderator' | 'member';
  roleColor?: string;
  isOnline: boolean;
}

export interface CallParticipant extends User {
  isSpeaking: boolean;
  isMicOn: boolean;
  isDeafened: boolean;
  isScreenSharing: boolean;
}

export interface CallSession {
  id: string;
  channelName: string;
  initiatorId: string;
  receiverIds: string[];
  status: 'dialing' | 'connected' | 'ended';
}

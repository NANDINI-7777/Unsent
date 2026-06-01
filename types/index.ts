export type ScreenName = 'landing' | 'vent' | 'waiting' | 'reply' | 'feed' | 'history';

export type Mood = {
  emoji: string;
  label: string;
  color: string;
};

export type ReplyStyle = 'heart-to-heart' | 'fr tho' | 'roast me' | 'idk';

export interface VentOptions {
  stayAnon: boolean;
  showOnFeed: boolean;
  justForMe: boolean;
  autoDelete: boolean;
}

export type GenderType = 'boy' | 'girl' | 'anon';

export interface Vent {
  id: string;
  content: string;
  mood: string;
  moodEmoji: string;
  moodColor: string;
  replyStyle: ReplyStyle;
  showOnFeed: boolean;
  autoDelete: boolean;
  deviceId: string;
  replyCount: number;
  gender: GenderType;
  createdAt: string;
  expiresAt?: string;
}

export interface Reply {
  id: string;
  ventId: string;
  content: string;
  deviceId?: string;
  createdAt: string;
}

export interface Reaction {
  id: string;
  replyId: string;
  reaction: string;
  ownComment?: string;
  deviceId: string;
  createdAt: string;
}

export const MOODS: Mood[] = [
  { emoji: '🥴', label: 'cooked', color: '#ffaac8' },
  { emoji: '💀', label: 'dead inside', color: '#c9788f' },
  { emoji: '🫠', label: 'melting', color: '#ff85ae' },
  { emoji: '🥀', label: 'not okay', color: '#d94478' },
  { emoji: '😶‍🌫️', label: 'dissociating', color: '#e8b4c4' },
  { emoji: '🤌', label: 'it is what it is', color: '#f56393' },
  { emoji: '🫁', label: "can't breathe", color: '#b07080' },
  { emoji: '🙃', label: 'totally fine', color: '#ffc9dd' },
];

export const REACTIONS = [
  { emoji: '🫂', label: 'felt that' },
  { emoji: '💀', label: 'deadass' },
  { emoji: '😮‍💨', label: 'needed this fr' },
  { emoji: '🫡', label: 'respect' },
  { emoji: '🤍', label: 'lowkey helped' },
  { emoji: '😭', label: 'crying rn' },
];

export const REPLY_STYLES: { value: ReplyStyle; emoji: string; label: string; description: string }[] = [
  { value: 'heart-to-heart', emoji: '💌', label: 'heart-to-heart', description: 'deep, warm support' },
  { value: 'fr tho', emoji: '💡', label: 'fr tho', description: 'honest, direct advice' },
  { value: 'roast me', emoji: '💀', label: 'roast me', description: 'lighten the mood' },
  { value: 'idk', emoji: '🤷', label: 'idk', description: 'surprise me, a mix' },
];

import { Category } from '../types/activity';

export const CATEGORY_COLORS: Record<Category, string> = {
  work: '#3B82F6',
  exercise: '#10B981',
  social: '#F59E0B',
  learning: '#8B5CF6',
  entertainment: '#EC4899',
  other: '#6B7280',
};

export const CATEGORY_EMOJIS: Record<Category, string> = {
  work: '💼',
  exercise: '💪',
  social: '👥',
  learning: '📚',
  entertainment: '🎮',
  other: '📝',
};

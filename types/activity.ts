export interface Activity {
  id: string;
  title: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  category: string;
}

export type Category = 'work' | 'exercise' | 'social' | 'learning' | 'entertainment' | 'other';

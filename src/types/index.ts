export type Stage = 'Exploring' | 'Building' | 'Testing' | 'Live' | 'Paused' | 'Archived';
export type Priority = 'Now' | 'Next' | 'Later';

export interface ActivityItem {
  id: string;
  type: 'stage' | 'priority' | 'action' | 'comment' | 'created' | 'touched';
  message: string;
  timestamp: string;
  author?: string;
}

export interface Project {
  id: string;
  name: string;
  nextAction: string;
  stage: Stage;
  priority: Priority;
  lastTouched: string; // ISO date
  createdAt: string;
  liveUrl?: string;
  repoUrl?: string;
  progress: number; // 0-100
  activity: ActivityItem[];
}

export type FilterStage = Stage | 'All';

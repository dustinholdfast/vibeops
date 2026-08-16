import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Project,
  Stage,
  Priority,
  Health,
  FilterStage,
  FilterHealth,
  FilterDeadline,
  ActivityItem,
} from '../types';
import { generateId, toLocalDateString } from '../lib/utils';

interface ProjectState {
  projects: Project[];
  filter: FilterStage;
  healthFilter: FilterHealth;
  deadlineFilter: FilterDeadline;
  selectedId: string | null;
  search: string;
  isDrawerOpen: boolean;

  setFilter: (f: FilterStage) => void;
  setHealthFilter: (f: FilterHealth) => void;
  setDeadlineFilter: (f: FilterDeadline) => void;
  setSearch: (s: string) => void;
  selectProject: (id: string | null) => void;
  openDrawer: (id: string) => void;
  closeDrawer: () => void;

  addProject: (data: {
    name: string;
    nextAction?: string;
    stage?: Stage;
    priority?: Priority;
    health?: Health;
    targetDate?: string | null;
  }) => void;
  /** Full optimistic update — merges only provided fields, never drops unrelated ones */
  updateProject: (id: string, updates: Partial<Project>) => void;
  setPriority: (id: string, priority: Priority) => void;
  setStage: (id: string, stage: Stage) => void;
  setNextAction: (id: string, nextAction: string) => void;
  setHealth: (id: string, health: Health) => void;
  setTargetDate: (id: string, targetDate: string | null) => void;
  touchProject: (id: string) => void;
  deleteProject: (id: string) => void;
  addActivity: (id: string, item: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
}

const initialProjects: Project[] = [
  {
    id: 'pf1',
    name: 'PromptForge',
    nextAction: 'Define the first slice',
    stage: 'Testing',
    priority: 'Later',
    health: 'At risk',
    targetDate: toLocalDateString(new Date(Date.now() - 2 * 86400000)), // overdue
    lastTouched: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    liveUrl: 'https://promptforge.local',
    repoUrl: 'https://github.com/example/promptforge',
    progress: 45,
    activity: [
      {
        id: 'a1',
        type: 'stage',
        message: 'Stage changed to Testing',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        author: 'You',
      },
      {
        id: 'a2',
        type: 'priority',
        message: 'Priority updated to Later',
        timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
        author: 'You',
      },
    ],
  },
  {
    id: 'tf1',
    name: 'TrendForge',
    nextAction: 'Define the first slice',
    stage: 'Exploring',
    priority: 'Later',
    health: 'On track',
    targetDate: toLocalDateString(new Date(Date.now() + 5 * 86400000)), // due soon
    lastTouched: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    progress: 20,
    activity: [
      {
        id: 'a3',
        type: 'created',
        message: 'Project created',
        timestamp: new Date(Date.now() - 8 * 86400000).toISOString(),
        author: 'You',
      },
    ],
  },
  {
    id: 'jt1',
    name: 'Jotline',
    nextAction: 'Define the first slice',
    stage: 'Exploring',
    priority: 'Later',
    health: 'Blocked',
    targetDate: null,
    lastTouched: new Date().toISOString(),
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    progress: 15,
    activity: [
      {
        id: 'a4',
        type: 'touched',
        message: 'Touched today',
        timestamp: new Date().toISOString(),
        author: 'You',
      },
    ],
  },
];

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: initialProjects,
      filter: 'All',
      healthFilter: 'All',
      deadlineFilter: 'All',
      selectedId: null,
      search: '',
      isDrawerOpen: false,

      setFilter: (filter) => set({ filter }),
      setHealthFilter: (healthFilter) => set({ healthFilter }),
      setDeadlineFilter: (deadlineFilter) => set({ deadlineFilter }),
      setSearch: (search) => set({ search }),
      selectProject: (id) => set({ selectedId: id }),
      openDrawer: (id) => set({ selectedId: id, isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false, selectedId: null }),

      addProject: ({
        name,
        nextAction = 'Define the first slice',
        stage = 'Exploring',
        priority = 'Later',
        health = 'On track',
        targetDate = null,
      }) => {
        const now = new Date().toISOString();
        const project: Project = {
          id: generateId(),
          name,
          nextAction,
          stage,
          priority,
          health,
          targetDate,
          lastTouched: now,
          createdAt: now,
          progress: 0,
          activity: [
            {
              id: generateId(),
              type: 'created',
              message: 'Project created',
              timestamp: now,
              author: 'You',
            },
          ],
        };
        set((s) => ({ projects: [project, ...s.projects] }));
      },

      updateProject: (id, updates) => {
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id
              ? { ...p, ...updates, lastTouched: new Date().toISOString() }
              : p
          ),
        }));
      },

      setPriority: (id, priority) => {
        const project = get().projects.find((p) => p.id === id);
        if (!project || project.priority === priority) return;
        get().addActivity(id, {
          type: 'priority',
          message: `Priority updated to ${priority}`,
          author: 'You',
        });
        get().updateProject(id, { priority });
      },

      setStage: (id, stage) => {
        const project = get().projects.find((p) => p.id === id);
        if (!project || project.stage === stage) return;
        get().addActivity(id, {
          type: 'stage',
          message: `Stage changed to ${stage}`,
          author: 'You',
        });
        get().updateProject(id, { stage });
      },

      setNextAction: (id, nextAction) => {
        get().addActivity(id, {
          type: 'action',
          message: `Next action updated: “${nextAction.slice(0, 40)}${nextAction.length > 40 ? '…' : ''}”`,
          author: 'You',
        });
        get().updateProject(id, { nextAction });
      },

      setHealth: (id, health) => {
        const project = get().projects.find((p) => p.id === id);
        if (!project || project.health === health) return;
        get().addActivity(id, {
          type: 'health',
          message: `Health set to ${health}`,
          author: 'You',
        });
        get().updateProject(id, { health });
      },

      setTargetDate: (id, targetDate) => {
        const project = get().projects.find((p) => p.id === id);
        if (!project) return;
        const prev = project.targetDate;
        if (prev === targetDate) return;
        get().addActivity(id, {
          type: 'target',
          message: targetDate
            ? `Target date set to ${targetDate}`
            : 'Target date cleared',
          author: 'You',
        });
        get().updateProject(id, { targetDate });
      },

      touchProject: (id) => {
        get().addActivity(id, {
          type: 'touched',
          message: 'Touched',
          author: 'You',
        });
        get().updateProject(id, {});
      },

      deleteProject: (id) => {
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          selectedId: s.selectedId === id ? null : s.selectedId,
          isDrawerOpen: s.selectedId === id ? false : s.isDrawerOpen,
        }));
      },

      addActivity: (id, item) => {
        const activityItem: ActivityItem = {
          ...item,
          id: generateId(),
          timestamp: new Date().toISOString(),
        };
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id
              ? { ...p, activity: [activityItem, ...p.activity].slice(0, 50) }
              : p
          ),
        }));
      },
    }),
    {
      name: 'vibeops-storage',
      partialize: (state) => ({ projects: state.projects }),
      // Migration helper for older localStorage data missing new fields
      merge: (persisted, current) => {
        const p = persisted as Partial<ProjectState> | undefined;
        if (!p?.projects) return current;
        const migrated = p.projects.map((proj) => ({
          health: 'On track' as Health,
          targetDate: null as string | null,
          ...proj,
        }));
        return { ...current, ...p, projects: migrated };
      },
    }
  )
);

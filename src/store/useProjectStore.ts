import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project, Stage, Priority, FilterStage, ActivityItem } from '../types';
import { generateId } from '../lib/utils';

interface ProjectState {
  projects: Project[];
  filter: FilterStage;
  selectedId: string | null;
  search: string;
  isDrawerOpen: boolean;

  // actions
  setFilter: (f: FilterStage) => void;
  setSearch: (s: string) => void;
  selectProject: (id: string | null) => void;
  openDrawer: (id: string) => void;
  closeDrawer: () => void;

  addProject: (data: { name: string; nextAction?: string; stage?: Stage; priority?: Priority }) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  setPriority: (id: string, priority: Priority) => void;
  setStage: (id: string, stage: Stage) => void;
  setNextAction: (id: string, nextAction: string) => void;
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
      selectedId: null,
      search: '',
      isDrawerOpen: false,

      setFilter: (filter) => set({ filter }),
      setSearch: (search) => set({ search }),
      selectProject: (id) => set({ selectedId: id }),
      openDrawer: (id) => set({ selectedId: id, isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false, selectedId: null }),

      addProject: ({ name, nextAction = 'Define the first slice', stage = 'Exploring', priority = 'Later' }) => {
        const now = new Date().toISOString();
        const project: Project = {
          id: generateId(),
          name,
          nextAction,
          stage,
          priority,
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
            p.id === id ? { ...p, ...updates, lastTouched: new Date().toISOString() } : p
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
    }
  )
);

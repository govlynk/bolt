import { create } from 'zustand';

export const useTimeStore = create((set) => ({
  entries: [],
  projects: [],
  tags: [],
  activeEntry: null,
  addEntry: (entry) =>
    set((state) => ({
      entries: [...state.entries],
      activeEntry: entry,
    })),
  stopTimer: (id) =>
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === id
          ? { ...entry, endTime: new Date(), duration: Date.now() - entry.startTime.getTime() }
          : entry
      ),
      activeEntry: null,
    })),
  addProject: (project) =>
    set((state) => ({
      projects: [...state.projects, project],
    })),
  addTag: (tag) =>
    set((state) => ({
      tags: [...state.tags, tag],
    })),
}));
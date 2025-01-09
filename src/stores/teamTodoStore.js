import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTeamTodoStore = create(
	persist(
		(set, get) => ({
			selectedTeamId: "all",
			setSelectedTeamId: (teamId) => set({ selectedTeamId: teamId }),
			getSelectedTeamId: () => get().selectedTeamId,
		}),
		{
			name: "team-todo-storage",
		}
	)
);

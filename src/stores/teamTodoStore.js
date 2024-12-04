import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTeamTodoStore = create(
	persist(
		(set) => ({
			selectedTeamId: "all",
			setSelectedTeamId: (teamId) => set({ selectedTeamId: teamId }),
		}),
		{
			name: "team-todo-storage",
		}
	)
);

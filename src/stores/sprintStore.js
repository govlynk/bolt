import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient();

export const useSprintStore = create((set, get) => ({
	sprints: [],
	activeSprint: null,
	loading: false,
	error: null,

	fetchSprints: async (teamId) => {
		set({ loading: true });
		try {
			const response = await client.models.Sprint.list({
				filter: { teamId: { eq: teamId } },
			});

			set({
				sprints: response.data || [],
				loading: false,
				error: null,
			});
		} catch (err) {
			console.error("Error fetching sprints:", err);
			set({
				error: err.message,
				loading: false,
			});
		}
	},

	createSprint: async (sprintData) => {
		set({ loading: true });
		try {
			const response = await client.models.Sprint.create(sprintData);

			set((state) => ({
				sprints: [...state.sprints, response.data],
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("Error creating sprint:", err);
			set({
				error: err.message,
				loading: false,
			});
			throw err;
		}
	},

	updateSprint: async (id, updates) => {
		set({ loading: true });
		try {
			const response = await client.models.Sprint.update({
				id,
				...updates,
			});

			set((state) => ({
				sprints: state.sprints.map((sprint) => (sprint.id === id ? response.data : sprint)),
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("Error updating sprint:", err);
			set({
				error: err.message,
				loading: false,
			});
			throw err;
		}
	},

	setActiveSprint: (sprintId) => {
		const sprint = get().sprints.find((s) => s.id === sprintId);
		set({ activeSprint: sprint });
	},

	addTaskToSprint: async (sprintId, taskId) => {
		set({ loading: true });
		try {
			const response = await client.models.Todo.update({
				id: taskId,
				sprintId,
			});

			set({ loading: false, error: null });
			return response.data;
		} catch (err) {
			console.error("Error adding task to sprint:", err);
			set({
				error: err.message,
				loading: false,
			});
			throw err;
		}
	},

	moveTaskBetweenSprints: async (taskId, fromSprintId, toSprintId) => {
		set({ loading: true });
		try {
			const response = await client.models.Todo.update({
				id: taskId,
				sprintId: toSprintId,
			});

			set({ loading: false, error: null });
			return response.data;
		} catch (err) {
			console.error("Error moving task between sprints:", err);
			set({
				error: err.message,
				loading: false,
			});
			throw err;
		}
	},

	completeSprint: async (sprintId) => {
		set({ loading: true });
		try {
			// Update sprint status
			await client.models.Sprint.update({
				id: sprintId,
				status: "COMPLETED",
			});

			// Move incomplete tasks to backlog
			const tasks = await client.models.Todo.list({
				filter: {
					and: [{ sprintId: { eq: sprintId } }, { status: { ne: "DONE" } }],
				},
			});

			await Promise.all(
				tasks.data.map((task) =>
					client.models.Todo.update({
						id: task.id,
						sprintId: null,
						status: "TODO",
					})
				)
			);

			set((state) => ({
				sprints: state.sprints.map((sprint) =>
					sprint.id === sprintId ? { ...sprint, status: "COMPLETED" } : sprint
				),
				loading: false,
				error: null,
			}));
		} catch (err) {
			console.error("Error completing sprint:", err);
			set({
				error: err.message,
				loading: false,
			});
			throw err;
		}
	},

	cleanup: () => {
		set({
			sprints: [],
			activeSprint: null,
			loading: false,
			error: null,
		});
	},
}));

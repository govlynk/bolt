import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { useGlobalStore } from "./globalStore";

const client = generateClient();

export const useSprintStore = create((set, get) => ({
	sprints: [],
	activeSprint: null,
	loading: false,
	error: null,

	fetchSprints: async (teamId) => {
		if (!teamId) {
			console.warn("No team ID provided to fetchSprints");
			return;
		}

		set({ loading: true });
		try {
			console.log("Fetching sprints for team:", teamId);
			const response = await client.models.Sprint.list({
				filter: { teamId: { eq: teamId } },
			});

			console.log("Fetched sprints:", response.data);
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
			const { activeTeamId } = useGlobalStore.getState();
			if (!activeTeamId) {
				throw new Error("No active team selected");
			}

			// Ensure dates are in ISO string format
			const formattedData = {
				...sprintData,
				startDate: new Date(sprintData.startDate).toISOString(),
				endDate: new Date(sprintData.endDate).toISOString(),
				teamId: activeTeamId,
			};

			const response = await client.models.Sprint.create(formattedData);

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
			// Ensure dates are in ISO string format
			const formattedUpdates = {
				...updates,
				startDate: new Date(updates.startDate).toISOString(),
				endDate: new Date(updates.endDate).toISOString(),
			};

			// Only include fields that are actually defined in the schema
			const validFields = ["name", "goal", "startDate", "endDate", "status", "position", "teamId"];

			const filteredUpdates = Object.keys(formattedUpdates)
				.filter((key) => validFields.includes(key))
				.reduce((obj, key) => {
					obj[key] = formattedUpdates[key];
					return obj;
				}, {});

			const response = await client.models.Sprint.update({
				id,
				...filteredUpdates,
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

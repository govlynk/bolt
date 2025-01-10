// src/components/KanbanBoard/types.js
export const BOARD_TYPES = {
	TODO: "todo",
	PROJECT: "project",
	PIPELINE: "opportunities",
	SPRINT: "sprint",
};

export const DEFAULT_BOARDS = {
	[BOARD_TYPES.TODO]: {
		columns: {
			todo: {
				id: "todo",
				title: "To Do",
				tasks: [],
			},
			inProgress: {
				id: "inProgress",
				title: "In Progress",
				tasks: [],
			},
			done: {
				id: "done",
				title: "Done",
				tasks: [],
			},
		},
	},
	[BOARD_TYPES.PROJECT]: {
		columns: {
			backlog: {
				id: "backlog",
				title: "Backlog",
				items: [],
			},
			inProgress: {
				id: "inProgress",
				title: "In Progress",
				items: [],
			},
			review: {
				id: "review",
				title: "Review",
				items: [],
			},
			done: {
				id: "done",
				title: "Done",
				items: [],
			},
		},
	},

	[BOARD_TYPES.PIPELINE]: {
		columns: {
			backlog: {
				id: "backlog",
				title: "Backlog",
				limit: 4,
				color: "#D671AE",
				items: [],
			},
			inProgress: {
				id: "response",
				title: "Preparing Response",
				limit: 4,
				color: "#D6713E",
				items: [],
			},
			review: {
				id: "review",
				title: "Review",
				limit: 4,
				color: "#ffbd0a",
				items: [],
			},
			submitted: {
				id: "submitted",
				title: "Submitted",
				limit: 4,
				color: "#8FABFB",
				items: [],
			},
			done: {
				id: "done",
				title: "Done",
				limit: 4,
				color: "#6ddba6",
				items: [],
			},
		},
	},
	[BOARD_TYPES.SPRINT]: {
		columns: {
			TODO: {
				id: "TODO",
				title: "To Do",
				items: [],
			},
			DOING: {
				id: "DOING",
				title: "In Progress",
				items: [],
			},
			DONE: {
				id: "DONE",
				title: "Done",
				items: [],
			},
		},
	},
};

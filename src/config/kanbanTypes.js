// src/components/KanbanBoard/types.js
export const BOARD_TYPES = {
	TODO: "todo",
	PROJECT: "project",
	PIPELINE: "opportunities",
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
				id: "prebid",
				title: "Pre-Bid",
				limit: 4,
				color: "#D671AE",
				items: [],
			},
			inProgress: {
				id: "response",
				title: "Preparing Response",
				limit: 4,
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
};

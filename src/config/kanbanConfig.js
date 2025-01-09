// src/config/kanbanConfig.js
export const BOARD_TYPES = {
	TODO: "todo",
	PROJECT: "project",
	PIPELINE: "pipeline",
};

export const BOARD_CONFIGS = {
	[BOARD_TYPES.TODO]: {
		columns: {
			todo: {
				id: "todo",
				title: "To Do",
				limit: 50,
				color: "#D671AE",
			},
			inProgress: {
				id: "inProgress",
				title: "In Progress",
				limit: 10,
				color: "#6ddba6",
			},
			done: {
				id: "done",
				title: "Done",
				limit: null,
				color: "#8FABFB",
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
			},
			inProgress: {
				id: "response",
				title: "Preparing Response",
				limit: 4,
				color: "#6ddba6",
			},
			review: {
				id: "review",
				title: "Review",
				limit: 4,
				color: "#ffbd0a",
			},
			submitted: {
				id: "submitted",
				title: "Submitted",
				limit: 4,
				color: "#8FABFB",
			},
			done: {
				id: "done",
				title: "Done",
				limit: 4,
				color: "#6ddba6",
			},
		},
	},
};

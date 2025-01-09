import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { useGlobalStore } from "./globalStore";

const client = generateClient({
	authMode: "userPool",
});

const BOARD_CONFIG = {
	columns: {
		BACKLOG: {
			id: "BACKLOG",
			title: "Backlog",
			limit: 50,
		},
		BID: {
			id: "BID",
			title: "Preparing Bid",
			limit: 10,
		},
		REVIEW: {
			id: "REVIEW",
			title: "In Review",
			limit: 5,
		},
		SUBMITTED: {
			id: "SUBMITTED",
			title: "Submitted",
			limit: null,
		},
		WON: {
			id: "WON",
			title: "Won",
			limit: null,
		},
		LOST: {
			id: "LOST",
			title: "Lost",
			limit: null,
		},
	},
};

export const useOpportunityStore = create((set, get) => ({
	opportunities: [],
	loading: false,
	error: null,
	boardConfig: BOARD_CONFIG,
	subscription: null,

	fetchOpportunities: async () => {
		const { activeCompanyId, activeTeamId } = useGlobalStore.getState();

		if (!activeCompanyId) {
			set({
				error: "No active company selected",
				loading: false,
				opportunities: [],
			});
			return;
		}

		// Cleanup existing subscription
		const currentSub = get().subscription;
		if (currentSub) {
			currentSub.unsubscribe();
		}

		set({ loading: true });
		try {
			// Build filter based on company and team selection
			const filter = {
				companyId: { eq: activeCompanyId },
				...(activeTeamId && { teamId: { eq: activeTeamId } }),
			};

			console.log("Fetching opportunities with filter:", filter);

			const subscription = client.models.Opportunity.observeQuery({
				filter,
				sort: {
					field: "position",
					direction: "ASC",
				},
			}).subscribe({
				next: ({ items }) => {
					console.log("Received opportunities:", items.length);
					set({
						opportunities: items,
						loading: false,
						error: null,
					});
				},
				error: (err) => {
					console.error("Fetch opportunities error:", err);
					set({
						error: "Failed to fetch opportunities",
						loading: false,
					});
				},
			});

			set({ subscription });
		} catch (err) {
			console.error("Fetch opportunities error:", err);
			set({
				error: "Failed to fetch opportunities",
				loading: false,
			});
		}
	},

	moveOpportunity: async (opportunityId, newStatus) => {
		const { activeTeamId } = useGlobalStore.getState();
		const opportunity = get().opportunities.find((opp) => opp.id === opportunityId);

		if (!opportunity) return;

		try {
			const updatedOpportunity = await client.models.Opportunity.update({
				id: opportunityId,
				status: newStatus,
				teamId: activeTeamId, // Ensure team ID is updated when moving
			});

			return updatedOpportunity;
		} catch (err) {
			console.error("Error moving opportunity:", err);
			throw err;
		}
	},

	updateOpportunity: async (id, updates) => {
		const { activeTeamId } = useGlobalStore.getState();
		const opportunity = get().opportunities.find((opp) => opp.id === id);
		if (!opportunity) return;

		try {
			const updatedOpportunity = await client.models.Opportunity.update({
				id,
				...updates,
				teamId: activeTeamId, // Ensure team ID is updated
			});

			return updatedOpportunity;
		} catch (err) {
			console.error("Error updating opportunity:", err);
			throw err;
		}
	},

	cleanup: () => {
		const { subscription } = get();
		if (subscription) {
			subscription.unsubscribe();
		}
		set({
			opportunities: [],
			loading: false,
			error: null,
			subscription: null,
		});
	},
}));

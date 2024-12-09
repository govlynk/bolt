import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient();

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

	fetchOpportunities: async (companyId) => {
		if (!companyId) {
			set({ error: "Company ID is required", loading: false });
			return;
		}

		// Cleanup existing subscription
		const currentSub = get().subscription;
		if (currentSub) {
			currentSub.unsubscribe();
		}

		set({ loading: true });
		try {
			const subscription = client.models.Opportunity.observeQuery({
				filter: { companyId: { eq: companyId } },
			}).subscribe({
				next: ({ items }) => {
					set({
						opportunities: items,
						loading: false,
						error: null,
					});
				},
				error: (err) => {
					console.error("Error in opportunity subscription:", err);
					set({
						error: err.message || "Failed to fetch opportunities",
						loading: false,
					});
				},
			});

			set({ subscription });
		} catch (err) {
			console.error("Error setting up opportunity subscription:", err);
			set({
				error: err.message || "Failed to load opportunities",
				loading: false,
			});
		}
	},

	moveOpportunity: async (opportunityId, newStatus) => {
		const opportunity = get().opportunities.find((opp) => opp.id === opportunityId);
		if (!opportunity) return;

		try {
			const updatedOpportunity = await client.models.Opportunity.update({
				id: opportunityId,
				status: newStatus,
			});

			return updatedOpportunity;
		} catch (err) {
			console.error("Error moving opportunity:", err);
			throw err;
		}
	},

	updateOpportunity: async (id, updates) => {
		const opportunity = get().opportunities.find((opp) => opp.id === id);
		if (!opportunity) return;

		try {
			const updatedOpportunity = await client.models.Opportunity.update({
				id,
				...updates,
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

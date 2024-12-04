import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateClient } from "aws-amplify/data";
import { getOpportunity } from "../utils/opportunityApi";

const client = generateClient();

export const useOpportunityStore = create(
	persist(
		(set, get) => ({
			opportunities: [],
			savedOpportunities: [],
			rejectedOpportunities: [],
			lastRetrievedDate: null,
			loading: false,
			error: null,

			fetchOpportunities: async (params) => {
				set({ loading: true, error: null });
				try {
					const response = await getOpportunity(params);

					console.log("Opportunities:", response);
					// Filter out previously rejected opportunities
					const rejectedIds = get().rejectedOpportunities.map((opp) => opp.noticeId);
					const filteredOpportunities = response.filter((opp) => !rejectedIds.includes(opp.noticeId));

					set({
						opportunities: filteredOpportunities,
						lastRetrievedDate: new Date().toISOString(),
						loading: false,
					});

					return filteredOpportunities;
				} catch (err) {
					console.error("Error fetching opportunities:", err);
					set({ error: err.message, loading: false });
					throw err;
				}
			},

			saveOpportunity: async (opportunity) => {
				try {
					const savedOpp = {
						...opportunity,
						savedAt: new Date().toISOString(),
						status: "saved",
					};

					set((state) => ({
						savedOpportunities: [...state.savedOpportunities, savedOpp],
						opportunities: state.opportunities.filter((opp) => opp.noticeId !== opportunity.noticeId),
					}));
				} catch (err) {
					console.error("Error saving opportunity:", err);
					throw err;
				}
			},

			rejectOpportunity: async (opportunity) => {
				try {
					const rejectedOpp = {
						...opportunity,
						rejectedAt: new Date().toISOString(),
						status: "rejected",
					};

					set((state) => ({
						rejectedOpportunities: [...state.rejectedOpportunities, rejectedOpp],
						opportunities: state.opportunities.filter((opp) => opp.noticeId !== opportunity.noticeId),
					}));
				} catch (err) {
					console.error("Error rejecting opportunity:", err);
					throw err;
				}
			},

			clearOpportunities: () => {
				set({ opportunities: [], error: null });
			},
		}),
		{
			name: "opportunity-storage",
			partialize: (state) => ({
				savedOpportunities: state.savedOpportunities,
				rejectedOpportunities: state.rejectedOpportunities,
				lastRetrievedDate: state.lastRetrievedDate,
			}),
		}
	)
);

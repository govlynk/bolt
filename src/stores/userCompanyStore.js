import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { useGlobalStore } from "./globalStore";

const client = generateClient({
	authMode: "userPool",
});

export const useUserCompanyStore = create((set, get) => ({
	userCompanies: [],
	activeCompanyId: null,
	loading: false,
	error: null,

	reset: () =>
		set({
			userCompanies: [],
			activeCompanyId: null,
			loading: false,
			error: null,
		}),

	fetchUserCompanies: async (activeUserId) => {
		if (!activeUserId) {
			console.log("UserCompanyStore: No user ID found, skipping fetch");
			return;
		}

		set({ loading: true, error: null });

		try {
			const response = await client.models.UserCompanyAccess.list({
				filter: { userId: { eq: activeUserId } },
			});

			if (!response?.data) {
				throw new Error("Failed to fetch user companies");
			}

			// Fetch full company details for each role
			const companiesWithDetails = await Promise.all(
				response.data.map(async (ucr) => {
					const companyResponse = await client.models.Company.get({ id: ucr.companyId });
					return {
						...companyResponse.data,
						access: ucr.access,
						UserCompanyAccessId: ucr.id,
						status: ucr.status,
					};
				})
			);

			// Set companies and initialize active company if needed
			set((state) => {
				const newState = {
					userCompanies: companiesWithDetails,
					loading: false,
					error: null,
				};

				// Set first company as active if none selected
				if (companiesWithDetails.length > 0 && !state.activeCompanyId) {
					useGlobalStore.getState().setActiveCompany(companiesWithDetails[0].id);
				}

				return newState;
			});
		} catch (err) {
			set({
				error: err.message || "Failed to fetch user companies",
				loading: false,
				userCompanies: [],
			});
		}
	},

	getActiveCompany: () => {
		const state = get();
		return state.userCompanies.find((company) => company.id === state.activeCompanyId);
	},
	// Add reset method
	reset: () => {
		set({
			userCompanies: [],
			loading: false,
			error: null,
		});
	},
}));

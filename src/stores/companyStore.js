import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient({
	authMode: "userPool",
});

export const useCompanyStore = create((set, get) => ({
	companies: [],
	loading: false,
	error: null,
	subscription: null,

	fetchCompanies: async () => {
		set({ loading: true });
		try {
			const subscription = client.models.Company.observeQuery().subscribe({
				next: ({ items }) => {
					set({
						companies: items,
						loading: false,
						error: null,
					});
				},
				error: (err) => {
					console.error("Fetch companies error:", err);
					set({ error: "Failed to fetch companies", loading: false });
				},
			});
			set({ subscription });
		} catch (err) {
			console.error("Fetch companies error:", err);
			set({ error: "Failed to fetch companies", loading: false });
		}
	},

	addCompany: async (companyData) => {
		set({ loading: true, error: null });
		try {
			// Validate required fields
			if (!companyData.legalBusinessName?.trim()) {
				throw new Error("Legal business name is required");
			}
			if (!companyData.uei?.trim()) {
				throw new Error("UEI is required");
			}
			// Create company
			const response = await client.models.Company.create({
				...companyData,
			});

			console.log("Create company response:", response);

			if (!response.data?.id) {
				console.error("Company creation failed - invalid response:", response);
				throw new Error("Company creation failed - invalid response");
			}

			const company = response;

			set((state) => ({
				companies: [...state.companies, company],
				loading: false,
				error: null,
			}));

			return company;
		} catch (err) {
			console.error("Create company error:", err);
			const errorMessage = err.message || "Failed to create company";
			set({ error: errorMessage, loading: false });
			throw new Error(errorMessage);
		}
	},

	updateCompany: async (id, updates) => {
		set({ loading: true, error: null });
		try {
			const updatedCompany = await client.models.Company.update({
				id,
				...updates,
			});

			set((state) => ({
				companies: state.companies.map((company) => (company.id === id ? updatedCompany : company)),
				loading: false,
				error: null,
			}));
			return updatedCompany;
		} catch (err) {
			console.error("Error updating company:", err);
			set({ error: "Failed to update company", loading: false });
			throw err;
		}
	},

	removeCompany: async (id) => {
		set({ loading: true, error: null });
		try {
			if (!id) {
				throw new Error("Company ID is required for removal");
			}

			// First remove all UserCompanyAccesss associated with this company
			const UserCompanyAccesss = await client.models.UserCompanyAccess.list({
				filter: { companyId: { eq: id } },
			});

			for (const role of UserCompanyAccesss.data) {
				await client.models.UserCompanyAccess.delete({ id: role.id });
			}

			// Then remove all team members associated with this company
			const teams = await client.models.Team.list({
				filter: { companyId: { eq: id } },
			});

			for (const team of teams.data) {
				await client.models.Team.delete({ id: team.id });
			}

			// Finally remove the company
			await client.models.Company.delete({ id });

			set((state) => ({
				companies: state.companies.filter((company) => company.id !== id),
				loading: false,
				error: null,
			}));
		} catch (err) {
			console.error("Error removing company:", err);
			const errorMessage = err.message || "Failed to remove company";
			set({ error: errorMessage, loading: false });
			throw new Error(errorMessage);
		}
	},

	cleanup: () => {
		const { subscription } = get();
		if (subscription) {
			subscription.unsubscribe();
		}
	},
}));

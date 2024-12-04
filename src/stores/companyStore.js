import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { useAuthStore } from "./authStore";

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
				legalBusinessName: companyData.legalBusinessName.trim(),
				dbaName: companyData.dbaName?.trim() || null,
				uei: companyData.uei.trim(),
				cageCode: companyData.cageCode?.trim() || null,
				ein: companyData.ein?.trim() || null,
				companyEmail: companyData.companyEmail?.trim() || null,
				companyPhoneNumber: companyData.companyPhoneNumber?.trim() || null,
				companyWebsite: companyData.companyWebsite?.trim() || null,
				status: companyData.status || "ACTIVE",
				activationDate: companyData.activationDate || null,
				billingAddressCity: companyData.billingAddressCity || null,
				billingAddressCountryCode: companyData.billingAddressCountryCode || null,
				billingAddressStateCode: companyData.billingAddressStateCode || null,
				billingAddressStreetLine1: companyData.billingAddressStreetLine1 || null,
				billingAddressStreetLine2: companyData.billingAddressStreetLine2 || null,
				billingAddressZipCode: companyData.billingAddressZipCode || null,
				companyStartDate: companyData.companyStartDate || null,
				congressionalDistrict: companyData.congressionalDistrict || null,
				coreCongressionalDistrict: companyData.coreCongressionalDistrict || null,
				countryOfIncorporationCode: companyData.countryOfIncorporationCode || null,
				entityDivisionName: companyData.entityDivisionName || null,
				entityStartDate: companyData.entityStartDate || null,
				entityStructureDesc: companyData.entityStructureDesc || null,
				entityTypeDesc: companyData.entityTypeDesc || null,
				exclusionStatusFlag: companyData.exclusionStatusFlag || null,
				expirationDate: companyData.expirationDate || null,
				fiscalYearEndCloseDate: companyData.fiscalYearEndCloseDate || null,
				lastUpdateDate: companyData.lastUpdateDate || null,
				organizationStructureDesc: companyData.organizationStructureDesc || null,
				primaryNaics: companyData.primaryNaics || null,
				profitStructureDesc: companyData.profitStructureDesc || null,
				purposeOfRegistrationDesc: companyData.purposeOfRegistrationDesc || null,
				registrationDate: companyData.registrationDate || null,
				registrationExpirationDate: companyData.registrationExpirationDate || null,
				registrationStatus: companyData.registrationStatus || null,
				shippingAddressCity: companyData.shippingAddressCity || null,
				shippingAddressCountryCode: companyData.shippingAddressCountryCode || null,
				shippingAddressStateCode: companyData.shippingAddressStateCode || null,
				shippingAddressStreetLine1: companyData.shippingAddressStreetLine1 || null,
				shippingAddressStreetLine2: companyData.shippingAddressStreetLine2 || null,
				shippingAddressZipCode: companyData.shippingAddressZipCode || null,
				stateOfIncorporationCode: companyData.stateOfIncorporationCode || null,
				submissionDate: companyData.submissionDate || null,
			});

			console.log("Create company response:", response);

			if (!response?.id) {
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

			// First remove all UserCompanyRoles associated with this company
			const userCompanyRoles = await client.models.UserCompanyRole.list({
				filter: { companyId: { eq: id } },
			});

			for (const role of userCompanyRoles.data) {
				await client.models.UserCompanyRole.delete({ id: role.id });
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

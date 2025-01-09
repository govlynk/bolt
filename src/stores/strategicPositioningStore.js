import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { useGlobalStore } from "./globalStore";

const client = generateClient();

// Define the expected fields for a capability statement
const sanitizeCapabilityData = (data) => ({
	companyId: data.companyId,
	aboutUs: data.aboutUs || null,
	keyCapabilities: Array.isArray(data.keyCapabilities) ? data.keyCapabilities : [],
	competitiveAdvantage: data.competitiveAdvantage || null,
	mission: data.mission || null,
	vision: data.vision || null,
	keywords: Array.isArray(data.keywords) ? data.keywords : [],
	lastModified: new Date().toISOString(),
});

export const useStrategicPositioningStore = create((set, get) => ({
	capabilityStatement: null,
	loading: false,
	error: null,
	success: false,
	history: [],

	fetchCapabilityStatement: async (companyId) => {
		if (!companyId) {
			set({ error: "No company ID provided" });
			return;
		}

		set({ loading: true, error: null });
		try {
			const response = await client.models.CapabilityStatement.list({
				filter: { companyId: { eq: companyId } },
				limit: 1,
			});

			set({
				capabilityStatement: response?.data?.[0] || null,
				loading: false,
				error: null,
			});
		} catch (err) {
			console.error("Error fetching strategic positioning:", err);
			set({ error: err.message, loading: false });
		}
	},

	saveCapabilityStatement: async (data) => {
		const { activeCompanyId } = useGlobalStore.getState();
		if (!activeCompanyId) {
			throw new Error("No active company selected");
		}

		set({ loading: true, error: null, success: false });
		try {
			const currentStatement = get().capabilityStatement;

			// Sanitize the data to ensure it matches the expected schema
			const sanitizedData = sanitizeCapabilityData({
				...data,
				companyId: activeCompanyId,
			});

			let response;
			if (currentStatement?.id) {
				// Update existing statement
				response = await client.models.CapabilityStatement.update({
					id: currentStatement.id,
					...sanitizedData,
				});
			} else {
				// Create new statement
				response = await client.models.CapabilityStatement.create(sanitizedData);
			}

			if (!response?.data) {
				throw new Error("Failed to save capability statement");
			}

			set({
				capabilityStatement: response.data,
				loading: false,
				error: null,
				success: true,
			});

			return response.data;
		} catch (err) {
			console.error("Error saving capability statement:", err);
			set({
				error: err.message || "Failed to save capability statement",
				loading: false,
				success: false,
			});
			throw err;
		}
	},

	resetSuccess: () => set({ success: false }),

	reset: () => {
		set({
			capabilityStatement: null,
			loading: false,
			error: null,
			success: false,
		});
	},
}));

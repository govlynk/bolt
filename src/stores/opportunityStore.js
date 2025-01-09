import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { useGlobalStore } from "./globalStore";
import { getOpportunity } from "../utils/opportunityApi";

const client = generateClient({
	authMode: "userPool",
});

export const useOpportunityStore = create((set, get) => ({
	opportunities: [],
	savedOpportunities: [],
	rejectedOpportunities: [],
	lastRetrievedDate: null,
	loading: false,
	error: null,
	isInitialized: false,
	subscription: null,

	initializeStore: async () => {
		const { activeCompanyId, activeUserId, activeTeamId } = useGlobalStore.getState();

		if (!activeCompanyId) {
			set({
				error: "No active company selected",
				loading: false,
				isInitialized: false,
			});
			return;
		}

		set({ loading: true, error: null });
		try {
			// Fetch saved opportunities
			const savedOpportunities = await client.models.Opportunity.list({
				filter: {
					companyId: { eq: activeCompanyId },
					status: { eq: "BACKLOG" },
				},
			});

			// Fetch rejected opportunities
			const rejectedOpportunities = await client.models.Opportunity.list({
				filter: {
					companyId: { eq: activeCompanyId },
					status: { eq: "REJECTED" },
				},
			});

			set({
				savedOpportunities: savedOpportunities?.data || [],
				rejectedOpportunities: rejectedOpportunities?.data || [],
				loading: false,
				error: null,
				isInitialized: true,
			});
		} catch (err) {
			console.error("Error initializing opportunity store:", err);
			set({
				error: "Failed to initialize opportunity store",
				loading: false,
				isInitialized: false,
			});
		}
	},

	setOpportunities: (opportunities) => {
		set({ opportunities });
	},

	// Fetch opportunities from SAM.gov
	fetchOpportunities: async (params) => {
		const { activeCompanyId } = useGlobalStore.getState();
		if (!activeCompanyId) {
			set({ error: "No active company selected", loading: false });
			return;
		}

		if (!params || !Object.keys(params).length) {
			set({
				error: "Invalid search parameters",
				loading: false,
			});
			return;
		}

		set({ loading: true, error: null });
		try {
			const response = await getOpportunity(params);
			const currentState = get();

			// Filter out previously saved and rejected opportunities
			const savedIds = currentState.savedOpportunities.map((opp) => opp.opportunityId);
			const rejectedIds = currentState.rejectedOpportunities.map((opp) => opp.opportunityId);
			const filteredOpportunities = response.filter(
				(opp) => !savedIds.includes(opp.noticeId) && !rejectedIds.includes(opp.noticeId)
			);

			set({
				opportunities: filteredOpportunities,
				lastRetrievedDate: new Date().toISOString(),
				loading: false,
			});

			return filteredOpportunities;
		} catch (err) {
			console.error("Error fetching opportunities:", err);
			set({ error: err.message || "Failed to fetch opportunities", loading: false });
		}
	},

	// Fetch saved opportunities from database
	fetchSavedOpportunities: async () => {
		const { activeCompanyId } = useGlobalStore.getState();
		if (!activeCompanyId) return;

		set({ loading: true });
		try {
			const response = await client.models.Opportunity.list({
				filter: {
					companyId: { eq: activeCompanyId },
					status: { ne: "REJECTED" },
				},
			});
			set({ savedOpportunities: response.data || [], loading: false });
		} catch (err) {
			console.error("Error fetching saved opportunities:", err);
			set({ error: err.message, loading: false });
		}
	},

	// Fetch rejected opportunities
	fetchRejectedOpportunities: async () => {
		const { activeCompanyId } = useGlobalStore.getState();
		if (!activeCompanyId) return;

		set({ loading: true });
		try {
			const response = await client.models.Opportunity.list({
				filter: {
					companyId: { eq: activeCompanyId },
					status: { eq: "REJECTED" },
				},
			});
			set({ rejectedOpportunities: response.data || [], loading: false });
		} catch (err) {
			console.error("Error fetching rejected opportunities:", err);
			set({ error: err.message, loading: false });
		}
	},

	// Move opportunity between pipeline stages
	moveOpportunity: async (opportunityId, newStatus) => {
		set({ loading: true, error: null });
		try {
			const response = await client.models.Opportunity.update({
				id: opportunityId,
				status: newStatus,
			});

			if (!response?.data) {
				throw new Error("Failed to update opportunity status");
			}

			// Update local state
			await get().fetchSavedOpportunities();
			set({ loading: false });
			return response.data;
		} catch (err) {
			console.error("Error moving opportunity:", err);
			set({ error: err.message, loading: false });
			throw err;
		}
	},

	moveToSaved: async (opportunity) => {
		const { activeCompanyId, activeTeamId, activeUserId } = useGlobalStore.getState();

		if (!activeCompanyId) {
			throw new Error("No active company selected");
		}

		set({ loading: true, error: null });
		try {
			// First, find and delete the rejected opportunity
			const rejectedOpp = await client.models.Opportunity.list({
				filter: {
					opportunityId: { eq: opportunity.noticeId },
					status: { eq: "REJECTED" },
				},
			});

			if (rejectedOpp?.data?.[0]) {
				await client.models.Opportunity.delete({
					id: rejectedOpp.data[0].id,
				});
			}

			// Then create a new saved opportunity
			const opportunityData = {
				status: "BACKLOG",
				noticeId: opportunity.noticeId,
				title: opportunity.title || "",
				description: opportunity.description || "",

				// Agency hierarchy
				department: opportunity?.department || "N/A",
				agency: opportunity?.agency || "N/A",
				office: opportunity?.office || "N/A",
				subOffice: opportunity?.subOffice || "N/A",

				solicitationNumber: opportunity.solicitationNumber || "",
				fullParentPathName: opportunity.fullParentPathName || "",
				postedDate: opportunity.postedDate ? new Date(opportunity.postedDate).toISOString() : null,
				type: opportunity.type || "",
				typeOfSetAsideDescription: opportunity.typeOfSetAsideDescription || "",
				typeOfSetAside: opportunity.typeOfSetAside || "",
				responseDeadLine: opportunity.responseDeadLine
					? new Date(opportunity.responseDeadLine).toISOString()
					: null,
				naicsCode: opportunity.naicsCode || "",
				naicsCodes: opportunity.naicsCodes || "",
				classificationCode: opportunity.classificationCode || "",
				active: opportunity.active || "Yes",
				organizationType: opportunity.organizationType || "",
				resourceLinks: opportunity.resourceLinks || "",
				uiLink: opportunity.uiLink || "",
				// Office Address as embedded fields
				officeZipcode: opportunity.officeZipcode || "",
				officeCity: opportunity.officeCity || "",
				officeCountryCode: opportunity.officeCountryCode || "",
				officeState: opportunity.officeState || "",
				// Point of Contact as embedded fields
				pocName: opportunity.pocName || "",
				pocEmail: opportunity.pocEmail || "",
				pocPhone: opportunity.pocPhone || "",
				pocType: opportunity.pocType || "",
				// Default Pipeline fields
				position: 0,
				priority: "MEDIUM",
				estimatedEffort: 0,
				actualEffort: 0,
				tags: "",
				notes: "",
				assigneeId: activeUserId,
				// set initial due date to response deadline
				dueDate: opportunity.responseDeadLine ? new Date(opportunity.responseDeadLine).toISOString() : null,

				notes: "",

				// Foreign key relationships
				userId: activeUserId,
				companyId: activeCompanyId,
				teamId: activeTeamId,
			};

			const response = await client.models.Opportunity.create(opportunityData);

			if (!response?.data) {
				throw new Error("Failed to move opportunity to saved");
			}

			set((state) => ({
				savedOpportunities: [...state.savedOpportunities, response.data],
				rejectedOpportunities: state.rejectedOpportunities.filter(
					(opp) => opp.opportunityId !== opportunity.noticeId
				),
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("Error moving opportunity to saved:", err);
			set({ error: err.message || "Failed to move opportunity to saved", loading: false });
			throw err;
		}
	},

	// Save new opportunity
	saveOpportunity: async (opportunity) => {
		const state = get();
		if (!state.isInitialized) {
			await state.initializeStore();
		}

		const { activeCompanyId, activeTeamId, activeUserId } = useGlobalStore.getState();
		console.log("Active Company ID: ", activeCompanyId);
		console.log("Active Team ID: ", activeTeamId);
		console.log("Active User ID: ", activeUserId);

		if (!activeCompanyId) {
			throw new Error("No active company selected");
		}

		set({ loading: true, error: null });
		try {
			console.log("OpportunityStore: Saving opportunity:", opportunity);

			const opportunityData = {
				status: "BACKLOG",
				noticeId: opportunity.noticeId,
				title: opportunity.title || "",
				description: opportunity.description || "",
				solicitationNumber: opportunity.solicitationNumber || "",
				fullParentPathName: opportunity.fullParentPathName || "",
				postedDate: opportunity.postedDate ? new Date(opportunity.postedDate).toISOString() : null,
				type: opportunity.type || "",
				typeOfSetAsideDescription: opportunity.typeOfSetAsideDescription || "",
				typeOfSetAside: opportunity.typeOfSetAside || "",
				responseDeadLine: opportunity.responseDeadLine
					? new Date(opportunity.responseDeadLine).toISOString()
					: null,
				naicsCode: opportunity.naicsCode || "",
				naicsCodes: opportunity.naicsCodes || "",
				classificationCode: opportunity.classificationCode || "",
				active: opportunity.active || "Yes",
				organizationType: opportunity.organizationType || "",
				resourceLinks: opportunity.resourceLinks || "",
				uiLink: opportunity.uiLink || "",
				// Office Address as embedded fields
				officeZipcode: opportunity.officeZipcode || "",
				officeCity: opportunity.officeCity || "",
				officeCountryCode: opportunity.officeCountryCode || "",
				officeState: opportunity.officeState || "",
				// Point of Contact as embedded fields
				pocName: opportunity.pocName || "",
				pocEmail: opportunity.pocEmail || "",
				pocPhone: opportunity.pocPhone || "",
				pocType: opportunity.pocType || "",
				// Default Pipeline fields
				position: 0,
				priority: "MEDIUM",
				estimatedEffort: 0,
				actualEffort: 0,
				tags: "",
				notes: "",
				assigneeId: activeUserId,
				// set initial due date to response deadline
				dueDate: opportunity.responseDeadLine ? new Date(opportunity.responseDeadLine).toISOString() : null,

				notes: "",

				// Foreign key relationships
				userId: activeUserId,
				companyId: activeCompanyId,
				teamId: activeTeamId,
			};

			const response = await client.models.Opportunity.create(opportunityData);
			console.log("Saved opportunity response:", response);

			if (!response?.data) {
				throw new Error("Failed to save opportunity");
			}

			set((state) => ({
				savedOpportunities: [...state.savedOpportunities, response.data],
				opportunities: state.opportunities.filter((opp) => opp.noticeId !== opportunity.noticeId),
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("Error saving opportunity:", err);
			set({ error: err.message || "Failed to save opportunity", loading: false });
			throw err;
		}
	},

	// Reject opportunity
	rejectOpportunity: async (opportunity) => {
		const { activeCompanyId, activeTeamId, activeUserId } = useGlobalStore.getState();

		if (!activeCompanyId) {
			throw new Error("No active company selected");
		}

		set({ loading: true, error: null });
		try {
			const opportunityData = {
				status: "REJECTED",
				noticeId: opportunity.noticeId,
				title: opportunity.title || "",
				description: opportunity.description || "",
				solicitationNumber: opportunity.solicitationNumber || "",
				fullParentPathName: opportunity.fullParentPathName || "",
				postedDate: opportunity.postedDate ? new Date(opportunity.postedDate).toISOString() : null,
				type: opportunity.type || "",
				typeOfSetAsideDescription: opportunity.typeOfSetAsideDescription || "",
				typeOfSetAside: opportunity.typeOfSetAside || "",
				responseDeadLine: opportunity.responseDeadLine
					? new Date(opportunity.responseDeadLine).toISOString()
					: null,
				naicsCode: opportunity.naicsCode || "",
				naicsCodes: opportunity.naicsCodes || "",
				classificationCode: opportunity.classificationCode || "",
				active: opportunity.active || "Yes",
				organizationType: opportunity.organizationType || "",
				resourceLinks: opportunity.resourceLinks || "",
				uiLink: opportunity.uiLink || "",
				// Office Address as embedded fields
				officeZipcode: opportunity.officeZipcode || "",
				officeCity: opportunity.officeCity || "",
				officeCountryCode: opportunity.officeCountryCode || "",
				officeState: opportunity.officeState || "",
				// Point of Contact as embedded fields
				pocName: opportunity.pocName || "",
				pocEmail: opportunity.pocEmail || "",
				pocPhone: opportunity.pocPhone || "",
				pocType: opportunity.pocType || "",
				// Default Pipeline fields
				position: 0,
				priority: "MEDIUM",
				estimatedEffort: 0,
				actualEffort: 0,
				tags: "",
				notes: "",
				assigneeId: activeUserId,
				// set initial due date to response deadline
				dueDate: opportunity.responseDeadLine ? new Date(opportunity.responseDeadLine).toISOString() : null,

				notes: "",

				// Foreign key relationships
				userId: activeUserId,
				companyId: activeCompanyId,
				teamId: activeTeamId,
			};

			const response = await client.models.Opportunity.create(opportunityData);

			console.log("Rejected opportunity response:", response);

			if (!response?.data) {
				throw new Error("Failed to reject opportunity");
			}

			set((state) => ({
				rejectedOpportunities: [...state.rejectedOpportunities, response.data],
				opportunities: state.opportunities.filter((opp) => opp.noticeId !== opportunity.noticeId),
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("Error rejecting opportunity:", err);
			set({ error: err.message, loading: false });
			throw err;
		}
	},

	// Initialize real-time subscription
	initializeSubscription: () => {
		const { activeCompanyId, activeTeamId, activeUserId } = useGlobalStore.getState();

		if (!activeCompanyId) return;

		const currentSub = get().subscription;
		if (currentSub) {
			currentSub.unsubscribe();
		}

		const subscription = client.models.Opportunity.observeQuery({
			filter: { companyId: { eq: activeCompanyId } },
		}).subscribe({
			next: async () => {
				await get().fetchSavedOpportunities();
				await get().fetchRejectedOpportunities();
			},
			error: (err) => {
				console.error("Subscription error:", err);
				set({ error: err.message });
			},
		});

		set({ subscription });
	},

	resetStore: () => {
		set({
			opportunities: [],
			savedOpportunities: [],
			rejectedOpportunities: [],
			lastRetrievedDate: null,
			loading: false,
			error: null,
			isInitialized: false,
		});
	},

	cleanup: () => {
		const { subscription } = get();
		if (subscription) {
			subscription.unsubscribe();
		}
		set({
			opportunities: [],
			savedOpportunities: [],
			rejectedOpportunities: [],
			loading: false,
			error: null,
			subscription: null,
		});
	},
}));

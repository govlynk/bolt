import { create } from "zustand";

export const useSetupWorkflowStore = create((set, get) => ({
	// Step tracking
	activeStep: 0,

	// Data for each step
	companyData: null,
	contactsData: [],
	adminData: null,
	teamData: null,

	// Loading and error states
	loading: false,
	error: null,

	// Step actions
	setActiveStep: (step) => set({ activeStep: step }),
	nextStep: () => set((state) => ({ activeStep: state.activeStep + 1 })),
	prevStep: () => set((state) => ({ activeStep: Math.max(0, state.activeStep - 1) })),

	// Data setters
	setCompanyData: (data) => set({ companyData: data }),
	setContactsData: (data) => set({ contactsData: data }),
	setAdminData: (data) => set({ adminData: data }),
	setTeamData: (data) => set({ teamData: data }),

	// Data getters
	getCompanyData: () => get().companyData,
	getContactsData: () => get().contactsData,
	getAdminData: () => get().adminData,
	getTeamData: () => get().teamData,

	// Reset workflow
	resetWorkflow: () =>
		set({
			activeStep: 0,
			companyData: null,
			contactsData: [],
			adminData: null,
			teamData: null,
			loading: false,
			error: null,
		}),

	// Validation helpers
	canProceedToNextStep: () => {
		const state = get();
		switch (state.activeStep) {
			case 0: // Company Search
				return !!state.companyData;
			case 1: // Contacts
				return state.contactsData.length > 0;
			case 2: // Admin Setup
				return !!state.adminData;
			case 3: // Team Setup
				return !!state.teamData;
			default:
				return false;
		}
	},
}));

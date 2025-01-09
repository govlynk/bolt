import { create } from "zustand";
import { generateClient } from "aws-amplify/api";

const client = generateClient();

export const useContactStore = create((set, get) => ({
	contacts: [],
	loading: false,
	error: null,
	subscription: null,

	fetchContacts: async (companyId) => {
		// Clear existing subscription if any
		const currentSub = get().subscription;
		if (currentSub) {
			currentSub.unsubscribe();
		}

		set({ loading: true, error: null });

		try {
			// Create new subscription
			const subscription = client.models.Contact.observeQuery({
				filter: { companyId: { eq: companyId } },
			}).subscribe({
				next: ({ items }) => {
					set({
						contacts: items,
						loading: false,
						error: null,
					});
				},
				error: (err) => {
					console.error("Error fetching contacts:", err);
					set({
						error: err.message || "Failed to fetch contacts",
						loading: false,
					});
				},
			});

			// Store the subscription
			set({ subscription });
		} catch (err) {
			console.error("Error setting up contacts subscription:", err);
			set({
				error: err.message || "Failed to load contacts",
				loading: false,
			});
		}
	},

	addContact: async (contactData) => {
		set({ loading: true, error: null });
		try {
			await client.models.Contact.create(contactData);
			// Don't manually update the contacts array - let the subscription handle it
			set({ loading: false });
		} catch (err) {
			console.error("Error creating contact:", err);
			set({
				error: err.message || "Failed to create contact",
				loading: false,
			});
			throw err;
		}
	},

	updateContact: async (id, updates) => {
		set({ loading: true, error: null });
		try {
			await client.models.Contact.update({
				id,
				...updates,
			});
			// Don't manually update the contacts array - let the subscription handle it
			set({ loading: false });
		} catch (err) {
			console.error("Error updating contact:", err);
			set({
				error: err.message || "Failed to update contact",
				loading: false,
			});
			throw err;
		}
	},

	removeContact: async (id) => {
		set({ loading: true, error: null });
		try {
			await client.models.Contact.delete({ id });
			// Don't manually update the contacts array - let the subscription handle it
			set({ loading: false });
		} catch (err) {
			console.error("Error removing contact:", err);
			set({
				error: err.message || "Failed to remove contact",
				loading: false,
			});
			throw err;
		}
	},

	cleanup: () => {
		const { subscription } = get();
		if (subscription) {
			subscription.unsubscribe();
		}
		set({
			contacts: [],
			subscription: null,
			loading: false,
			error: null,
		});
	},
}));

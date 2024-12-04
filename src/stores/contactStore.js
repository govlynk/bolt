import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { useUserCompanyStore } from "./userCompanyStore";

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
      // If no companyId provided, use active company
      const activeCompany = useUserCompanyStore.getState().getActiveCompany();
      const targetCompanyId = companyId || activeCompany?.id;

      if (!targetCompanyId) {
        set({
          error: "No company selected",
          loading: false,
          contacts: [],
        });
        return;
      }

      // Create new subscription with company filter
      const subscription = client.models.Contact.observeQuery({
        filter: { companyId: { eq: targetCompanyId } },
      }).subscribe({
        next: ({ items }) => {
          // Ensure unique contacts
          const uniqueContacts = Array.from(
            new Map(items.map(contact => [contact.id, contact])).values()
          );
          
          set({
            contacts: uniqueContacts,
            loading: false,
            error: null,
          });
        },
        error: (err) => {
          console.error("Error fetching contacts:", err);
          set({
            error: err.message || "Failed to fetch contacts",
            loading: false,
            contacts: [],
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
        contacts: [],
      });
    }
  },

  addContact: async (contactData) => {
    if (!contactData.companyId) {
      throw new Error("Company ID is required");
    }

    set({ loading: true, error: null });
    try {
      const response = await client.models.Contact.create(contactData);
      
      if (!response?.data) {
        throw new Error("Failed to create contact");
      }

      // Let subscription handle state update
      set({ loading: false });
      return response.data;
    } catch (err) {
      console.error("Error creating contact:", err);
      set({
        error: err.message || "Failed to create contact",
        loading: false,
      });
      throw err;
    }
  },

  // ... rest of the store implementation remains the same
}));
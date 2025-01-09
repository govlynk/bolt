import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { useGlobalStore } from "./globalStore";
import { createOrUpdateUser, createOrUpdateUserCompanyAccess } from "../utils/userUtils";

const client = generateClient();

export const useUserStore = create((set, get) => ({
	users: [],
	loading: false,
	error: null,

	fetchUsers: async () => {
		const { activeCompanyId } = useGlobalStore.getState();
		if (!activeCompanyId) {
			set({
				users: [],
				loading: false,
				error: "No active company selected",
			});
			return;
		}

		set({ loading: true, error: null });
		try {
			const response = await client.models.UserCompanyAccess.list({
				filter: { companyId: { eq: activeCompanyId } },
			});

			if (!response?.data) {
				throw new Error("Failed to fetch user company access");
			}

			// Fetch full user details for each access record
			const usersWithRoles = await Promise.all(
				response.data.map(async (access) => {
					const userResponse = await client.models.User.get({ id: access.userId });
					return {
						...userResponse.data,
						companyRole: access,
					};
				})
			);

			set({
				users: usersWithRoles.filter(Boolean),
				loading: false,
				error: null,
			});
		} catch (err) {
			console.error("Error fetching users:", err);
			set({
				error: err.message || "Failed to fetch users",
				loading: false,
			});
		}
	},

	addUser: async (userData) => {
		const { activeCompanyId } = useGlobalStore.getState();
		if (!activeCompanyId) {
			throw new Error("No active company selected");
		}

		set({ loading: true, error: null });
		try {
			// Create or update user
			const user = await createOrUpdateUser(userData);
			if (!user) {
				throw new Error("Failed to create/update user");
			}
			console.log("user", user, userData);

			// Create or update company access
			const access = await createOrUpdateUserCompanyAccess(user.id, activeCompanyId, userData.accessLevel);

			if (!access?.data) {
				throw new Error("Failed to create company access");
			}

			// Refresh user list
			await get().fetchUsers();
			set({ loading: false, error: null });

			return user;
		} catch (err) {
			console.error("Error adding user:", err);
			set({
				error: err.message || "Failed to add user",
				loading: false,
			});
			throw err;
		}
	},

	updateUser: async (id, updates) => {
		const { activeCompanyId } = useGlobalStore.getState();
		if (!id || !activeCompanyId) {
			throw new Error("User ID and active company are required");
		}

		set({ loading: true, error: null });
		console.log("Updating user:", id, updates);
		try {
			// Update user
			const userResponse = await client.models.User.update({
				id,
				cognitoId: updates.cognitoId,
				email: updates.email,
				name: `${updates.name}`,
				phone: updates.phone,
				contactId: updates.id,
				status: "ACTIVE",
			});

			// await client.models.User.update({
			// 	id: user.id,
			// 	contactId: contact.id,
			// 	lastLogin: new Date().toISOString(),
			// });

			if (!userResponse?.data) {
				throw new Error("Failed to update user");
			}

			// Update company access if access level changed
			if (updates.accessLevel) {
				await createOrUpdateUserCompanyAccess(id, activeCompanyId, updates.accessLevel);
			}

			// Refresh user list
			await get().fetchUsers();
			set({ loading: false, error: null });

			return userResponse.data;
		} catch (err) {
			console.error("Error updating user:", err);
			set({
				error: err.message || "Failed to update user",
				loading: false,
			});
			throw err;
		}
	},

	removeUser: async (id) => {
		if (!id) {
			throw new Error("User ID is required");
		}

		set({ loading: true, error: null });
		try {
			// First remove all user company access records
			const accessResponse = await client.models.UserCompanyAccess.list({
				filter: { userId: { eq: id } },
			});

			if (accessResponse?.data) {
				await Promise.all(
					accessResponse.data.map((access) => client.models.UserCompanyAccess.delete({ id: access.id }))
				);
			}

			// Then remove the user
			await client.models.User.delete({ id });

			// Refresh user list
			await get().fetchUsers();
			set({ loading: false, error: null });
		} catch (err) {
			console.error("Error removing user:", err);
			set({
				error: err.message || "Failed to remove user",
				loading: false,
			});
			throw err;
		}
	},

	cleanup: () => {
		set({
			users: [],
			loading: false,
			error: null,
		});
	},
}));

import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { useUserCompanyStore } from "./userCompanyStore";

const client = generateClient();

export const useUserStore = create((set, get) => ({
	users: [],
	loading: false,
	error: null,
	subscription: null,

	fetchUsers: async () => {
		set({ loading: true });

		// Clean up existing subscription
		const currentSub = get().subscription;
		if (currentSub) {
			currentSub.unsubscribe();
			set({ subscription: null });
		}

		try {
			// Get active company
			const activeCompany = useUserCompanyStore.getState().getActiveCompany();

			if (!activeCompany?.id) {
				set({
					users: [],
					loading: false,
					error: "No active company selected",
				});
				return;
			}

			// Fetch user-company roles for active company
			const userCompanyRoles = await client.models.UserCompanyRole.list({
				filter: { companyId: { eq: activeCompany.id } },
			});

			if (!userCompanyRoles?.data) {
				throw new Error("Failed to fetch user company roles");
			}

			// Get unique user IDs
			const userIds = [...new Set(userCompanyRoles.data.map((role) => role.userId))];

			// Fetch user details for each ID
			const userPromises = userIds.map((id) => client.models.User.get({ id }));

			const userResponses = await Promise.all(userPromises);
			const users = userResponses.filter((response) => response?.data).map((response) => response.data);

			set({
				users,
				loading: false,
				error: null,
			});
		} catch (err) {
			console.error("Fetch users error:", err);
			set({
				error: "Failed to fetch users",
				loading: false,
				users: [],
			});
		}
	},

	addUser: async (userData) => {
		if (!userData.email?.trim() || !userData.name?.trim()) {
			throw new Error("Email and name are required");
		}

		const activeCompany = useUserCompanyStore.getState().getActiveCompany();
		if (!activeCompany?.id) {
			throw new Error("No active company selected");
		}

		set({ loading: true, error: null });
		try {
			// Create user
			const userResponse = await client.models.User.create({
				cognitoId: userData.cognitoId || null,
				email: userData.email.trim(),
				name: userData.name.trim(),
				phone: userData.phone?.trim() || null,
				status: userData.status || "ACTIVE",
				lastLogin: new Date().toISOString(),
			});

			if (!userResponse?.data) {
				throw new Error("Failed to create user");
			}

			// Create user-company role
			await client.models.UserCompanyRole.create({
				userId: userResponse.data.id,
				companyId: activeCompany.id,
				roleId: userData.roleId || "MEMBER",
				status: "ACTIVE",
			});

			// Refresh users list
			await get().fetchUsers();

			return userResponse.data;
		} catch (err) {
			console.error("Create user error:", err);
			const errorMessage = err.message || "Failed to create user";
			set({ error: errorMessage, loading: false });
			throw new Error(errorMessage);
		}
	},

	updateUser: async (id, updates) => {
		if (!id) {
			throw new Error("User ID is required for update");
		}

		const activeCompany = useUserCompanyStore.getState().getActiveCompany();
		if (!activeCompany?.id) {
			throw new Error("No active company selected");
		}

		set({ loading: true, error: null });
		try {
			// Update user details
			const response = await client.models.User.update({
				id,
				...updates,
			});

			if (!response?.data) {
				throw new Error("Failed to update user");
			}

			// Update user-company role if roleId is provided
			if (updates.roleId) {
				const roles = await client.models.UserCompanyRole.list({
					filter: {
						userId: { eq: id },
						companyId: { eq: activeCompany.id },
					},
				});

				if (roles?.data?.[0]) {
					await client.models.UserCompanyRole.update({
						id: roles.data[0].id,
						roleId: updates.roleId,
						status: updates.status || roles.data[0].status,
					});
				}
			}

			// Refresh users list
			await get().fetchUsers();

			return response.data;
		} catch (err) {
			console.error("Update user error:", err);
			const errorMessage = err.message || "Failed to update user";
			set({ error: errorMessage, loading: false });
			throw new Error(errorMessage);
		}
	},

	removeUser: async (id) => {
		if (!id) {
			throw new Error("User ID is required for deletion");
		}

		const activeCompany = useUserCompanyStore.getState().getActiveCompany();
		if (!activeCompany?.id) {
			throw new Error("No active company selected");
		}

		set({ loading: true, error: null });
		try {
			// Remove user-company role first
			const roles = await client.models.UserCompanyRole.list({
				filter: {
					userId: { eq: id },
					companyId: { eq: activeCompany.id },
				},
			});

			for (const role of roles.data) {
				await client.models.UserCompanyRole.delete({ id: role.id });
			}

			// Only delete user if they have no other company associations
			const otherRoles = await client.models.UserCompanyRole.list({
				filter: { userId: { eq: id } },
			});

			if (otherRoles.data.length === 0) {
				await client.models.User.delete({ id });
			}

			// Refresh users list
			await get().fetchUsers();
		} catch (err) {
			console.error("Remove user error:", err);
			const errorMessage = err.message || "Failed to remove user";
			set({ error: errorMessage, loading: false });
			throw new Error(errorMessage);
		}
	},

	cleanup: () => {
		const { subscription } = get();
		if (subscription) {
			subscription.unsubscribe();
		}
		set({
			users: [],
			subscription: null,
			loading: false,
			error: null,
		});
	},
}));

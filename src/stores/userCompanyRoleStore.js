import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient({
	authMode: "userPool",
});

export const useUserCompanyRoleStore = create((set, get) => ({
	userCompanyRoles: [],
	loading: false,
	error: null,

	fetchUserCompanyRoles: async (companyId) => {
		if (!companyId) {
			set({ error: "Company ID is required", loading: false });
			return;
		}

		set({ loading: true, error: null });
		try {
			const response = await client.models.UserCompanyRole.list({
				filter: { companyId: { eq: companyId } },
			});

			if (!response?.data) {
				throw new Error("Invalid response from server");
			}

			set({ userCompanyRoles: response.data, loading: false, error: null });
		} catch (err) {
			console.error("Failed to fetch user-company roles:", err);
			set({ error: err.message || "Failed to fetch user-company roles", loading: false });
		}
	},

	addUserCompanyRole: async (roleData) => {
		if (!roleData.userId || !roleData.companyId || !roleData.roleId) {
			throw new Error("Missing required fields: userId, companyId, or roleId");
		}

		set({ loading: true, error: null });
		try {
			const response = await client.models.UserCompanyRole.create({
				userId: roleData.userId,
				companyId: roleData.companyId,
				roleId: roleData.roleId,
				status: roleData.status || "ACTIVE",
			});

			if (!response?.data) {
				throw new Error("Failed to create user company role");
			}

			set((state) => ({
				userCompanyRoles: [...state.userCompanyRoles, response.data],
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("Error adding user company role:", err);
			set({ error: err.message || "Failed to add user company role", loading: false });
			throw err;
		}
	},

	updateUserCompanyRole: async (id, updates) => {
		if (!id) {
			throw new Error("Role ID is required");
		}

		set({ loading: true, error: null });
		try {
			const response = await client.models.UserCompanyRole.update({
				id,
				...updates,
			});

			if (!response?.data) {
				throw new Error("Failed to update user company role");
			}

			set((state) => ({
				userCompanyRoles: state.userCompanyRoles.map((role) => (role.id === id ? response.data : role)),
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("Error updating user company role:", err);
			set({ error: err.message || "Failed to update user company role", loading: false });
			throw err;
		}
	},

	removeUserCompanyRole: async (id) => {
		if (!id) {
			throw new Error("Role ID is required");
		}

		set({ loading: true, error: null });
		try {
			await client.models.UserCompanyRole.delete({ id });

			set((state) => ({
				userCompanyRoles: state.userCompanyRoles.filter((role) => role.id !== id),
				loading: false,
				error: null,
			}));
		} catch (err) {
			console.error("Error removing user company role:", err);
			set({ error: err.message || "Failed to remove user company role", loading: false });
			throw err;
		}
	},
}));

import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient({
	authMode: "userPool",
});

export const useCurrentUserStore = create((set) => ({
	currentUser: null,
	isAuthenticated: false,
	isAdmin: false,
	groups: [],
	userCompanies: [],
	userRoles: [],
	loading: false,
	error: null,

	initializeCurrentUser: async (cognitoUser) => {
		if (!cognitoUser?.sub) return;

		set({ loading: true });
		try {
			// Extract groups from Cognito token
			const groups = cognitoUser.signInUserSession?.accessToken?.payload?.["cognito:groups"] || [];
			const isAdmin = groups.some((group) => typeof group === "string" && group.toLowerCase() === "admin");

			// Fetch or create user in the database
			let userData = await client.models.User.get({ id: cognitoUser.sub });

			if (!userData) {
				// Create new user if doesn't exist
				userData = await client.models.User.create({
					cognitoId: cognitoUser.sub,
					email: cognitoUser.email,
					name: cognitoUser.name || cognitoUser.username,
					status: "ACTIVE",
					lastLogin: new Date().toISOString(),
				});
			} else {
				// Update last login
				userData = await client.models.User.update({
					id: userData.id,
					lastLogin: new Date().toISOString(),
				});
			}

			// Fetch user's company associations with roles
			const userCompanyRoles = await client.models.UserCompanyRole.list({
				filter: { userId: { eq: userData.id } },
				include: {
					company: true,
					role: true,
				},
			});

			// Process company and role data
			const companies = userCompanyRoles.data.map((ucr) => ({
				...ucr.company,
				roleId: ucr.roleId,
				userCompanyRoleId: ucr.id,
				status: ucr.status,
			}));

			set({
				currentUser: {
					...userData,
					groups,
					companies,
				},
				isAuthenticated: true,
				isAdmin,
				groups,
				userCompanies: companies,
				userRoles: userCompanyRoles.data.map((ucr) => ucr.role),
				loading: false,
				error: null,
			});
		} catch (err) {
			console.error("Error initializing current user:", err);
			set({
				error: "Failed to initialize user data",
				loading: false,
			});
		}
	},

	updateCurrentUser: async (updates) => {
		set({ loading: true });
		try {
			const updatedUser = await client.models.User.update({
				id: updates.id,
				...updates,
			});

			set((state) => ({
				currentUser: {
					...state.currentUser,
					...updatedUser,
				},
				loading: false,
				error: null,
			}));
		} catch (err) {
			console.error("Error updating current user:", err);
			set({
				error: "Failed to update user data",
				loading: false,
			});
		}
	},

	reset: () => {
		set({
			currentUser: null,
			isAuthenticated: false,
			isAdmin: false,
			groups: [],
			userCompanies: [],
			userRoles: [],
			loading: false,
			error: null,
		});
	},
}));

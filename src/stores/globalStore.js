import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateClient } from "aws-amplify/data";
import { getAuthSession, extractUserGroups } from "../utils/auth/sessionUtils";

const client = generateClient({
	authMode: "userPool",
});

export const useGlobalStore = create(
	persist(
		(set, get) => ({
			// Active entities
			activeUserId: null,
			activeUserData: null,
			activeCompanyId: null,
			activeTeamId: null,
			activeCompanyData: null,

			// User methods
			setActiveUser: async (userProfile) => {
				if (!userProfile?.id) {
					console.error("Invalid user profile:", userProfile);
					return;
				}

				try {
					// Fetch auth session and user data in parallel
					const [session, userResponse] = await Promise.all([
						getAuthSession(),
						client.models.User.list({
							filter: { cognitoId: { eq: userProfile.id } },
						}),
					]);
					// set user data from the User table
					const userData = userResponse?.data[0];
					if (!userData) {
						throw new Error("User data not found");
					}

					// Set groups and permissions
					const authData = extractUserGroups(session);

					//set user variables
					set({
						activeUserId: userData.id,
						activeUserData: {
							...userProfile,
							userId: userData.id,
							name: userData.name,
							email: userData.email,
							phone: userData.phone,
							avatar: userData.avatar,
							lastLogin: userData.lastLogin,

							...authData,
							isAuthenticated: true,
						},
					});

					return userData;
				} catch (err) {
					console.error("Error setting active user:", err);
					throw err;
				}
			},

			getActiveUser: () => get().activeUserId,

			getActiveUserData: () => get().activeUserData,

			// Company methods
			setActiveCompany: async (companyId) => {
				try {
					const response = await client.models.Company.get({ id: companyId });
					const companyData = response?.data;

					if (!companyData) {
						throw new Error("Company data not found");
					}

					set({
						activeCompanyId: companyId,
						activeCompanyData: companyData,
						activeTeamId: null, // Reset team selection
					});

					return companyData;
				} catch (err) {
					console.error("Error setting active company:", err);
					throw err;
				}
			},

			getActiveCompany: () => get().activeCompanyData,

			// Team methods
			setActiveTeam: (teamId) => {
				set({ activeTeamId: teamId });
				window.dispatchEvent(new CustomEvent("teamChanged", { detail: { teamId } }));
			},

			getActiveTeam: () => get().activeTeamId,

			// Reset all state
			reset: () => {
				set({
					activeUserId: null,
					activeUserData: null,
					activeCompanyId: null,
					activeTeamId: null,
					activeCompanyData: null,
				});
			},
		}),
		{
			name: "global-store",
			version: 1,
			partialize: (state) => ({
				activeUserId: state.activeUserId,
				activeUserData: state.activeUserData,
				activeCompanyId: state.activeCompanyId,
				activeTeamId: state.activeTeamId,
				activeCompanyData: state.activeCompanyData,
			}),
		}
	)
);

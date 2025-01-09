import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient({
	authMode: "userPool",
});

export const useTeamStore = create((set, get) => ({
	teams: [],
	loading: false,
	error: null,
	subscription: null,

	fetchTeams: async (companyId) => {
		if (!companyId) {
			set({
				teams: [],
				loading: false,
				error: "Company ID is required",
			});
			return;
		}

		// Cleanup existing subscription
		const currentSub = get().subscription;
		if (currentSub) {
			currentSub.unsubscribe();
		}

		set({ loading: true });
		try {
			// Set up subscription for real-time updates
			const subscription = client.models.Team.observeQuery({
				filter: { companyId: { eq: companyId } },
			}).subscribe({
				next: async ({ items }) => {
					// Fetch members for each team
					const teamsWithMembers = await Promise.all(
						items.map(async (team) => {
							const membersResponse = await client.models.TeamMember.list({
								filter: { teamId: { eq: team.id } },
							});

							const membersWithContacts = await Promise.all(
								(membersResponse?.data || []).map(async (member) => {
									const contactResponse = await client.models.Contact.get({
										id: member.contactId,
									});
									return {
										...member,
										contact: contactResponse?.data || null,
									};
								})
							);

							return {
								...team,
								members: membersWithContacts,
							};
						})
					);

					set({
						teams: teamsWithMembers,
						loading: false,
						error: null,
					});
				},
				error: (err) => {
					console.error("Error in team subscription:", err);
					set({
						error: err.message || "Failed to fetch teams",
						loading: false,
					});
				},
			});

			set({ subscription });
		} catch (err) {
			console.error("Error fetching teams:", err);
			set({
				error: err.message || "Failed to fetch teams",
				loading: false,
			});
		}
	},

	addTeam: async (teamData) => {
		set({ loading: true, error: null });
		try {
			const response = await client.models.Team.create(teamData);
			set({ loading: false });
			return response.data;
		} catch (err) {
			console.error("Error creating team:", err);
			set({
				error: err.message || "Failed to create team",
				loading: false,
			});
			throw err;
		}
	},

	updateTeam: async (id, updates) => {
		set({ loading: true, error: null });
		try {
			const response = await client.models.Team.update({
				id,
				...updates,
			});
			set({ loading: false });
			return response.data;
		} catch (err) {
			console.error("Error updating team:", err);
			set({
				error: err.message || "Failed to update team",
				loading: false,
			});
			throw err;
		}
	},

	removeTeam: async (id) => {
		set({ loading: true, error: null });
		try {
			await client.models.Team.delete({ id });
			set({ loading: false });
		} catch (err) {
			console.error("Error removing team:", err);
			set({
				error: err.message || "Failed to remove team",
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
			teams: [],
			loading: false,
			error: null,
			subscription: null,
		});
	},
}));

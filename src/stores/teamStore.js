import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient();

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
			// First fetch teams
			const teamsResponse = await client.models.Team.list({
				filter: { companyId: { eq: companyId } },
			});

			if (!teamsResponse?.data) {
				throw new Error("Failed to fetch teams");
			}

			// Then fetch members for each team
			const teamsWithMembers = await Promise.all(
				teamsResponse.data.map(async (team) => {
					const membersResponse = await client.models.TeamMember.list({
						filter: { teamId: { eq: team.id } },
					});

					// Fetch contact details for each member
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

			// Set up subscription for real-time updates
			const subscription = client.models.Team.observeQuery({
				filter: { companyId: { eq: companyId } },
			}).subscribe({
				next: async ({ items }) => {
					// When teams update, fetch fresh member data
					const updatedTeamsWithMembers = await Promise.all(
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
						teams: updatedTeamsWithMembers,
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

			set({
				teams: teamsWithMembers,
				loading: false,
				error: null,
				subscription,
			});
		} catch (err) {
			console.error("Error fetching teams:", err);
			set({
				error: err.message || "Failed to fetch teams",
				loading: false,
				teams: [],
			});
		}
	},

	addTeam: async (teamData) => {
		if (!teamData.companyId) {
			throw new Error("Company ID is required");
		}

		if (!teamData.name?.trim()) {
			throw new Error("Team name is required");
		}

		set({ loading: true });
		try {
			const response = await client.models.Team.create({
				name: teamData.name.trim(),
				description: teamData.description?.trim() || null,
				companyId: teamData.companyId,
			});

			if (!response?.data) {
				throw new Error("Failed to create team");
			}

			// Let subscription handle state update
			set({ loading: false, error: null });
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

	updateTeam: async (id, teamData) => {
		if (!id) {
			throw new Error("Team ID is required");
		}

		set({ loading: true });
		try {
			const response = await client.models.Team.update({
				id,
				name: teamData.name?.trim(),
				description: teamData.description?.trim() || null,
			});

			if (!response?.data) {
				throw new Error("Failed to update team");
			}

			// Let subscription handle state update
			set({ loading: false, error: null });
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
		if (!id) {
			throw new Error("Team ID is required");
		}

		set({ loading: true });
		try {
			// First remove all team members
			const teamMembers = await client.models.TeamMember.list({
				filter: { teamId: { eq: id } },
			});

			if (teamMembers?.data) {
				for (const member of teamMembers.data) {
					await client.models.TeamMember.delete({ id: member.id });
				}
			}

			// Then remove the team
			await client.models.Team.delete({ id });

			// Let subscription handle state update
			set({ loading: false, error: null });
		} catch (err) {
			console.error("Error removing team:", err);
			set({
				error: err.message || "Failed to delete team",
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

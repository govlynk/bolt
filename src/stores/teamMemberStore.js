import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient();

export const useTeamMemberStore = create((set) => ({
	teamMembers: [],
	loading: false,
	error: null,

	addTeamMember: async ({ teamId, contactId, role }) => {
		console.log("TeamMemberStore: Adding member with data:", { teamId, contactId, role });
		if (!teamId || !contactId || !role) {
			console.error("TeamMemberStore: addTeamMember called with incomplete data");
			throw new Error("Team ID, Contact ID, and Role are required");
		}

		set({ loading: true });
		try {
			const response = await client.models.TeamMember.create({
				teamId,
				contactId,
				role,
			});

			if (!response?.data) {
				throw new Error("Failed to add team member");
			}

			console.log("TeamMemberStore: Successfully added team member:", response.data);
			set((state) => ({
				teamMembers: [...state.teamMembers, response.data],
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("TeamMemberStore: Error adding team member:", err);
			set({
				error: err.message || "Failed to add team member",
				loading: false,
			});
			throw err;
		}
	},

	removeTeamMember: async (id) => {
		if (!id) {
			throw new Error("Team member ID is required");
		}

		set({ loading: true });
		try {
			await client.models.TeamMember.delete({ id });

			set((state) => ({
				teamMembers: state.teamMembers.filter((member) => member.id !== id),
				loading: false,
				error: null,
			}));
		} catch (err) {
			console.error("Error removing team member:", err);
			set({
				error: err.message || "Failed to remove team member",
				loading: false,
			});
			throw err;
		}
	},
}));

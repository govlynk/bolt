import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { TeamList } from "../components/team/TeamList";
import { useTeamStore } from "../stores/teamStore";
import { useUserCompanyStore } from "../stores/userCompanyStore";

export default function TeamScreen() {
	const { fetchTeams } = useTeamStore();
	const { getActiveCompany } = useUserCompanyStore();
	const activeCompany = getActiveCompany();

	useEffect(() => {
		if (activeCompany?.id) {
			fetchTeams(activeCompany.id);
		}
	}, [activeCompany?.id, fetchTeams]);

	return (
		<Box sx={{ p: 3 }}>
			<TeamList />
		</Box>
	);
}

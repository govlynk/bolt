import React from "react";
import { FormControl, Select, MenuItem, Box } from "@mui/material";
import { Users } from "lucide-react";
import { useTeamTodoStore } from "../../stores/teamTodoStore";
import { useTeamStore } from "../../stores/teamStore";
import { useUserCompanyStore } from "../../stores/userCompanyStore";

export function TeamSelector() {
	const { teams, fetchTeams } = useTeamStore();
	const { selectedTeamId, setSelectedTeamId } = useTeamTodoStore();
	const { getActiveCompany } = useUserCompanyStore();
	const activeCompany = getActiveCompany();

	React.useEffect(() => {
		if (activeCompany?.id) {
			fetchTeams(activeCompany.id);
		}
	}, [activeCompany?.id, fetchTeams]);

	if (!teams?.length || !activeCompany) {
		return null;
	}

	return (
		<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
			<Users size={20} />
			<FormControl size='small' sx={{ minWidth: 200 }}>
				<Select
					value={selectedTeamId || "all"}
					onChange={(e) => setSelectedTeamId(e.target.value)}
					displayEmpty
					sx={{
						bgcolor: "background.paper",
						"& .MuiSelect-select": {
							py: 1,
						},
					}}
				>
					<MenuItem value='all'>All Teams</MenuItem>
					{teams.map((team) => (
						<MenuItem key={team.id} value={team.id}>
							{team.name}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Box>
	);
}

import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Plus } from "lucide-react";
import { useUserCompanyStore } from "../../stores/userCompanyStore";

export function TodoHeader({ onAddClick }) {
	const { getActiveCompany } = useUserCompanyStore();
	const activeCompany = getActiveCompany();

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				mb: 4,
			}}
		>
			<Typography variant='h4' sx={{ fontWeight: "bold" }}>
				Tasks
			</Typography>
			<Button
				variant='contained'
				startIcon={<Plus size={20} />}
				onClick={onAddClick}
				sx={{ px: 3 }}
				disabled={!activeCompany}
			>
				Add Task
			</Button>
		</Box>
	);
}

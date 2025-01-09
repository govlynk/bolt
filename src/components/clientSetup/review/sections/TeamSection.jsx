import React from "react";
import { Box, Paper, Typography, Chip } from "@mui/material";
import { Users } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { DataField } from "./DataField";

export function TeamSection({ team }) {
	if (!team) return null;

	return (
		<Paper sx={{ p: 3 }}>
			<SectionHeader icon={Users} title='Team Information' />

			<Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr" }}>
				<DataField label='Team Name' value={team.name} />
				<DataField label='Description' value={team.description} />
			</Box>
		</Paper>
	);
}

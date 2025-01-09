import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Alert } from "@mui/material";
import { KanbanBoard } from "../components/pipeline/KanbanBoard";
import { useOpportunityStore } from "../stores/opportunityStore";
import { useUserCompanyStore } from "../stores/userCompanyStore";
import { useQueryClient } from "@tanstack/react-query";

export default function PipelineScreen() {
	const [loading, setLoading] = useState(false);
	const queryClient = useQueryClient();
	const { savedOpportunities, moveOpportunity, fetchSavedOpportunities } = useOpportunityStore();
	const { getActiveCompany } = useUserCompanyStore();
	const activeCompany = getActiveCompany();

	useEffect(() => {
		if (activeCompany?.id) {
			fetchSavedOpportunities();
		}
	}, [activeCompany?.id]);

	const handleOpportunityMove = async (opportunityId, newStatus) => {
		setLoading(true);
		try {
			// Optimistically update UI
			const opportunity = savedOpportunities.find((opp) => opp.id === opportunityId);
			const previousStatus = opportunity?.status;

			queryClient.setQueryData(["savedOpportunities"], (old) =>
				old?.map((opp) => (opp.id === opportunityId ? { ...opp, status: newStatus } : opp))
			);

			// Perform actual update
			await moveOpportunity(opportunityId, newStatus);
		} catch (err) {
			// Revert on error
			queryClient.invalidateQueries(["savedOpportunities"]);
			console.error("Error moving opportunity:", err);
		} finally {
			setLoading(false);
		}
	};

	if (!activeCompany) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='warning'>Please select a company to view pipeline</Alert>
			</Box>
		);
	}

	return (
		<Container maxWidth={false} disableGutters>
			<Box sx={{ p: 4, width: "100%" }}>
				<Typography variant='h4' sx={{ mb: 4, fontWeight: "bold" }}>
					Pipeline
				</Typography>
				<KanbanBoard
					opportunities={savedOpportunities}
					loading={loading}
					onOpportunityMove={handleOpportunityMove}
				/>
			</Box>
		</Container>
	);
}

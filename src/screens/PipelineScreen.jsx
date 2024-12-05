import React, { useEffect } from "react";
import { Box, Typography, Alert } from "@mui/material";
import { OpportunityBoard } from "../components/opportunities/OpportunityBoard";
import { useOpportunityStore } from "../stores/opportunityStore";
import { useUserCompanyStore } from "../stores/userCompanyStore";

export default function PipelineScreen() {
	const { fetchOpportunities } = useOpportunityStore();
	const { getActiveCompany } = useUserCompanyStore();
	const activeCompany = getActiveCompany();

	useEffect(() => {
		if (activeCompany?.id) {
			fetchOpportunities(activeCompany.id);
		}
	}, [activeCompany?.id, fetchOpportunities]);

	if (!activeCompany) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='warning'>Please select a company to view the opportunity pipeline</Alert>
			</Box>
		);
	}

	const handleOpportunityMove = (opportunityId, newStatus) => {
		console.log(`Moved opportunity ${opportunityId} to ${newStatus}`);
	};

	const handleOpportunityUpdate = (opportunity) => {
		console.log("Updated opportunity:", opportunity);
	};

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant='h4' sx={{ mb: 4, fontWeight: "bold" }}>
				Opportunity Pipeline
			</Typography>

			<OpportunityBoard onOpportunityMove={handleOpportunityMove} onOpportunityUpdate={handleOpportunityUpdate} />
		</Box>
	);
}

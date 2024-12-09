import React from "react";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";
import { useOpportunityStore } from "../../stores/opportunityStore";
import { useUserCompanyStore } from "../../stores/userCompanyStore";

export function OpportunitySearch() {
	const { fetchOpportunities, loading, error, lastRetrievedDate } = useOpportunityStore();
	const { getActiveCompany } = useUserCompanyStore();
	const activeCompany = getActiveCompany();

	React.useEffect(() => {
		if (activeCompany?.naicsCode) {
			const date = new Date();
			const endDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
			const startDate = lastRetrievedDate
				? new Date(lastRetrievedDate).toLocaleDateString()
				: `${date.getMonth() - 2}/01/${date.getFullYear()}`;

			const searchParams = {
				naics: activeCompany.naicsCode.join(","),
				postedFrom: startDate,
				postedTo: endDate,
				limit: "100",
			};

			fetchOpportunities(searchParams).catch((err) => {
				console.error("Error in opportunity search:", err);
			});
		}
	}, [activeCompany?.naicsCode, fetchOpportunities]);

	if (!activeCompany?.naicsCode?.length) {
		return (
			<Alert severity='info' sx={{ mt: 2 }}>
				No NAICS codes found for this company. NAICS codes are required to search for opportunities.
			</Alert>
		);
	}

	if (error) {
		return (
			<Alert severity='error' sx={{ mt: 2 }}>
				{error}
			</Alert>
		);
	}

	return (
		<Box sx={{ mb: 3 }}>
			{lastRetrievedDate && (
				<Typography variant='caption' color='text.secondary'>
					Last updated: {new Date(lastRetrievedDate).toLocaleString()}
				</Typography>
			)}
		</Box>
	);
}

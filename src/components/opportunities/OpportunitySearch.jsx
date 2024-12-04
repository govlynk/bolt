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
			const NAICS = activeCompany?.naicsCode;
			const ncode = Array.isArray(NAICS) && NAICS.length > 1 ? NAICS.join(",") : NAICS;
			const date = new Date();
			const endDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
			const startDate = lastRetrievedDate
				? new Date(lastRetrievedDate).toLocaleDateString()
				: `${date.getMonth() - 2}/01/${date.getFullYear()}`;
			const limit = 10;

			const searchParams = {
				ncode: `naics=${ncode}`,
				postedFrom: `postedFrom=${startDate}`,
				postedTo: `postedTo=${endDate}`,
				ptype: `ptype=${["p", "o", "k"]}`,
				limit: `limit=${limit}`,
			};

			fetchOpportunities(searchParams);
		}
	}, [activeCompany?.naicsCode, fetchOpportunities]);

	if (!activeCompany) {
		return (
			<Alert severity='warning' sx={{ mt: 2 }}>
				Please select a company to search for opportunities
			</Alert>
		);
	}

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
				<CircularProgress />
			</Box>
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

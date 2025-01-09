import React from "react";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";
import { useOpportunityQuery } from "../../utils/opportunityApi";
import { useGlobalStore } from "../../stores/globalStore";
import { useUserCompanyStore } from "../../stores/userCompanyStore";
import { useOpportunityStore } from "../../stores/opportunityStore";

export function OpportunitySearch() {
	const { activeCompanyId } = useGlobalStore();
	const { userCompanies } = useUserCompanyStore();
	const { setOpportunities, fetchOpportunities } = useOpportunityStore();
	const activeCompany = userCompanies.find((c) => c.id === activeCompanyId);

	// Construct search parameters
	const searchParams = React.useMemo(() => {
		if (!activeCompany?.naicsCode?.length) {
			return null;
		}

		const date = new Date();
		const endDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
		const startDate = `${date.getMonth() - 2}/01/${date.getFullYear()}`;

		return {
			naicsCode: activeCompany.naicsCode.join(","),
			postedFrom: startDate,
			postedTo: endDate,
			limit: "10",
		};
	}, [activeCompany]);

	const { data, isLoading, error, dataUpdatedAt } = useOpportunityQuery(searchParams);

	React.useEffect(() => {
		if (data) {
			setOpportunities(data);
		}
	}, [data, setOpportunities]);

	if (!activeCompanyId) {
		return (
			<Alert severity='warning' sx={{ mt: 2 }}>
				Please select a company to view opportunities
			</Alert>
		);
	}

	if (!activeCompany?.naicsCode?.length) {
		return (
			<Alert severity='info' sx={{ mt: 2 }}>
				No NAICS codes found for this company. NAICS codes are required to search for opportunities.
			</Alert>
		);
	}

	if (isLoading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
				<CircularProgress size={24} />
			</Box>
		);
	}

	if (error) {
		return (
			<Alert severity='error' sx={{ mt: 2 }}>
				{error.message || "Failed to fetch opportunities"}
			</Alert>
		);
	}

	return (
		<Box sx={{ mb: 3 }}>
			{dataUpdatedAt && (
				<Typography variant='caption' color='text.secondary'>
					Last updated: {new Date(dataUpdatedAt).toLocaleString()}
				</Typography>
			)}
		</Box>
	);
}

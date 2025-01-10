import React from "react";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";
import { useOpportunityQuery } from "../../utils/opportunityApi";
import { useGlobalStore } from "../../stores/globalStore";
import { useUserCompanyStore } from "../../stores/userCompanyStore";
import { useOpportunityStore } from "../../stores/opportunityStore";

export function OpportunitySearch() {
	const { activeCompanyId } = useGlobalStore();
	const { userCompanies } = useUserCompanyStore();
	const { setOpportunities } = useOpportunityStore();
	const activeCompany = userCompanies.find((c) => c.id === activeCompanyId);

	// Construct search parameters
	const searchParams = React.useMemo(() => {
		if (!activeCompany?.naicsCode?.length) {
			return null;
		}

		const endDate = new Date();
		const startDate = new Date();
		startDate.setMonth(endDate.getMonth() - 2);
		startDate.setDate(1);

		// Handle year rollover if needed
		if (startDate.getMonth() > endDate.getMonth()) {
			startDate.setFullYear(endDate.getFullYear() - 1);
		}

		const formattedEndDate = `${endDate.getMonth() + 1}/${endDate.getDate()}/${endDate.getFullYear()}`;
		const formattedStartDate = `${startDate.getMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear()}`;

		return {
			naicsCode: activeCompany.naicsCode.join(","),
			postedFrom: formattedStartDate,
			postedTo: formattedEndDate,
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

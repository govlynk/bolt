import React from "react";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";
import { useOpportunityStore } from "../../stores/opportunityStore";
import { useUserCompanyStore } from "../../stores/userCompanyStore";

export function OpportunitySearch() {
	const { fetchOpportunities, loading, error, lastRetrievedDate } = useOpportunityStore();
	const { getActiveCompany } = useUserCompanyStore();
	const activeCompany = getActiveCompany();
	const [localError, setLocalError] = React.useState(null);
	const [lastFetchTime, setLastFetchTime] = React.useState(null);

	React.useEffect(() => {
		const fetchData = async () => {
			// Prevent fetching if we've fetched in the last 5 minutes
			const now = Date.now();
			if (lastFetchTime && now - lastFetchTime < 5 * 60 * 1000) {
				return;
			}

			if (!activeCompany?.naicsCode?.length) {
				return;
			}

			try {
				const NAICS = activeCompany.naicsCode;
				const ncode = Array.isArray(NAICS) && NAICS.length > 1 ? NAICS.join(",") : NAICS;
				const date = new Date();
				const endDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
				const startDate = lastRetrievedDate
					? new Date(lastRetrievedDate).toLocaleDateString()
					: `${date.getMonth() - 2}/01/${date.getFullYear()}`;

				const searchParams = {
					ncode: `naics=${ncode}`,
					postedFrom: `postedFrom=${startDate}`,
					postedTo: `postedTo=${endDate}`,
					ptype: `ptype=${["p", "o", "k"]}`,
					limit: `limit=10`,
				};

				await fetchOpportunities(searchParams);
				setLastFetchTime(now);
				setLocalError(null);
			} catch (err) {
				console.error("Error fetching opportunities:", err);
				setLocalError(err.message || "Failed to fetch opportunities");
			}
		};

		fetchData();
	}, [activeCompany?.id]); // Only depend on company ID change

	if (!activeCompany?.naicsCode?.length) {
		return (
			<Alert severity='info' sx={{ mt: 2 }}>
				No NAICS codes found for this company. NAICS codes are required to search for opportunities.
			</Alert>
		);
	}

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
				<CircularProgress size={24} />
			</Box>
		);
	}

	if (error || localError) {
		return (
			<Alert severity='error' sx={{ mt: 2 }}>
				{error || localError}
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

import React, { useState, useEffect } from "react";
import { Box, Typography, Alert, Button, CircularProgress } from "@mui/material";
import { generateClient } from "aws-amplify/data";
import { useGlobalStore } from "../stores/globalStore";
import CompanyHeader from "../components/company/CompanyHeader";
import CompanyDetailsGrid from "../components/company/CompanyDetailsGrid";
import { refreshSamData } from "../utils/sam/samDataRefresh";
import { RefreshCw } from "lucide-react";

const client = generateClient();

export default function SAMRegistrationScreen() {
	const [company, setCompany] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { activeCompanyId } = useGlobalStore.getState();

	useEffect(() => {
		async function fetchCompany() {
			if (!activeCompanyId) {
				setError("No active company selected");
				return;
			}

			setLoading(true);
			try {
				const response = await client.models.Company.get({ id: activeCompanyId });
				setCompany(response.data);
				setError(null);
			} catch (err) {
				console.error("Error fetching company:", err);
				setError(err.message || "Failed to fetch company");
			} finally {
				setLoading(false);
			}
		}

		fetchCompany();
	}, [activeCompanyId]);

	const handleRefreshData = async () => {
		if (!company) return;

		setLoading(true);
		setError(null);

		try {
			const updatedCompany = await refreshSamData(company);
			console.log("Updated company:", updatedCompany);
			setCompany(updatedCompany);
		} catch (err) {
			console.error("Error refreshing SAM data:", err);
			setError(err.message || "Failed to refresh SAM data");
		} finally {
			setLoading(false);
		}
	};

	if (!activeCompanyId) {
		return (
			<Box sx={{ p: 3 }}>
				<Typography color='error'>No active company selected</Typography>
			</Box>
		);
	}

	if (loading && !company) {
		return (
			<Box sx={{ p: 3 }}>
				<Typography>Loading...</Typography>
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ p: 3 }}>
				<Typography color='error'>{error}</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ p: 3 }}>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
				<Typography variant='h4' sx={{ fontWeight: "bold" }}>
					Company Registration Details
				</Typography>
				<Button
					variant='contained'
					color='primary'
					onClick={handleRefreshData}
					disabled={!company?.uei}
					startIcon={loading ? <CircularProgress size={20} /> : <RefreshCw size={20} />}
					sx={{ ml: 2 }}
				>
					{loading ? "Refreshing..." : "Refresh SAM Data"}
				</Button>
			</Box>

			{error && (
				<Alert severity='error' sx={{ mb: 3 }}>
					{error}
				</Alert>
			)}

			{company && (
				<>
					<CompanyHeader company={company} />
					<CompanyDetailsGrid company={company} />
				</>
			)}
		</Box>
	);
}

import React from "react";
import { Box, Typography, Alert } from "@mui/material";
import { useUserCompanyStore } from "../stores/userCompanyStore";
import CompanyHeader from "../components/company/CompanyHeader";
import CompanyDetailsGrid from "../components/company/CompanyDetailsGrid";

export default function SAMRegistrationScreen() {
	const { getActiveCompany } = useUserCompanyStore();
	const company = getActiveCompany();

	if (!company) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='warning'>Please select a company to view registration details.</Alert>
			</Box>
		);
	}

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant='h4' sx={{ mb: 4, fontWeight: "bold" }}>
				Company Registration Details
			</Typography>

			<CompanyHeader company={company} />
			<CompanyDetailsGrid company={company} />
		</Box>
	);
}

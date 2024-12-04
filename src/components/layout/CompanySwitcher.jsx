import React, { useEffect } from "react";
import { Box, Select, MenuItem, FormControl, Typography, Chip, CircularProgress } from "@mui/material";
import { Building2 } from "lucide-react";
import { useUserCompanyStore } from "../../stores/userCompanyStore";
import { useAuthStore } from "../../stores/authStore";

export function CompanySwitcher() {
	const { userCompanies, activeCompanyId, setActiveCompany, fetchUserCompanies, loading } = useUserCompanyStore();
	const { user } = useAuthStore();

	// Fetch companies when component mounts or user changes
	useEffect(() => {
		if (user?.id) {
			fetchUserCompanies();
		}
	}, [user?.id, fetchUserCompanies]);

	// Set initial active company if none is selected
	useEffect(() => {
		if (userCompanies.length > 0 && !activeCompanyId) {
			setActiveCompany(userCompanies[0].id);
		}
	}, [userCompanies, activeCompanyId, setActiveCompany]);

	const handleCompanyChange = (event) => {
		const newCompanyId = event.target.value;
		setActiveCompany(newCompanyId);
	};

	if (loading) {
		return (
			<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
				<CircularProgress size={20} />
			</Box>
		);
	}

	if (!userCompanies?.length) {
		return null;
	}

	const renderCompanyDisplay = (company) => {
		if (!company) return <Typography color='text.secondary'>Select a company</Typography>;

		return (
			<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
				<Typography variant='body2' noWrap>
					{company.legalBusinessName}
				</Typography>
				<Chip label={company.roleId} size='small' sx={{ ml: "auto" }} />
			</Box>
		);
	};

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 2,
				minWidth: 300,
				maxWidth: 400,
			}}
		>
			<Building2 size={20} />
			<FormControl fullWidth size='small'>
				<Select
					value={activeCompanyId || ""}
					onChange={handleCompanyChange}
					displayEmpty
					renderValue={(selected) => {
						const company = userCompanies.find((c) => c.id === selected);
						return renderCompanyDisplay(company || userCompanies[0]);
					}}
					sx={{
						"& .MuiSelect-select": {
							display: "flex",
							alignItems: "center",
							gap: 1,
							py: 1,
						},
					}}
				>
					{userCompanies.map((company) => (
						<MenuItem
							key={company.id}
							value={company.id}
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								gap: 2,
							}}
						>
							<Typography variant='body2' noWrap>
								{company.legalBusinessName}
							</Typography>
							<Chip label={company.roleId} size='small' sx={{ ml: "auto" }} />
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Box>
	);
}

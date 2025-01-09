import React, { useEffect } from "react";
import { Box, Select, MenuItem, FormControl, Typography, Chip, CircularProgress, Alert } from "@mui/material";
import { Building2 } from "lucide-react";
import { useUserCompanyStore } from "../../stores/userCompanyStore";
import { useGlobalStore } from "../../stores/globalStore";

export function CompanySelector() {
	const { userCompanies, loading } = useUserCompanyStore();
	const { activeCompanyId, setActiveCompany } = useGlobalStore();

	// Select first company if none selected
	useEffect(() => {
		if (!loading && userCompanies.length > 0 && !activeCompanyId) {
			setActiveCompany(userCompanies[0].id);
		}
	}, [loading, userCompanies, activeCompanyId, setActiveCompany]);

	const handleCompanyChange = async (event) => {
		try {
			await setActiveCompany(event.target.value);
		} catch (err) {
			console.error("Error changing company:", err);
		}
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

	return (
		<Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 300, maxWidth: 400 }}>
			<Building2 size={20} />
			<FormControl fullWidth size='small'>
				<Select
					value={activeCompanyId || ""}
					onChange={handleCompanyChange}
					MenuProps={{
						PaperProps: {
							sx: {
								bgcolor: "grey.900",
								borderRadius: 1,
								boxShadow: (theme) => theme.shadows[4],
								"& .MuiMenuItem-root": {
									color: "common.white",
									"&:hover": {
										bgcolor: "grey.800",
									},
									"&.Mui-selected": {
										bgcolor: "grey.800",
										"&:hover": {
											bgcolor: "grey.700",
										},
									},
								},
							},
						},
					}}
					sx={{
						color: "common.white",
						".MuiOutlinedInput-notchedOutline": {
							borderColor: "grey.700",
						},
						"&:hover .MuiOutlinedInput-notchedOutline": {
							borderColor: "grey.600",
						},
						"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
							borderColor: "primary.main",
						},
						".MuiSvgIcon-root": {
							color: "common.white",
						},
					}}
				>
					{userCompanies.map((company) => (
						<MenuItem key={company.id} value={company.id}>
							<Box
								sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}
							>
								<Typography variant='body2' noWrap>
									{company.legalBusinessName}
								</Typography>
								{company.uei && (
									<Chip
										label={`UEI: ${company.uei}`}
										size='small'
										variant='outlined'
										sx={{ ml: 1, color: "common.white" }}
									/>
								)}
							</Box>
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Box>
	);
}

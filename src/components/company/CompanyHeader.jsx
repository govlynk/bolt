import React from "react";
import { Box, Paper, Typography, Chip, Divider, Grid } from "@mui/material";
import { Building2, Calendar, FileText } from "lucide-react";
import { formatDate } from "../../utils/formatters";

export default function CompanyHeader({ company }) {
	const registrationStatus = company.registrationStatus.toUpperCase() || "ACTIVE";
	const isActive = registrationStatus === "ACTIVE";

	return (
		<Paper sx={{ p: 3, mb: 3 }}>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
				<Box>
					<Typography variant='h5' gutterBottom>
						{company.legalBusinessName}
					</Typography>
					{company.dbaName && (
						<Typography variant='body2' color='text.secondary'>
							Doing Business As: {company.dbaName}
						</Typography>
					)}
				</Box>
				<Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
					<Chip
						icon={<Building2 size={16} />}
						label={registrationStatus}
						color={isActive ? "success" : "error"}
						variant='outlined'
					/>
				</Box>
			</Box>

			<Divider sx={{ my: 2 }} />

			<Grid container spacing={3}>
				<Grid item xs={12} sm={6} md={4}>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
						<Calendar size={16} />
						<Typography variant='subtitle2' color='text.secondary'>
							Registration Dates
						</Typography>
					</Box>
					<Box sx={{ pl: 3 }}>
						<Typography variant='body2'>
							<strong>Registered:</strong> {formatDate(company.registrationDate)}
						</Typography>
						<Typography variant='body2'>
							<strong>Expires:</strong> {formatDate(company.registrationExpirationDate)}
						</Typography>
						<Typography variant='body2'>
							<strong>Last Updated:</strong> {formatDate(company.lastUpdateDate)}
						</Typography>
					</Box>
				</Grid>

				<Grid item xs={12} sm={6} md={4}>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
						<FileText size={16} />
						<Typography variant='subtitle2' color='text.secondary'>
							Identification
						</Typography>
					</Box>
					<Box sx={{ pl: 3 }}>
						<Typography variant='body2'>
							<strong>UEI:</strong> {company.uei}
						</Typography>
						<Typography variant='body2'>
							<strong>CAGE Code:</strong> {company.cageCode || "N/A"}
						</Typography>
						<Typography variant='body2'>
							<strong>EIN:</strong> {company.ein || "N/A"}
						</Typography>
					</Box>
				</Grid>

				{company.purposeOfRegistrationDesc && (
					<Grid item xs={12} sm={6} md={4}>
						<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
							<FileText size={16} />
							<Typography variant='subtitle2' color='text.secondary'>
								Registration Purpose
							</Typography>
						</Box>
						<Box sx={{ pl: 3 }}>
							<Typography variant='body2'>{company.purposeOfRegistrationDesc}</Typography>
						</Box>
					</Grid>
				)}
			</Grid>
		</Paper>
	);
}

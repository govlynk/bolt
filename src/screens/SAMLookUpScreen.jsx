import React, { useState } from "react";
import {
	Box,
	Paper,
	Typography,
	Grid,
	Divider,
	Chip,
	Card,
	CardContent,
	useTheme,
	Alert,
	TextField,
	Button,
	CircularProgress,
} from "@mui/material";
import { Building2, MapPin, Phone, Mail, Globe, Calendar, FileText, Award } from "lucide-react";
import { getEntity } from "../utils/samApi";
import { formatCompanyData } from "../utils/companyDataMapper";

const InfoSection = ({ title, icon: Icon, children }) => {
	const theme = useTheme();
	return (
		<Card
			elevation={0}
			sx={{
				height: "100%",
				bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.50",
				"&:hover": {
					bgcolor: theme.palette.mode === "dark" ? "grey.700" : "grey.100",
					transform: "translateY(-2px)",
				},
				transition: "all 0.3s ease",
			}}
		>
			<CardContent>
				<Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
					<Icon size={20} />
					<Typography variant='h6' component='h3'>
						{title}
					</Typography>
				</Box>
				{children}
			</CardContent>
		</Card>
	);
};

const DataField = ({ label, value }) => (
	<Box sx={{ mb: 1 }}>
		<Typography variant='caption' color='text.secondary' display='block'>
			{label}
		</Typography>
		<Typography variant='body2'>{value || "-"}</Typography>
	</Box>
);

export default function SAMLookupScreen() {
	const theme = useTheme();
	const [uei, setUei] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [companyData, setCompanyData] = useState(null);

	const handleSearch = async () => {
		if (!uei.trim()) {
			setError("Please enter a UEI");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const entityData = await getEntity(uei.trim());
			const formattedData = formatCompanyData(entityData);

			if (!formattedData) {
				throw new Error("No company data found for the provided UEI");
			}

			setCompanyData(formattedData);
		} catch (err) {
			console.error("Search error:", err);
			setError(err.message || "Failed to fetch company information");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant='h4' sx={{ mb: 4, fontWeight: "bold" }}>
				SAM Registration Details
			</Typography>

			<Paper sx={{ p: 3, mb: 4 }}>
				<Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
					<TextField
						fullWidth
						label='Enter UEI'
						value={uei}
						onChange={(e) => setUei(e.target.value)}
						placeholder='Enter 12-character UEI'
						disabled={loading}
					/>
					<Button variant='contained' onClick={handleSearch} disabled={loading} sx={{ minWidth: 120 }}>
						{loading ? <CircularProgress size={24} /> : "Search"}
					</Button>
				</Box>

				{error && (
					<Alert severity='error' sx={{ mt: 2 }}>
						{error}
					</Alert>
				)}
			</Paper>

			{companyData && (
				<Box sx={{ mb: 4 }}>
					<Paper sx={{ p: 3, mb: 4 }}>
						<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
							<Box>
								<Typography variant='h5' gutterBottom>
									{companyData.legalBusinessName}
								</Typography>
								{companyData.dbaName && (
									<Typography variant='body2' color='text.secondary'>
										DBA: {companyData.dbaName}
									</Typography>
								)}
							</Box>
							<Chip
								label={companyData.registrationExpirationDate ? "Active" : "Inactive"}
								color={companyData.registrationExpirationDate ? "success" : "error"}
							/>
						</Box>
						<Divider sx={{ mb: 3 }} />

						<Grid container spacing={3}>
							<Grid item xs={12} md={6}>
								<InfoSection title='Basic Information' icon={Building2}>
									<DataField label='UEI' value={companyData.uei} />
									<DataField label='CAGE Code' value={companyData.cageCode} />
									<DataField label='Registration Expiration' value={companyData.registrationExpirationDate} />
									<DataField label='Entity Type' value={companyData.entityTypeDesc} />
									<DataField label='Organization Structure' value={companyData.organizationStructureDesc} />
								</InfoSection>
							</Grid>

							<Grid item xs={12} md={6}>
								<InfoSection title='Contact Information' icon={Phone}>
									<DataField label='Email' value={companyData.companyEmail} />
									<DataField label='Phone' value={companyData.companyPhoneNumber} />
									<DataField label='Website' value={companyData.entityURL} />
								</InfoSection>
							</Grid>

							<Grid item xs={12} md={6}>
								<InfoSection title='Physical Address' icon={MapPin}>
									<DataField
										label='Address'
										value={`${companyData.shippingAddressStreetLine1}${
											companyData.shippingAddressStreetLine2
												? `, ${companyData.shippingAddressStreetLine2}`
												: ""
										}`}
									/>
									<DataField
										label='Location'
										value={`${companyData.shippingAddressCity}, ${companyData.shippingAddressStateCode} ${companyData.shippingAddressZipCode}`}
									/>
									<DataField label='Congressional District' value={companyData.congressionalDistrict} />
								</InfoSection>
							</Grid>

							<Grid item xs={12} md={6}>
								<InfoSection title='Business Information' icon={FileText}>
									<DataField label='Start Date' value={companyData.entityStartDate} />
									<DataField label='Fiscal Year End' value={companyData.fiscalYearEndCloseDate} />
									<DataField label='State of Incorporation' value={companyData.stateOfIncorporationCode} />
									<DataField label='Profit Structure' value={companyData.profitStructureDesc} />
								</InfoSection>
							</Grid>

							{companyData.naicsCode?.length > 0 && (
								<Grid item xs={12}>
									<InfoSection title='NAICS Codes' icon={Award}>
										<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
											{companyData.naicsCode.map((code, index) => (
												<Chip
													key={index}
													label={code}
													variant='outlined'
													color={code === companyData.primaryNaics ? "primary" : "default"}
												/>
											))}
										</Box>
									</InfoSection>
								</Grid>
							)}
						</Grid>
					</Paper>
				</Box>
			)}
		</Box>
	);
}

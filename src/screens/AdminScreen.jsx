import React, { useState, useEffect } from "react";
import {
	Box,
	Button,
	TextField,
	Typography,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Alert,
	CircularProgress,
	Chip,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import { Search, Building2, Edit, Trash2 } from "lucide-react";
import { generateClient } from "aws-amplify/data";
import { getEntity } from "../utils/samApi";
import { formatCompanyData } from "../utils/companyDataMapper";

const client = generateClient({
	authMode: "userPool",
});

export default function AdminScreen() {
	const [uei, setUei] = useState("");
	const [companies, setCompanies] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [searchResult, setSearchResult] = useState(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editCompany, setEditCompany] = useState(null);
	const [subscription, setSubscription] = useState(null);

	useEffect(() => {
		fetchCompanies();
		return () => {
			if (subscription) {
				subscription.unsubscribe();
			}
		};
	}, []);

	const fetchCompanies = async () => {
		setLoading(true);
		try {
			const sub = client.models.Company.observeQuery().subscribe({
				next: ({ items }) => {
					setCompanies(items);
					setLoading(false);
					setError(null);
				},
				error: (err) => {
					console.error("Error fetching companies:", err);
					setError("Failed to load companies");
					setLoading(false);
				},
			});
			setSubscription(sub);
		} catch (err) {
			console.error("Error setting up subscription:", err);
			setError("Failed to load companies");
			setLoading(false);
		}
	};

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
			setSearchResult(formattedData);
			setDialogOpen(true);
		} catch (err) {
			console.error("Search error:", err);
			setError(err.message || "Failed to fetch company information");
		} finally {
			setLoading(false);
		}
	};

	const handleAddCompany = async () => {
		if (!searchResult) return;

		setLoading(true);
		try {
			const companyData = {
				legalBusinessName: searchResult.legalBusinessName,
				dbaName: searchResult.dbaName || null,
				uei: searchResult.uei,
				cageCode: searchResult.cageCode || null,
				ein: searchResult.ein || null,
				companyEmail: searchResult.companyEmail || null,
				companyPhoneNumber: searchResult.companyPhoneNumber || null,
				companyWebsite: searchResult.entityURL || null,
				status: "ACTIVE",
				activationDate: searchResult.activationDate || null,
				billingAddressCity: searchResult.billingAddressCity || null,
				billingAddressCountryCode: searchResult.billingAddressCountryCode || null,
				billingAddressStateCode: searchResult.billingAddressStateCode || null,
				billingAddressStreetLine1: searchResult.billingAddressStreetLine1 || null,
				billingAddressStreetLine2: searchResult.billingAddressStreetLine2 || null,
				billingAddressZipCode: searchResult.billingAddressZipCode || null,
				companyStartDate: searchResult.companyStartDate || null,
				congressionalDistrict: searchResult.congressionalDistrict || null,
				coreCongressionalDistrict: searchResult.coreCongressionalDistrict || null,
				countryOfIncorporationCode: searchResult.countryOfIncorporationCode || null,
				entityDivisionName: searchResult.entityDivisionName || null,
				entityStartDate: searchResult.entityStartDate || null,
				entityStructureDesc: searchResult.entityStructureDesc || null,
				entityTypeDesc: searchResult.entityTypeDesc || null,
				exclusionStatusFlag: searchResult.exclusionStatusFlag || null,
				expirationDate: searchResult.expirationDate || null,
				fiscalYearEndCloseDate: searchResult.fiscalYearEndCloseDate || null,
				lastUpdateDate: searchResult.lastUpdateDate || null,
				organizationStructureDesc: searchResult.organizationStructureDesc || null,
				primaryNaics: searchResult.primaryNaics || null,
				profitStructureDesc: searchResult.profitStructureDesc || null,
				purposeOfRegistrationDesc: searchResult.purposeOfRegistrationDesc || null,
				registrationDate: searchResult.registrationDate || null,
				registrationExpirationDate: searchResult.registrationExpirationDate || null,
				registrationStatus: searchResult.registrationStatus || null,
				shippingAddressCity: searchResult.shippingAddressCity || null,
				shippingAddressCountryCode: searchResult.shippingAddressCountryCode || null,
				shippingAddressStateCode: searchResult.shippingAddressStateCode || null,
				shippingAddressStreetLine1: searchResult.shippingAddressStreetLine1 || null,
				shippingAddressStreetLine2: searchResult.shippingAddressStreetLine2 || null,
				shippingAddressZipCode: searchResult.shippingAddressZipCode || null,
				stateOfIncorporationCode: searchResult.stateOfIncorporationCode || null,
				submissionDate: searchResult.submissionDate || null,
			};
			console.log(searchResult);
			const response = await client.models.Company.create(companyData);
			console.log(response);
			setDialogOpen(false);
			setSearchResult(null);
			setUei("");
		} catch (err) {
			console.error("Error adding company:", err);
			setError("Failed to add company");
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateCompany = async (id, updates) => {
		setLoading(true);
		try {
			await client.models.Company.update({
				id,
				...updates,
			});
			setEditCompany(null);
		} catch (err) {
			console.error("Error updating company:", err);
			setError("Failed to update company");
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteCompany = async (id) => {
		if (!window.confirm("Are you sure you want to delete this company?")) return;

		setLoading(true);
		try {
			// First delete all associated UserCompanyRoles
			const userCompanyRoles = await client.models.UserCompanyRole.list({
				filter: { companyId: { eq: id } },
			});

			for (const role of userCompanyRoles.data) {
				await client.models.UserCompanyRole.delete({ id: role.id });
			}

			// Then delete all associated Teams
			const teams = await client.models.Team.list({
				filter: { companyId: { eq: id } },
			});

			for (const team of teams.data) {
				await client.models.Team.delete({ id: team.id });
			}

			// Finally delete the company
			await client.models.Company.delete({ id });
		} catch (err) {
			console.error("Error deleting company:", err);
			setError("Failed to delete company");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant='h4' sx={{ mb: 4, fontWeight: "bold" }}>
				Company Administration
			</Typography>

			<Paper sx={{ p: 3, mb: 4 }}>
				<Box sx={{ display: "flex", gap: 2 }}>
					<TextField
						fullWidth
						label='Enter UEI'
						value={uei}
						onChange={(e) => setUei(e.target.value)}
						placeholder='Enter 12-character UEI'
						disabled={loading}
					/>
					<Button
						variant='contained'
						onClick={handleSearch}
						disabled={loading}
						startIcon={loading ? <CircularProgress size={20} /> : <Search />}
					>
						Search
					</Button>
				</Box>

				{error && (
					<Alert severity='error' sx={{ mt: 2 }}>
						{error}
					</Alert>
				)}
			</Paper>

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Legal Name</TableCell>
							<TableCell>DBA Name</TableCell>
							<TableCell>UEI</TableCell>
							<TableCell>Email</TableCell>
							<TableCell>Status</TableCell>
							<TableCell align='right'>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{companies.map((company) => (
							<TableRow key={company.id}>
								<TableCell>{company.legalBusinessName}</TableCell>
								<TableCell>{company.dbaName || "-"}</TableCell>
								<TableCell>{company.uei}</TableCell>
								<TableCell>{company.companyEmail || "-"}</TableCell>
								<TableCell>
									<Chip
										label={company.status}
										color={company.status === "ACTIVE" ? "success" : "default"}
										size='small'
									/>
								</TableCell>
								<TableCell align='right'>
									<IconButton onClick={() => setEditCompany(company)} size='small' title='Edit Company'>
										<Edit size={18} />
									</IconButton>
									<IconButton
										onClick={() => handleDeleteCompany(company.id)}
										size='small'
										color='error'
										title='Delete Company'
									>
										<Trash2 size={18} />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
						{companies.length === 0 && !loading && (
							<TableRow>
								<TableCell colSpan={6} align='center'>
									No companies found
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Add Company Dialog */}
			<Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth='md' fullWidth>
				<DialogTitle>Add New Company</DialogTitle>
				<DialogContent>
					{searchResult && (
						<Box sx={{ mt: 2 }}>
							<Typography variant='subtitle1' gutterBottom>
								Company Information from SAM.gov
							</Typography>
							<Typography>
								<strong>Legal Name:</strong> {searchResult.legalBusinessName}
							</Typography>
							<Typography>
								<strong>UEI:</strong> {searchResult.uei}
							</Typography>
							<Typography>
								<strong>CAGE Code:</strong> {searchResult.cageCode || "-"}
							</Typography>
							<Typography>
								<strong>Status:</strong> {searchResult.registrationStatus}
							</Typography>
						</Box>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDialogOpen(false)}>Cancel</Button>
					<Button onClick={handleAddCompany} variant='contained' disabled={loading}>
						Add Company
					</Button>
				</DialogActions>
			</Dialog>

			{/* Edit Company Dialog */}
			<Dialog open={Boolean(editCompany)} onClose={() => setEditCompany(null)} maxWidth='sm' fullWidth>
				<DialogTitle>Edit Company</DialogTitle>
				<DialogContent>
					{editCompany && (
						<Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
							<TextField
								fullWidth
								label='Legal Business Name'
								value={editCompany.legalBusinessName}
								onChange={(e) =>
									setEditCompany({
										...editCompany,
										legalBusinessName: e.target.value,
									})
								}
							/>
							<TextField
								fullWidth
								label='DBA Name'
								value={editCompany.dbaName || ""}
								onChange={(e) =>
									setEditCompany({
										...editCompany,
										dbaName: e.target.value,
									})
								}
							/>
							<TextField
								fullWidth
								label='Email'
								value={editCompany.companyEmail || ""}
								onChange={(e) =>
									setEditCompany({
										...editCompany,
										companyEmail: e.target.value,
									})
								}
							/>
							<FormControl fullWidth>
								<InputLabel>Status</InputLabel>
								<Select
									value={editCompany.status}
									onChange={(e) =>
										setEditCompany({
											...editCompany,
											status: e.target.value,
										})
									}
									label='Status'
								>
									<MenuItem value='ACTIVE'>Active</MenuItem>
									<MenuItem value='INACTIVE'>Inactive</MenuItem>
									<MenuItem value='PENDING'>Pending</MenuItem>
								</Select>
							</FormControl>
						</Box>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setEditCompany(null)}>Cancel</Button>
					<Button
						onClick={() => handleUpdateCompany(editCompany.id, editCompany)}
						variant='contained'
						disabled={loading}
					>
						Save Changes
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

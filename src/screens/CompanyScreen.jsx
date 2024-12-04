import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	IconButton,
	Chip,
	Divider,
	Alert,
} from "@mui/material";
import { Building2, Edit, Trash2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { generateClient } from "aws-amplify/data";
import { CompanyDialog } from "../components/company/CompanyDialog";
import { UserCompanyList } from "../components/company/UserCompanyList";

const client = generateClient({
	authMode: "userPool",
});

export default function CompanyScreen() {
	const [companies, setCompanies] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editCompany, setEditCompany] = useState(null);
	const navigate = useNavigate();

	const fetchCompanies = async () => {
		setLoading(true);
		try {
			const response = await client.models.Company.list();
			setCompanies(response.data);
			setError(null);
		} catch (err) {
			console.error("Error fetching companies:", err);
			setError("Failed to load companies");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCompanies();
	}, []);

	const handleAddClick = () => {
		setEditCompany(null);
		setDialogOpen(true);
	};

	const handleEditClick = (company) => {
		setEditCompany(company);
		setDialogOpen(true);
	};

	const handleDeleteClick = async (companyId) => {
		if (window.confirm("Are you sure you want to delete this company?")) {
			try {
				// First delete all associated UserCompanyRoles
				const userCompanyRoles = await client.models.UserCompanyRole.list({
					filter: { companyId: { eq: companyId } },
				});

				for (const role of userCompanyRoles.data) {
					await client.models.UserCompanyRole.delete({ id: role.id });
				}

				// Then delete all associated Teams
				const teams = await client.models.Team.list({
					filter: { companyId: { eq: companyId } },
				});

				for (const team of teams.data) {
					// Delete the associated contact first
					await client.models.Contact.delete({ id: team.contactId });
					// Then delete the team
					await client.models.Team.delete({ id: team.id });
				}

				// Finally delete the company
				await client.models.Company.delete({ id: companyId });

				// Refresh the companies list
				fetchCompanies();
			} catch (err) {
				console.error("Error deleting company:", err);
				setError("Failed to delete company");
			}
		}
	};

	const handleViewTeam = (companyId) => {
		navigate(`/company/${companyId}/team`);
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
		setEditCompany(null);
		fetchCompanies(); // Refresh the list after dialog closes
	};

	return (
		<Box sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 4 }}>
			<UserCompanyList />

			<Divider />

			<Box>
				<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
					<Typography variant='h4' sx={{ fontWeight: "bold" }}>
						All Companies
					</Typography>
					<Button variant='contained' startIcon={<Building2 size={20} />} onClick={handleAddClick} sx={{ px: 3 }}>
						Add Company
					</Button>
				</Box>

				{error && (
					<Alert severity='error' sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

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
										<IconButton
											onClick={() => handleViewTeam(company.id)}
											size='small'
											color='primary'
											title='View Team'
										>
											<Users size={18} />
										</IconButton>
										<IconButton onClick={() => handleEditClick(company)} size='small' title='Edit Company'>
											<Edit size={18} />
										</IconButton>
										<IconButton
											onClick={() => handleDeleteClick(company.id)}
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
			</Box>

			<CompanyDialog open={dialogOpen} onClose={handleCloseDialog} editCompany={editCompany} />
		</Box>
	);
}

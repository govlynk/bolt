import React, { useEffect } from "react";
import {
	Box,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Chip,
	IconButton,
} from "@mui/material";
import { Unlink } from "lucide-react";
import { useUserCompanyStore } from "../../stores/userCompanyStore";

export function UserCompanyList() {
	const { userCompanies, fetchUserCompanies, removeUserCompanyAssociation, loading, error } = useUserCompanyStore();

	useEffect(() => {
		fetchUserCompanies();
		return () => {
			const { cleanup } = useUserCompanyStore.getState();
			cleanup();
		};
	}, [fetchUserCompanies]);

	const handleRemoveAssociation = async (UserCompanyAccessId) => {
		if (window.confirm("Are you sure you want to remove this company association?")) {
			await removeUserCompanyAssociation(UserCompanyAccessId);
		}
	};

	if (loading) {
		return <Typography>Loading...</Typography>;
	}

	if (error) {
		return <Typography color='error'>{error}</Typography>;
	}

	return (
		<Box>
			<Typography variant='h6' sx={{ mb: 2 }}>
				My Associated Companies
			</Typography>

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Company Name</TableCell>
							<TableCell>UEI</TableCell>
							<TableCell>Role</TableCell>
							<TableCell>Status</TableCell>
							<TableCell align='right'>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{userCompanies.map((company) => (
							<TableRow key={company.UserCompanyAccessId}>
								<TableCell>{company.legalBusinessName}</TableCell>
								<TableCell>{company.uei}</TableCell>
								<TableCell>{company.roleId}</TableCell>
								<TableCell>
									<Chip
										label={company.status}
										color={company.status === "ACTIVE" ? "success" : "default"}
										size='small'
									/>
								</TableCell>
								<TableCell align='right'>
									<IconButton
										onClick={() => handleRemoveAssociation(company.UserCompanyAccessId)}
										size='small'
										color='error'
										title='Remove Association'
									>
										<Unlink size={18} />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
						{userCompanies.length === 0 && (
							<TableRow>
								<TableCell colSpan={5} align='center'>
									No companies associated with your account
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
}

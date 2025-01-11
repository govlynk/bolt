import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Box,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	FormControlLabel,
	Checkbox,
	Alert,
} from "@mui/material";
import { generateClient } from "aws-amplify/data";
import { useGlobalStore } from "../../stores/globalStore";

const client = generateClient({
	authMode: "userPool",
});

const initialFormState = {
	legalBusinessName: "",
	dbaName: "",
	uei: "",
	cageCode: "",
	ein: "",
	companyEmail: "",
	companyPhoneNumber: "",
	companyWebsite: "",
	status: "ACTIVE",
	associateCurrentUser: true,
	userRole: "ADMIN",
};

export function CompanyDialog({ open, onClose, editCompany = null }) {
	const [formData, setFormData] = useState(initialFormState);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const { activeUserId } = useGlobalStore();

	useEffect(() => {
		if (!open) {
			setFormData(initialFormState);
			setError(null);
			return;
		}

		if (editCompany) {
			setFormData({
				...initialFormState,
				...editCompany,
				associateCurrentUser: false,
			});
		}
	}, [open, editCompany]);

	const handleChange = (e) => {
		const { name, value, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === "associateCurrentUser" ? checked : value,
		}));
		setError(null);
	};

	const validateForm = () => {
		if (!formData.legalBusinessName?.trim()) {
			setError("Legal business name is required");
			return false;
		}
		if (!formData.uei?.trim()) {
			setError("UEI is required");
			return false;
		}
		return true;
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;

		setLoading(true);
		try {
			const companyData = {
				legalBusinessName: formData.legalBusinessName.trim(),
				dbaName: formData.dbaName?.trim() || null,
				uei: formData.uei.trim(),
				cageCode: formData.cageCode?.trim() || null,
				ein: formData.ein?.trim() || null,
				companyEmail: formData.companyEmail?.trim() || null,
				companyPhoneNumber: formData.companyPhoneNumber?.trim() || null,
				companyWebsite: formData.companyWebsite?.trim() || null,
				status: formData.status || "ACTIVE",
			};

			if (editCompany) {
				await client.models.Company.update({
					id: editCompany.id,
					...companyData,
				});
			} else {
				const company = await client.models.Company.create(companyData);

				if (formData.associateCurrentUser) {
					await client.models.UserCompanyAccess.create({
						userId: activeUserId,
						companyId: company.id,
						roleId: formData.userRole,
						status: "ACTIVE",
					});
				}
			}

			onClose();
		} catch (err) {
			console.error("Error saving company:", err);
			setError(err.message || "Failed to save company");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth='md'
			fullWidth
			PaperProps={{
				sx: {
					bgcolor: "background.paper",
					color: "text.primary",
				},
			}}
		>
			<DialogTitle>{editCompany ? "Edit Company" : "Add New Company"}</DialogTitle>
			<DialogContent>
				<Box component='form' sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
					{error && (
						<Alert severity='error' sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}
					<TextField
						fullWidth
						label='Legal Business Name'
						name='legalBusinessName'
						value={formData.legalBusinessName || ""}
						onChange={handleChange}
						required
						error={error === "Legal business name is required"}
						disabled={loading}
					/>
					<TextField
						fullWidth
						label='DBA Name'
						name='dbaName'
						value={formData.dbaName || ""}
						onChange={handleChange}
						disabled={loading}
					/>
					<Box sx={{ display: "flex", gap: 2 }}>
						<TextField
							fullWidth
							label='UEI'
							name='uei'
							value={formData.uei || ""}
							onChange={handleChange}
							required
							error={error === "UEI is required"}
							disabled={loading}
						/>
						<TextField
							fullWidth
							label='CAGE Code'
							name='cageCode'
							value={formData.cageCode || ""}
							onChange={handleChange}
							disabled={loading}
						/>
						<TextField
							fullWidth
							label='EIN'
							name='ein'
							value={formData.ein || ""}
							onChange={handleChange}
							disabled={loading}
						/>
					</Box>
					<Box sx={{ display: "flex", gap: 2 }}>
						<TextField
							fullWidth
							label='Company Email'
							name='companyEmail'
							type='email'
							value={formData.companyEmail || ""}
							onChange={handleChange}
							disabled={loading}
						/>
						<TextField
							fullWidth
							label='Phone Number'
							name='companyPhoneNumber'
							value={formData.companyPhoneNumber || ""}
							onChange={handleChange}
							disabled={loading}
						/>
					</Box>
					<TextField
						fullWidth
						label='Website'
						name='companyWebsite'
						value={formData.companyWebsite || ""}
						onChange={handleChange}
						disabled={loading}
					/>
					<FormControl fullWidth disabled={loading}>
						<InputLabel>Status</InputLabel>
						<Select name='status' value={formData.status || "ACTIVE"} onChange={handleChange} label='Status'>
							<MenuItem value='ACTIVE'>Active</MenuItem>
							<MenuItem value='INACTIVE'>Inactive</MenuItem>
							<MenuItem value='PENDING'>Pending</MenuItem>
						</Select>
					</FormControl>

					{!editCompany && (
						<>
							<FormControlLabel
								control={
									<Checkbox
										checked={formData.associateCurrentUser}
										onChange={handleChange}
										name='associateCurrentUser'
										disabled={loading}
									/>
								}
								label='Associate me with this company'
							/>
							{formData.associateCurrentUser && (
								<FormControl fullWidth disabled={loading}>
									<InputLabel>Your Role</InputLabel>
									<Select name='userRole' value={formData.userRole} onChange={handleChange} label='Your Role'>
										<MenuItem value='ADMIN'>Administrator</MenuItem>
										<MenuItem value='MANAGER'>Manager</MenuItem>
										<MenuItem value='MEMBER'>Team Member</MenuItem>
									</Select>
								</FormControl>
							)}
						</>
					)}
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} disabled={loading}>
					Cancel
				</Button>
				<Button onClick={handleSubmit} variant='contained' color='primary' disabled={loading}>
					{loading ? "Saving..." : editCompany ? "Save Changes" : "Add Company"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

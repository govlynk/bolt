import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Box,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Grid,
	Typography,
	Alert,
	Divider,
	Chip,
	useTheme,
} from "@mui/material";

const ROLES = [
	"Executive",
	"Sales",
	"Marketing",
	"Finance",
	"Risk",
	"Technology",
	"Engineering",
	"Operations",
	"HumanResources",
	"Legal",
	"Contracting",
	"Servicing",
	"Other",
];

export function ContactDialog({ open, onClose, onSave, initialData, error }) {
	const theme = useTheme();
	const [errors, setErrors] = useState({});
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		contactEmail: "",
		contactMobilePhone: "",
		title: "",
		department: "",
		workAddressStreetLine1: "",
		workAddressStreetLine2: "",
		workAddressCity: "",
		workAddressStateCode: "",
		workAddressZipCode: "",
		workAddressCountryCode: "",
		role: "",
		notes: "",
	});

	useEffect(() => {
		if (initialData) {
			setFormData({
				firstName: initialData.firstName || "",
				lastName: initialData.lastName || "",
				contactEmail: initialData.email || "",
				contactMobilePhone: initialData.phone || "",
				title: "",
				department: "",
				workAddressStreetLine1: initialData?.workAddressStreetLine1 || "",
				workAddressStreetLine2: initialData?.workAddressStreetLine2 || "",
				workAddressCity: initialData?.workAddressCity || "",
				workAddressStateCode: initialData?.workAddressStateCode || "",
				workAddressZipCode: initialData?.workAddressZipCode || "",
				workAddressCountryCode: initialData?.workAddressCountryCode || "USA",
				role: initialData.role || "",
				notes: initialData.notes || "",
			});
		} else {
			setFormData({
				firstName: "",
				lastName: "",
				contactEmail: "",
				contactMobilePhone: "",
				title: "",
				department: "",
				workAddressStreetLine1: "",
				workAddressStreetLine2: "",
				workAddressCity: "",
				workAddressStateCode: "",
				workAddressZipCode: "",
				workAddressCountryCode: "USA",
				role: "",
				notes: "",
			});
		}
	}, [initialData, open]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = () => {
		onSave(formData);
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
			<DialogTitle>{initialData ? "Edit Contact" : "Add New Contact"}</DialogTitle>
			<DialogContent>
				<Box sx={{ mt: 2 }}>
					{error && (
						<Alert severity='error' sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}

					<Grid container spacing={3}>
						<Grid item xs={12} md={6}>
							<Typography variant='subtitle2' sx={{ mb: 2, color: "primary.main" }}>
								Personal Information
							</Typography>
							<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
								<TextField
									fullWidth
									label='First Name'
									name='firstName'
									value={formData.firstName}
									onChange={handleChange}
									error={!!errors.firstName}
									helperText={errors.firstName}
									required
								/>
								<TextField
									fullWidth
									label='Last Name'
									name='lastName'
									value={formData.lastName}
									onChange={handleChange}
									error={!!errors.lastName}
									helperText={errors.lastName}
									required
								/>
								<TextField
									fullWidth
									label='Email'
									name='contactEmail'
									type='email'
									value={formData.contactEmail}
									onChange={handleChange}
									error={!!errors.contactEmail}
									helperText={errors.contactEmail}
									required
								/>
								<TextField
									fullWidth
									label='Mobile Phone'
									name='contactMobilePhone'
									value={formData.contactMobilePhone}
									onChange={handleChange}
								/>
							</Box>
						</Grid>

						<Grid item xs={12} md={6}>
							<Typography variant='subtitle2' sx={{ mb: 2, color: "primary.main" }}>
								Company Position
							</Typography>
							<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
								<FormControl fullWidth required>
									<InputLabel>Role</InputLabel>
									<Select name='role' value={formData.role} onChange={handleChange} label='Role'>
										{ROLES.map((role) => (
											<MenuItem key={role} value={role}>
												{role}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<TextField
									fullWidth
									label='Title'
									name='title'
									value={formData.title}
									onChange={handleChange}
								/>
								<TextField
									fullWidth
									label='Department'
									name='department'
									value={formData.department}
									onChange={handleChange}
								/>
							</Box>
						</Grid>
						<Divider sx={{ my: 4 }} />
						<Grid item xs={12}>
							<Typography variant='subtitle2' sx={{ mb: 2, color: "primary.main" }}>
								Work Address
							</Typography>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<TextField
										fullWidth
										label='Street Address Line 1'
										name='workAddressStreetLine1'
										value={formData.workAddressStreetLine1}
										onChange={handleChange}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										fullWidth
										label='Street Address Line 2'
										name='workAddressStreetLine2'
										value={formData.workAddressStreetLine2}
										onChange={handleChange}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										fullWidth
										label='City'
										name='workAddressCity'
										value={formData.workAddressCity}
										onChange={handleChange}
									/>
								</Grid>
								<Grid item xs={12} sm={3}>
									<TextField
										fullWidth
										label='State'
										name='workAddressStateCode'
										value={formData.workAddressStateCode}
										onChange={handleChange}
									/>
								</Grid>
								<Grid item xs={12} sm={3}>
									<TextField
										fullWidth
										label='ZIP Code'
										name='workAddressZipCode'
										value={formData.workAddressZipCode}
										onChange={handleChange}
									/>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSubmit} variant='contained'>
					{initialData ? "Save Changes" : "Add Contact"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

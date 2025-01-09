import React, { useState } from "react";
import { Box, Typography, Button, Alert } from "@mui/material";
import { useSetupWorkflowStore } from "../../stores/setupWorkflowStore";
import { useUserStore } from "../../stores/userStore";
import { useTeamStore } from "../../stores/teamStore";
import { AdminTable } from "./admin/AdminTable";
import { filterContactsWithEmail } from "../../utils/contactUtils";

export function AdminSetupStep() {
	const { contactsData, setAdminData, nextStep, prevStep } = useSetupWorkflowStore();
	const { addUser } = useUserStore();
	const { addTeamMember } = useTeamStore();
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	// Filter contacts to only show those with email addresses
	const contactsWithEmail = filterContactsWithEmail(contactsData);

	const [rows, setRows] = useState(
		contactsWithEmail.map((contact) => ({
			...contact,
			contactId: contact.id,
			email: contact.email || contact.contactEmail || "",
			phone: contact.phone || contact.contactMobilePhone || "",
			cognitoId: "",
			accessLevel: "",
			isAuthorized: false,
		}))
	);

	const handleAuthorizeUser = async (row) => {
		if (!row.cognitoId || !row.accessLevel) {
			setError("Cognito ID and Access Level are required");
			return;
		}

		setLoading(true);
		try {
			const userData = {
				contactId: row.id,
				cognitoId: row.cognitoId,
				email: row.email,
				name: `${row.firstName} ${row.lastName}`,
				phone: row.phone,
				status: "ACTIVE",
			};

			const newUser = await addUser(userData);
			setRows(rows.map((r) => (r.id === row.id ? { ...r, isAuthorized: true } : r)));
			setError(null);
		} catch (err) {
			setError(err.message || "Failed to authorize user");
		} finally {
			setLoading(false);
		}
	};

	const handleContinue = () => {
		const authorizedUsers = rows.filter((row) => row.isAuthorized);
		if (authorizedUsers.length === 0) {
			setError("At least one user must be authorized to continue");
			return;
		}
		setAdminData(authorizedUsers);
		nextStep();
	};

	if (contactsWithEmail.length === 0) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='warning'>
					No contacts with email addresses found. Please go back and add contacts with valid email addresses.
				</Alert>
				<Box sx={{ mt: 2 }}>
					<Button onClick={prevStep}>Back</Button>
				</Box>
			</Box>
		);
	}

	return (
		<Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
			<Typography variant='h5' gutterBottom>
				Authorize Users
			</Typography>

			{error && (
				<Alert severity='error' sx={{ mb: 3 }}>
					{error}
				</Alert>
			)}

			<AdminTable
				rows={rows}
				onCognitoIdChange={(id, value) => {
					setRows(rows.map((row) => (row.id === id ? { ...row, cognitoId: value } : row)));
				}}
				onAccessLevelChange={(id, value) => {
					setRows(rows.map((row) => (row.id === id ? { ...row, accessLevel: value } : row)));
				}}
				onAuthorize={handleAuthorizeUser}
				loading={loading}
			/>

			<Box sx={{ display: "flex", justifyContent: "space-between" }}>
				<Button onClick={prevStep}>Back</Button>
				<Button
					variant='contained'
					onClick={handleContinue}
					disabled={loading || rows.filter((r) => r.isAuthorized).length === 0}
				>
					Continue
				</Button>
			</Box>
		</Box>
	);
}

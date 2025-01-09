import React from "react";
import { Box, Card, CardContent, TextField, Typography, Divider } from "@mui/material";
import { TeamMemberCard } from "./TeamMemberCard";

export function TeamSetupForm({ formData, onChange, companyData, contactsData }) {
	const handleChange = (e) => {
		const { name, value } = e.target;
		onChange({ ...formData, [name]: value });
	};

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
			<Card>
				<CardContent>
					<Typography variant='subtitle1' gutterBottom color='primary'>
						Team Information
					</Typography>

					<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
						<TextField
							fullWidth
							label='Team Name'
							name='name'
							value={formData.name}
							onChange={handleChange}
							required
						/>
						<TextField
							fullWidth
							label='Description'
							name='description'
							value={formData.description}
							onChange={handleChange}
							multiline
							rows={3}
						/>
					</Box>
				</CardContent>
			</Card>

			<Card>
				<CardContent>
					<Typography variant='subtitle1' gutterBottom color='primary'>
						Initial Team Members
					</Typography>
					<Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
						The following contacts will be added as initial team members
					</Typography>

					<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
						{contactsData.map((contact) => (
							<TeamMemberCard key={contact.rowId} member={contact} />
						))}
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
}

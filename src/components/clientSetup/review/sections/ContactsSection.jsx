import React from "react";
import { Box, Paper, Typography, Divider } from "@mui/material";
import { Contact2 } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { DataField } from "./DataField";

export function ContactsSection({ contacts }) {
	if (!contacts?.length) return null;

	return (
		<Paper sx={{ p: 3 }}>
			<SectionHeader icon={Contact2} title='Contact Information' />

			{contacts.map((contact, index) => (
				<React.Fragment key={contact.rowId}>
					{index > 0 && <Divider sx={{ my: 3 }} />}

					<Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr" }}>
						<DataField label='First Name' value={contact.firstName} />
						<DataField label='Last Name' value={contact.lastName} />
						<DataField label='Email' value={contact.email || contact.contactEmail} />
						<DataField label='Phone' value={contact.phone || contact.contactMobilePhone} />
						<DataField label='Role' value={contact.role} />
						<DataField label='Department' value={contact.department} />
					</Box>

					{contact.workAddressStreetLine1 && (
						<Box sx={{ mt: 2 }}>
							<Typography variant='subtitle2' color='text.secondary' gutterBottom>
								Work Address
							</Typography>
							<Typography variant='body2'>
								{contact.workAddressStreetLine1}
								{contact.workAddressStreetLine2 && <br />}
								{contact.workAddressStreetLine2}
								<br />
								{[contact.workAddressCity, contact.workAddressStateCode, contact.workAddressZipCode]
									.filter(Boolean)
									.join(", ")}
							</Typography>
						</Box>
					)}
				</React.Fragment>
			))}
		</Paper>
	);
}

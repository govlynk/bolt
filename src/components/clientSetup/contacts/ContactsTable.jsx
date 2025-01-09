import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	IconButton,
	Box,
	Paper,
} from "@mui/material";
import { Mail, Phone, Edit, Trash2 } from "lucide-react";

export function ContactsTable({ contacts, onEdit, onDelete }) {
	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Name</TableCell>
						<TableCell>Email</TableCell>
						<TableCell>Phone</TableCell>
						<TableCell>Role</TableCell>
						<TableCell align='right'>Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{contacts.map((contact) => (
						<TableRow key={contact.rowId} hover>
							<TableCell>{`${contact.firstName} ${contact.lastName}`}</TableCell>
							<TableCell>
								<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
									<Mail size={16} />
									{contact.email || contact.contactEmail || "-"}
								</Box>
							</TableCell>
							<TableCell>
								{(contact.phone || contact.contactMobilePhone) && (
									<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
										<Phone size={16} />
										{contact.phone || contact.contactMobilePhone}
									</Box>
								)}
							</TableCell>
							<TableCell>{contact.role || "-"}</TableCell>
							<TableCell align='right'>
								<IconButton onClick={() => onEdit(contact)} size='small'>
									<Edit size={18} />
								</IconButton>
								<IconButton onClick={() => onDelete(contact.id)} size='small' color='error'>
									<Trash2 size={18} />
								</IconButton>
							</TableCell>
						</TableRow>
					))}
					{contacts.length === 0 && (
						<TableRow>
							<TableCell colSpan={5} align='center'>
								No contacts available
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

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
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Alert,
	CircularProgress,
} from "@mui/material";
import { UserPlus, Edit, Trash2, Mail, Phone } from "lucide-react";
import { ContactDialog } from "../components/contacts/ContactDialog";
import { useContactStore } from "../stores/contactStore";
import { useUserCompanyStore } from "../stores/userCompanyStore";

export default function ContactsScreen() {
	const { contacts, fetchContacts, loading, error, removeContact } = useContactStore();
	const { getActiveCompany } = useUserCompanyStore();
	const activeCompany = getActiveCompany();
	const [selectedCompany, setSelectedCompany] = useState(activeCompany?.id || "");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editContact, setEditContact] = useState(null);

	useEffect(() => {
		if (selectedCompany) {
			fetchContacts(selectedCompany);
		}
	}, [selectedCompany, fetchContacts]);

	const handleAddContact = () => {
		setEditContact(null);
		setDialogOpen(true);
	};

	const handleEditContact = (contact) => {
		setEditContact(contact);
		setDialogOpen(true);
	};

	const handleDeleteContact = async (contactId) => {
		if (window.confirm("Are you sure you want to delete this contact?")) {
			try {
				await removeContact(contactId);
			} catch (err) {
				console.error("Failed to remove contact:", err);
			}
		}
	};

	return (
		<Box>
			{loading ? (
				<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
					<CircularProgress />
				</Box>
			) : (
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Phone</TableCell>
								<TableCell align='right'>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{contacts.map((contact) => (
								<TableRow key={contact.id} hover>
									<TableCell>{`${contact.firstName} ${contact.lastName}`}</TableCell>
									<TableCell>{contact.contactEmail}</TableCell>
									<TableCell>{contact.contactMobilePhone || contact.contactBusinessPhone}</TableCell>
									<TableCell align='right'>
										<IconButton onClick={() => handleEditContact(contact)} size='small' color='primary'>
											<Edit size={16} />
										</IconButton>
										<IconButton
											onClick={() => handleDeleteContact(contact.id)}
											size='small'
											color='secondary'
										>
											<Trash2 size={16} />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}

			<Button variant='contained' color='primary' startIcon={<UserPlus />} onClick={handleAddContact} sx={{ mt: 3 }}>
				Add Contact
			</Button>

			<ContactDialog open={dialogOpen} onClose={() => setDialogOpen(false)} contact={editContact} />
		</Box>
	);
}

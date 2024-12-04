import React, { useState, useEffect } from "react";
import {
	Box,
	Button,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Typography,
	Alert,
	TextField,
	InputAdornment,
} from "@mui/material";
import { UserPlus, Search } from "lucide-react";
import { ContactDialog } from "../components/contacts/ContactDialog";
import { ContactList } from "../components/contacts/ContactList";
import { useContactStore } from "../stores/contactStore";
import { useCompanyStore } from "../stores/companyStore";

export default function ContactAdminScreen() {
	const [selectedCompany, setSelectedCompany] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editContact, setEditContact] = useState(null);

	const { contacts, fetchContacts, removeContact, loading, error } = useContactStore();
	const { companies, fetchCompanies, loading: companiesLoading } = useCompanyStore();

	useEffect(() => {
		fetchCompanies();
	}, [fetchCompanies]);

	useEffect(() => {
		if (selectedCompany) {
			fetchContacts(selectedCompany);
		}
	}, [selectedCompany, fetchContacts]);

	const handleAddContact = () => {
		if (!selectedCompany) {
			return;
		}
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

	const filteredContacts = contacts.filter((contact) => {
		const searchStr = searchTerm.toLowerCase();
		return (
			contact.firstName.toLowerCase().includes(searchStr) ||
			contact.lastName.toLowerCase().includes(searchStr) ||
			contact.contactEmail?.toLowerCase().includes(searchStr) ||
			contact.title?.toLowerCase().includes(searchStr)
		);
	});

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant='h4' sx={{ mb: 4, fontWeight: "bold" }}>
				Contact Management
			</Typography>

			<Box sx={{ mb: 4 }}>
				<FormControl fullWidth sx={{ mb: 3 }}>
					<InputLabel>Select Company</InputLabel>
					<Select
						value={selectedCompany}
						onChange={(e) => setSelectedCompany(e.target.value)}
						label='Select Company'
						disabled={companiesLoading}
					>
						{companies.map((company) => (
							<MenuItem key={company.id} value={company.id}>
								{company.legalBusinessName}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<Box sx={{ display: "flex", gap: 2, mb: 3 }}>
					<TextField
						fullWidth
						placeholder='Search contacts...'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						disabled={!selectedCompany}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<Search size={20} />
								</InputAdornment>
							),
						}}
					/>
					<Button
						variant='contained'
						startIcon={<UserPlus size={20} />}
						onClick={handleAddContact}
						disabled={!selectedCompany}
					>
						Add Contact
					</Button>
				</Box>
			</Box>

			{!selectedCompany ? (
				<Alert severity='info'>Please select a company to manage contacts</Alert>
			) : (
				<ContactList
					contacts={filteredContacts}
					loading={loading}
					error={error}
					onEditContact={handleEditContact}
					onDeleteContact={handleDeleteContact}
				/>
			)}

			<ContactDialog
				open={dialogOpen}
				onClose={() => {
					setDialogOpen(false);
					setEditContact(null);
				}}
				contact={editContact}
			/>
		</Box>
	);
}

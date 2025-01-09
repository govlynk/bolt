import React, { useState } from "react";
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
	Typography,
	Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { addDays } from "date-fns";

export function SprintDialog({ open, onClose, onSave, editSprint = null }) {
	const [formData, setFormData] = useState({
		name: "",
		goal: "",
		startDate: new Date(),
		endDate: addDays(new Date(), 14), // Default 2-week sprint
		status: "PLANNING",
		...editSprint,
	});
	const [error, setError] = useState(null);

	const handleChange = (field) => (event) => {
		setFormData((prev) => ({
			...prev,
			[field]: event.target.value,
		}));
		setError(null);
	};

	const handleDateChange = (field) => (date) => {
		setFormData((prev) => ({
			...prev,
			[field]: date,
		}));
	};

	const handleSubmit = () => {
		if (!formData.name.trim()) {
			setError("Sprint name is required");
			return;
		}

		if (!formData.goal.trim()) {
			setError("Sprint goal is required");
			return;
		}

		if (formData.endDate <= formData.startDate) {
			setError("End date must be after start date");
			return;
		}

		onSave({
			...formData,
			id: editSprint?.id || crypto.randomUUID(),
		});
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
			<DialogTitle>{editSprint ? "Edit Sprint" : "Create New Sprint"}</DialogTitle>
			<DialogContent>
				<Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
					{error && (
						<Alert severity='error' sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}

					<TextField
						fullWidth
						label='Sprint Name'
						value={formData.name}
						onChange={handleChange("name")}
						required
					/>

					<TextField
						fullWidth
						label='Sprint Goal'
						value={formData.goal}
						onChange={handleChange("goal")}
						multiline
						rows={3}
						required
					/>

					<Box sx={{ display: "flex", gap: 2 }}>
						<DatePicker
							label='Start Date'
							value={formData.startDate}
							onChange={handleDateChange("startDate")}
							renderInput={(params) => <TextField {...params} fullWidth />}
						/>
						<DatePicker
							label='End Date'
							value={formData.endDate}
							onChange={handleDateChange("endDate")}
							renderInput={(params) => <TextField {...params} fullWidth />}
						/>
					</Box>

					<FormControl fullWidth>
						<InputLabel>Status</InputLabel>
						<Select value={formData.status} onChange={handleChange("status")} label='Status'>
							<MenuItem value='PLANNING'>Planning</MenuItem>
							<MenuItem value='ACTIVE'>Active</MenuItem>
							<MenuItem value='COMPLETED'>Completed</MenuItem>
						</Select>
					</FormControl>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSubmit} variant='contained'>
					{editSprint ? "Save Changes" : "Create Sprint"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

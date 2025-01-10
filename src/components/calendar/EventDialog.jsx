import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Box,
	FormControlLabel,
	Checkbox,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	IconButton,
} from "@mui/material";
import { X } from "lucide-react";
import { format } from "date-fns";

export function EventDialog({ open, onClose, onSave, initialSlot }) {
	const [eventData, setEventData] = useState({
		title: "",
		start: "",
		end: "",
		location: "",
		description: "",
		isAllDay: false,
		isRepeat: false,
		isPrivate: false,
		addToSchedule: true,
		conferenceType: "",
		url: "",
		reminderType: "Email",
		reminderTime: "15",
		reminderTimeUnit: "mins",
		participants: "",
	});

	useEffect(() => {
		if (initialSlot) {
			setEventData((prev) => ({
				...prev,
				start: format(initialSlot.start, "yyyy-MM-dd'T'HH:mm"),
				end: format(initialSlot.end, "yyyy-MM-dd'T'HH:mm"),
			}));
		}
	}, [initialSlot]);

	const handleChange = (field) => (event) => {
		const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
		setEventData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = () => {
		if (!eventData.title || !eventData.start || !eventData.end) {
			return;
		}

		onSave({
			...eventData,
			id: crypto.randomUUID(),
		});

		setEventData({
			title: "",
			start: "",
			end: "",
			location: "",
			description: "",
			isAllDay: false,
			isRepeat: false,
			isPrivate: false,
			addToSchedule: true,
			conferenceType: "",
			url: "",
			reminderType: "Email",
			reminderTime: "15",
			reminderTimeUnit: "mins",
			participants: "",
		});
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
			<DialogTitle sx={{ m: 0, p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
				Add Event
				<IconButton onClick={onClose} size='small'>
					<X size={18} />
				</IconButton>
			</DialogTitle>

			<DialogContent dividers>
				<Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
					<TextField
						fullWidth
						label='Event Title'
						value={eventData.title}
						onChange={handleChange("title")}
						required
					/>

					<Box sx={{ display: "flex", gap: 2 }}>
						<TextField
							label='Start Time'
							value={eventData.start}
							onChange={handleChange("start")}
							fullWidth
							required
						/>
						<TextField label='End Time' value={eventData.end} onChange={handleChange("end")} fullWidth required />
					</Box>

					<Box sx={{ display: "flex", gap: 2 }}>
						<FormControlLabel
							control={<Checkbox checked={eventData.isAllDay} onChange={handleChange("isAllDay")} />}
							label='All day'
						/>
						<FormControlLabel
							control={<Checkbox checked={eventData.isRepeat} onChange={handleChange("isRepeat")} />}
							label='Repeat'
						/>
					</Box>

					<TextField
						fullWidth
						label='Participants'
						value={eventData.participants}
						onChange={handleChange("participants")}
						placeholder='Invite individual participants or your groups'
					/>

					<TextField fullWidth label='Location' value={eventData.location} onChange={handleChange("location")} />

					<FormControl fullWidth>
						<InputLabel>Add conference</InputLabel>
						<Select
							value={eventData.conferenceType}
							onChange={handleChange("conferenceType")}
							label='Add conference'
						>
							<MenuItem value='googlemeet'>Google Meet</MenuItem>
							<MenuItem value='zoom'>Zoom</MenuItem>
							<MenuItem value='teams'>Microsoft Teams</MenuItem>
						</Select>
					</FormControl>

					<Box sx={{ display: "flex", gap: 2 }}>
						<FormControlLabel
							control={<Checkbox checked={eventData.isPrivate} onChange={handleChange("isPrivate")} />}
							label='Private'
						/>
						<FormControlLabel
							control={<Checkbox checked={eventData.addToSchedule} onChange={handleChange("addToSchedule")} />}
							label='Add to free/busy schedule'
						/>
					</Box>

					<TextField
						fullWidth
						label='URL'
						value={eventData.url}
						onChange={handleChange("url")}
						placeholder='Enter url'
					/>

					<Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
						<FormControl sx={{ minWidth: 120 }}>
							<InputLabel>Reminder</InputLabel>
							<Select value={eventData.reminderType} onChange={handleChange("reminderType")} label='Reminder'>
								<MenuItem value='Email'>Email</MenuItem>
								<MenuItem value='Notification'>Notification</MenuItem>
							</Select>
						</FormControl>

						<TextField
							type='number'
							value={eventData.reminderTime}
							onChange={handleChange("reminderTime")}
							sx={{ width: 100 }}
						/>

						<FormControl sx={{ minWidth: 120 }}>
							<Select value={eventData.reminderTimeUnit} onChange={handleChange("reminderTimeUnit")}>
								<MenuItem value='mins'>minutes</MenuItem>
								<MenuItem value='hours'>hours</MenuItem>
								<MenuItem value='days'>days</MenuItem>
							</Select>
						</FormControl>
					</Box>

					<TextField
						fullWidth
						multiline
						rows={4}
						label='Description'
						value={eventData.description}
						onChange={handleChange("description")}
					/>
				</Box>
			</DialogContent>

			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button
					onClick={handleSubmit}
					variant='contained'
					disabled={!eventData.title || !eventData.start || !eventData.end}
				>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}

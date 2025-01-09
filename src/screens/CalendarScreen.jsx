import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Box, Paper, Button, Typography, List, ListItem, ListItemText, useTheme } from "@mui/material";
import { Plus } from "lucide-react";
import { EventDialog } from "../components/calendar/EventDialog";

const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales: {
		"en-US": enUS,
	},
});

const CalendarScreen = () => {
	const theme = useTheme();
	const [currentEvents, setCurrentEvents] = useState([]);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedSlot, setSelectedSlot] = useState(null);

	const handleAddEvent = () => {
		const now = new Date();
		const oneHourFromNow = new Date(now.getTime() + 3600000); // 1 hour from now

		setSelectedSlot({
			start: now,
			end: oneHourFromNow,
		});
		setDialogOpen(true);
	};

	const handleSlotSelect = (slotInfo) => {
		setSelectedSlot(slotInfo);
		setDialogOpen(true);
	};

	const handleSaveEvent = (eventData) => {
		const newEvent = {
			...eventData,
			start: new Date(eventData.start),
			end: new Date(eventData.end),
		};

		setCurrentEvents((prev) => [...prev, newEvent]);
		setDialogOpen(false);
		setSelectedSlot(null);
	};

	const handleEventClick = (event) => {
		if (window.confirm(`Are you sure you want to delete '${event.title}'?`)) {
			setCurrentEvents((prev) => prev.filter((e) => e.id !== event.id));
		}
	};

	return (
		<Box sx={{ p: 3 }}>
			<Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
				<Typography variant='h4' sx={{ fontWeight: "bold" }}>
					Calendar
				</Typography>
				<Button variant='contained' startIcon={<Plus />} onClick={handleAddEvent}>
					New Event
				</Button>
			</Box>

			<Box sx={{ display: "flex", gap: 3 }}>
				{/* Sidebar */}
				<Paper sx={{ p: 2, width: 300, bgcolor: theme.palette.background.paper }}>
					<Typography variant='h6' sx={{ mb: 2 }}>
						Events
					</Typography>
					<List sx={{ width: "100%" }}>
						{currentEvents.map((event) => (
							<ListItem key={event.id} sx={{ display: "block", mb: 1 }}>
								<ListItemText
									primary={event.title}
									secondary={format(new Date(event.start), "MMMM dd, yyyy")}
								/>
							</ListItem>
						))}
					</List>
				</Paper>

				{/* Calendar */}
				<Paper sx={{ p: 2, flexGrow: 1, height: "calc(100vh - 200px)" }}>
					<Calendar
						localizer={localizer}
						events={currentEvents}
						startAccessor='start'
						endAccessor='end'
						selectable
						onSelectSlot={handleSlotSelect}
						onSelectEvent={handleEventClick}
						style={{ height: "100%" }}
					/>
				</Paper>
			</Box>

			<EventDialog
				open={dialogOpen}
				onClose={() => {
					setDialogOpen(false);
					setSelectedSlot(null);
				}}
				onSave={handleSaveEvent}
				initialSlot={selectedSlot}
			/>
		</Box>
	);
};

export default CalendarScreen;

import React, { useState, useEffect } from "react";
import { Box, Button, Typography, IconButton, Tooltip, Chip, Paper } from "@mui/material";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useSprintStore } from "../../stores/sprintStore";
import { useGlobalStore } from "../../stores/globalStore";
import { format } from "date-fns";

const STATUS_COLORS = {
	PLANNING: "default",
	ACTIVE: "success",
	COMPLETED: "secondary",
};

export function TodoHeader({ onAddClick }) {
	const [selectedSprintId, setSelectedSprintId] = useState(null);
	const { sprints, loading, fetchSprints } = useSprintStore();
	const { activeCompanyId, activeTeamId } = useGlobalStore();
	const [selectedIndex, setSelectedIndex] = useState(null);

	// Fetch sprints when team changes
	useEffect(() => {
		if (activeTeamId) {
			fetchSprints(activeTeamId);
		}
	}, [activeTeamId, fetchSprints]);

	// Sort sprints by start date
	const sortedSprints = [...sprints].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

	// Find active sprint on initial load
	useEffect(() => {
		if (sortedSprints.length > 0 && selectedIndex === null) {
			const today = new Date();
			const activeSprint = sortedSprints.find(
				(sprint) => new Date(sprint.startDate) <= today && new Date(sprint.endDate) >= today
			);
			const activeIndex = activeSprint ? sortedSprints.indexOf(activeSprint) : 0;
			setSelectedIndex(activeIndex);
		}
	}, [sortedSprints, selectedIndex]);

	const handlePreviousSprint = () => {
		setSelectedIndex((prev) => Math.max(0, prev - 1));
	};

	const handleNextSprint = () => {
		setSelectedIndex((prev) => Math.min(sortedSprints.length - 1, prev + 1));
	};

	const currentSprint = sortedSprints[selectedIndex];

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				mb: 4,
				flexWrap: "wrap",
				gap: 2,
			}}
		>
			<Typography variant='h4' sx={{ fontWeight: "bold" }}>
				Tasks
			</Typography>

			<Paper
				sx={{
					display: "flex",
					alignItems: "center",
					gap: 2,
					p: 1,
					minWidth: 300,
				}}
			>
				<Tooltip title={selectedIndex === 0 ? "No earlier sprints" : "Previous Sprint"}>
					<span>
						<IconButton onClick={handlePreviousSprint} disabled={selectedIndex === 0 || loading} size='small'>
							<ChevronLeft size={20} />
						</IconButton>
					</span>
				</Tooltip>

				<Box sx={{ textAlign: "center", flex: 1 }}>
					{loading ? (
						<Typography variant='body1'>Loading sprints...</Typography>
					) : !currentSprint ? (
						<Typography variant='body1'>No sprints available</Typography>
					) : (
						<Box>
							<Typography variant='subtitle1' sx={{ fontWeight: "medium" }}>
								{currentSprint.name}
							</Typography>
							<Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mt: 0.5 }}>
								<Typography variant='caption' color='text.secondary'>
									{format(new Date(currentSprint.startDate), "MMM d")} -{" "}
									{format(new Date(currentSprint.endDate), "MMM d, yyyy")}
								</Typography>
								<Chip label={currentSprint.status} size='small' color={STATUS_COLORS[currentSprint.status]} />
							</Box>
						</Box>
					)}
				</Box>

				<Tooltip title={selectedIndex === sortedSprints.length - 1 ? "No later sprints" : "Next Sprint"}>
					<span>
						<IconButton
							onClick={handleNextSprint}
							disabled={selectedIndex === sortedSprints.length - 1 || loading}
							size='small'
						>
							<ChevronRight size={20} />
						</IconButton>
					</span>
				</Tooltip>
			</Paper>
			<Button
				variant='contained'
				startIcon={<Plus size={20} />}
				onClick={onAddClick}
				sx={{ px: 3 }}
				disabled={!activeCompanyId}
			>
				Add Task
			</Button>
		</Box>
	);
}

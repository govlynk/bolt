import React from "react";
import { Box, Paper, Typography, LinearProgress, Chip, IconButton, Tooltip, useTheme } from "@mui/material";
import { Edit, MoreVertical, Calendar, Target } from "lucide-react";
import { format } from "date-fns";
import { KanbanBoard } from "../kanban/KanbanBoard";
import { BOARD_TYPES } from "../../config/kanbanTypes";

export function SprintBoard({ sprint, tasks, onEditSprint, onTaskMove }) {
	const theme = useTheme();

	const completedTasks = tasks.filter((task) => task.status === "DONE").length;
	const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

	return (
		<Box sx={{ mb: 4 }}>
			<Paper
				elevation={3}
				sx={{
					p: 3,
					borderRadius: 2,
					bgcolor: theme.palette.background.paper,
				}}
			>
				{/* Sprint Header */}
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
						mb: 3,
					}}
				>
					<Box>
						<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
							<Typography variant='h5' fontWeight='bold'>
								{sprint.name}
							</Typography>
							<Chip
								label={sprint.status}
								color={
									sprint.status === "ACTIVE"
										? "success"
										: sprint.status === "COMPLETED"
										? "default"
										: "primary"
								}
								size='small'
							/>
						</Box>

						<Box sx={{ display: "flex", alignItems: "center", gap: 3, color: "text.secondary" }}>
							<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
								<Calendar size={16} />
								<Typography variant='body2'>
									{format(new Date(sprint.startDate), "MMM d")} -{" "}
									{format(new Date(sprint.endDate), "MMM d, yyyy")}
								</Typography>
							</Box>
							<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
								<Target size={16} />
								<Typography variant='body2'>{sprint.goal}</Typography>
							</Box>
						</Box>
					</Box>

					<Box sx={{ display: "flex", gap: 1 }}>
						<Tooltip title='Edit Sprint'>
							<IconButton onClick={() => onEditSprint(sprint)}>
								<Edit size={20} />
							</IconButton>
						</Tooltip>
						<IconButton>
							<MoreVertical size={20} />
						</IconButton>
					</Box>
				</Box>

				{/* Progress Bar */}
				<Box sx={{ mb: 3 }}>
					<Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
						<Typography variant='body2' color='text.secondary'>
							Sprint Progress
						</Typography>
						<Typography variant='body2' color='text.secondary'>
							{completedTasks} of {tasks.length} tasks completed
						</Typography>
					</Box>
					<LinearProgress
						variant='determinate'
						value={progress}
						sx={{
							height: 8,
							borderRadius: 4,
							bgcolor: theme.palette.grey[200],
							"& .MuiLinearProgress-bar": {
								borderRadius: 4,
							},
						}}
					/>
				</Box>

				{/* Kanban Board */}
				<KanbanBoard items={tasks} onItemMove={onTaskMove} type={BOARD_TYPES.SPRINT} />
			</Paper>
		</Box>
	);
}

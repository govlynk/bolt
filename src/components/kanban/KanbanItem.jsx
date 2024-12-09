// src/components/kanban/KanbanItem.jsx
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Paper, Typography, Chip, IconButton } from "@mui/material";
import { Calendar, AlertCircle, Edit, Tag, GripVertical } from "lucide-react";

export function KanbanItem({ item, onUpdate }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	const formatDate = (date) => {
		if (!date) return "N/A";
		return new Date(date).toLocaleDateString();
	};

	return (
		<Paper
			ref={setNodeRef}
			style={style}
			sx={{
				p: 2,
				mb: 2,
				cursor: isDragging ? "grabbing" : "grab",
				"&:hover": {
					boxShadow: 3,
					transform: "translateY(-2px)",
				},
			}}
		>
			<Box sx={{ display: "flex", gap: 1, mb: 2 }}>
				<Box {...attributes} {...listeners} sx={{ cursor: "inherit", color: "text.secondary" }}>
					<GripVertical size={20} />
				</Box>
				<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
					{item.title}
				</Typography>
			</Box>

			<Typography variant='body2' color='text.secondary' noWrap sx={{ mb: 2 }}>
				{item.description}
			</Typography>

			<Box sx={{ display: "flex", gap: 1, mb: 2 }}>
				<Chip
					icon={<AlertCircle size={14} />}
					label={item.priority}
					size='small'
					color={item.priority === "HIGH" ? "error" : item.priority === "MEDIUM" ? "warning" : "default"}
				/>

				<Chip icon={<Calendar size={14} />} label={formatDate(item.dueDate)} size='small' />
			</Box>

			{item.tags?.length > 0 && (
				<Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
					{item.tags.map((tag, index) => (
						<Chip key={index} icon={<Tag size={14} />} label={tag} size='small' variant='outlined' />
					))}
				</Box>
			)}

			{item.estimatedEffort > 0 && (
				<Typography variant='caption' color='text.secondary' display='block' sx={{ mt: 1 }}>
					Progress: {item.actualEffort || 0}/{item.estimatedEffort} hours
				</Typography>
			)}
		</Paper>
	);
}

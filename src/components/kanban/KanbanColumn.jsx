// src/components/kanban/KanbanColumn.jsx
import React from "react";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanItem } from "./KanbanItem";
import { EmptyColumn } from "./EmptyColumn";

export function KanbanColumn({ id, title, items = [], color, limit, onItemUpdate }) {
	const theme = useTheme();
	const { setNodeRef, isOver } = useDroppable({ id });
	const isAtLimit = limit && items.length >= limit;

	return (
		<Paper
			ref={setNodeRef}
			sx={{
				width: 350,
				minWidth: 350,
				height: "100%",
				bgcolor: isOver ? "action.hover" : "background.paper",
				borderTop: `4px solid ${color}`,
				transition: "background-color 0.2s ease",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<Typography variant='h6'>{title}</Typography>
				<Typography
					variant='caption'
					sx={{
						px: 1,
						py: 0.5,
						borderRadius: 1,
						bgcolor: isAtLimit ? "error.light" : "grey.200",
						color: isAtLimit ? "error.contrastText" : "text.secondary",
					}}
				>
					{items.length}
					{limit ? `/${limit}` : ""}
				</Typography>
			</Box>

			<Box
				sx={{
					p: 1,
					flex: 1,
					overflowY: "auto",
					bgcolor: isOver ? "action.hover" : "transparent",
					transition: "background-color 0.2s ease",
				}}
			>
				<SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
					{items.map((item) => (
						<KanbanItem key={item.id} item={item} onUpdate={onItemUpdate} />
					))}
					{items.length === 0 && <EmptyColumn status={id} />}
				</SortableContext>
			</Box>
		</Paper>
	);
}

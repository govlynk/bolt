// src/components/kanban/KanbanBoard.jsx
import React from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";
import { KanbanColumn } from "./KanbanColumn";
import { DEFAULT_BOARDS, BOARD_TYPES } from "../../config/kanbanTypes";

export function KanbanBoard({
	items = [],
	type = BOARD_TYPES.TODO,
	loading = false,
	error = null,
	onItemMove,
	onItemUpdate,
}) {
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 5 },
		}),
		useSensor(KeyboardSensor)
	);

	const boardConfig = DEFAULT_BOARDS[type];
	if (!boardConfig) {
		return <Alert severity='error'>Invalid board type: {type}</Alert>;
	}

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return <Alert severity='error'>{error}</Alert>;
	}

	const handleDragEnd = (event) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const itemId = active.id;
		const newStatus = over.id;
		onItemMove?.(itemId, newStatus);
	};

	return (
		<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
			<Box
				sx={{
					display: "flex",
					overflowX: "auto",
					gap: 2,
					p: 2,
					minHeight: "calc(100vh - 200px)",
				}}
			>
				{Object.entries(boardConfig.columns).map(([key, column]) => (
					<KanbanColumn
						key={column.id}
						id={column.id}
						title={column.title}
						items={items.filter((item) => item.status === column.id)}
						color={column.color}
						limit={column.limit}
						onItemUpdate={onItemUpdate}
					/>
				))}
			</Box>
		</DndContext>
	);
}

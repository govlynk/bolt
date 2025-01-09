import React from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";

const COLUMN_COLORS = {
	BACKLOG: "#D671AE",
	BID: "#ffbd0a",
	REVIEW: "#8FABFB",
	SUBMITTED: "#FF6900",
	WON: "#6ddba6",
	LOST: "#e57373",
};

const COLUMNS = {
	BACKLOG: {
		id: "BACKLOG",
		title: "Backlog",
		color: COLUMN_COLORS.BACKLOG,
		limit: 50,
	},
	BID: {
		id: "BID",
		title: "Preparing Bid",
		color: COLUMN_COLORS.BID,
		limit: 10,
	},
	REVIEW: {
		id: "REVIEW",
		title: "In Review",
		color: COLUMN_COLORS.REVIEW,
		limit: 5,
	},
	SUBMITTED: {
		id: "SUBMITTED",
		title: "Submitted",
		color: COLUMN_COLORS.SUBMITTED,
		limit: null,
	},
	WON: {
		id: "WON",
		title: "Won",
		color: COLUMN_COLORS.WON,
		limit: null,
	},
	LOST: {
		id: "LOST",
		title: "Lost",
		color: COLUMN_COLORS.LOST,
		limit: null,
	},
};

export function KanbanBoard({ opportunities = [], loading, error, onOpportunityMove }) {
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 5 },
		}),
		useSensor(KeyboardSensor)
	);

	const handleDragEnd = (event) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const opportunityId = active.id;
		const newStatus = over.id;
		onOpportunityMove?.(opportunityId, newStatus);
	};

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Alert severity='error' sx={{ m: 2 }}>
				{error}
			</Alert>
		);
	}

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
				<SortableContext items={opportunities.map((opp) => opp.id)} strategy={horizontalListSortingStrategy}>
					{Object.values(COLUMNS).map((column) => (
						<KanbanColumn
							key={column.id}
							id={column.id}
							title={column.title}
							color={column.color}
							limit={column.limit}
							opportunities={opportunities.filter((opp) => opp.status === column.id)}
						/>
					))}
				</SortableContext>
			</Box>
		</DndContext>
	);
}

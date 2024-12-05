import React from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { OpportunityColumn } from "./OpportunityColumn";
import { useOpportunityStore } from "../../stores/opportunityStore";

const COLUMN_COLORS = {
	BACKLOG: "#D671AE",
	BID: "#ffbd0a",
	REVIEW: "#8FABFB",
	SUBMITTED: "#FF6900",
	WON: "#6ddba6",
	LOST: "#e57373",
};

export function OpportunityBoard({ onOpportunityMove, onOpportunityUpdate }) {
	const { opportunities, loading, error, moveOpportunity, boardConfig } = useOpportunityStore();

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 5 },
		}),
		useSensor(KeyboardSensor)
	);

	const handleDragEnd = async (event) => {
		const { active, over } = event;

		if (!over || active.id === over.id) return;

		const opportunityId = active.id;
		const newStatus = over.id;

		try {
			await moveOpportunity(opportunityId, newStatus);
			onOpportunityMove?.(opportunityId, newStatus);
		} catch (err) {
			console.error("Error moving opportunity:", err);
		}
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
				{Object.entries(boardConfig.columns).map(([key, column]) => (
					<OpportunityColumn
						key={key}
						id={key}
						title={column.title}
						opportunities={opportunities.filter((opp) => opp.status === key)}
						color={COLUMN_COLORS[key]}
						limit={column.limit}
						onOpportunityUpdate={onOpportunityUpdate}
					/>
				))}
			</Box>
		</DndContext>
	);
}

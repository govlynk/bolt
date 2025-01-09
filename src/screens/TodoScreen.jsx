import React, { useState, useEffect } from "react";
import { Box, Container, Alert } from "@mui/material";
import { TodoDialog } from "../components/toDo/TodoDialog";
import { TodoHeader } from "../components/toDo/TodoHeader";
import { KanbanBoard } from "../components/toDo/KanbanBoard";
import { useTeamStore } from "../stores/teamStore";
import { useGlobalStore } from "../stores/globalStore";

function TodoScreen() {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editTodo, setEditTodo] = useState(null);
	const { activeCompanyId } = useGlobalStore();
	const { fetchTeams } = useTeamStore();

	// Fetch teams when company changes
	useEffect(() => {
		if (activeCompanyId) {
			fetchTeams(activeCompanyId);
		}
	}, [activeCompanyId, fetchTeams]);

	const handleAddClick = () => {
		setEditTodo(null);
		setDialogOpen(true);
	};

	const handleEditClick = (todo) => {
		setEditTodo(todo);
		setDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
		setEditTodo(null);
	};

	if (!activeCompanyId) {
		return (
			<Container maxWidth={false}>
				<Box sx={{ p: 4 }}>
					<Alert severity='warning'>Please select a company to manage tasks</Alert>
				</Box>
			</Container>
		);
	}

	return (
		<Container maxWidth={false} disableGutters>
			<Box sx={{ p: 4, width: "100%" }}>
				<TodoHeader onAddClick={handleAddClick} />
				<KanbanBoard onEditTodo={handleEditClick} />
				<TodoDialog open={dialogOpen} onClose={handleCloseDialog} editTodo={editTodo} />
			</Box>
		</Container>
	);
}

export default TodoScreen;

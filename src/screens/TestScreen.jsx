// src/screens/TodoScreen.jsx
import React, { useState, useEffect } from "react";
import { Box, Container, Alert } from "@mui/material";
import { TodoDialog } from "../components/toDo/TodoDialog";
import { TodoHeader } from "../components/toDo/TodoHeader";
import { KanbanBoard } from "../components/kanban/KanbanBoard";
import { BOARD_TYPES } from "../config/kanbanTypes";
import { useTeamStore } from "../stores/teamStore";
import { useTodoStore } from "../stores/todoStore";
import { useUserCompanyStore } from "../stores/userCompanyStore";

function TestScreen() {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editTodo, setEditTodo] = useState(null);
	const { getActiveCompany } = useUserCompanyStore();
	const { fetchTeams } = useTeamStore();
	const { todos, loading, error, updateTodo, moveTodo } = useTodoStore();
	const activeCompany = getActiveCompany();

	useEffect(() => {
		if (activeCompany?.id) {
			fetchTeams(activeCompany.id);
		}
	}, [activeCompany?.id, fetchTeams]);

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

	const handleTodoMove = async (todoId, newStatus) => {
		try {
			await moveTodo(todoId, newStatus);
		} catch (err) {
			console.error("Error moving todo:", err);
		}
	};

	if (!activeCompany) {
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
				<KanbanBoard
					items={todos}
					type={BOARD_TYPES.PIPELINE}
					loading={loading}
					error={error}
					onItemMove={handleTodoMove}
					onItemUpdate={handleEditClick}
				/>
				<TodoDialog open={dialogOpen} onClose={handleCloseDialog} editTodo={editTodo} />
			</Box>
		</Container>
	);
}

export default TestScreen;

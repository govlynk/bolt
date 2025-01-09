import React, { useState, useEffect } from "react";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	useDroppable,
	DragOverlay,
} from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Box, Paper, Typography, useTheme, CircularProgress } from "@mui/material";
import { useTodoStore } from "../../stores/todoStore";
import { useTeamStore } from "../../stores/teamStore";
import { useTeamTodoStore } from "../../stores/teamTodoStore";
import { TodoItem } from "./TodoItem";
import { EmptyColumn } from "./EmptyColumn";

const COLUMNS = {
	TODO: "To Do",
	DOING: "In Progress",
	DONE: "Done",
};

const getColumnColors = (mode) => ({
	TODO: {
		default: mode === "dark" ? "grey.900" : "grey.50",
		hover: mode === "dark" ? "grey.800" : "grey.100",
	},
	DOING: {
		default: mode === "dark" ? "#1a365d" : "info.50",
		hover: mode === "dark" ? "#1e4976" : "info.100",
	},
	DONE: {
		default: mode === "dark" ? "#1a4731" : "success.50",
		hover: mode === "dark" ? "#1e5738" : "success.100",
	},
});

function DroppableColumn({ status, title, todos = [], onEditTodo, activeId, teams }) {
	const theme = useTheme();
	const { setNodeRef, isOver } = useDroppable({
		id: status,
	});

	const COLUMN_COLORS = getColumnColors(theme.palette.mode);
	const isActiveContainer = todos.some((todo) => todo.id === activeId);

	const getTeamName = (teamId) => {
		const team = teams.find((t) => t.id === teamId);
		return team ? team.name : null;
	};

	return (
		<Box
			ref={setNodeRef}
			sx={{
				width: "100%",
				maxWidth: 350,
				transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
				transform: isOver ? "scale(1.02)" : "none",
			}}
		>
			<Paper
				sx={{
					p: 2,
					height: "100%",
					bgcolor: isOver ? COLUMN_COLORS[status].hover : COLUMN_COLORS[status].default,
					borderRadius: 2,
					minHeight: 200,
					transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
					outline: isOver ? "2px dashed" : isActiveContainer ? "2px solid" : "none",
					outlineColor: "primary.main",
					boxShadow: isOver ? 4 : 1,
				}}
			>
				<Typography
					variant='h6'
					sx={{
						mb: 2,
						fontWeight: 600,
						p: 1,
						borderRadius: 1,
						bgcolor: "background.paper",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						transition: "all 0.2s ease",
						boxShadow: isOver ? 1 : 0,
					}}
				>
					{title}
					<Typography
						component='span'
						sx={{
							ml: 1,
							px: 1.5,
							py: 0.5,
							borderRadius: "12px",
							bgcolor: isOver ? "primary.main" : theme.palette.mode === "dark" ? "grey.800" : "grey.200",
							color: isOver ? "primary.contrastText" : "text.secondary",
							fontSize: "0.875rem",
							fontWeight: 500,
							transition: "all 0.2s ease",
						}}
					>
						{todos.length}
					</Typography>
				</Typography>
				<Box
					sx={{
						minHeight: 100,
						transition: "all 0.2s ease",
						p: 1,
						borderRadius: 1,
						bgcolor: isOver
							? theme.palette.mode === "dark"
								? "rgba(255, 255, 255, 0.05)"
								: "action.hover"
							: "transparent",
					}}
				>
					<SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
						{todos.map((todo) => (
							<TodoItem
								key={todo.id}
								todo={todo}
								onEdit={onEditTodo}
								isDragging={todo.id === activeId}
								teamName={getTeamName(todo.teamId)}
							/>
						))}
					</SortableContext>
					{todos.length === 0 && <EmptyColumn status={status} />}
				</Box>
			</Paper>
		</Box>
	);
}

export function KanbanBoard({ onEditTodo }) {
	const { todos, updateTodos, fetchTodos, loading, error, cleanup } = useTodoStore();
	const { teams } = useTeamStore();
	const { selectedTeamId } = useTeamTodoStore();
	const [activeId, setActiveId] = useState(null);
	const [activeTodo, setActiveTodo] = useState(null);

	useEffect(() => {
		fetchTodos();
		return () => {
			cleanup();
		};
	}, [fetchTodos, selectedTeamId, cleanup]);

	useEffect(() => {
		const handleTeamChange = () => {
			fetchTodos();
		};

		window.addEventListener("teamChanged", handleTeamChange);
		return () => window.removeEventListener("teamChanged", handleTeamChange);
	}, [selectedTeamId, fetchTodos]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 5 },
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragStart = (event) => {
		const { active } = event;
		setActiveId(active.id);
		setActiveTodo(todos.find((todo) => todo.id === active.id));
		document.body.style.cursor = "grabbing";
	};

	const handleDragEnd = async (event) => {
		const { active, over } = event;
		setActiveId(null);
		setActiveTodo(null);
		document.body.style.cursor = "";

		if (!over || !active) return;

		const activeIndex = todos.findIndex((t) => t.id === active.id);
		if (activeIndex === -1) return;

		const newTodos = [...todos];
		const [draggedTodo] = newTodos.splice(activeIndex, 1);

		if (Object.keys(COLUMNS).includes(over.id)) {
			draggedTodo.status = over.id;
			const targetColumnTodos = todos.filter((t) => t.status === over.id);
			const insertIndex =
				targetColumnTodos.length > 0
					? newTodos.findIndex((t) => t.id === targetColumnTodos[targetColumnTodos.length - 1].id) + 1
					: newTodos.length;
			newTodos.splice(insertIndex, 0, draggedTodo);
		} else {
			const overIndex = todos.findIndex((t) => t.id === over.id);
			if (overIndex === -1) return;

			if (draggedTodo.status === todos[overIndex].status) {
				newTodos.splice(overIndex, 0, draggedTodo);
			} else {
				draggedTodo.status = todos[overIndex].status;
				newTodos.splice(overIndex, 0, draggedTodo);
			}
		}

		try {
			await updateTodos(newTodos);
		} catch (err) {
			console.error("Failed to update todos:", err);
			fetchTodos();
		}
	};

	const handleDragCancel = () => {
		setActiveId(null);
		setActiveTodo(null);
		document.body.style.cursor = "";
	};

	const todosByStatus = Object.keys(COLUMNS).reduce((acc, status) => {
		acc[status] = todos.filter((todo) => todo?.status === status) || [];
		return acc;
	}, {});

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return <Box sx={{ textAlign: "center", color: "error.main", py: 4 }}>Error: {error}</Box>;
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onDragCancel={handleDragCancel}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					width: "100%",
					minHeight: "calc(100vh - 100px)",
					gap: 3,
					mt: 4,
					overflowX: "auto",
					pb: 2,
					"& > *": {
						flex: "0 0 350px",
					},
				}}
			>
				{Object.entries(COLUMNS).map(([status, title]) => (
					<DroppableColumn
						key={status}
						status={status}
						title={title}
						todos={todosByStatus[status] || []}
						onEditTodo={onEditTodo}
						activeId={activeId}
						teams={teams}
					/>
				))}
			</Box>
			<DragOverlay>{activeTodo ? <TodoItem todo={activeTodo} isDragging /> : null}</DragOverlay>
		</DndContext>
	);
}

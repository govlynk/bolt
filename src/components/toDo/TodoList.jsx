import React from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TodoItem } from "./TodoItem";
import { useTodoStore } from "../../stores/todoStore";
import { Box } from "@mui/material";

export function TodoList() {
	const { todos, reorderTodos } = useTodoStore();

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragEnd = (event) => {
		const { active, over } = event;
		if (!over) return;

		if (active.id !== over.id) {
			const oldIndex = todos.findIndex((todo) => todo.id === active.id);
			const newIndex = todos.findIndex((todo) => todo.id === over.id);
			const newTodos = arrayMove(todos, oldIndex, newIndex);
			reorderTodos(newTodos);
		}
	};

	return (
		<Box sx={{ mt: 4 }}>
			<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
				<SortableContext items={todos} strategy={verticalListSortingStrategy}>
					{todos.map((todo) => (
						<TodoItem key={todo.id} todo={todo} />
					))}
				</SortableContext>
			</DndContext>
		</Box>
	);
}

import React, { useState } from "react";
import {
	Box,
	TextField,
	Button,
	Typography,
	List,
	ListItem,
	ListItemText,
	IconButton,
	FormHelperText,
} from "@mui/material";
import { Plus, X } from "lucide-react";
import { FormField } from "../FormField";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableCapability({ capability, onRemove, id }) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<ListItem
			ref={setNodeRef}
			style={style}
			sx={{
				bgcolor: "background.paper",
				mb: 1,
				borderRadius: 1,
				boxShadow: 1,
			}}
		>
			<Box {...attributes} {...listeners} sx={{ cursor: "grab", mr: 2 }}>
				⋮
			</Box>
			<ListItemText primary={capability} />
			<IconButton edge='end' onClick={onRemove} size='small'>
				<X size={18} />
			</IconButton>
		</ListItem>
	);
}

export function SortableListQuestion({ question, value = [], onChange, error }) {
	const [inputValue, setInputValue] = useState("");

	const handleAdd = () => {
		if (inputValue.trim()) {
			const newValue = Array.isArray(value) ? [...value] : [];
			newValue.push(inputValue.trim());
			onChange(newValue);
			setInputValue("");
		}
	};

	const handleRemove = (index) => {
		const newValue = Array.isArray(value) ? [...value] : [];
		newValue.splice(index, 1);
		onChange(newValue);
	};

	const handleDragEnd = (event) => {
		const { active, over } = event;
		if (!active || !over || active.id === over.id) return;

		const oldIndex = value.indexOf(active.id);
		const newIndex = value.indexOf(over.id);

		const newValue = [...value];
		newValue.splice(oldIndex, 1);
		newValue.splice(newIndex, 0, active.id);
		onChange(newValue);
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAdd();
		}
	};

	return (
		<Box sx={{ width: "100%" }}>
			<FormField question={question} error={error}>
				<Box sx={{ mb: 3 }}>
					<TextField
						fullWidth
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder={question.placeholder}
					/>
					<Button startIcon={<Plus size={20} />} onClick={handleAdd} sx={{ mt: 1 }}>
						Add Item
					</Button>
				</Box>

				<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
					<SortableContext items={Array.isArray(value) ? value : []} strategy={verticalListSortingStrategy}>
						<List>
							{Array.isArray(value) &&
								value.map((item, index) => (
									<SortableCapability
										key={item}
										id={item}
										capability={item}
										onRemove={() => handleRemove(index)}
									/>
								))}
						</List>
					</SortableContext>
				</DndContext>

				{question.helpText && <FormHelperText>{question.helpText}</FormHelperText>}
			</FormField>
		</Box>
	);
}

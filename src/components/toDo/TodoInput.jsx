import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useTodoStore } from "../../stores/todoStore";
import { useAuthStore } from "../../stores/authStore";
import { Box, TextField, Select, MenuItem, Button, Grid, Chip, IconButton } from "@mui/material";

export function TodoInput() {
	const user = useAuthStore((state) => state.user);
	const isAdmin = useAuthStore((state) => state.isAdmin);
	const addTodo = useTodoStore((state) => state.addTodo);

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [priority, setPriority] = useState("Medium");
	const [dueDate, setDueDate] = useState("");
	const [adminNotes, setAdminNotes] = useState("");
	const [estimatedEffort, setEstimatedEffort] = useState("");
	const [tagInput, setTagInput] = useState("");
	const [tags, setTags] = useState([]);

	const handleAddTag = (e) => {
		if (e.key === "Enter" && tagInput.trim()) {
			setTags([...new Set([...tags, tagInput.trim().toLowerCase()])]);
			setTagInput("");
		}
	};

	const handleRemoveTag = (tagToRemove) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (title.trim() && description.trim() && dueDate) {
			const todoData = {
				id: crypto.randomUUID(),
				title: title.trim(),
				description: description.trim(),
				priority,
				status: "todo",
				addDate: new Date().toISOString().split("T")[0],
				dueDate,
				estimatedEffort: parseFloat(estimatedEffort) || 0,
				actualEffort: 0,
				tags,
				assignee: {
					name: user?.name || user?.username || "Anonymous",
					email: user?.email || "",
					avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d",
				},
				columnPosition: 1,
			};

			if (isAdmin && adminNotes.trim()) {
				todoData.adminNotes = adminNotes.trim();
			}

			addTodo(todoData);
			setTitle("");
			setDescription("");
			setPriority("Medium");
			setDueDate("");
			setAdminNotes("");
			setEstimatedEffort("");
			setTags([]);
		}
	};

	return (
		<Box component='form' onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
			<TextField
				fullWidth
				label='Task title'
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				variant='outlined'
			/>

			<TextField
				fullWidth
				label='Task description'
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				multiline
				rows={3}
				variant='outlined'
			/>

			{isAdmin && (
				<TextField
					fullWidth
					label='Admin Notes'
					value={adminNotes}
					onChange={(e) => setAdminNotes(e.target.value)}
					multiline
					rows={2}
					variant='outlined'
					sx={{
						"& .MuiOutlinedInput-root": {
							bgcolor: "purple.50",
							"&:hover": {
								bgcolor: "purple.100",
							},
							"&.Mui-focused": {
								bgcolor: "white",
							},
						},
					}}
				/>
			)}

			<Grid container spacing={2}>
				<Grid item xs={12} sm={3}>
					<Select fullWidth value={priority} onChange={(e) => setPriority(e.target.value)} variant='outlined'>
						<MenuItem value='Low'>Low Priority</MenuItem>
						<MenuItem value='Medium'>Medium Priority</MenuItem>
						<MenuItem value='High'>High Priority</MenuItem>
					</Select>
				</Grid>

				<Grid item xs={12} sm={3}>
					<TextField
						fullWidth
						type='date'
						label='Due Date'
						value={dueDate}
						onChange={(e) => setDueDate(e.target.value)}
						variant='outlined'
						InputLabelProps={{ shrink: true }}
					/>
				</Grid>

				<Grid item xs={12} sm={3}>
					<TextField
						fullWidth
						type='number'
						label='Estimated Hours'
						value={estimatedEffort}
						onChange={(e) => setEstimatedEffort(e.target.value)}
						variant='outlined'
						InputProps={{ inputProps: { min: 0, step: 0.5 } }}
					/>
				</Grid>

				<Grid item xs={12} sm={3}>
					<Button fullWidth type='submit' variant='contained' sx={{ height: "100%" }}>
						<Plus />
					</Button>
				</Grid>
			</Grid>

			<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
				<TextField
					fullWidth
					label='Add tags (press Enter)'
					value={tagInput}
					onChange={(e) => setTagInput(e.target.value)}
					onKeyPress={handleAddTag}
					variant='outlined'
				/>
				{tags.length > 0 && (
					<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
						{tags.map((tag) => (
							<Chip
								key={tag}
								label={tag}
								onDelete={() => handleRemoveTag(tag)}
								color='primary'
								variant='outlined'
								size='small'
							/>
						))}
					</Box>
				)}
			</Box>
		</Box>
	);
}

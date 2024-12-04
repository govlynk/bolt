import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Box,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Chip,
	Stack,
	Alert,
} from "@mui/material";
import { Tag, X } from "lucide-react";
import { useTodoStore } from "../../stores/todoStore";
import { useAuthStore } from "../../stores/authStore";
import { useTeamStore } from "../../stores/teamStore";
import { useTeamTodoStore } from "../../stores/teamTodoStore";

const initialFormState = {
	title: "",
	description: "",
	priority: "MEDIUM",
	status: "TODO",
	dueDate: new Date().toISOString().split("T")[0],
	estimatedEffort: "",
	actualEffort: "",
	tags: [],
	position: 0,
	teamId: "",
	assigneeId: "",
};

export function TodoDialog({ open, onClose, editTodo = null }) {
	const user = useAuthStore((state) => state.user);
	const { todos, addTodo, updateTodo } = useTodoStore();
	const { teams } = useTeamStore();
	const selectedTeamId = useTeamTodoStore((state) => state.selectedTeamId);
	const [tagInput, setTagInput] = useState("");
	const [formData, setFormData] = useState(initialFormState);
	const [error, setError] = useState(null);

	// Get current team's members
	const currentTeam = teams.find((team) => team.id === formData.teamId);
	const teamMembers = currentTeam?.members || [];

	useEffect(() => {
		if (!open) {
			setFormData(initialFormState);
			setTagInput("");
			setError(null);
			return;
		}

		if (editTodo) {
			setFormData({
				...editTodo,
				dueDate: new Date(editTodo.dueDate).toISOString().split("T")[0],
				tags: editTodo.tags || [],
				estimatedEffort: editTodo.estimatedEffort || "",
				actualEffort: editTodo.actualEffort || "",
			});
		} else {
			const statusTodos = todos.filter((t) => t.status === "TODO");
			const maxPosition = Math.max(...statusTodos.map((t) => t.position), 0);

			setFormData({
				...initialFormState,
				position: maxPosition + 1,
				assigneeId: user?.sub,
				teamId: selectedTeamId === "all" ? teams[0]?.id || "" : selectedTeamId,
			});
		}
	}, [open, editTodo, user, todos, teams, selectedTeamId]);

	const validateForm = () => {
		if (!formData.title.trim()) {
			setError("Title is required");
			return false;
		}
		if (!formData.description.trim()) {
			setError("Description is required");
			return false;
		}
		if (!formData.dueDate) {
			setError("Due date is required");
			return false;
		}
		if (!user?.sub) {
			setError("User information is missing. Please sign in again.");
			return false;
		}
		if (!formData.teamId) {
			setError("Please select a team");
			return false;
		}
		if (!formData.assigneeId) {
			setError("Please select an assignee");
			return false;
		}
		return true;
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;

		try {
			const todoData = {
				title: formData.title.trim(),
				description: formData.description.trim(),
				tags: formData.tags || [],
				estimatedEffort: parseFloat(formData.estimatedEffort) || 0,
				actualEffort: parseFloat(formData.actualEffort) || 0,
				dueDate: new Date(formData.dueDate).toISOString(),
				status: formData.status || "TODO",
				priority: formData.priority || "MEDIUM",
				position: formData.position || 0,
				assigneeId: formData.assigneeId,
				teamId: formData.teamId,
			};

			if (editTodo) {
				await updateTodo(editTodo.id, todoData);
			} else {
				await addTodo(todoData);
			}
			onClose();
		} catch (error) {
			console.error("Error saving todo:", error);
			setError(error.message || "Failed to save todo");
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setError(null);
	};

	const handleAddTag = (e) => {
		if (e.key === "Enter" && tagInput.trim()) {
			e.preventDefault();
			const newTag = tagInput.trim().toLowerCase();
			if (!formData.tags.includes(newTag)) {
				setFormData((prev) => ({
					...prev,
					tags: [...prev.tags, newTag],
				}));
			}
			setTagInput("");
		}
	};

	const handleRemoveTag = (tagToRemove) => {
		setFormData((prev) => ({
			...prev,
			tags: prev.tags.filter((tag) => tag !== tagToRemove),
		}));
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
			<DialogTitle>{editTodo ? "Edit Task" : "Add New Task"}</DialogTitle>
			<DialogContent>
				<Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
					{error && <Box sx={{ color: "error.main", mb: 2 }}>{error}</Box>}

					<FormControl fullWidth>
						<InputLabel>Team</InputLabel>
						<Select name='teamId' value={formData.teamId} onChange={handleChange} label='Team' required>
							{teams.map((team) => (
								<MenuItem key={team.id} value={team.id}>
									{team.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl fullWidth>
						<InputLabel>Assignee</InputLabel>
						<Select
							name='assigneeId'
							value={formData.assigneeId}
							onChange={handleChange}
							label='Assignee'
							required
							disabled={!formData.teamId}
						>
							{teamMembers.map((member) => (
								<MenuItem key={member.id} value={member.contact?.id}>
									{member.contact?.firstName} {member.contact?.lastName}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<TextField
						fullWidth
						label='Title'
						name='title'
						value={formData.title}
						onChange={handleChange}
						required
						error={error === "Title is required"}
					/>

					<TextField
						fullWidth
						label='Description'
						name='description'
						value={formData.description}
						onChange={handleChange}
						multiline
						rows={3}
						required
						error={error === "Description is required"}
					/>

					<Box sx={{ display: "flex", gap: 2 }}>
						<FormControl fullWidth>
							<InputLabel>Priority</InputLabel>
							<Select name='priority' value={formData.priority} onChange={handleChange} label='Priority'>
								<MenuItem value='LOW'>Low</MenuItem>
								<MenuItem value='MEDIUM'>Medium</MenuItem>
								<MenuItem value='HIGH'>High</MenuItem>
							</Select>
						</FormControl>

						<TextField
							fullWidth
							type='date'
							label='Due Date'
							name='dueDate'
							value={formData.dueDate}
							onChange={handleChange}
							InputLabelProps={{ shrink: true }}
							required
							error={error === "Due date is required"}
						/>
					</Box>

					<Box sx={{ display: "flex", gap: 2 }}>
						<TextField
							fullWidth
							label='Estimated Effort (hours)'
							name='estimatedEffort'
							type='number'
							value={formData.estimatedEffort}
							onChange={handleChange}
							InputProps={{ inputProps: { min: 0, step: 0.5 } }}
						/>
						<TextField
							fullWidth
							label='Actual Effort (hours)'
							name='actualEffort'
							type='number'
							value={formData.actualEffort}
							onChange={handleChange}
							InputProps={{ inputProps: { min: 0, step: 0.5 } }}
						/>
					</Box>

					<Box>
						<TextField
							fullWidth
							label='Add Tags'
							value={tagInput}
							onChange={(e) => setTagInput(e.target.value)}
							onKeyDown={handleAddTag}
							placeholder='Press Enter to add tags'
							helperText='Press Enter to add multiple tags'
						/>
						{formData.tags && formData.tags.length > 0 && (
							<Stack direction='row' spacing={1} sx={{ mt: 1, flexWrap: "wrap", gap: 1 }}>
								{formData.tags.map((tag, index) => (
									<Chip
										key={`${tag}-${index}`}
										icon={<Tag size={14} />}
										label={tag}
										onDelete={() => handleRemoveTag(tag)}
										deleteIcon={<X size={14} />}
										color='secondary'
										variant='outlined'
										sx={{
											bgcolor: "background.paper",
											color: "text.primary",
											"& .MuiChip-icon": {
												color: "inherit",
											},
										}}
									/>
								))}
							</Stack>
						)}
					</Box>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSubmit} variant='contained' color='primary'>
					{editTodo ? "Save Changes" : "Add Task"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

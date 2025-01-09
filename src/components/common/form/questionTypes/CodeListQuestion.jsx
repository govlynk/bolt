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
import { QUESTION_TYPES } from "../questionTypes";

export function CodeListQuestion({ question, value = [], onChange }) {
	const [inputValue, setInputValue] = useState("");
	const [error, setError] = useState("");

	const handleInputChange = (e) => {
		setInputValue(e.target.value);
		setError("");
	};

	const validateInput = (input) => {
		if (question.pattern) {
			const patternRegex = new RegExp(question.pattern);
			if (!patternRegex.test(input)) {
				return "Invalid code format";
			}
		}
		if (question.validation) {
			return question.validation(input);
		}
		return "";
	};

	const handleAddCode = () => {
		if (!inputValue.trim()) return;

		const validationError = validateInput(inputValue);
		if (validationError) {
			setError(validationError);
			return;
		}

		const newCodes = [...(Array.isArray(value) ? value : []), inputValue.trim()];

		if (question.maxItems && newCodes.length > question.maxItems) {
			setError(`Maximum ${question.maxItems} items allowed`);
			return;
		}

		onChange(question.id, newCodes);
		setInputValue("");
		setError("");
	};

	const handleRemoveCode = (indexToRemove) => {
		const newCodes = (Array.isArray(value) ? value : []).filter((_, index) => index !== indexToRemove);
		onChange(question.id, newCodes);
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAddCode();
		}
	};

	return (
		<Box sx={{ width: "100%" }}>
			<Typography variant='h6' gutterBottom>
				{question.title}
				{question.required && <span style={{ color: "error.main" }}> *</span>}
			</Typography>

			<Typography variant='body1' sx={{ mb: 2, color: "text.secondary" }}>
				{question.question}
			</Typography>

			<Box sx={{ display: "flex", gap: 1, mb: 2 }}>
				<TextField
					fullWidth
					value={inputValue}
					onChange={handleInputChange}
					onKeyPress={handleKeyPress}
					error={Boolean(error)}
					helperText={error}
					placeholder={question.placeholder}
					sx={{ flexGrow: 1 }}
				/>
				<Button variant='contained' onClick={handleAddCode} startIcon={<Plus size={20} />}>
					Add
				</Button>
			</Box>

			<List>
				{Array.isArray(value) &&
					value.map((code, index) => (
						<ListItem
							key={index}
							secondaryAction={
								<IconButton edge='end' onClick={() => handleRemoveCode(index)}>
									<X size={20} />
								</IconButton>
							}
						>
							<ListItemText primary={code} />
						</ListItem>
					))}
			</List>

			{question.helpText && <FormHelperText>{question.helpText}</FormHelperText>}
		</Box>
	);
}

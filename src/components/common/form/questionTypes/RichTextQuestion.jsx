import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Info } from "lucide-react";
import { RichTextEditor } from "../RichTextEditor/RichTextEditor";
import { FormField } from "../FormField";
import { getPlainText } from "../../../../utils/richTextUtils";

export function RichTextQuestion({ question, value, onChange, onInfoClick }) {
	const handleEditorChange = React.useCallback(
		(editorContent) => {
			// Don't pass the question.id as the first parameter anymore
			// Just pass the editor content directly
			if (editorContent !== value) {
				onChange(editorContent);
			}
		},
		[onChange, value]
	);

	const validateContent = () => {
		if (question.required && (!value || value === "{}")) {
			return "This field is required";
		}

		if (question.minLength || question.maxLength) {
			const plainText = getPlainText(value);

			if (question.minLength && plainText.length < question.minLength) {
				return `Minimum ${question.minLength} characters required`;
			}

			if (question.maxLength && plainText.length > question.maxLength) {
				return `Maximum ${question.maxLength} characters allowed`;
			}
		}

		return null;
	};

	const error = validateContent();

	return (
		<Box sx={{ width: "100%" }}>
			<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
				<Typography variant='h6' gutterBottom>
					{question.title}
					{question.required && <span style={{ color: "error.main" }}> *</span>}
				</Typography>
				{question?.info && (
					<IconButton size='small' onClick={() => onInfoClick?.(question)} sx={{ mb: 1 }}>
						<Info size={20} />
					</IconButton>
				)}
			</Box>
			<RichTextEditor
				value={value}
				onChange={handleEditorChange}
				placeholder={question.placeholder}
				minHeight={question.minHeight || 300}
				error={Boolean(error)}
			/>
		</Box>
	);
}

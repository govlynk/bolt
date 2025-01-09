import React from "react";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { FormField } from "../FormField";

export function MultipleChoiceQuestion({ question, value = [], onChange }) {
	// Convert value to array if it's not already
	const selectedValues = Array.isArray(value) ? value : [value].filter(Boolean);

	const handleChange = (option) => {
		if (!question.multiple) {
			// Single selection mode
			onChange(selectedValues.includes(option) ? null : option);
			return;
		}

		// Multiple selection mode
		if (option === "None of the above") {
			// Clear all selections if "None of the above" is selected
			onChange(selectedValues.includes(option) ? [] : [option]);
			return;
		}

		// Handle regular options
		const newValues = selectedValues.includes(option)
			? selectedValues.filter((v) => v !== option)
			: [...selectedValues.filter((v) => v !== "None of the above"), option];

		onChange(newValues);
	};

	return (
		<FormField question={question}>
			<FormGroup>
				{question.options.map((option) => (
					<FormControlLabel
						key={option}
						control={
							<Checkbox
								checked={selectedValues.includes(option)}
								onChange={() => handleChange(option)}
								disabled={option !== "None of the above" && selectedValues.includes("None of the above")}
							/>
						}
						label={option}
					/>
				))}
			</FormGroup>
		</FormField>
	);
}

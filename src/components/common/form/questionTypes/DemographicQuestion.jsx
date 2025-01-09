import React from "react";
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Grid, FormHelperText } from "@mui/material";
import { FormField } from "../FormField";

export function DemographicQuestion({ question, value = {}, onChange, error }) {
	const handleFieldChange = (fieldName, fieldValue) => {
		onChange({
			...value,
			[fieldName]: fieldValue,
		});
	};

	const getFieldError = (field) => {
		if (!field.required) return null;
		if (!value[field.name]) return `${field.label} is required`;

		if (field.type === "number") {
			const num = Number(value[field.name]);
			if (field.min && num < field.min) {
				return `Must be at least ${field.min}`;
			}
			if (field.max && num > field.max) {
				return `Must be no more than ${field.max}`;
			}
		}
		return null;
	};

	return (
		<FormField question={question} error={error}>
			<Grid container spacing={3}>
				{question.fields.map((field) => (
					<Grid item xs={12} sm={6} key={field.name}>
						{field.type === "select" ? (
							<FormControl fullWidth error={Boolean(getFieldError(field))}>
								<InputLabel required={field.required}>{field.label}</InputLabel>
								<Select
									value={value[field.name] || ""}
									onChange={(e) => handleFieldChange(field.name, e.target.value)}
									label={field.label}
								>
									{field.options.map((option) => (
										<MenuItem key={option.value} value={option.value}>
											{option.label}
										</MenuItem>
									))}
								</Select>
								{getFieldError(field) && <FormHelperText>{getFieldError(field)}</FormHelperText>}
							</FormControl>
						) : (
							<TextField
								fullWidth
								label={field.label}
								type={field.type}
								value={value[field.name] || ""}
								onChange={(e) => handleFieldChange(field.name, e.target.value)}
								required={field.required}
								error={Boolean(getFieldError(field))}
								helperText={getFieldError(field)}
								inputProps={{
									min: field.min,
									max: field.max,
								}}
							/>
						)}
					</Grid>
				))}
			</Grid>
		</FormField>
	);
}

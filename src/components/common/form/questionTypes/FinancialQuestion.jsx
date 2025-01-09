import React from "react";
import { Box, TextField, Grid, InputAdornment, Typography } from "@mui/material";
import { FormField } from "../FormField";

export function FinancialQuestion({ question, value = {}, onChange, error }) {
	const handleChange = (fieldName, fieldValue) => {
		// Convert empty string to null to avoid NaN issues
		const numValue = fieldValue === "" ? null : Number(fieldValue);

		onChange({
			...value,
			[fieldName]: numValue,
		});
	};

	const formatValue = (val) => {
		return val === null || val === undefined ? "" : val.toString();
	};

	return (
		<FormField question={question} error={error}>
			<Grid container spacing={3}>
				{question.fields.map((field) => (
					<Grid item xs={12} sm={6} key={field.name}>
						<TextField
							fullWidth
							label={field.label}
							type='number'
							value={formatValue(value[field.name])}
							onChange={(e) => handleChange(field.name, e.target.value)}
							required={field.required}
							error={Boolean(error?.[field.name])}
							helperText={error?.[field.name]}
							InputProps={{
								startAdornment: field.prefix && (
									<InputAdornment position='start'>{field.prefix}</InputAdornment>
								),
								endAdornment: field.suffix && <InputAdornment position='end'>{field.suffix}</InputAdornment>,
							}}
							inputProps={{
								min: field.min,
								max: field.max,
								step: field.step || 1,
							}}
						/>
						{field.helpText && (
							<Typography variant='caption' color='text.secondary' sx={{ mt: 0.5, display: "block" }}>
								{field.helpText}
							</Typography>
						)}
					</Grid>
				))}
			</Grid>
		</FormField>
	);
}

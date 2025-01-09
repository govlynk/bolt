import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Alert, CircularProgress } from "@mui/material";

export function BaseFormDialog({
	open,
	onClose,
	title,
	initialData,
	validateForm,
	onSave,
	FormComponent,
	maxWidth = "sm",
}) {
	const [formData, setFormData] = useState({});
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (open) {
			setFormData(initialData || {});
			setErrors({});
		}
	}, [initialData, open]);

	const handleChange = (name, value) => {
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setErrors((prev) => ({
			...prev,
			[name]: "",
			submit: "",
		}));
	};

	const handleSubmit = async () => {
		const validationErrors = validateForm?.(formData);
		if (validationErrors) {
			setErrors(validationErrors);
			return;
		}

		setLoading(true);
		try {
			await onSave(formData);
			onClose();
		} catch (err) {
			console.error("Error saving:", err);
			setErrors((prev) => ({
				...prev,
				submit: err.message || "Failed to save",
			}));
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>
				<Box sx={{ mt: 2 }}>
					{errors.submit && (
						<Alert severity='error' sx={{ mb: 2 }}>
							{errors.submit}
						</Alert>
					)}
					<FormComponent formData={formData} errors={errors} onChange={handleChange} disabled={loading} />
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} disabled={loading}>
					Cancel
				</Button>
				<Button
					onClick={handleSubmit}
					variant='contained'
					disabled={loading}
					startIcon={loading ? <CircularProgress size={20} /> : null}
				>
					{loading ? "Saving..." : "Save"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { IconButton } from "@mui/material";
import { Info } from "lucide-react";

export function FormSection({ title, description, children }) {
	return (
		<Paper sx={{ p: 3, mb: 3 }}>
			{title && (
				<Box sx={{ mb: 3 }}>
					<Typography variant='h6' gutterBottom>
						{title}
					</Typography>
					{description && (
						<Typography variant='body2' color='text.secondary'>
							{description}
						</Typography>
					)}
					<IconButton size='small' onClick={() => onInfoClick?.(question)}>
						<Info size={20} />
					</IconButton>
				</Box>
			)}
			{children}
		</Paper>
	);
}

import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Info } from "lucide-react";

export function FormField({ question, error, children }) {
	return (
		<Box sx={{ mb: 3 }}>
			<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
				<Typography variant='h6'>
					{question.title}
					{question.required && (
						<Typography component='span' color='error' sx={{ ml: 0.5 }}>
							*
						</Typography>
					)}
				</Typography>
				{question.info && (
					<IconButton size='small' onClick={() => onInfoClick?.(question)}>
						<Info size={20} />
					</IconButton>
				)}
			</Box>

			{question.instructions && (
				<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
					{question.instructions}
				</Typography>
			)}

			{children}

			{error && (
				<Typography color='error' variant='caption' sx={{ mt: 1 }}>
					{error}
				</Typography>
			)}
		</Box>
	);
}

import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Info } from "lucide-react";

export function FormStep({ title, description, showInfo = true, onInfoClick, children }) {
	return (
		<Box>
			<Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
				<Box>
					<Typography variant='h5' gutterBottom>
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
				{showInfo && (
					<IconButton onClick={onInfoClick} color='primary' sx={{ ml: "auto" }}>
						<Info />
					</IconButton>
				)}
			</Box>

			{children}
		</Box>
	);
}

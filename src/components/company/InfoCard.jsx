import React from "react";
import { Card, CardContent, Box, Typography, useTheme } from "@mui/material";

export default function InfoCard({ title, icon: Icon, children }) {
	const theme = useTheme();

	return (
		<Card
			elevation={0}
			sx={{
				height: "100%",
				bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.50",
				"&:hover": {
					bgcolor: theme.palette.mode === "dark" ? "grey.700" : "grey.100",
					transform: "translateY(-2px)",
				},
				transition: "all 0.3s ease",
			}}
		>
			<CardContent>
				<Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
					<Icon size={20} />
					<Typography variant='h6' component='h3'>
						{title}
					</Typography>
				</Box>
				{children}
			</CardContent>
		</Card>
	);
}
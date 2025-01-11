import React from "react";
import { Box, Typography, Link } from "@mui/material";

export default function DataField({ label, value, isUrl, isEmail }) {
	if (!value) {
		return (
			<Box sx={{ mb: 1 }}>
				<Typography variant='caption' color='text.secondary' display='block'>
					{label}
				</Typography>
				<Typography variant='body2'>-</Typography>
			</Box>
		);
	}

	let displayValue = value;
	if (isUrl) {
		displayValue = (
			<Link href={value.startsWith("http") ? value : `https://${value}`} target='_blank' rel='noopener noreferrer'>
				{value}
			</Link>
		);
	} else if (isEmail) {
		displayValue = <Link href={`mailto:${value}`}>{value}</Link>;
	}

	return (
		<Box sx={{ mb: 1 }}>
			<Typography variant='caption' color='text.secondary' display='block'>
				{label}
			</Typography>
			<Typography variant='body2'>{displayValue}</Typography>
		</Box>
	);
}
import React from "react";
import { Box, Typography, Rating, FormHelperText } from "@mui/material";
import { Star } from "lucide-react";
import { FormField } from "../FormField";

export function RatingQuestion({ question, value, onChange }) {
	// Ensure value is an object
	const ratings = value || {};

	const handleRatingChange = (category, newValue) => {
		const updatedRatings = {
			...ratings,
			[category]: newValue,
		};
		onChange(updatedRatings);
	};

	return (
		<FormField question={question} error={null}>
			{question.categories.map((category) => (
				<Box key={category} sx={{ mb: 2 }}>
					<Typography variant='subtitle1' gutterBottom>
						{category}
					</Typography>
					<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
						<Rating
							value={ratings[category] || 0}
							onChange={(_, newValue) => handleRatingChange(category, newValue)}
							max={question.maxRating || 5}
							icon={<Star fill='currentColor' />}
							emptyIcon={<Star />}
							sx={{
								"& .MuiRating-icon": {
									color: "primary.main",
								},
							}}
						/>
						{ratings[category] && question.labels && (
							<Typography variant='body2' color='text.secondary'>
								{question.labels[ratings[category]]}
							</Typography>
						)}
					</Box>
				</Box>
			))}
		</FormField>
	);
}

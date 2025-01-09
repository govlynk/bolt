import React from "react";
import { Grid, Typography, Box, CircularProgress } from "@mui/material";
import { OpportunityCard } from "./OpportunityCard";

export function OpportunityList({ opportunities = [] }) {
	if (!opportunities.length) {
		return (
			<Typography color='text.secondary' align='center' sx={{ py: 4 }}>
				No opportunities found.
			</Typography>
		);
	}

	return (
		<Grid container spacing={3}>
			{opportunities.map((opportunity) => (
				<Grid item xs={12} md={6} lg={4} key={opportunity.noticeId}>
					<OpportunityCard opportunity={opportunity} />
				</Grid>
			))}
		</Grid>
	);
}

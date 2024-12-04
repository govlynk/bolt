import React from "react";
import { Box, Typography, Drawer, IconButton, Divider } from "@mui/material";
import { CircleX } from "lucide-react";

export function OpportunityDetailsSidebar({ open, onClose, opportunity }) {
	const formatDate = (dateString) => {
		if (!dateString) return "N/A";
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const formatCurrency = (amount) => {
		if (!amount) return "N/A";
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	};

	return (
		<Drawer
			anchor='right'
			open={open}
			onClose={onClose}
			PaperProps={{
				sx: { width: "400px" },
			}}
		>
			<Box sx={{ p: 3 }}>
				<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
					<Typography variant='h6'>Opportunity Details</Typography>
					<IconButton onClick={onClose}>
						<CircleX />
					</IconButton>
				</Box>

				<Divider sx={{ mb: 3 }} />

				<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
					<Box>
						<Typography variant='subtitle2' color='text.secondary'>
							Title
						</Typography>
						<Typography variant='body1'>{opportunity.title}</Typography>
					</Box>

					<Box>
						<Typography variant='subtitle2' color='text.secondary'>
							Solicitation Number
						</Typography>
						<Typography variant='body1'>{opportunity.solicitationNumber || "N/A"}</Typography>
					</Box>

					<Box>
						<Typography variant='subtitle2' color='text.secondary'>
							Department
						</Typography>
						<Typography variant='body1'>{opportunity.department}</Typography>
					</Box>

					<Box>
						<Typography variant='subtitle2' color='text.secondary'>
							Sub-tier
						</Typography>
						<Typography variant='body1'>{opportunity.subtier || "N/A"}</Typography>
					</Box>

					<Box>
						<Typography variant='subtitle2' color='text.secondary'>
							Office
						</Typography>
						<Typography variant='body1'>{opportunity.office || "N/A"}</Typography>
					</Box>

					<Box>
						<Typography variant='subtitle2' color='text.secondary'>
							Posted Date
						</Typography>
						<Typography variant='body1'>{formatDate(opportunity.postedDate)}</Typography>
					</Box>

					<Box>
						<Typography variant='subtitle2' color='text.secondary'>
							Response Deadline
						</Typography>
						<Typography variant='body1'>{formatDate(opportunity.responseDeadLine)}</Typography>
					</Box>

					{opportunity.placeOfPerformance && (
						<Box>
							<Typography variant='subtitle2' color='text.secondary'>
								Place of Performance
							</Typography>
							<Typography variant='body1'>
								{`${opportunity.placeOfPerformance.state?.name || ""}, 
                  ${opportunity.placeOfPerformance.country?.name || ""}`}
							</Typography>
						</Box>
					)}

					{opportunity.award?.amount && (
						<Box>
							<Typography variant='subtitle2' color='text.secondary'>
								Award Amount
							</Typography>
							<Typography variant='body1'>{formatCurrency(opportunity.award.amount)}</Typography>
						</Box>
					)}

					<Box>
						<Typography variant='subtitle2' color='text.secondary'>
							Set Aside
						</Typography>
						<Typography variant='body1'>{opportunity.setAside || "None"}</Typography>
					</Box>

					<Box>
						<Typography variant='subtitle2' color='text.secondary'>
							NAICS Code
						</Typography>
						<Typography variant='body1'>{opportunity.naicsCode || "N/A"}</Typography>
					</Box>

					{opportunity.description && (
						<Box>
							<Typography variant='subtitle2' color='text.secondary'>
								Description
							</Typography>
							<Typography variant='body2' sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
								{opportunity.description}
							</Typography>
						</Box>
					)}
				</Box>
			</Box>
		</Drawer>
	);
}

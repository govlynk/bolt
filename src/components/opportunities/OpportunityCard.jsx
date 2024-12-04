import React, { useState } from "react";
import { Card, CardContent, CardActions, Typography, Button, Chip, Box, Tooltip, IconButton } from "@mui/material";
import {
	ThumbsUp,
	ThumbsDown,
	Calendar,
	Building2,
	MapPin,
	ExternalLink,
	DollarSign,
	Eye,
	Building,
} from "lucide-react";
import { useOpportunityStore } from "../../stores/opportunityStore";
import { OpportunityDetailsSidebar } from "./OpportunityDetailsSidebar";

export function OpportunityCard({ opportunity }) {
	const { saveOpportunity, rejectOpportunity } = useOpportunityStore();
	const [detailsOpen, setDetailsOpen] = useState(false);

	const handleSave = () => {
		saveOpportunity(opportunity);
	};

	const handleReject = () => {
		rejectOpportunity(opportunity);
	};

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
		<>
			<Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
				<CardContent sx={{ flexGrow: 1 }}>
					<Typography variant='h6' gutterBottom>
						{opportunity.title}
					</Typography>

					<Box sx={{ mb: 2 }}>
						<Chip size='small' label={opportunity.type} color='primary' sx={{ mr: 1 }} />
						{opportunity.setAside && <Chip size='small' label={opportunity.setAside} color='secondary' />}
					</Box>

					<Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							<Building2 size={16} />
							<Typography variant='body2'>{opportunity.department}</Typography>
						</Box>

						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							<Building size={16} />
							<Typography variant='body2'>{opportunity.subtier}</Typography>
						</Box>

						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							<Calendar size={16} />
							<Typography variant='body2'>Posted: {formatDate(opportunity.postedDate)}</Typography>
						</Box>

						{opportunity.responseDeadLine && (
							<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
								<Calendar size={16} />
								<Typography variant='body2' color='error'>
									Due: {formatDate(opportunity.responseDeadLine)}
								</Typography>
							</Box>
						)}

						{opportunity.placeOfPerformance && (
							<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
								<MapPin size={16} />
								<Typography variant='body2'>
									{`${opportunity.placeOfPerformance.state?.name || ""}, 
                    ${opportunity.placeOfPerformance.country?.name || ""}`}
								</Typography>
							</Box>
						)}

						{opportunity.award?.amount && (
							<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
								<DollarSign size={16} />
								<Typography variant='body2'>
									Award Amount: {formatCurrency(opportunity.award.amount)}
								</Typography>
							</Box>
						)}
					</Box>
				</CardContent>

				<CardActions sx={{ justifyContent: "space-between", p: 2 }}>
					<Box>
						<Tooltip title='Save Opportunity'>
							<IconButton onClick={handleSave} color='primary'>
								<ThumbsUp size={20} />
							</IconButton>
						</Tooltip>
						<Tooltip title='Reject Opportunity'>
							<IconButton onClick={handleReject} color='error'>
								<ThumbsDown size={20} />
							</IconButton>
						</Tooltip>
						<Tooltip title='View Details'>
							<IconButton onClick={() => setDetailsOpen(true)} color='info'>
								<Eye size={20} />
							</IconButton>
						</Tooltip>
					</Box>

					<Button
						endIcon={<ExternalLink size={16} />}
						href={opportunity.uiLink}
						target='_blank'
						rel='noopener noreferrer'
					>
						View Details
					</Button>
				</CardActions>
			</Card>

			<OpportunityDetailsSidebar
				open={detailsOpen}
				onClose={() => setDetailsOpen(false)}
				opportunity={opportunity}
			/>
		</>
	);
}

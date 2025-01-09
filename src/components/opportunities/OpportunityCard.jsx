import React, { useState } from "react";
import {
	Card,
	CardContent,
	CardActions,
	Typography,
	Button,
	Chip,
	Box,
	Tooltip,
	IconButton,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
} from "@mui/material";
import { ThumbsUp, ThumbsDown, Calendar, Building2, MapPin, ExternalLink, DollarSign, Eye, Users } from "lucide-react";
import { useOpportunityStore } from "../../stores/opportunityStore";
import { OpportunityDetailsSidebar } from "./OpportunityDetailsSidebar";
import { formatDate, formatCurrency } from "../../utils/formatters";
import { useGlobalStore } from "../../stores/globalStore";
import { useTeamStore } from "../../stores/teamStore";

export function OpportunityCard({ opportunity, type = "new" }) {
	const { saveOpportunity, rejectOpportunity, moveToSaved, loading, error } = useOpportunityStore();
	const [detailsOpen, setDetailsOpen] = useState(false);
	const [localLoading, setLocalLoading] = useState(false);
	const [localError, setLocalError] = useState(null);
	const { activeCompanyId, activeTeamId } = useGlobalStore();
	const { teams } = useTeamStore();
	const [selectedTeamId, setSelectedTeamId] = useState(activeTeamId);

	const handleSave = async () => {
		setLocalLoading(true);
		setLocalError(null);
		try {
			if (type === "rejected") {
				await moveToSaved(opportunity);
			} else {
				await saveOpportunity({
					...opportunity,
					teamId: selectedTeamId,
				});
			}
		} catch (err) {
			console.error("Error saving opportunity:", err);
			setLocalError(err.message || "Failed to save opportunity");
		} finally {
			setLocalLoading(false);
		}
	};

	const handleReject = async () => {
		setLocalLoading(true);
		setLocalError(null);
		try {
			await rejectOpportunity(opportunity);
		} catch (err) {
			console.error("Error rejecting opportunity:", err);
			setLocalError(err.message || "Failed to reject opportunity");
		} finally {
			setLocalLoading(false);
		}
	};

	console.log("OpportunityCard render", opportunity);

	return (
		<>
			<Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
				<CardContent sx={{ flexGrow: 1 }}>
					<Typography variant='h6' gutterBottom>
						{opportunity.title}
					</Typography>

					<Box sx={{ mb: 2 }}>
						<Chip size='small' label={opportunity.type} color='primary' sx={{ mr: 1 }} />
						{opportunity.typeOfSetAside && (
							<Chip size='small' label={opportunity.typeOfSetAside} color='secondary' />
						)}
					</Box>

					<Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							<Building2 size={16} />
							<Typography variant='body2'>{opportunity.department}</Typography>
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

					{type === "new" && (
						<FormControl fullWidth size='small' sx={{ mb: 2 }}>
							<InputLabel>Assign Team</InputLabel>
							<Select
								value={selectedTeamId}
								onChange={(e) => setSelectedTeamId(e.target.value)}
								label='Assign Team'
							>
								{teams.map((team) => (
									<MenuItem key={team.id} value={team.id}>
										<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
											<Users size={16} />
											{team.name}
										</Box>
									</MenuItem>
								))}
							</Select>
						</FormControl>
					)}

					{localError && (
						<Typography color='error' variant='body2' sx={{ mt: 1 }}>
							{localError}
						</Typography>
					)}
				</CardContent>

				<CardActions sx={{ justifyContent: "space-between", p: 2 }}>
					<Box>
						<Tooltip title={type === "saved" ? "Already Saved" : "Save Opportunity"}>
							<span>
								<IconButton
									onClick={handleSave}
									color='primary'
									disabled={localLoading || loading || type === "saved"}
								>
									<ThumbsUp size={20} />
								</IconButton>
							</span>
						</Tooltip>
						<Tooltip title={type === "rejected" ? "Already Rejected" : "Reject Opportunity"}>
							<span>
								<IconButton
									onClick={handleReject}
									color='error'
									disabled={localLoading || loading || type === "rejected"}
								>
									<ThumbsDown size={20} />
								</IconButton>
							</span>
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
						View on SAM.gov
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

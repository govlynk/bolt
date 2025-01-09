import React, { useEffect, useState } from "react";
import { Box, Typography, Tabs, Tab, Alert } from "@mui/material";
import { OpportunityList } from "../components/opportunities/OpportunityList";
import { OpportunitySearch } from "../components/opportunities/OpportunitySearch";
import { useOpportunityStore } from "../stores/opportunityStore";
import { useUserCompanyStore } from "../stores/userCompanyStore";
import { useQueryClient } from "@tanstack/react-query";

export default function OpportunitiesScreen() {
	const [activeTab, setActiveTab] = useState(0);
	const [loading, setLoading] = useState(false);
	const queryClient = useQueryClient();
	const {
		opportunities,
		savedOpportunities,
		rejectedOpportunities,
		error,
		initializeStore,
		saveOpportunity,
		rejectOpportunity,
		moveToSaved,
		resetStore,
	} = useOpportunityStore();
	const { getActiveCompany } = useUserCompanyStore();
	const activeCompany = getActiveCompany();

	useEffect(() => {
		if (activeCompany?.id) {
			initializeStore();
		}
		return () => resetStore();
	}, [activeCompany?.id]);

	const handleTabChange = (event, newValue) => {
		setActiveTab(newValue);
	};

	const handleSaveOpportunity = async (opportunity) => {
		setLoading(true);
		try {
			// Optimistic update
			queryClient.setQueryData(["opportunities"], (old) =>
				old?.filter((opp) => opp.noticeId !== opportunity.noticeId)
			);
			queryClient.setQueryData(["savedOpportunities"], (old) => [
				...(old || []),
				{ ...opportunity, status: "BACKLOG" },
			]);

			await saveOpportunity(opportunity);
		} catch (err) {
			// Revert on error
			queryClient.invalidateQueries(["opportunities"]);
			queryClient.invalidateQueries(["savedOpportunities"]);
			console.error("Error saving opportunity:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleRejectOpportunity = async (opportunity) => {
		setLoading(true);
		try {
			// Optimistic update
			queryClient.setQueryData(["opportunities"], (old) =>
				old?.filter((opp) => opp.noticeId !== opportunity.noticeId)
			);
			queryClient.setQueryData(["rejectedOpportunities"], (old) => [
				...(old || []),
				{ ...opportunity, status: "REJECTED" },
			]);

			await rejectOpportunity(opportunity);
		} catch (err) {
			// Revert on error
			queryClient.invalidateQueries(["opportunities"]);
			queryClient.invalidateQueries(["rejectedOpportunities"]);
			console.error("Error rejecting opportunity:", err);
		} finally {
			setLoading(false);
		}
	};

	if (!activeCompany) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='warning'>Please select a company to view opportunities</Alert>
			</Box>
		);
	}

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant='h4' sx={{ mb: 4, fontWeight: "bold" }}>
				Contract Opportunities
			</Typography>

			<OpportunitySearch />

			<Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
				<Tab label={`New (${opportunities.length})`} id='opportunities-tab-0' />
				<Tab label={`Saved (${savedOpportunities.length})`} id='opportunities-tab-1' />
				<Tab label={`Rejected (${rejectedOpportunities.length})`} id='opportunities-tab-2' />
			</Tabs>

			{error && (
				<Alert severity='error' sx={{ mb: 3 }}>
					{error}
				</Alert>
			)}

			<Box role='tabpanel' hidden={activeTab !== 0}>
				{activeTab === 0 && (
					<OpportunityList
						opportunities={opportunities}
						type='new'
						onSave={handleSaveOpportunity}
						onReject={handleRejectOpportunity}
						loading={loading}
					/>
				)}
			</Box>

			<Box role='tabpanel' hidden={activeTab !== 1}>
				{activeTab === 1 && <OpportunityList opportunities={savedOpportunities} type='saved' loading={loading} />}
			</Box>

			<Box role='tabpanel' hidden={activeTab !== 2}>
				{activeTab === 2 && (
					<OpportunityList
						opportunities={rejectedOpportunities}
						type='rejected'
						onMoveToSaved={moveToSaved}
						loading={loading}
					/>
				)}
			</Box>
		</Box>
	);
}

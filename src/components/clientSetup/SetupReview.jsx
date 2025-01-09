import React, { useState } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSetupWorkflowStore } from "../../stores/setupWorkflowStore";
import { SetupReviewHeader } from "./review/SetupReviewHeader";
import { SetupReviewContent } from "./review/SetupReviewContent";
import { SetupReviewFooter } from "./review/SetupReviewFooter";
import { setupCompany } from "../../utils/setupDbOperations";

export function SetupReview() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { companyData, contactsData, adminData, teamData, resetWorkflow } = useSetupWorkflowStore();

	const handleComplete = async () => {
		setLoading(true);
		setError(null);

		try {
			// Create all entities in the database
			await setupCompany({
				companyData,
				contactsData,
				adminData,
				teamData,
			});

			// Success - reset workflow and redirect
			resetWorkflow();
			navigate("/client-setup");
		} catch (err) {
			console.error("Setup error:", err);
			setError(err.message || "Failed to complete setup");
			setLoading(false);
		}
	};

	return (
		<Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
			<SetupReviewHeader />

			<SetupReviewContent
				companyData={companyData}
				contactsData={contactsData}
				adminData={adminData}
				teamData={teamData}
				error={error}
			/>

			<SetupReviewFooter onComplete={handleComplete} loading={loading} />
		</Box>
	);
}

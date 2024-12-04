import React, { useState } from "react";
import { Box, Stepper, Step, StepLabel, Card, Typography, useTheme } from "@mui/material";
import { CompanySearch } from "../components/clientSetup/CompanySearch";
import { AdminSetup } from "../components/clientSetup/AdminSetup";
import { TeamSetupScreen } from "../components/clientSetup/TeamSetupScreen";
import { SetupReview } from "../components/clientSetup/SetupReview";

const steps = ["Company Information", "Admin Setup", "Team Setup", "Review & Confirm"];

export default function ClientSetupScreen() {
	const theme = useTheme();
	const [activeStep, setActiveStep] = useState(0);
	const [setupData, setSetupData] = useState({
		company: null,
		user: null,
		team: null,
	});

	const handleCompanySelect = (companyData) => {
		console.log("Selected company data:", companyData);
		setSetupData((prev) => ({
			...prev,
			company: companyData,
		}));
		setActiveStep(1);
	};

	const handleAdminSetup = (adminData) => {
		console.log("Admin setup data:", adminData);
		setSetupData((prev) => ({
			...prev,
			user: adminData,
		}));
		setActiveStep(2);
	};

	const handleTeamSetup = (teamData) => {
		console.log("Team setup data:", teamData);
		setSetupData((prev) => ({
			...prev,
			team: teamData,
		}));
		setActiveStep(3);
	};

	const handleBack = () => {
		setActiveStep((prev) => prev - 1);
	};

	const handleSetupComplete = () => {
		// Reset the form and return to first step
		setSetupData({
			company: null,
			user: null,
			team: null,
		});
		setActiveStep(0);
	};

	const renderStepContent = () => {
		switch (activeStep) {
			case 0:
				return <CompanySearch onCompanySelect={handleCompanySelect} />;
			case 1:
				return <AdminSetup onSubmit={handleAdminSetup} onBack={handleBack} companyData={setupData.company} />;
			case 2:
				return <TeamSetupScreen onSubmit={handleTeamSetup} onBack={handleBack} setupData={setupData} />;
			case 3:
				return <SetupReview setupData={setupData} onBack={handleBack} onComplete={handleSetupComplete} />;
			default:
				return null;
		}
	};

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant='h4' sx={{ mb: 4, fontWeight: "bold" }}>
				Client Setup
			</Typography>

			<Card
				sx={{
					p: 4,
					bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.50",
					borderRadius: 2,
					boxShadow: theme.shadows[4],
				}}
			>
				<Stepper
					activeStep={activeStep}
					sx={{
						mb: 4,
						"& .MuiStepLabel-root .Mui-completed": {
							color: "success.main",
						},
						"& .MuiStepLabel-root .Mui-active": {
							color: "primary.main",
						},
					}}
				>
					{steps.map((label) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>

				{renderStepContent()}
			</Card>
		</Box>
	);
}

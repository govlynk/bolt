import React from "react";
import { Box, Stepper, Step, StepLabel, Paper } from "@mui/material";
import { useSetupWorkflowStore } from "../stores/setupWorkflowStore";
import { CompanySearchStep } from "../components/clientSetup/CompanySearchStep";
import { ContactsStep } from "../components/clientSetup/ContactsStep";
import { AdminSetupStep } from "../components/clientSetup/AdminSetupStep";
import { TeamSetupStep } from "../components/clientSetup/TeamSetupStep";
import { SetupReview } from "../components/clientSetup/SetupReview";

const steps = ["Company Search", "Contacts", "Admin Setup", "Team Setup", "Review"];

export default function ClientSetupScreen() {
	const { activeStep, getCompanyData, getContactsData, getAdminData, getTeamData } = useSetupWorkflowStore();

	const renderStep = () => {
		switch (activeStep) {
			case 0:
				return <CompanySearchStep />;
			case 1:
				return <ContactsStep initial={getCompanyData()} />;
			case 2:
				return <AdminSetupStep />;
			case 3:
				return <TeamSetupStep companyData={getCompanyData()} contactsData={getContactsData()} />;
			case 4:
				return (
					<SetupReview
						companyData={getCompanyData()}
						contactsData={getContactsData()}
						adminData={getAdminData()}
						teamData={getTeamData()}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<Box sx={{ p: 3 }}>
			<Paper sx={{ p: 3, mb: 3 }}>
				<Stepper activeStep={activeStep}>
					{steps.map((label) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>
			</Paper>

			{renderStep()}
		</Box>
	);
}

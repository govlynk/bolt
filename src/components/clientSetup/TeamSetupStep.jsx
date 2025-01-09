import React, { useState } from "react";
import { Box, Typography, Alert } from "@mui/material";
import { useSetupWorkflowStore } from "../../stores/setupWorkflowStore";
import { TeamSetupHeader } from "./team/TeamSetupHeader";
import { TeamSetupForm } from "./team/TeamSetupForm";
import { TeamSetupFooter } from "./team/TeamSetupFooter";

export function TeamSetupStep() {
  const { companyData, contactsData, setTeamData, nextStep, prevStep } = useSetupWorkflowStore();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: `${companyData.legalBusinessName} Team`,
    description: `Default team for ${companyData.legalBusinessName}`,
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      setError("Team name is required");
      return;
    }
    setTeamData(formData);
    nextStep();
  };

  if (!companyData || !contactsData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Missing required company or contact data</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <TeamSetupHeader />
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TeamSetupForm
        formData={formData}
        onChange={setFormData}
        companyData={companyData}
        contactsData={contactsData}
      />

      <TeamSetupFooter
        onBack={prevStep}
        onContinue={handleSubmit}
        disabled={!formData.name.trim()}
      />
    </Box>
  );
}
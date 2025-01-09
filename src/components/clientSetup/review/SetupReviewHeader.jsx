import React from "react";
import { Box, Typography, Stepper, Step, StepLabel } from "@mui/material";
import { ClipboardCheck } from "lucide-react";

const SETUP_STEPS = [
  "Company Search",
  "Contacts",
  "Admin Setup",
  "Team Setup",
  "Review"
];

export function SetupReviewHeader() {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <ClipboardCheck size={24} />
        <Box>
          <Typography variant="h5" gutterBottom>
            Setup Review
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review and confirm your company setup details before finalizing
          </Typography>
        </Box>
      </Box>

      <Stepper activeStep={4}>
        {SETUP_STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
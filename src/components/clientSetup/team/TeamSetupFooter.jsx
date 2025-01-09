import React from "react";
import { Box, Button } from "@mui/material";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function TeamSetupFooter({ onBack, onContinue, disabled }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
      <Button onClick={onBack} startIcon={<ArrowLeft />}>
        Back
      </Button>
      <Button 
        variant="contained" 
        onClick={onContinue} 
        disabled={disabled}
        endIcon={<ArrowRight />}
      >
        Continue
      </Button>
    </Box>
  );
}
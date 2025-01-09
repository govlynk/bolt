import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { Building2 } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { DataField } from "./DataField";

export function CompanySection({ company }) {
  return (
    <Paper sx={{ p: 3 }}>
      <SectionHeader 
        icon={Building2} 
        title="Company Information" 
      />

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr" }}>
        <DataField 
          label="Legal Business Name" 
          value={company.legalBusinessName} 
        />
        <DataField 
          label="DBA Name" 
          value={company.dbaName} 
        />
        <DataField 
          label="UEI" 
          value={company.uei} 
        />
        <DataField 
          label="CAGE Code" 
          value={company.cageCode} 
        />
        <DataField 
          label="Email" 
          value={company.companyEmail} 
        />
        <DataField 
          label="Phone" 
          value={company.companyPhoneNumber} 
        />
      </Box>
    </Paper>
  );
}
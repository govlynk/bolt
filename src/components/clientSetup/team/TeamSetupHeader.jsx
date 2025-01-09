import React from "react";
import { Box, Typography } from "@mui/material";
import { Users } from "lucide-react";

export function TeamSetupHeader() {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
        <Users size={24} />
        <Typography variant="h5">Team Setup</Typography>
      </Box>
      <Typography variant="body2" color="text.secondary">
        Create a default team for your organization and assign initial team members
      </Typography>
    </Box>
  );
}
import React from "react";
import { Box, Typography } from "@mui/material";

export function SectionHeader({ icon: Icon, title }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
      <Icon size={20} />
      <Typography variant="h6">{title}</Typography>
    </Box>
  );
}
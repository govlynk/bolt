import React from "react";
import { Box, Card, Typography, Chip } from "@mui/material";
import { Mail, Phone, Building2 } from "lucide-react";

export function TeamMemberCard({ member }) {
  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography variant="subtitle1">
            {member.firstName} {member.lastName}
          </Typography>
          
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
            {(member.email || member.contactEmail) && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Mail size={16} />
                <Typography variant="body2" color="text.secondary">
                  {member.email || member.contactEmail}
                </Typography>
              </Box>
            )}
            
            {(member.phone || member.contactMobilePhone) && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Phone size={16} />
                <Typography variant="body2" color="text.secondary">
                  {member.phone || member.contactMobilePhone}
                </Typography>
              </Box>
            )}
            
            {member.role && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Building2 size={16} />
                <Typography variant="body2" color="text.secondary">
                  {member.role}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Chip 
          label={member.role || "Team Member"} 
          size="small"
          color="primary"
          variant="outlined"
        />
      </Box>
    </Card>
  );
}
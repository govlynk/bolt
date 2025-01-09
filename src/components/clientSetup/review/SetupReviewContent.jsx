import React from "react";
import { Paper, Typography, Divider, Alert, Box } from "@mui/material";
import { CompanySection } from "./sections/CompanySection";
import { TeamSection } from "./sections/TeamSection";
import { ContactsSection } from "./sections/ContactsSection";
import { AdminSection } from "./sections/AdminSection";

export function SetupReviewContent({
  companyData,
  contactsData,
  adminData,
  teamData,
  error
}) {
  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <CompanySection company={companyData} />
        <TeamSection team={teamData} />
        <ContactsSection contacts={contactsData} />
        <AdminSection admins={adminData} />
      </Box>
    </>
  );
}
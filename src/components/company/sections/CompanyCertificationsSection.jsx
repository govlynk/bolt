import React from "react";
import { Box, Chip } from "@mui/material";
import { Award } from "lucide-react";
import InfoCard from "../InfoCard";

export default function CompanyCertificationsSection({ company }) {
	return (
		<InfoCard title='Business Types & Certifications' icon={Award}>
			<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
				{company.sbaBusinessTypeDesc?.map((type, index) => (
					<Chip
						key={index}
						label={type}
						variant='outlined'
						color='secondary'
						sx={{ borderRadius: 1 }}
					/>
				))}
			</Box>
		</InfoCard>
	);
}
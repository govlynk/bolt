import React from "react";
import { Box, Paper, Typography, Chip, Divider } from "@mui/material";
import { CaptionsOff, UserCog } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { DataField } from "./DataField";

const ACCESS_LEVELS = {
	COMPANY_ADMIN: "Company Administrator",
	MANAGER: "Company Manager",
	MEMBER: "Company Member",
	GOVLYNK_ADMIN: "Govlynk Administrator",
	GOVLYNK_MEMBER: "Govlynk Member",
};

export function AdminSection({ admins }) {
	if (!admins?.length) return null;

	console.log("admins", admins);
	return (
		<Paper sx={{ p: 3 }}>
			<SectionHeader icon={UserCog} title='Administrative Users' />

			{admins.map((admin, index) => (
				<React.Fragment key={admin.rowId}>
					{index > 0 && <Divider sx={{ my: 3 }} />}

					<Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr" }}>
						<Box>
							<DataField label='Name' value={`${admin.firstName} ${admin.lastName}`} />
							<DataField label='Email' value={admin.email} />
							<DataField label='Phone' value={admin.phone} />
						</Box>

						<Box>
							<DataField label='Access Level' value={ACCESS_LEVELS[admin.accessLevel]} />
							<DataField label='Cognito ID' value={admin.cognitoId} />
							<Box sx={{ mt: 1 }}>
								<Chip
									label={admin.isAuthorized ? "Authorized" : "Pending"}
									color={admin.isAuthorized ? "success" : "warning"}
									size='small'
								/>
							</Box>
						</Box>
					</Box>
				</React.Fragment>
			))}
		</Paper>
	);
}

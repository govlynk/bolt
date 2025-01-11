import React from "react";
import { Building2 } from "lucide-react";
import InfoCard from "../InfoCard";
import DataField from "../DataField";

export default function CompanyInfoSection({ company }) {
	return (
		<InfoCard title='Company Information' icon={Building2}>
			<DataField label='Legal Business Name' value={company.legalBusinessName} />
			<DataField label='DBA Name' value={company.dbaName} />
			<DataField label='Entity Division' value={company.entityDivisionName} />
			<DataField label='Congressional District' value={company.congressionalDistrict} />
		</InfoCard>
	);
}

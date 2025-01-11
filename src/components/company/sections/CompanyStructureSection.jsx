import React from "react";
import { Building } from "lucide-react";
import InfoCard from "../InfoCard";
import DataField from "../DataField";

export default function CompanyStructureSection({ company }) {
	return (
		<InfoCard title='Organization Structure' icon={Building}>
			<DataField label='Entity Type' value={company.entityTypeDesc} />
			<DataField label='Entity Structure' value={company.entityStructureDesc} />
			<DataField label='Organization Structure' value={company.organizationStructureDesc} />
			<DataField label='Profit Structure' value={company.profitStructureDesc} />
		</InfoCard>
	);
}
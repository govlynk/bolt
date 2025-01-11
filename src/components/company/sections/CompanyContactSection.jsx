import React from "react";
import { Phone } from "lucide-react";
import InfoCard from "../InfoCard";
import DataField from "../DataField";

export default function CompanyContactSection({ company }) {
	return (
		<InfoCard title='Contact Information' icon={Phone}>
			<DataField label='Email' value={company.companyEmail} isEmail />
			<DataField label='Phone' value={company.companyPhoneNumber} />
			<DataField label='Website' value={company.companyWebsite} isUrl />
		</InfoCard>
	);
}

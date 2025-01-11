import React from "react";
import { MapPin } from "lucide-react";
import InfoCard from "../InfoCard";
import DataField from "../DataField";

export default function CompanyAddressSection({ title, address }) {
	const fullAddress = [
		address.line1,
		address.line2,
		[address.city, address.state, address.zip].filter(Boolean).join(", "),
		address.country,
	]
		.filter(Boolean)
		.join("\n");

	return (
		<InfoCard title={title} icon={MapPin}>
			<DataField label='Street Address' value={address.line1} />
			<DataField label='Street Address 2' value={address.line2} />
			<DataField label='City' value={address.city} />
			<DataField label='State' value={address.state} />
			<DataField label='ZIP Code' value={address.zip} />
			<DataField label='Country' value={address.country} />
		</InfoCard>
	);
}
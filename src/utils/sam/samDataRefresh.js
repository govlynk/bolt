import { generateClient } from "aws-amplify/data";
import { getEntity } from "./samApi";
import { formatCompanyData } from "../companyDataMapper";
import { initializeCompanyData } from "../setupUtils";

const client = generateClient();

export async function refreshSamData(company) {
	if (!company?.uei) {
		throw new Error("Company UEI is required");
	}

	// Fetch fresh data from SAM.gov
	const entityData = await getEntity(company.uei);
	console.log("pull raw", entityData);
	const formattedData = formatCompanyData(entityData);
	console.log("pull formatted", formattedData);

	if (!formattedData) {
		throw new Error("No data found for the provided UEI");
	}

	const initializedData = initializeCompanyData(formattedData);
	console.log("pull initialized", initializedData);
	// Update company in database
	const response = await client.models.Company.update({
		id: company.id,
		...initializedData,
		SAMPullDate: new Date().toISOString(),
	});
	console.log("pull response", response);

	return response.data;
}

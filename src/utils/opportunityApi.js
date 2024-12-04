import axios from "axios";

const sanitizeData = (data) => {
	if (!data) return null;

	// Convert data to plain object, removing any Symbol or non-serializable content
	return JSON.parse(JSON.stringify(data));
};

const formatQueryParams = (params) => {
	return Object.entries(params)
		.map(([key, value]) => `${value}`)
		.join("&");
};

const processOpportunityData = (opportunity) => {
	return {
		...opportunity,
		department: opportunity.department?.name || opportunity.departmentName || "N/A",
		subtier: opportunity.subtierAgency?.name || opportunity.subtierAgencyName || "N/A",
		office: opportunity.office?.name || opportunity.officeName || "N/A",
	};
};

export async function getOpportunity(searchParams) {
	const api_key = `&api_key=${import.meta.env.VITE_SAM_API_KEY}`;

	const queryString = formatQueryParams(searchParams);
	const apiUrl = `https://api.sam.gov/opportunities/v2/search?${api_key}&${queryString}`;
	console.log(apiUrl);

	try {
		const response = await axios.get(apiUrl);
		if (response.status !== 200) {
			throw new Error("Network response was not ok");
		}

		// Process each opportunity to ensure department, subtier, and office info is available
		const processedData = response.data.opportunitiesData.map(processOpportunityData);

		// Sanitize the processed data before returning
		const sanitizedData = sanitizeData(processedData);
		return sanitizedData;
	} catch (error) {
		// Handle errors
		const serializedError = new Error(error.message || "Failed to fetch opportunity data");
		throw serializedError;
	}
}

//*******************    Fetch notice   ***************** */
export const fetchNotice = (url, setNotice) => {
	const apiUrl = `${url}` + api_key;

	axios
		.get(apiUrl)
		.then((response) => {
			if (response.status === 404) {
				//****   There was no description available
				setNotice("No description available");
				return;
			}

			let noticeText = convertSentenceCase(response.data.description);
			noticeText ? setNotice(noticeText) : setNotice("empty");
		})
		.catch((error) => {
			// Handle errors
			setNotice("error");
			console.error("There was an error fetching the notice:", error);
		});
};

import axios from "axios";

const processOpportunityData = (opportunity) => {
	if (!opportunity) return null;

	return {
		...opportunity,
		department: opportunity.department?.name || opportunity.departmentName || "N/A",
		subtier: opportunity.subtierAgency?.name || opportunity.subtierAgencyName || "N/A",
		office: opportunity.office?.name || opportunity.officeName || "N/A",
	};
};

export async function getOpportunity(searchParams) {
	if (!import.meta.env.VITE_HG_API_KEY) {
		throw new Error("HighrGov API key is not configured");
	}

	// ****************************
	// Define the Endpoint and Key
	const endpoint = "https://www.highergov.com/api-external/opportunity/";
	const api_key = import.meta.env.VITE_HG_API_KEY;

	// Define Parameters
	let params = {
		last_modified_date: "2023-07-06",
		search_id: "z9zi90apiU_Zyl3T2CUZa",
		page_number: "1",
	};

	// Convert parameters to URL query string
	let query = Object.keys(searchParams)
		.map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(searchParams[k])}`)
		.join("&");

	const apiUrl = `${endpoint}?api_key=${api_key}&${query}`;

	// ****************************

	const maxRetries = 3;
	let lastError;

	for (let i = 0; i < maxRetries; i++) {
		try {
			const response = await axios.get(apiUrl, {
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			});

			console.log("Response", response);
			if (!response.results?.Opportunity) {
				return [];
			}

			// Process and sanitize each opportunity
			const processedData = response.results.Opportunity.filter(Boolean).map(processOpportunityData).filter(Boolean);
			return processedData;
		} catch (error) {
			if (error.response?.status !== 429) {
				throw error;
			}
			lastError = error;

			// Check for "Retry-After" header
			const retryAfter = error.response.headers["retry-after"];
			const delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : Math.pow(2, i) * 1000;
			console.log(`Retrying after ${delay}ms`, retryAfter);

			// Exponential backoff or wait for "Retry-After" duration
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}

	throw lastError;
}

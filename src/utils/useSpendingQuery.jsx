import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Setup SearchFields
const SearchReturnFields = [
	"Award ID",
	"Recipient Name",
	"Recipient Id",
	"Description",
	"Start Date",
	"End Date",
	"Last Modified Date",
	"Award Amount",
	"Awarding Agency",
	"Awarding Sub Agency",
	"Contract Award Type",
	"Award Type",
	"Funding Agency",
	"Funding Sub Agency",
	"Prime Award ID",
	"Prime Recipient Name",
	"Recipient Name",
	"Sub-Award Amount",
];

const awardSearchApi = axios.create({
	baseURL: "https://api.usaspending.gov/api/v2/search/",
});



// ***** getSpendingByAward function
export async function getSpendingByAward(company) {
	try {
		const date = new Date();
		const endDate = `${date.getFullYear()}-${String(
			date.getMonth() + 1
		).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
		const startDate = `${date.getFullYear()}-${String(
			date.getMonth()
		).padStart(2, "0")}-01`;

		// Setup filters using Map
		const filters = {
			time_period: [{
				"start_date": startDate,
				"end_date": endDate
			}],
			award_type_codes: ["A", "B", "C"],
			naics_codes: company.naicsCode,
		};

		// Setup parameters
		const params = {
			limit: 100,
			subawards: "false",
			page: 1,
			fields: SearchReturnFields,
			filters: filters,
		};

		// Invoke USASpending API
		const url = awardSearchApi.defaults.baseURL + "spending_by_award/";
		const headers = {
			"Content-Type": "application/json",
		};
		const response = await awardSearchApi.post(url, params, { headers: headers });

		if (response.status !== 200) {
			throw new Error("Network response was not ok");
		}

		const data = response.data;
		if (!data || data.length === 0) {
			throw new Error("No spending data found");
		}

		return data;
	} catch (error) {
		console.error("Error fetching spending data:", error);
		throw error;
	}
}


// ***** getAwardingAgency function
export async function getAwardingAgency(company) {
	try {
		const date = new Date();
		const endDate = `${date.getFullYear()}-${String(
			date.getMonth() + 1
		).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
		const startDate = `${date.getFullYear()}-${String(
			date.getMonth()
		).padStart(2, "0")}-01`;

    
		// Setup filters using Map
		const filters = {
			category: "awarding_agency",
			time_period: [{
				"start_date": startDate,
				"end_date": endDate
			}],
			award_type_codes: [ "A","B","C","D"],
			naics_codes: company.naicsCode,
		};

		// Setup parameters
		const params = {
			limit: 10,
			subawards: "false",
			page: 1,
			filters: filters,
		};

		// Invoke USASpending API
		const url = awardSearchApi.defaults.baseURL + "/spending_by_category/awarding_agency/";
		const headers = {
			"Content-Type": "application/json",
		};
console.log(url, params, headers);

		const response = await awardSearchApi.post(url, params, { headers: headers });
console.log(response);

		if (response.status !== 200) {
			throw new Error("Network response was not ok");
		}

		const data = response.data;
		if (!data || data.length === 0) {
			throw new Error("No spending data found");
		}

		return data;
	} catch (error) {
		console.error("Error fetching spending data:", error);
		throw error;
	}
}

export const useSpendingQuery = (company) => {
	return useQuery({
		queryKey: ["spending", company],
		queryFn: () => getSpendingByAward(company),
		staleTime: 1000 * 60 * 10,
	});
};
export const useAwardingAgencyQuery = (company) => {
	return useQuery({
		queryKey: ["awardingAgency", company],
		queryFn: () => getAwardingAgency(company),
		staleTime: 1000 * 60 * 10,
	});
};

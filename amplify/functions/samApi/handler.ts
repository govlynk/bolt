import { type Handler } from "aws-lambda";
import axios from "axios";

// Types for API responses and parameters
interface ApiEvent {
	queryStringParameters?: {
		uei?: string;
		action?: "repsAndCerts" | "entity";
	};
}

interface ApiResponse {
	statusCode: number;
	headers: {
		[key: string]: string;
	};
	body: string;
}

// Helper functions
const sanitizeData = (data: any): any => {
	if (!data) return null;
	return JSON.parse(JSON.stringify(data));
};

const buildSamApiUrl = (uei: string, includeSections: string = ""): string => {
	const baseUrl = "https://api.sam.gov/entity-information/v3/entities";
	const params = new URLSearchParams({
		api_key: process.env.SAM_API_KEY || "",
		ueiSAM: uei,
		...(includeSections && { includeSections }),
	});
	return `${baseUrl}?${params.toString()}`;
};

const handleApiResponse = async (response: any, section: string = ""): Promise<any> => {
	if (response.status !== 200) {
		console.error(`SAM API Error: ${response.status}`, response.data);
		throw new Error("Failed to fetch data from SAM API");
	}

	const entityData = response.data.entityData?.[0];
	if (!entityData) {
		console.error("No entity data found in response");
		throw new Error("No entity data found");
	}

	const dataToSanitize = section ? entityData[section] : entityData;
	return sanitizeData(dataToSanitize);
};

export const handler: Handler = async (event: ApiEvent): Promise<ApiResponse> => {
	console.log("Event received:", JSON.stringify(event));

	try {
		const { uei, action } = event.queryStringParameters || {};

		if (!uei) {
			return {
				statusCode: 400,
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				},
				body: JSON.stringify({ error: "UEI parameter is required" }),
			};
		}

		let response;
		let data;

		switch (action) {
			case "repsAndCerts":
				console.log("Fetching reps and certs for UEI:", uei);
				response = await axios.get(buildSamApiUrl(uei, "repsAndCerts"));
				data = await handleApiResponse(response, "repsAndCerts");
				break;

			case "entity":
			default:
				console.log("Fetching entity data for UEI:", uei);
				response = await axios.get(buildSamApiUrl(uei));
				data = await handleApiResponse(response);
				break;
		}

		return {
			statusCode: 200,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
			body: JSON.stringify(data),
		};
	} catch (error: any) {
		console.error("Lambda execution error:", error);

		return {
			statusCode: error.response?.status || 500,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
			body: JSON.stringify({
				error: error.message || "Internal server error",
				details: process.env.NODE_ENV === "development" ? error.stack : undefined,
			}),
		};
	}
};

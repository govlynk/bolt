import axios from "axios";

const sanitizeData = (data) => {
	if (!data) return null;

	// Convert data to plain object, removing any Symbol or non-serializable content
	return JSON.parse(JSON.stringify(data));
};

export async function getEntity(uei) {
	const api_key = `&api_key=${import.meta.env.VITE_SAM_API_KEY}`;
	const url = "https://api.sam.gov/entity-information/v3/entities?" + api_key + `&ueiSAM=${uei}`;

	try {
		const response = await axios.get(url);
		if (response.status !== 200) {
			throw new Error("Network response was not ok");
		}
		console.log(response);
		// Sanitize the data before returning
		const sanitizedData = sanitizeData(response.data.entityData[0]);
		return sanitizedData;
	} catch (error) {
		// Ensure error is serializable
		const serializedError = new Error(error.message || "Failed to fetch entity data");
		throw serializedError;
	}
}

export async function getRepsAndCerts(uei) {
	const api_key = `&api_key=${import.meta.env.VITE_SAM_API_KEY}`;
	const url =
		"https://api.sam.gov/entity-information/v3/entities?" + api_key + `&ueiSAM=${uei}&includeSections=repsAndCerts`;

	try {
		const response = await axios.get(url);
		if (response.status !== 200) {
			throw new Error("Network response was not ok");
		}
		console.log("Reps and Cert", response.data.entityData[0].repsAndCerts);
		// Sanitize the data before returning
		const sanitizedData = sanitizeData(response.data.entityData[0].repsAndCerts);
		return sanitizedData;
	} catch (error) {
		// Ensure error is serializable
		const serializedError = new Error(error.message || "Failed to fetch entity data");
		throw serializedError;
	}
}

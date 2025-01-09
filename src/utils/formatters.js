export const formatCurrency = (amount) => {
	if (!amount) return "N/A";
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
};

export const formatShortDate = (dateString) => {
	if (!dateString) return "N/A";
	try {
		return new Date(dateString).toLocaleDateString(undefined, {
			month: "2-digit",
			day: "2-digit",
		});
	} catch (error) {
		console.error("Error formatting short date:", error);
		return "Invalid Date";
	}
};

export const formatDate = (dateString) => {
	if (!dateString) return "N/A";
	try {
		return new Date(dateString).toLocaleDateString(undefined, {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	} catch (error) {
		console.error("Error formatting date:", error);
		return "Invalid Date";
	}
};

export const formatUrl = (url) => {
	if (!url) return null;
	try {
		// Remove whitespace
		let formattedUrl = url.trim();

		// Add protocol if missing
		if (!formattedUrl.startsWith("http")) {
			formattedUrl = "https://" + formattedUrl;
		}

		// Remove trailing slash
		formattedUrl = formattedUrl.replace(/\/+$/, "");

		// Validate URL
		new URL(formattedUrl);
		return formattedUrl;
	} catch (e) {
		console.warn("Invalid URL:", url);
		return null;
	}
};

export const formatBillions = (value) => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		notation: "compact",
		maximumFractionDigits: 1,
		compactDisplay: "short",
	}).format(value / 1000000000);
};

export const parseAgencyHierarchy = (hierarchyString) => {
	if (!hierarchyString) return null;

	const segments = hierarchyString.split(".");

	return {
		department: segments[0] || "",
		agency: segments[1] || "",
		office: segments.slice(2, -1).join(".") || "",
		subOffice: segments[segments.length - 1] || "",
	};
};

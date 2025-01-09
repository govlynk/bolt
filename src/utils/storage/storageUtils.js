export const getCompanyStoragePath = (companyId, path = "") => {
	if (!companyId) throw new Error("Company ID is required");
	return `company/${companyId}/${path}`.replace(/\/+/g, "/");
};

export const validateStoragePath = (path) => {
	if (!path.startsWith("company/")) {
		throw new Error("Invalid storage path - must start with company/");
	}
	return path;
};

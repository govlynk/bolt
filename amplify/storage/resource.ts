import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
	name: "govlynkWorkDrive",
	access: (allow) => ({
		// Company root directory
		"company/{company_id}/*": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN"]).to(["read", "write", "delete"]),
			allow.entity("identity").to(["read"]),
		],

		// Documents subdirectory
		"company/{company_id}/documents/*": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN"]).to(["read", "write", "delete"]),
			allow.entity("identity").to(["read"]),
		],

		// Contracts subdirectory
		"company/{company_id}/contracts/*": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN"]).to(["read", "write", "delete"]),
			allow.entity("identity").to(["read"]),
		],

		// Certifications subdirectory
		"company/{company_id}/certifications/*": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN"]).to(["read", "write", "delete"]),
			allow.entity("identity").to(["read"]),
		],
	}),
});

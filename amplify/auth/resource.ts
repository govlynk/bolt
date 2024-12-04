import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
	loginWith: {
		// this configures a required "email" attribute
		email: true,
	},
	userAttributes: {
		"custom:display_name": {
			dataType: "String",
			mutable: true,
			maxLen: 16,
			minLen: 1,
		},
		"custom:is_beta_user": {
			dataType: "Boolean",
			mutable: true,
		},
		"custom:started_free_trial": {
			dataType: "DateTime",
			mutable: true,
		},
	},
	// User groups
	groups: ["Admin", "CompanyAdmin", "GovLynkUser", "GovLynkConsultant", "CompanyUser"],
});

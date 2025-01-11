import { defineFunction, secret } from "@aws-amplify/backend";

export const samApi = defineFunction({
	name: "samApi",
	environment: {
		SAM_API_KEY: secret("SAM_API_KEY"),
	},
	entry: "./handler.ts",
});

import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { samApi } from "./functions/samApi/resource";

export const backend = defineBackend({
	auth,
	storage,
	data,
	// Define the function as a custom resource
	samApi,
});

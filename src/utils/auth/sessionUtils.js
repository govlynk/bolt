import { fetchAuthSession } from "aws-amplify/auth";

export async function getAuthSession() {
	const session = await fetchAuthSession();
	if (!session.tokens?.accessToken) {
		throw new Error("Invalid session");
	}
	return session;
}

export function extractUserGroups(session) {
	const groups = session.tokens.accessToken.payload["cognito:groups"] || [];
	return {
		groups,
		isAdmin: groups?.some((group) => ["COMPANY_ADMIN", "GOVLYNK_ADMIN"].includes(group)),
		isGovLynk: groups?.some((group) => group?.toUpperCase().includes("GOVLYNK")),
		isGovLynkAdmin: groups.includes("GOVLYNK_ADMIN"),
	};
}

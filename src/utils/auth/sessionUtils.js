import { fetchAuthSession } from "aws-amplify/auth";

let cachedSession = null;
let sessionExpiry = null;

export async function getAuthSession() {
	// Check if we have a valid cached session
	if (cachedSession && sessionExpiry && Date.now() < sessionExpiry) {
		return cachedSession;
	}

	// Fetch new session
	const session = await fetchAuthSession();
	if (!session.tokens?.accessToken) {
		throw new Error("Invalid session");
	}

	// Cache session with 55 minute expiry (tokens typically expire in 1 hour)
	cachedSession = session;
	sessionExpiry = Date.now() + 55 * 60 * 1000;

	return session;
}

// Cache extracted groups per session
const groupCache = new Map();

export function extractUserGroups(session) {
	const sessionId = session.tokens.accessToken.jti;

	// Return cached groups if available
	if (groupCache.has(sessionId)) {
		return groupCache.get(sessionId);
	}

	const groups = session.tokens.accessToken.payload["cognito:groups"] || [];
	const groupData = {
		groups,
		isAdmin: groups?.some((group) => ["COMPANY_ADMIN", "GOVLYNK_ADMIN"].includes(group)),
		isGovLynk: groups?.some((group) => group?.toUpperCase().includes("GOVLYNK")),
		isGovLynkAdmin: groups.includes("GOVLYNK_ADMIN"),
	};

	// Cache the extracted groups
	groupCache.set(sessionId, groupData);

	return groupData;
}

// Clear caches on logout
export function clearAuthCaches() {
	cachedSession = null;
	sessionExpiry = null;
	groupCache.clear();
}

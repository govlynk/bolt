import { useEffect, useCallback, useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { useGlobalStore } from "./stores/globalStore";
import { useUserCompanyStore } from "./stores/userCompanyStore";
import AppRouter from "./components/layout/AppRouter";
import { getAuthSession, extractUserGroups } from "./utils/auth/sessionUtils";

function AuthenticatedApp({ signOut, user }) {
	const { setActiveUser } = useGlobalStore();
	const { fetchUserCompanies } = useUserCompanyStore();
	const [authInitialized, setAuthInitialized] = useState(false);

	const initializeApp = useCallback(async () => {
		if (!user?.userId) return;

		try {
			// Get auth session and extract groups first
			const session = await getAuthSession();
			const authData = extractUserGroups(session);

			// Initialize user first
			const userData = await setActiveUser({
				id: user.userId,
				email: user.signInDetails?.loginId,
				name: user.username,
				...authData,
			});

			// Then fetch companies if user was initialized successfully
			if (userData?.id) {
				await fetchUserCompanies(userData.id);
			}

			setAuthInitialized(true);
		} catch (err) {
			console.error("Error initializing app:", err);
		}
	}, [user, setActiveUser, fetchUserCompanies]);

	useEffect(() => {
		if (user && !authInitialized) {
			initializeApp();
		}
		return () => {
			// Reset stores on unmount/signout
			if (!user) {
				useGlobalStore.getState().reset();
				useUserCompanyStore.getState().reset();
				setAuthInitialized(false);
			}
		};
	}, [user, initializeApp, authInitialized]);

	// Only render AppRouter after auth is initialized
	return authInitialized ? <AppRouter signOut={signOut} user={user} /> : null;
}

export default function App() {
	return <Authenticator loginMechanisms={["email"]}>{(props) => <AuthenticatedApp {...props} />}</Authenticator>;
}

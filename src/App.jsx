import { useEffect, useCallback } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { useGlobalStore } from "./stores/globalStore";
import { useUserCompanyStore } from "./stores/userCompanyStore";
import AppRouter from "./components/layout/AppRouter";

function AuthenticatedApp({ signOut, user }) {
	const { setActiveUser } = useGlobalStore();
	const { fetchUserCompanies } = useUserCompanyStore();

	const initializeApp = useCallback(async () => {
		if (!user?.userId) return;

		try {
			// Initialize user first
			const userData = await setActiveUser({
				id: user.userId,
				email: user.signInDetails?.loginId,
				name: user.username,
			});

			// Then fetch companies if user was initialized successfully
			if (userData?.id) {
				await fetchUserCompanies(userData.id);
			}
		} catch (err) {
			console.error("Error initializing app:", err);
		}
	}, [user, setActiveUser, fetchUserCompanies]);

	useEffect(() => {
		if (user) {
			initializeApp();
		}
		return () => {
			// Reset stores on unmount/signout
			if (!user) {
				useGlobalStore.getState().reset();
				useUserCompanyStore.getState().reset();
			}
		};
	}, [user, initializeApp]);

	return <AppRouter signOut={signOut} user={user} />;
}

export default function App() {
	return <Authenticator loginMechanisms={["email"]}>{(props) => <AuthenticatedApp {...props} />}</Authenticator>;
}

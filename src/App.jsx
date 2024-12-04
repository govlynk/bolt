import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { useAuthStore } from "./stores/authStore";
import AppRouter from "./components/layout/AppRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
			refetchOnWindowFocus: false,
		},
	},
});

// Separate component to handle authenticated state
const AuthenticatedApp = ({ signOut, user }) => {
	const initializeAuth = useAuthStore((state) => state.initialize);

	React.useEffect(() => {
		if (user) {
			initializeAuth(user);
		}
	}, [user, initializeAuth]);

	return <AppRouter signOut={signOut} user={user} />;
};

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Authenticator loginMechanisms={["email"]}>{(props) => <AuthenticatedApp {...props} />}</Authenticator>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}

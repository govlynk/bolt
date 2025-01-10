import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "./context/ThemeContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "@aws-amplify/ui-react/styles.css";
import outputs from "../amplify_outputs.json";

// Configure Amplify with outputs
Amplify.configure(outputs);

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
			cacheTime: 30 * 60 * 1000, // Keep unused data for 30 minutes
			retry: 3,
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
		},
	},
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(
	<StrictMode>
		<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
			<Authenticator.Provider>
				<QueryClientProvider client={queryClient}>
					<ThemeProvider>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<CssBaseline />
							<App />
						</LocalizationProvider>
					</ThemeProvider>
				</QueryClientProvider>
			</Authenticator.Provider>
		</BrowserRouter>
	</StrictMode>
);

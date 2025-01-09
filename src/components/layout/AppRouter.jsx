import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, memo } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useGlobalStore } from "../../stores/globalStore";
import MainLayout from "../layout/MainLayout";
import NotFoundPage from "../../screens/NotFoundPage";

// Loading component
const LoadingScreen = () => (
	<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
		<CircularProgress />
	</Box>
);

// Lazy loaded components
const TodoScreen = lazy(() => import("../../screens/TodoScreen"));

//Sales
const OpportunitiesScreen = lazy(() => import("../../screens/OpportunitiesScreen"));
const PipelineScreen = lazy(() => import("../../screens/PipelineScreen"));
<<<<<<< HEAD
const CalendarScreen = lazy(() => import("../../screens/CalendarScreen"));

=======
//Market Positioning
const SpendingAnalysisScreen = lazy(() => import("../../screens/SpendingAnalysisScreen"));
const PastPerformanceScreen = lazy(() => import("../../screens/PastPerformanceScreen"));
const CertificationScreen = lazy(() => import("../../screens/CertificationScreen"));
//Profile
const StrategicPositioiningScreen = lazy(() => import("../../screens/StrategicPositioiningScreen"));
const MaturityAssessmentScreen = lazy(() => import("../../screens/MaturityAssessmentScreen"));
const SAMRegistrationScreen = lazy(() => import("../../screens/SAMRegistrationScreen"));

//Regulation
const RegulationManagement = lazy(() => import("../../screens/RegulationManagement"));
>>>>>>> 6feb7bd0e713936b092e3afb358aaebe05462b05
const FileBrowserScreen = lazy(() => import("../../screens/FileBrowserScreen"));
//Admin
const ClientSetupScreen = lazy(() => import("../../screens/ClientSetupScreen"));

//Development
const TestScreen = lazy(() => import("../../screens/TestScreen"));

const ProtectedRoute = ({ children, requiredGroups }) => {
	const { activeUserData } = useGlobalStore();

	// Add null check for requiredGroups and activeUserData.groups
	const isAllowed =
		requiredGroups && activeUserData?.groups
			? requiredGroups.some((requiredGroup) => activeUserData.groups.includes(requiredGroup))
			: false;

	if (!isAllowed) {
		return <Navigate to='/' />;
	}
	return children;
};

const AppRouter = ({ signOut }) => {
	const { activeUserData } = useGlobalStore();
	const isGovLynkAdmin = activeUserData?.isGovLynk;

	return (
		<Routes>
			<Route path='/' element={<MainLayout signOut={signOut} />}>
				<Route
					index
					element={
						<Suspense fallback={<LoadingScreen />}>
							<TodoScreen />
						</Suspense>
					}
				/>

				{/* Sales */}
				<Route
					path='opportunities'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<OpportunitiesScreen />
						</Suspense>
					}
				/>
				<Route
					path='pipeline'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<PipelineScreen />
						</Suspense>
					}
				/>
				<Route
					path='calendar'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<CalendarScreen />
						</Suspense>
					}
				/>

				{/* Management */}
				<Route
					path='todos'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<TodoScreen />
						</Suspense>
					}
				/>

				<Route
					path='company-files'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<FileBrowserScreen />
						</Suspense>
					}
				/>

				{/* Protected GovLynk Routes */}
				<Route
					path='client-setup'
					element={
						<ProtectedRoute isAllowed={["GOVLYNK_ADMIN"]}>
							<Suspense fallback={<LoadingScreen />}>
								<ClientSetupScreen />
							</Suspense>
						</ProtectedRoute>
					}
				/>

				{/* Development */}
				<Route
					path='test'
					element={
						<ProtectedRoute isAllowed={["COMPANY_ADMIN"]}>
							<Suspense fallback={<LoadingScreen />}>
								<TestScreen />
							</Suspense>
						</ProtectedRoute>
					}
				/>

<<<<<<< HEAD
=======
				{/* Profile */}
				<Route
					path='sam'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<SAMRegistrationScreen />
						</Suspense>
					}
				/>
				<Route
					path='maturity'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<MaturityAssessmentScreen />
						</Suspense>
					}
				/>
				<Route
					path='far'
					element={
						<Suspense fallback={<LoadingScreen />}>
							<RegulationManagement />
						</Suspense>
					}
				/>

>>>>>>> 6feb7bd0e713936b092e3afb358aaebe05462b05
				{/* 404 */}
				<Route path='*' element={<NotFoundPage />} />
			</Route>
		</Routes>
	);
};

export default memo(AppRouter); // Memoize the component

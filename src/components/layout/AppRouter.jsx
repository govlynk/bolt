import { Routes, Route } from "react-router-dom";

import OpportunitiesScreen from "../../screens/OpportunitiesScreen";
import NotFoundPage from "../../screens/NotFoundPage";
import MainLayout from "../layout/MainLayout";

const AppRouter = ({ signOut, user }) => {
	return (
		<Routes>
			<Route path='/' element={<MainLayout signOut={signOut} />}>
				<Route path='opportunities' element={<OpportunitiesScreen />} />
				<Route path='*' element={<NotFoundPage />} />
			</Route>
		</Routes>
	);
};

export default AppRouter;

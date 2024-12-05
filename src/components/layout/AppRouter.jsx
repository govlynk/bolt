import { Routes, Route } from "react-router-dom";

import OpportunitiesScreen from "../../screens/OpportunitiesScreen";
import PipelineScreen from "../../screens/PipelineScreen";
import NotFoundPage from "../../screens/NotFoundPage";
import MainLayout from "../layout/MainLayout";
import TodoScreen from "../../screens/TodoScreen";

const AppRouter = ({ signOut, user }) => {
	return (
		<Routes>
			<Route path='/' element={<MainLayout signOut={signOut} />}>
				<Route index element={<TodoScreen />} />
				<Route path='todos' element={<TodoScreen />} />
				<Route path='opportunities' element={<OpportunitiesScreen />} />
				<Route path='pipeline' element={<PipelinesScreen />} />
				<Route path='*' element={<NotFoundPage />} />
			</Route>
		</Routes>
	);
};

export default AppRouter;

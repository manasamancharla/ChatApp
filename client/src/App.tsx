import { Route, Routes } from "react-router-dom";

import { ROLES } from "./config/roles";
import Layout from "./components/Layout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/Dashboard";
import PersistLogin from "./pages/auth/PersistLogin";
import RequireAuth from "./pages/auth/RequireAuth";

import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
	return (
		<>
			<div className="w-screen h-auto min-h-[100vh] flex flex-col">
				<main className="w-full h-auto">
					<Routes>
						<Route path="/" element={<Layout />}>
							{/* Public routes */}

							<Route index element={<Login />} />
							<Route path="login" element={<Login />} />
							<Route path="signup" element={<Signup />} />

							{/* Private routes */}
							<Route element={<PersistLogin />}>
								<Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
									<Route path="admindashboard" element={<AdminDashboard />} />
								</Route>
							</Route>

							<Route element={<PersistLogin />}>
								<Route
									element={<RequireAuth allowedRoles={[ROLES.Customer]} />}
								>
									<Route path="dashboard" element={<Dashboard />} />
								</Route>
							</Route>

							{/* Catch all routes */}
						</Route>
					</Routes>
				</main>
			</div>
		</>
	);
};

export default App;

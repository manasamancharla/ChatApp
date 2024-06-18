import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

const App = () => {
	return (
		<>
			<div className="w-screen h-auto min-h-[100vh] flex flex-col">
				<main className="w-full h-auto">
					<Routes>
						<Route path="/" element={<Layout />}>
							<Route index element={<Login />} />
							<Route path="login" element={<Login />} />
							<Route path="register" element={<Register />} />
							<Route path="dashboard" element={<Dashboard />} />
						</Route>
					</Routes>
				</main>
			</div>
		</>
	);
};

export default App;

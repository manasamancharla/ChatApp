import { useNavigate, Link } from "react-router-dom";

import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import useAuth from "../hooks/useAuth";

const AdminDashboard = () => {
	const { username, status } = useAuth();
	const navigate = useNavigate();

	const [sendLogout, { isLoading }] = useSendLogoutMutation();

	const handleLogout = async () => {
		try {
			await sendLogout();
			navigate("/login");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	return (
		<>
			<h1>Admin Dashboard</h1>
			<p>{isLoading}</p>
			<p>Username: {username}</p>

			<button title="Logout" onClick={handleLogout}>
				Logout
			</button>
		</>
	);
};

export default AdminDashboard;

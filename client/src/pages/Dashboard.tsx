import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

import { useSendLogoutMutation } from "../features/auth/authApiSlice";

interface DecodedToken {
	UserInfo: {
		username: string;
		roles: string[];
	};
}

const Dashboard = () => {
	const token = useSelector(selectCurrentToken);
	const navigate = useNavigate();

	let username = "";
	let roles: string[] = [];

	if (token) {
		const decoded = jwtDecode<DecodedToken>(token);
		username = decoded.UserInfo.username;
		roles = decoded.UserInfo.roles;

		console.log(roles);
	}

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
			<h1>Dashboard</h1>
			<p>{isLoading}</p>
			<p>Username: {username}</p>

			<button title="Logout" onClick={handleLogout}>
				Logout
			</button>
		</>
	);
};

export default Dashboard;

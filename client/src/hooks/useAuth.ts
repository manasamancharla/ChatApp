import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
	UserInfo: {
		username: string;
		role: string[];
	};
}

const useAuth = () => {
	const token = useSelector(selectCurrentToken);
	let isAdmin = false;
	let status = "Customer";

	if (token) {
		try {
			const decoded = jwtDecode<DecodedToken>(token);
			const { username, role } = decoded.UserInfo;

			console.log(decoded);

			isAdmin = role.includes("Admin");

			if (isAdmin) status = "Admin";

			return { username, role, status, isAdmin };
		} catch (error) {
			console.error("Error decoding token:", error);
		}
	}
	return { username: "", role: [], isAdmin, status };
};

export default useAuth;

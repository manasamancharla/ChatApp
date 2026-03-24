import { apiSlice } from "../api/apiSlice";
import { logOut, setCredentials } from "./authSlice"; // importing action creators

interface Credentials {
	username: string;
	password: string;
}

interface RegisterResponse {
	accessToken: string;
	message: string;
}

interface LoginResponse {
	accessToken: string;
}

interface RefreshResponse {
	accessToken: string;
}

export const authApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		register: builder.mutation<RegisterResponse, Credentials>({
			// <response data type, type of arg>
			query: (credentials) => ({
				url: "/auth/register",
				method: "POST",
				body: credentials,
			}),
		}),

		login: builder.mutation<LoginResponse, Credentials>({
			query: (credentials) => ({
				url: "/auth",
				method: "POST",
				body: credentials,
			}),
		}),

		sendLogout: builder.mutation<void, void>({
			query: () => ({
				url: "/auth/logout",
				method: "POST",
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					console.log(data);
					dispatch(logOut());
					setTimeout(() => {
						dispatch(apiSlice.util.resetApiState());
					}, 1000);
				} catch (err) {
					console.log(err);
				}
			},
		}),

		refresh: builder.mutation<RefreshResponse, void>({
			query: () => ({
				url: "/auth/refresh",
				method: "GET",
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					// console.log(data);
					const { accessToken } = data;
					dispatch(setCredentials({ accessToken }));
				} catch (err) {
					console.log(err);
				}
			},
		}),
	}),
});

export const {
	useRegisterMutation,
	useLoginMutation,
	useSendLogoutMutation,
	useRefreshMutation,
} = authApiSlice;

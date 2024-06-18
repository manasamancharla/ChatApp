import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../app/store";

import { setCredentials } from "../auth/authSlice";

interface RefreshResult {
	accessToken: string;
}

const baseQuery = fetchBaseQuery({
	baseUrl: "http://localhost:3500",
	credentials: "include",
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).auth.token;

		if (token) {
			headers.set("authorization", `Bearer ${token}`);
		}

		return headers;
	},
});

// intercepts requests, handles authentication token refreshing,
// and retries the original request with the new token if necessary.

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
	// console.log(args) // request url, method, body
	// console.log(api) // signal, dispatch, getState()
	// console.log(extraOptions) //custom like {shout: true}

	let result = await baseQuery(args, api, extraOptions);

	if (result?.error?.status === 403) {
		console.log("sending refresh token");

		const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

		if (refreshResult?.data) {
			// api.dispatch(setCredentials({ ...refreshResult.data }));

			const data = refreshResult.data as RefreshResult;
			api.dispatch(setCredentials({ accessToken: data.accessToken }));

			// retry original query with new access token
			result = await baseQuery(args, api, extraOptions);
		} else {
			if (refreshResult?.error?.status === 403) {
				(refreshResult.error.data as { message: string }).message =
					"Your login has expired.";
			}
			return refreshResult;
		}
	}

	return result;
};

export const apiSlice = createApi({
	baseQuery: baseQueryWithReauth,
	tagTypes: ["Customer"],
	endpoints: (builder) => ({}),
});

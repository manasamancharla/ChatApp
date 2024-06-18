import { useState, useEffect, FormEvent } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { InputField } from "../components/ui/InputField";
import { setCredentials } from "../features/auth/authSlice";
import { useLoginMutation } from "../features/auth/authApiSlice";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [login, { isLoading }] = useLoginMutation();

	const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value);
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		try {
			const { accessToken } = await login({ username, password }).unwrap();
			dispatch(setCredentials({ accessToken }));
			setUsername("");
			setPassword("");
			navigate("/dashboard");
		} catch (err: any) {
			if (!err.status) {
				alert("No Server Response");
			} else if (err.status === 400) {
				alert("Missing Username or Password");
			} else if (err.status === 401) {
				alert("Unauthorized");
			} else {
				alert(err.data?.message);
			}
		}
	};

	useEffect(() => {
		console.log(username);
		console.log(password);
	}, [username, password]);

	return (
		<>
			<div className="flex flex-col md:flex-row h-[calc(100vh-0rem)] w-full p-4">
				<div className="hidden lg:block flex-1 h-full">
					<img
						src="/auth.jpg"
						alt=""
						className="object-cover h-full w-full rounded-lg"
					/>
				</div>
				<form className="flex-1 h-full" onSubmit={handleSubmit}>
					<div className="flex min-h-full flex-col py-12 lg:px-10 justify-center items-center gap-2">
						<h2 className="mt-10 text-2xl font-bold text-slate-500">
							Sign in to your account
						</h2>

						<InputField
							name="Username"
							type="text"
							value={username}
							required={false}
							onChange={handleUsernameChange}
						/>

						<div className="w-full flex justify-center">
							<div className="w-full sm:max-w-[400px] lg:min-w-[400px]">
								<label
									htmlFor="password"
									className="block text-sm font-medium mb-1 leading-6"
								>
									Password
								</label>
								<div className="flex w-full rounded-md border-0 p-1.5 sm:text-sm sm:leading-6 ring-1 ring-inset">
									<input
										id="password"
										name="password"
										type="text"
										required
										value={password}
										onChange={handlePasswordChange}
										className="focus:outline-none flex-1"
									/>
									<button
										type="button"
										id="togglePassword"
										className="focus:outline-none h-full p-1"
									>
										<IoEyeOutline size={20} />
									</button>
								</div>
							</div>
						</div>

						<div className="flex items-center justify-between w-full sm:max-w-[400px] lg:min-w-[400px] mb-1">
							<div className="flex items-center justify-center gap-1">
								<input
									type="checkbox"
									value=""
									className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded"
								/>
								<label className="text-sm font-medium">Remember me</label>
							</div>

							<p className="text-sm font-medium">Forgot password?</p>
						</div>

						<button
							type="submit"
							className="text-white w-full max-w-[400px] bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						>
							Login
						</button>

						<div className="w-full sm:max-w-[400px] lg:min-w-[400px] mt-2">
							<p className="text-sm flex justify-center">
								Don't have an account? &nbsp; <a href="">Sign up</a>
							</p>
						</div>

						{/* Divider */}
						{/* <div className="flex items-center w-full max-w-[400px]">
							<div className="border border-stone-200 flex-1"></div>
							<p className="mx-3 text-center text-slate-500">Or</p>
							<div className="border border-stone-200 flex-1"></div>
						</div> */}
					</div>
				</form>
			</div>
		</>
	);
};

export default Login;

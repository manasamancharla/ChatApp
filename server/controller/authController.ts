import { Request, Response, NextFunction } from "express";
import { User, IUser } from "../models/User";
import bcrypt from "bcrypt";
import jwt, { VerifyErrors } from "jsonwebtoken";
import asyncHandler from "express-async-handler";

import generateRefreshToken from "../utils/generateRefreshToken";

// @desc Register
// @route POST /auth
// @access Public

const register = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { username, password, role } = req.body;

		// Input Validation
		if (!username || !password) {
			res.status(400).json({ message: "All fields are required" });
			return;
		}

		// Check for duplicate usernames
		const duplicateUser = await User.findOne({ username }).exec();
		if (duplicateUser) {
			res.status(409).json({ message: "Username already taken" });
			return;
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = new User({
			username,
			password: hashedPassword,
			role,
		});

		await newUser.save();

		const accessToken = jwt.sign(
			{
				UserInfo: {
					username: newUser.username,
					role: newUser.role,
				},
			},
			process.env.ACCESS_TOKEN_SECRET as string,
			{ expiresIn: "30m" }
		);

		generateRefreshToken(res, { username: newUser.username });

		res.status(201).json({
			accessToken,
			message: "User registered successfully",
		});

		return;
	}
);

// @desc Login
// @route POST /auth
// @access Public

const login = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { username, password } = req.body;

		if (!username || !password) {
			res.status(400).json({ message: "All fields are required" });
			return;
		}

		const foundUser: IUser | null = await User.findOne({ username }).exec();

		if (!foundUser) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		const match = await bcrypt.compare(password, foundUser.password);

		if (!match) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}
		const accessToken = jwt.sign(
			{
				UserInfo: {
					username: foundUser.username,
					role: foundUser.role,
				},
			},
			process.env.ACCESS_TOKEN_SECRET as string,
			{ expiresIn: "30m" }
		);

		generateRefreshToken(res, { username: foundUser.username });

		// Send accessToken containing username and roles
		res.json({ accessToken });
	}
);

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired

const refresh = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const cookies = req.cookies;

		if (!cookies?.jwt) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		const refreshToken = cookies.jwt;

		jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET as string,
			async (err: VerifyErrors | null, decoded: any) => {
				if (err) {
					return res.status(403).json({ message: "Forbidden" });
				}

				const foundUser: IUser | null = await User.findOne({
					username: decoded.username,
				}).exec();

				if (!foundUser) {
					return res.status(401).json({ message: "Unauthorized" });
				}

				const accessToken = jwt.sign(
					{
						UserInfo: {
							username: foundUser.username,
							role: foundUser.role,
						},
					},
					process.env.ACCESS_TOKEN_SECRET as string,
					{ expiresIn: "30m" }
				);

				res.json({ accessToken });
			}
		);
	}
);

// @desc Logout
// @route POST /auth/logout
// @access Public - to clear cookie if exists

const logout = (req: Request, res: Response) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204); //No content
	res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
	res.json({ message: "Cookie cleared" });
};

export { register, login, refresh, logout };

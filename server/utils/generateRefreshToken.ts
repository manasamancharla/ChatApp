import jwt from "jsonwebtoken";
import { Response } from "express";

interface IUserPayload {
	username: string;
}

const generateRefreshToken = (res: Response, userpayload: IUserPayload) => {
	const refreshToken = jwt.sign(
		userpayload,
		process.env.REFRESH_TOKEN_SECRET as string,
		{ expiresIn: "7d" }
	);

	// Create secure cookie with refresh token
	res.cookie("jwt", refreshToken, {
		httpOnly: true, //accessible only by web server
		secure: true, //https
		// secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
		sameSite: "none", //cross-site cookie or "strict"
		maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
	});
};

export default generateRefreshToken;

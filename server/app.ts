import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/dbConfig";
import { errorHandler } from "./middleware/errorHandler";
import { logger, logEvents } from "./middleware/logger";
import { corsOptions } from "./config/corsOptions";
import authRoutes from "./routes/authRoutes";

dotenv.config();
const app: Express = express();

const PORT = process.env.PORT || 3500;

connectDB();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
	res.send("Express + TypeScript Server");
});

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/auth", authRoutes);

app.use(errorHandler);

mongoose.connection.once("open", () => {
	app.listen(PORT, () => {
		console.log(`[server] Server is running at http://localhost:${PORT}`);
	});
});

mongoose.connection.on("error", (err) => {
	console.log(err);
	logEvents(
		`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
		"mongoErrLog.log"
	);
});

import express, { Router } from "express";
import { loginLimiter } from "../middleware/loginLimiter";
import { register, login, refresh, logout } from "../controller/authController";

const router: Router = express.Router();

router.route("/").post(loginLimiter, login);

router.route("/register").post(loginLimiter, register);

router.route("/refresh").get(refresh);

router.route("/logout").post(logout);

export default router;

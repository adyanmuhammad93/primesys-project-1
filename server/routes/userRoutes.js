import { Router } from "express";
import { signUp, logIn } from "../services/userServices.js";

const userRoutes = Router();

userRoutes.post("/signup", async (req, res) => {
  const user = await signUp(req.body);
  res.json(user);
});

userRoutes.post("/login", async (req, res) => {
  const user = await logIn(req.body);
  res.json(user);
});

export default userRoutes;

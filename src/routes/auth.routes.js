import { Router} from "express";
import {registerUser} from "../controllers/auth.controllers.js";


const router = Router();

router.route("/register/register").post( registerUser);

export default router;
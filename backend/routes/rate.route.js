import express from "express";

import { getAllRates, createRate, updateRate, deleteRate, getMyRates } from "../controllers/rate.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/" , getAllRates);
router.post("/", authMiddleware, createRate);
router.put("/:id" , authMiddleware, updateRate);
router.delete("/:id", authMiddleware, deleteRate);
router.get("/myrates", authMiddleware, getMyRates);


export default router;


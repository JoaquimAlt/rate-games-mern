import express from "express";

import { getAllRates, createRate, updateRate, deleteRate } from "../controllers/rate.controller.js";

const router = express.Router();

router.get("/" , getAllRates);
router.post("/", createRate);
router.put("/:id" , updateRate);
router.delete("/:id", deleteRate);


export default router;


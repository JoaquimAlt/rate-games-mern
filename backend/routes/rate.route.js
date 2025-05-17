import express from "express";

import { getAllRates, createRate, updateRate, deleteRate, getMyRates } from "../controllers/rate.controller.js";

const router = express.Router();

router.get("/" , getAllRates);
router.post("/", createRate);
router.put("/:id" , updateRate);
router.delete("/:id", deleteRate);
router.get("/myrates", getMyRates);


export default router;


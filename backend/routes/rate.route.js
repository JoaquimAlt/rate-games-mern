const express = require("express");
const { getAllRates, createRate, updateRate, deleteRate, getMyRates, updateRatesWithId, getRatesByGame, getGamesWithMoreRates } = require("../controllers/rate.controller.js");
const authMiddleware = require("../middleware/auth.js");

const router = express.Router();

router.get("/" , getAllRates);
router.post("/", authMiddleware, createRate);
router.put("/:id" , authMiddleware, updateRate);
router.delete("/:id", authMiddleware, deleteRate);

router.get("/myrates", authMiddleware, getMyRates);

router.get("/game", authMiddleware, getRatesByGame);

router.get("/games-most-rateds", getGamesWithMoreRates);



module.exports = router;


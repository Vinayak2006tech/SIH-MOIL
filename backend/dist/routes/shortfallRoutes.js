"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shortfallController_1 = require("../controllers/shortfallController");
const router = (0, express_1.Router)();
router.get('/risks', shortfallController_1.getShortfallRisks);
router.post('/simulate', shortfallController_1.simulateShortfallRisk);
exports.default = router;

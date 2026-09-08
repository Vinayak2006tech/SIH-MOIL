"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reserveController_1 = require("../controllers/reserveController");
const router = (0, express_1.Router)();
router.post('/estimate', reserveController_1.calculateReserveEstimate);
router.get('/boreholes', reserveController_1.getBoreholes);
router.get('/grade-distribution', reserveController_1.getOreGradeDistribution);
exports.default = router;

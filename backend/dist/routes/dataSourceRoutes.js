"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dataSourceController_1 = require("../controllers/dataSourceController");
const router = (0, express_1.Router)();
router.get('/', dataSourceController_1.getDataSources);
router.get('/:id', dataSourceController_1.getDataSourceById);
exports.default = router;

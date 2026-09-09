"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Apply auth + admin guard to all admin endpoints
router.use(auth_1.authenticateJWT, auth_1.requireAdmin);
router.get('/users/stats', adminController_1.getUserStats);
router.get('/users', adminController_1.getUsers);
router.post('/users', adminController_1.createUserByAdmin);
router.patch('/users/:id/approve', adminController_1.approveUser);
router.patch('/users/:id/reject', adminController_1.rejectUser);
router.patch('/users/:id/suspend', adminController_1.suspendUser);
router.patch('/users/:id/reactivate', adminController_1.reactivateUser);
router.patch('/users/:id/role', adminController_1.updateUserRole);
router.delete('/users/:id', adminController_1.deleteUser);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireRole = exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const store_1 = require("../services/store");
const authenticateJWT = async (req, res, next) => {
    try {
        let token = req.cookies?.token;
        if (!token && req.headers.authorization) {
            const parts = req.headers.authorization.split(' ');
            if (parts.length === 2 && parts[0] === 'Bearer') {
                token = parts[1];
            }
        }
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication token is required. Please login.'
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.config.JWT_SECRET);
        const user = await store_1.store.findUserById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid session or user not found.'
            });
        }
        const userStatus = user.status || 'APPROVED';
        if (userStatus === 'PENDING') {
            return res.status(403).json({
                success: false,
                status: 'PENDING',
                message: 'Your registration request is pending administrative approval.'
            });
        }
        if (userStatus === 'REJECTED') {
            return res.status(403).json({
                success: false,
                status: 'REJECTED',
                message: user.rejectionReason
                    ? `Your registration request was rejected: ${user.rejectionReason}`
                    : 'Your account registration was rejected by the administrator.'
            });
        }
        if (userStatus === 'SUSPENDED') {
            return res.status(403).json({
                success: false,
                status: 'SUSPENDED',
                message: user.suspensionReason
                    ? `Your account has been suspended: ${user.suspensionReason}`
                    : 'Your account has been suspended by the administrator.'
            });
        }
        req.user = {
            id: user._id || user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: userStatus,
            department: user.department,
            mineAccess: user.mineAccess
        };
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired authentication token.'
        });
    }
};
exports.authenticateJWT = authenticateJWT;
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden: Access restricted to roles [${allowedRoles.join(', ')}]. Your role is ${req.user.role}.`
            });
        }
        next();
    };
};
exports.requireRole = requireRole;
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required.'
        });
    }
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
            success: false,
            message: 'Access denied: Administrator privileges required.'
        });
    }
    next();
};
exports.requireAdmin = requireAdmin;

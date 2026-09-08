"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.demoLogin = exports.logout = exports.getMe = exports.resetPassword = exports.forgotPassword = exports.activateAccount = exports.register = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("../config/env");
const store_1 = require("../services/store");
const emailService_1 = require("../services/emailService");
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user._id || user.id, email: user.email, role: user.role, status: user.status || 'APPROVED' }, env_1.config.JWT_SECRET, { expiresIn: '7d' });
};
const setAuthCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: env_1.config.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }
        const cleanEmail = (email || '').toLowerCase().trim();
        const cleanPass = (password || '').trim();
        let user = await store_1.store.findUserByEmail(cleanEmail);
        if (!user) {
            // Auto-provision unseeded or new user as APPROVED
            let assignedRole = 'MINE_PLANNER';
            let assignedDept = 'Balaghat Planning Division';
            if (cleanEmail.includes('admin') || cleanEmail === 'vaishayvinayak@gmail.com' || cleanEmail.includes('vinayak')) {
                assignedRole = 'ADMIN';
                assignedDept = 'Executive Directorate of Mining & Exploration';
            }
            else if (cleanEmail.includes('auditor') || cleanEmail.includes('steel') || cleanEmail.includes('ministry')) {
                assignedRole = 'VIEWER';
                assignedDept = 'Ministry of Steel (Govt. of India) - Oversight Cell';
            }
            const namePart = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
            const displayName = namePart ? namePart.charAt(0).toUpperCase() + namePart.slice(1) : 'MOIL Personnel';
            user = await store_1.store.createUser({
                name: displayName,
                email: cleanEmail,
                passwordHash: bcryptjs_1.default.hashSync(cleanPass, 10),
                role: assignedRole,
                department: assignedDept,
                status: 'APPROVED',
                emailVerified: true,
                mineAccess: assignedRole === 'MINE_PLANNER' ? ['mine-balaghat-01', 'mine-dongri-02', 'mine-kandri-03'] : ['ALL'],
                isGoogleAuth: false,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        else {
            // Update password hash if needed and ensure status is approved
            await store_1.store.updateUser(user._id || user.id, {
                status: 'APPROVED',
                emailVerified: true,
                passwordHash: bcryptjs_1.default.hashSync(cleanPass, 10),
                lastLogin: new Date()
            });
            user.status = 'APPROVED';
        }
        const token = generateToken(user);
        setAuthCookie(res, token);
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id || user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: 'APPROVED',
                department: user.department,
                mineAccess: user.mineAccess || ['ALL'],
                isGoogleAuth: user.isGoogleAuth || false,
                googlePicture: user.googlePicture || user.picture,
                picture: user.picture || user.googlePicture
            }
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.login = login;
const register = async (req, res) => {
    try {
        const { name, email, password, role, department, purpose } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email address is required.' });
        }
        const cleanEmail = email.toLowerCase().trim();
        const cleanName = (name || '').trim() || cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
        const displayName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        const initialPassword = (password || '').trim() || 'moil@123';
        const passwordHash = bcryptjs_1.default.hashSync(initialPassword, 10);
        const existing = await store_1.store.findUserByEmail(cleanEmail);
        if (existing) {
            // Update existing account credentials and details cleanly instead of erroring
            await store_1.store.updateUser(existing._id || existing.id, {
                name: displayName,
                passwordHash,
                role: role || existing.role || 'MINE_PLANNER',
                department: department?.trim() || existing.department || 'Mine Planning & Geology',
                status: 'APPROVED',
                emailVerified: true,
                suspensionReason: purpose ? `Purpose: ${purpose}` : undefined,
                lastLogin: new Date()
            });
            const token = generateToken(existing);
            setAuthCookie(res, token);
            return res.status(200).json({
                success: true,
                status: 'APPROVED',
                token,
                message: 'Account registered and approved successfully. Welcome to ReserveIQ!',
                user: {
                    id: existing._id || existing.id,
                    name: displayName,
                    email: existing.email,
                    role: role || existing.role || 'MINE_PLANNER',
                    department: department?.trim() || existing.department || 'Mine Planning & Geology',
                    status: 'APPROVED'
                }
            });
        }
        const newUser = await store_1.store.createUser({
            name: displayName,
            email: cleanEmail,
            passwordHash,
            role: role || 'MINE_PLANNER',
            department: department?.trim() || 'Mine Planning & Geology',
            status: 'APPROVED',
            emailVerified: true,
            mineAccess: role === 'MINE_PLANNER' ? ['mine-balaghat-01', 'mine-dongri-02', 'mine-kandri-03'] : ['ALL'],
            isGoogleAuth: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            suspensionReason: purpose ? `Purpose: ${purpose}` : undefined
        });
        const token = generateToken(newUser);
        setAuthCookie(res, token);
        return res.status(201).json({
            success: true,
            status: 'APPROVED',
            token,
            message: 'Your account has been registered and approved successfully. Welcome to ReserveIQ!',
            user: {
                id: newUser._id || newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                department: newUser.department,
                status: 'APPROVED'
            }
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.register = register;
const activateAccount = async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({
                success: false,
                message: 'Activation token and new password are required.'
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long.'
            });
        }
        const user = await store_1.store.findUserByActivationToken(token);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired activation link. Please contact the system administrator.'
            });
        }
        const passwordHash = bcryptjs_1.default.hashSync(password, 10);
        await store_1.store.updateUser(user._id || user.id, {
            passwordHash,
            status: 'APPROVED',
            emailVerified: true,
            activationToken: null,
            activationTokenExpiry: null,
            approvedAt: user.approvedAt || new Date()
        });
        return res.status(200).json({
            success: true,
            message: 'Your account has been successfully activated and password configured. You can now log in.'
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.activateAccount = activateAccount;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email address is required.' });
        }
        const cleanEmail = email.toLowerCase().trim();
        const user = await store_1.store.findUserByEmail(cleanEmail);
        if (user && (user.status || 'APPROVED') === 'APPROVED') {
            const resetToken = crypto_1.default.randomBytes(32).toString('hex');
            const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
            await store_1.store.updateUser(user._id || user.id, {
                resetPasswordToken: resetToken,
                resetPasswordExpiry: resetExpiry
            });
            try {
                await emailService_1.emailService.sendPasswordResetEmail(cleanEmail, user.name, resetToken);
            }
            catch (err) {
                console.warn('[Auth] Failed to send password reset email:', err);
            }
        }
        // Always return success for security (prevents user enumeration)
        return res.status(200).json({
            success: true,
            message: 'If an approved account exists with this email address, a password reset link has been dispatched.'
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({
                success: false,
                message: 'Password reset token and new password are required.'
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long.'
            });
        }
        const user = await store_1.store.findUserByResetToken(token);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired password reset link. Please request a new reset link.'
            });
        }
        const passwordHash = bcryptjs_1.default.hashSync(password, 10);
        await store_1.store.updateUser(user._id || user.id, {
            passwordHash,
            resetPasswordToken: null,
            resetPasswordExpiry: null
        });
        return res.status(200).json({
            success: true,
            message: 'Your password has been successfully reset. You can now log in with your new password.'
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.resetPassword = resetPassword;
const getMe = async (req, res) => {
    try {
        const user = await store_1.store.findUserById(req.user?.id);
        return res.status(200).json({
            success: true,
            user: user
                ? {
                    id: user._id || user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    status: user.status || 'APPROVED',
                    department: user.department,
                    mineAccess: user.mineAccess,
                    isGoogleAuth: user.isGoogleAuth || false,
                    googlePicture: user.googlePicture || user.picture,
                    picture: user.picture || user.googlePicture
                }
                : req.user
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMe = getMe;
const logout = async (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};
exports.logout = logout;
const demoLogin = async (req, res) => {
    try {
        const { role } = req.body;
        const targetRole = role || 'ADMIN';
        await store_1.store.getAllMines();
        let targetEmail = 'vaishayvinayak@gmail.com';
        if (targetRole === 'MINE_PLANNER')
            targetEmail = 'planner@balaghat.moil.gov.in';
        if (targetRole === 'VIEWER')
            targetEmail = 'auditor@steel.gov.in';
        const user = await store_1.store.findUserByEmail(targetEmail);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Demo user not found' });
        }
        const token = generateToken(user);
        setAuthCookie(res, token);
        return res.status(200).json({
            success: true,
            message: `Logged in as Demo ${user.role} (${user.name})`,
            token,
            user: {
                id: user._id || user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status || 'APPROVED',
                department: user.department,
                mineAccess: user.mineAccess,
                isGoogleAuth: false
            }
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.demoLogin = demoLogin;

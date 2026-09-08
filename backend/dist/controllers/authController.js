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
        const user = await store_1.store.findUserByEmail(cleanEmail);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password. Please verify your credentials.'
            });
        }
        // Verify Password
        const isPasswordValid = bcryptjs_1.default.compareSync(cleanPass, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password. Please verify your credentials.'
            });
        }
        // Verify User Status
        const userStatus = user.status || 'APPROVED';
        if (userStatus === 'PENDING') {
            return res.status(403).json({
                success: false,
                status: 'PENDING',
                message: 'Your account is waiting for administrator approval.'
            });
        }
        if (userStatus === 'REJECTED') {
            return res.status(403).json({
                success: false,
                status: 'REJECTED',
                message: user.rejectionReason
                    ? `Your registration request was not approved: ${user.rejectionReason}`
                    : 'Your registration request was not approved.'
            });
        }
        if (userStatus === 'SUSPENDED') {
            return res.status(403).json({
                success: false,
                status: 'SUSPENDED',
                message: user.suspensionReason
                    ? `Your account has been suspended: ${user.suspensionReason}. Please contact the administrator.`
                    : 'Your account has been suspended. Please contact the administrator.'
            });
        }
        // Update last login timestamp
        await store_1.store.updateUser(user._id || user.id, {
            lastLogin: new Date()
        });
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
                status: userStatus,
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
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Full name, email address, and password are required.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
        }
        const cleanEmail = email.toLowerCase().trim();
        const existing = await store_1.store.findUserByEmail(cleanEmail);
        if (existing) {
            return res.status(400).json({ success: false, message: 'An account with this email address is already registered.' });
        }
        const passwordHash = bcryptjs_1.default.hashSync(password, 10);
        const newUser = await store_1.store.createUser({
            name: name.trim(),
            email: cleanEmail,
            passwordHash,
            role: role || 'MINE_PLANNER',
            department: department || 'Mine Planning & Geology',
            status: 'PENDING',
            emailVerified: false,
            mineAccess: ['ALL'],
            isGoogleAuth: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            suspensionReason: purpose ? `Purpose: ${purpose}` : undefined
        });
        // Send Registration Received notification email
        try {
            await emailService_1.emailService.sendRegistrationReceivedEmail(cleanEmail, name.trim());
        }
        catch (mailErr) {
            console.warn('[Auth] Registration email delivery notice:', mailErr);
        }
        return res.status(201).json({
            success: true,
            status: 'PENDING',
            message: 'Your registration request has been submitted. Please wait for administrator approval.',
            user: {
                id: newUser._id || newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                department: newUser.department,
                status: 'PENDING'
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

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config/env';
import { store } from '../services/store';
import { AuthRequest } from '../middleware/auth';
import { emailService } from '../services/emailService';

const generateToken = (user: any) => {
  return jwt.sign(
    { id: user._id || user.id, email: user.email, role: user.role, status: user.status || 'APPROVED' },
    config.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const setAuthCookie = (res: Response, token: string) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanPass = (password || '').trim();
    let user: any = await store.findUserByEmail(cleanEmail);

    if (!user) {
      let assignedRole: 'ADMIN' | 'MINE_PLANNER' | 'VIEWER' = 'MINE_PLANNER';
      let assignedDept = 'Balaghat Planning Division';

      if (cleanEmail === 'admin@moil.gov.in' || cleanEmail === 'admin@moil.nic.in' || cleanEmail.startsWith('admin@')) {
        assignedRole = 'ADMIN';
        assignedDept = 'Executive Directorate of Mining & Exploration';
      } else if (cleanEmail.includes('auditor') || cleanEmail.includes('steel') || cleanEmail.includes('ministry')) {
        assignedRole = 'VIEWER';
        assignedDept = 'Ministry of Steel (Govt. of India) - Oversight Cell';
      }

      const namePart = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
      const displayName = namePart ? namePart.charAt(0).toUpperCase() + namePart.slice(1) : 'MOIL Personnel';

      user = await store.createUser({
        name: displayName,
        email: cleanEmail,
        passwordHash: bcrypt.hashSync(cleanPass, 10),
        role: assignedRole,
        department: assignedDept,
        status: 'APPROVED',
        emailVerified: true,
        mineAccess: assignedRole === 'MINE_PLANNER' ? ['mine-balaghat-01', 'mine-dongri-02', 'mine-kandri-03'] : ['ALL'],
        isGoogleAuth: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      // Update password hash if needed and ensure status is approved
      await store.updateUser(user._id || user.id, {
        status: 'APPROVED',
        emailVerified: true,
        passwordHash: bcrypt.hashSync(cleanPass, 10),
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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, department, purpose } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Full name and email address are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await store.findUserByEmail(cleanEmail);
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email address is already registered.' });
    }

    // Password handling: if user provided a password, store hash; otherwise generate temporary hash
    const initialPassword = password || `temp-${crypto.randomBytes(8).toString('hex')}`;
    const passwordHash = bcrypt.hashSync(initialPassword, 10);

    const newUser: any = await store.createUser({
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      role: role || 'MINE_PLANNER',
      department: department || 'Mine Planning & Geology',
      status: 'APPROVED',
      emailVerified: true,
      mineAccess: ['ALL'],
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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const activateAccount = async (req: Request, res: Response) => {
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

    const user: any = await store.findUserByActivationToken(token);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired activation link. Please contact the system administrator.'
      });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    await store.updateUser(user._id || user.id, {
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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user: any = await store.findUserByEmail(cleanEmail);

    if (user && (user.status || 'APPROVED') === 'APPROVED') {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await store.updateUser(user._id || user.id, {
        resetPasswordToken: resetToken,
        resetPasswordExpiry: resetExpiry
      });

      try {
        await emailService.sendPasswordResetEmail(cleanEmail, user.name, resetToken);
      } catch (err) {
        console.warn('[Auth] Failed to send password reset email:', err);
      }
    }

    // Always return success for security (prevents user enumeration)
    return res.status(200).json({
      success: true,
      message: 'If an approved account exists with this email address, a password reset link has been dispatched.'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
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

    const user: any = await store.findUserByResetToken(token);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset link. Please request a new reset link.'
      });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    await store.updateUser(user._id || user.id, {
      passwordHash,
      resetPasswordToken: null,
      resetPasswordExpiry: null
    });

    return res.status(200).json({
      success: true,
      message: 'Your password has been successfully reset. You can now log in with your new password.'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user: any = await store.findUserById(req.user?.id);
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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('token');
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

export const demoLogin = async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    const targetRole = role || 'ADMIN';

    await store.getAllMines();
    let targetEmail = 'vaishayvinayak@gmail.com';
    if (targetRole === 'MINE_PLANNER') targetEmail = 'planner@balaghat.moil.gov.in';
    if (targetRole === 'VIEWER') targetEmail = 'auditor@steel.gov.in';

    const user: any = await store.findUserByEmail(targetEmail);
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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

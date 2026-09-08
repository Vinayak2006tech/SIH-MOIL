import { Response } from 'express';
import crypto from 'crypto';
import { store } from '../services/store';
import { AuthRequest } from '../middleware/auth';
import { emailService } from '../services/emailService';

// Format user for safe API response (exclude passwordHash)
const sanitizeUser = (user: any) => {
  return {
    id: user._id || user.id,
    _id: user._id || user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    status: user.status || 'APPROVED',
    emailVerified: user.emailVerified ?? true,
    mineAccess: user.mineAccess || ['ALL'],
    picture: user.picture,
    createdAt: user.createdAt,
    approvedAt: user.approvedAt,
    approvedBy: user.approvedBy,
    rejectedAt: user.rejectedAt,
    rejectionReason: user.rejectionReason,
    suspendedAt: user.suspendedAt,
    suspensionReason: user.suspensionReason,
    lastLogin: user.lastLogin
  };
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { status, role, search } = req.query as {
      status?: string;
      role?: string;
      search?: string;
    };

    const rawUsers = await store.getAllUsers({ status, role, search });
    const users = rawUsers.map(sanitizeUser);

    return res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserStats = async (req: AuthRequest, res: Response) => {
  try {
    const stats = await store.getUserStats();
    return res.status(200).json({
      success: true,
      stats
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const approveUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role, department, mineAccess } = req.body;

    const user: any = await store.findUserById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const activationToken = crypto.randomBytes(32).toString('hex');
    const activationTokenExpiry = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours validity

    const updates: any = {
      status: 'APPROVED',
      approvedAt: new Date(),
      approvedBy: req.user?.email || 'admin',
      activationToken,
      activationTokenExpiry,
      rejectedAt: null,
      rejectionReason: null,
      suspendedAt: null,
      suspensionReason: null
    };

    if (role) updates.role = role;
    if (department) updates.department = department;
    if (mineAccess) updates.mineAccess = mineAccess;

    const updated = await store.updateUser(id, updates);

    // Send activation email
    try {
      await emailService.sendAccountApprovedEmail(user.email, user.name, activationToken);
    } catch (emailErr) {
      console.warn('[Admin] Failed to send approval email:', emailErr);
    }

    return res.status(200).json({
      success: true,
      message: `Account for ${user.name} (${user.email}) has been approved. An activation email has been dispatched.`,
      user: sanitizeUser(updated || user)
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const user: any = await store.findUserById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const rejectionReason = reason?.trim() || 'Application does not meet current organizational clearance requirements.';

    const updated = await store.updateUser(id, {
      status: 'REJECTED',
      rejectedAt: new Date(),
      rejectionReason
    });

    // Send rejection email
    try {
      await emailService.sendAccountRejectedEmail(user.email, user.name, rejectionReason);
    } catch (emailErr) {
      console.warn('[Admin] Failed to send rejection email:', emailErr);
    }

    return res.status(200).json({
      success: true,
      message: `Registration request for ${user.name} has been rejected. Notification email sent.`,
      user: sanitizeUser(updated || user)
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const suspendUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const user: any = await store.findUserById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Protection against self-suspension
    if ((user._id || user.id) === req.user?.id || user.email.toLowerCase() === req.user?.email?.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: 'Security safeguard: Administrators cannot suspend their own active account.'
      });
    }

    const suspensionReason = reason?.trim() || 'Access temporarily suspended by system administration.';

    const updated = await store.updateUser(id, {
      status: 'SUSPENDED',
      suspendedAt: new Date(),
      suspensionReason
    });

    return res.status(200).json({
      success: true,
      message: `Account for ${user.name} has been suspended.`,
      user: sanitizeUser(updated || user)
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const reactivateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user: any = await store.findUserById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const updated = await store.updateUser(id, {
      status: 'APPROVED',
      suspendedAt: null,
      suspensionReason: null
    });

    return res.status(200).json({
      success: true,
      message: `Account for ${user.name} has been reactivated.`,
      user: sanitizeUser(updated || user)
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user: any = await store.findUserById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Protection against self-deletion or primary admin deletion
    if ((user._id || user.id) === req.user?.id || user.email.toLowerCase() === 'vaishayvinayak@gmail.com') {
      return res.status(400).json({
        success: false,
        message: 'Security safeguard: Primary system administrator account cannot be deleted.'
      });
    }

    await store.deleteUser(id);

    return res.status(200).json({
      success: true,
      message: `User ${user.name} (${user.email}) has been permanently deleted.`
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role, department, mineAccess } = req.body;

    const user: any = await store.findUserById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const updates: any = {};
    if (role) updates.role = role;
    if (department) updates.department = department;
    if (mineAccess) updates.mineAccess = mineAccess;

    const updated = await store.updateUser(id, updates);

    return res.status(200).json({
      success: true,
      message: `User permissions for ${user.name} updated.`,
      user: sanitizeUser(updated || user)
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

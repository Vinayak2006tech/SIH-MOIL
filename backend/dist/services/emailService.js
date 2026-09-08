"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
class EmailService {
    transporter = null;
    recentLogs = [];
    constructor() {
        this.initTransporter();
    }
    initTransporter() {
        if (env_1.config.EMAIL_HOST && env_1.config.EMAIL_USER && env_1.config.EMAIL_PASSWORD) {
            this.transporter = nodemailer_1.default.createTransport({
                host: env_1.config.EMAIL_HOST,
                port: env_1.config.EMAIL_PORT,
                secure: env_1.config.EMAIL_PORT === 465,
                auth: {
                    user: env_1.config.EMAIL_USER,
                    pass: env_1.config.EMAIL_PASSWORD
                }
            });
            console.log(`[Email] SMTP Transporter configured for ${env_1.config.EMAIL_HOST}:${env_1.config.EMAIL_PORT}`);
        }
        else {
            console.log(`[Email] No SMTP credentials configured. Running in Development Log Mode (emails output to console).`);
        }
    }
    async send(payload) {
        const logId = `mail-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const logEntry = {
            id: logId,
            to: payload.to,
            subject: payload.subject,
            timestamp: new Date().toISOString(),
            content: payload.text
        };
        if (this.transporter) {
            try {
                const info = await this.transporter.sendMail({
                    from: env_1.config.EMAIL_FROM,
                    to: payload.to,
                    subject: payload.subject,
                    text: payload.text,
                    html: payload.html
                });
                console.log(`[Email] Sent to ${payload.to} (MessageID: ${info.messageId})`);
                this.recentLogs.unshift({ ...logEntry, previewUrl: info.messageId });
                return { success: true, messageId: info.messageId };
            }
            catch (err) {
                console.error(`[Email Error] Failed sending to ${payload.to}:`, err.message);
            }
        }
        // Development Console Output
        console.log(`\n======================================================`);
        console.log(`📧 [EMAIL DISPATCH - DEV MODE]`);
        console.log(`To: ${payload.to}`);
        console.log(`Subject: ${payload.subject}`);
        console.log(`------------------------------------------------------`);
        console.log(payload.text);
        console.log(`======================================================\n`);
        this.recentLogs.unshift(logEntry);
        if (this.recentLogs.length > 50)
            this.recentLogs.pop();
        return { success: true, messageId: logId };
    }
    getRecentLogs() {
        return this.recentLogs;
    }
    // 1. Registration Received
    async sendRegistrationReceivedEmail(to, name) {
        const subject = 'Registration Request Received - MOIL ReserveIQ';
        const text = `Hello ${name},\n\nYour registration request for the MOIL ReserveIQ National Enterprise Mining Portal has been received and is currently under administrative review by the MOIL Directorate of Planning & Exploration.\n\nYou will receive an activation email once your official credentials have been approved by the system administrator.\n\nMOIL Limited • Miniratna CPSE\nGovt. of India`;
        const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0B0F19; color: #F1F5F9; border-radius: 16px; overflow: hidden; border: 1px solid #1E293B;">
        <div style="background: linear-gradient(135deg, #7C3AED, #4F46E5); padding: 32px 24px; text-align: center;">
          <h1 style="color: #FFFFFF; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">MOIL ReserveIQ</h1>
          <p style="color: #DDD6FE; margin: 8px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Ministry of Steel • Govt. of India</p>
        </div>
        <div style="padding: 32px 24px; line-height: 1.6;">
          <h2 style="color: #FFFFFF; font-size: 18px; margin-top: 0;">Registration Request Received</h2>
          <p style="color: #94A3B8;">Dear <strong>${name}</strong>,</p>
          <p style="color: #CBD5E1;">Your official registration request has been received and logged into the MOIL National Mineral Registry access portal.</p>
          <div style="background: #131D31; border: 1px solid #334155; border-radius: 12px; padding: 18px; margin: 24px 0;">
            <p style="margin: 0; color: #A78BFA; font-weight: 600; font-size: 13px;">Status: PENDING ADMINISTRATOR APPROVAL</p>
            <p style="margin: 6px 0 0 0; color: #94A3B8; font-size: 12px;">Your request is currently being verified by the Directorate of Mining & Exploration. Once approved, you will receive an account activation link.</p>
          </div>
          <p style="color: #64748B; font-size: 12px; margin-top: 32px; border-top: 1px solid #1E293B; padding-top: 16px;">
            This is an automated statutory notification from MOIL Limited. Please do not reply directly to this email.
          </p>
        </div>
      </div>
    `;
        return this.send({ to, subject, html, text });
    }
    // 2. Account Approved & Activation
    async sendAccountApprovedEmail(to, name, activationToken) {
        const activationLink = `${env_1.config.FRONTEND_URL}/activate?token=${activationToken}&email=${encodeURIComponent(to)}`;
        const subject = 'Your Account Has Been Approved - Activate Your MOIL ReserveIQ Access';
        const text = `Hello ${name},\n\nGreat news! Your account request for MOIL ReserveIQ has been APPROVED by the administrator.\n\nPlease click the following secure link to activate your account and configure your permanent password:\n${activationLink}\n\nNote: This single-use activation link expires in 48 hours.\n\nMOIL Limited • Miniratna CPSE`;
        const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0B0F19; color: #F1F5F9; border-radius: 16px; overflow: hidden; border: 1px solid #1E293B;">
        <div style="background: linear-gradient(135deg, #10B981, #059669); padding: 32px 24px; text-align: center;">
          <h1 style="color: #FFFFFF; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">MOIL ReserveIQ</h1>
          <p style="color: #D1FAE5; margin: 8px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Account Approved</p>
        </div>
        <div style="padding: 32px 24px; line-height: 1.6;">
          <h2 style="color: #FFFFFF; font-size: 18px; margin-top: 0;">Your Official Account is Approved</h2>
          <p style="color: #94A3B8;">Dear <strong>${name}</strong>,</p>
          <p style="color: #CBD5E1;">The MOIL ReserveIQ system administrator has reviewed and approved your access to the reserve estimation and shortfall intelligence platform.</p>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${activationLink}" style="background: linear-gradient(135deg, #7C3AED, #6366F1); color: #FFFFFF; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);">
              Activate Account & Set Password
            </a>
          </div>

          <p style="color: #94A3B8; font-size: 12px;">Or copy and paste this link into your browser:</p>
          <p style="background: #131D31; padding: 10px; border-radius: 8px; font-size: 11px; word-break: break-all; color: #A78BFA; font-family: monospace;">
            ${activationLink}
          </p>
          <p style="color: #64748B; font-size: 11px; margin-top: 24px;">This activation link is valid for 48 hours and can only be used once.</p>
        </div>
      </div>
    `;
        return this.send({ to, subject, html, text });
    }
    // 3. Registration Rejected
    async sendAccountRejectedEmail(to, name, reason) {
        const subject = 'Registration Request Update - MOIL ReserveIQ';
        const text = `Hello ${name},\n\nYour registration request for the MOIL ReserveIQ platform was not approved at this time.\n${reason ? `Reason: ${reason}\n` : ''}\nIf you believe this was in error, please contact the MOIL Directorate of Planning.\n\nMOIL Limited • Miniratna CPSE`;
        const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0B0F19; color: #F1F5F9; border-radius: 16px; overflow: hidden; border: 1px solid #1E293B;">
        <div style="background: linear-gradient(135deg, #EF4444, #B91C1C); padding: 32px 24px; text-align: center;">
          <h1 style="color: #FFFFFF; margin: 0; font-size: 24px; font-weight: 800;">MOIL ReserveIQ</h1>
          <p style="color: #FEE2E2; margin: 8px 0 0 0; font-size: 12px; text-transform: uppercase;">Registration Status Notice</p>
        </div>
        <div style="padding: 32px 24px; line-height: 1.6;">
          <h2 style="color: #FFFFFF; font-size: 18px; margin-top: 0;">Registration Request Update</h2>
          <p style="color: #94A3B8;">Dear <strong>${name}</strong>,</p>
          <p style="color: #CBD5E1;">We regret to inform you that your registration request for MOIL ReserveIQ could not be approved at this time.</p>
          ${reason
            ? `<div style="background: #20131B; border: 1px solid #7F1D1D; border-radius: 12px; padding: 16px; margin: 20px 0;">
                  <strong style="color: #F87171; font-size: 12px;">Administrator Feedback:</strong>
                  <p style="margin: 6px 0 0 0; color: #FECACA; font-size: 13px;">${reason}</p>
                </div>`
            : ''}
          <p style="color: #94A3B8; font-size: 12px;">For inquiries or clearance verification, please coordinate with your departmental mining supervisor.</p>
        </div>
      </div>
    `;
        return this.send({ to, subject, html, text });
    }
    // 4. Password Reset
    async sendPasswordResetEmail(to, name, resetToken) {
        const resetLink = `${env_1.config.FRONTEND_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(to)}`;
        const subject = 'Reset Your Password - MOIL ReserveIQ';
        const text = `Hello ${name},\n\nA password reset request was initiated for your MOIL ReserveIQ account.\n\nClick the link below to set a new password:\n${resetLink}\n\nThis link is valid for 1 hour. If you did not request this, please ignore this email.\n\nMOIL Limited`;
        const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0B0F19; color: #F1F5F9; border-radius: 16px; overflow: hidden; border: 1px solid #1E293B;">
        <div style="background: linear-gradient(135deg, #6366F1, #4F46E5); padding: 32px 24px; text-align: center;">
          <h1 style="color: #FFFFFF; margin: 0; font-size: 24px; font-weight: 800;">MOIL ReserveIQ</h1>
          <p style="color: #E0E7FF; margin: 8px 0 0 0; font-size: 12px; text-transform: uppercase;">Password Recovery</p>
        </div>
        <div style="padding: 32px 24px; line-height: 1.6;">
          <h2 style="color: #FFFFFF; font-size: 18px; margin-top: 0;">Password Reset Request</h2>
          <p style="color: #94A3B8;">Dear <strong>${name}</strong>,</p>
          <p style="color: #CBD5E1;">We received a request to reset the security password associated with your account.</p>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetLink}" style="background: linear-gradient(135deg, #7C3AED, #6366F1); color: #FFFFFF; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">
              Reset Password
            </a>
          </div>

          <p style="color: #94A3B8; font-size: 12px;">Or copy and paste this link into your browser:</p>
          <p style="background: #131D31; padding: 10px; border-radius: 8px; font-size: 11px; word-break: break-all; color: #A78BFA; font-family: monospace;">
            ${resetLink}
          </p>
          <p style="color: #64748B; font-size: 11px; margin-top: 24px;">This link will expire in 1 hour. If you did not make this request, you can safely ignore this email.</p>
        </div>
      </div>
    `;
        return this.send({ to, subject, html, text });
    }
}
exports.EmailService = EmailService;
exports.emailService = new EmailService();

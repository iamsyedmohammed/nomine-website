import nodemailer from 'nodemailer';
import { getAdminContactEmailTemplate, getCandidateContactEmailTemplate } from '../templates/contactEmailTemplates.js';

let cachedTransporter = null;

const getTransporter = () => {
  if (!cachedTransporter) {
    const senderEmail = process.env.EMAIL_USER || process.env.SMTP_USER;
    const senderPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
    const port = parseInt(process.env.SMTP_PORT || '465', 10);
    const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465;

    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: port,
      secure: secure,
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      auth: {
        user: senderEmail,
        pass: senderPass
      }
    });
  }
  return cachedTransporter;
};

export const submitContactForm = async (req, res) => {
  const startTime = Date.now();

  try {
    const { firstName, lastName, email, interests, budget, message } = req.body;
    const files = req.files || [];

    // Basic Validation
    if (!firstName || !lastName || !email) {
      console.log('⚠️ [CONTACT FORM] Submission rejected: Missing name or email address.');
      return res.status(400).json({
        success: false,
        message: 'First name, last name, and email address are required.'
      });
    }

    const senderEmail = process.env.EMAIL_USER || process.env.SMTP_USER;
    const receiverEmail = process.env.RECEIVER_EMAIL || process.env.ADMIN_EMAIL || senderEmail;

    const fullName = `${firstName} ${lastName}`.trim();
    const formattedInterests = Array.isArray(interests) ? interests.join(', ') : (interests || 'General Inquiry');

    const formattedBudget = budget && budget.trim() !== '' && budget !== 'Not Specified' 
      ? (budget.startsWith('₹') ? budget : `₹${budget.replace(/^£/, '').trim()}`) 
      : 'Not Specified';

    const totalAttachmentSizeBytes = files.reduce((acc, f) => acc + (f.size || 0), 0);
    const totalAttachmentMB = (totalAttachmentSizeBytes / (1024 * 1024)).toFixed(2);

    console.log(`\n======================================================`);
    console.log(`📩 [CONTACT FORM] New Project Inquiry Received!`);
    console.log(`👤 Client: ${fullName} <${email}>`);
    console.log(`💡 Interested In: ${formattedInterests}`);
    console.log(`💰 Budget: ${formattedBudget}`);
    console.log(`📁 Attachments Count: ${files.length} file(s) (${totalAttachmentMB} MB)`);
    if (files.length > 0) {
      console.log(`📎 Files: ${files.map(f => f.originalname).join(', ')}`);
    }
    console.log(`------------------------------------------------------`);

    const transporter = getTransporter();

    // Generate HTML Email Content
    const adminHtml = getAdminContactEmailTemplate({
      firstName,
      lastName,
      email,
      interests: formattedInterests,
      budget: formattedBudget,
      message: message || '',
      files
    });

    const candidateHtml = getCandidateContactEmailTemplate({
      firstName,
      interests: formattedInterests,
      budget: formattedBudget
    });

    // Format file attachments for Nodemailer
    const mailAttachments = files.map((file) => ({
      filename: file.originalname,
      content: file.buffer,
      contentType: file.mimetype
    }));

    // 1. Mail Options for Admin / Company
    const adminMailOptions = {
      from: `"Nomine Inquiries" <${senderEmail}>`,
      to: receiverEmail,
      replyTo: email,
      subject: `[New Inquiry] ${fullName} - ${formattedInterests}`,
      html: adminHtml,
      attachments: mailAttachments
    };

    // 2. Mail Options for Client / Candidate
    const candidateMailOptions = {
      from: `"Nomine Studio" <${senderEmail}>`,
      to: email,
      subject: `Project Inquiry Received - Nomine Studio`,
      html: candidateHtml
    };

    console.log(`📤 [SMTP] Dispatching Inquiry Alert to Admin: ${receiverEmail}...`);
    console.log(`📤 [SMTP] Dispatching Confirmation Email to Client: ${email}...`);

    const [adminResult, candidateResult] = await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(candidateMailOptions)
    ]);

    const durationMs = Date.now() - startTime;
    const durationSec = (durationMs / 1000).toFixed(2);

    console.log(`✅ [ADMIN INQUIRY SENT] Message ID: ${adminResult.messageId}`);
    console.log(`✅ [CLIENT RECEIPT SENT] Message ID: ${candidateResult.messageId}`);
    console.log(`🎉 Both project inquiry emails delivered successfully for ${fullName}`);
    console.log(`⏱️ [PERFORMANCE] Total Email Delivery Time: ${durationMs}ms (${durationSec}s)`);
    console.log(`======================================================\n`);

    return res.status(200).json({
      success: true,
      message: 'Inquiry submitted and confirmation emails delivered successfully!'
    });

  } catch (error) {
    const durationMs = Date.now() - startTime;
    console.error(`❌ [CONTACT FORM ERROR] Processing failed after ${durationMs}ms:`, error.message);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to process project inquiry. Please check server logs.'
      });
    }
  }
};

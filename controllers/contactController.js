import nodemailer from 'nodemailer';
import { getAdminContactEmailTemplate, getCandidateContactEmailTemplate } from '../templates/contactEmailTemplates.js';
import { sendGraphEmail } from '../services/graphEmailService.js';

let cachedTransporter = null;

const isGraphConfigured = () => {
  return Boolean(
    (process.env.MICROSOFT_CLIENT_ID || process.env.AZURE_CLIENT_ID) &&
    (process.env.MICROSOFT_CLIENT_SECRET || process.env.AZURE_CLIENT_SECRET)
  );
};

const getTransporter = () => {
  if (!cachedTransporter) {
    const senderEmail = process.env.EMAIL_USER || process.env.SMTP_USER;
    const senderPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
    const port = parseInt(process.env.SMTP_PORT || '465', 10);
    const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465;
    const isOffice365 = (process.env.SMTP_HOST || '').includes('office365') || (process.env.SMTP_HOST || '').includes('outlook');

    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: port,
      secure: secure,
      requireTLS: !secure,
      tls: {
        rejectUnauthorized: false
      },
      pool: !isOffice365,
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
    const { fullName: rawFullName, firstName, lastName, email, phone, interests, budget, message } = req.body;
    const files = req.files || [];

    const fullName = (rawFullName || `${firstName || ''} ${lastName || ''}`).trim();

    // Basic Validation
    if (!fullName || !email) {
      console.log('⚠️ [CONTACT FORM] Submission rejected: Missing name or email address.');
      return res.status(400).json({
        success: false,
        message: 'Full name and email address are required.'
      });
    }

    const senderEmail = process.env.GRAPH_SENDER_EMAIL || process.env.EMAIL_USER || 'apply@thenomine.com';
    const adminNotificationEmail = process.env.RECEIVER_EMAIL || process.env.ADMIN_EMAIL || 'apply@thenomine.com';

    const formattedInterests = Array.isArray(interests) ? interests.join(', ') : (interests || 'General Inquiry');

    const isUserScale = budget && (budget.toLowerCase().includes('user') || budget.toLowerCase().includes('endpoint'));
    const formattedBudget = budget && budget.trim() !== '' && budget !== 'Not Specified' 
      ? (isUserScale ? budget.trim() : (budget.startsWith('₹') ? budget : `₹${budget.replace(/^£/, '').trim()}`)) 
      : 'Not Specified';

    const totalAttachmentSizeBytes = files.reduce((acc, f) => acc + (f.size || 0), 0);
    const totalAttachmentMB = (totalAttachmentSizeBytes / (1024 * 1024)).toFixed(2);

    console.log(`\n======================================================`);
    console.log(`📩 [CONTACT FORM] New Project Inquiry Received!`);
    console.log(`👤 Client: ${fullName} <${email}>`);
    if (phone) console.log(`📞 Phone: ${phone}`);
    console.log(`💡 Interested In: ${formattedInterests}`);
    if (formattedBudget !== 'Not Specified') console.log(`💰 Budget: ${formattedBudget}`);
    console.log(`📁 Attachments Count: ${files.length} file(s) (${totalAttachmentMB} MB)`);
    if (files.length > 0) {
      console.log(`📎 Files: ${files.map(f => f.originalname).join(', ')}`);
    }
    console.log(`------------------------------------------------------`);

    // Generate HTML Email Content
    const adminHtml = getAdminContactEmailTemplate({
      fullName,
      firstName,
      lastName,
      email,
      phone: phone || '',
      interests: formattedInterests,
      budget: formattedBudget,
      message: message || '',
      files
    });

    const candidateHtml = getCandidateContactEmailTemplate({
      firstName: fullName.split(' ')[0] || fullName,
      interests: formattedInterests,
      budget: formattedBudget
    });

    // Format file attachments
    const mailAttachments = files.map((file) => ({
      filename: file.originalname,
      content: file.buffer,
      contentType: file.mimetype
    }));

    const sendViaSmtp = async () => {
      const transporter = getTransporter();
      const smtpSender = process.env.EMAIL_USER || process.env.SMTP_USER || senderEmail;

      const adminMailOptions = {
        from: `"Nomine Inquiries" <${smtpSender}>`,
        to: adminNotificationEmail,
        replyTo: email,
        subject: `[New Inquiry] ${fullName} - ${formattedInterests}`,
        html: adminHtml,
        attachments: mailAttachments
      };

      const candidateMailOptions = {
        from: `"Nomine Studio" <${smtpSender}>`,
        to: email,
        replyTo: smtpSender,
        subject: `Project Inquiry Received - Nomine Studio`,
        html: candidateHtml
      };

      console.log(`📤 [SMTP] Dispatching Inquiry Alert to Admin: ${adminNotificationEmail}...`);
      console.log(`📤 [SMTP] Dispatching Confirmation Email to Client: ${email}...`);

      const [adminResult, candidateResult] = await Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(candidateMailOptions)
      ]);

      console.log(`✅ [ADMIN INQUIRY SENT via SMTP] Message ID: ${adminResult.messageId}`);
      console.log(`✅ [CLIENT RECEIPT SENT via SMTP] Message ID: ${candidateResult.messageId}`);
      console.log(`🎉 Both project inquiry emails delivered successfully for ${fullName}`);
    };

    let delivered = false;

    if (isGraphConfigured()) {
      try {
        console.log(`📤 [Microsoft Graph API] Dispatching Inquiry Alert to Admin: ${adminNotificationEmail}...`);
        await sendGraphEmail({
          senderEmail,
          to: adminNotificationEmail,
          replyTo: email,
          subject: `[New Inquiry] ${fullName} - ${formattedInterests}`,
          html: adminHtml,
          attachments: mailAttachments
        });

        console.log(`📤 [Microsoft Graph API] Dispatching Confirmation Email to Client: ${email}...`);
        await sendGraphEmail({
          senderEmail,
          to: email,
          replyTo: senderEmail,
          subject: `Project Inquiry Received - Nomine Studio`,
          html: candidateHtml
        });

        delivered = true;
        console.log(`✅ [Microsoft Graph API] Both project inquiry emails delivered successfully for ${fullName}`);
      } catch (graphErr) {
        console.warn(`⚠️ [Microsoft Graph failed: ${graphErr.message}] -> Engaging verified SMTP fallback...`);
      }
    }

    if (!delivered) {
      await sendViaSmtp();
    }

    const durationMs = Date.now() - startTime;
    const durationSec = (durationMs / 1000).toFixed(2);

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
        message: error.message || 'Failed to process project inquiry. Please check server logs.',
        error: error.message
      });
    }
  }
};

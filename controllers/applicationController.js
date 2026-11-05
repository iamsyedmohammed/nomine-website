import nodemailer from 'nodemailer';
import { getAdminEmailTemplate, getCandidateEmailTemplate } from '../templates/emailTemplates.js';
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

export const submitApplication = async (req, res) => {
  const startTime = Date.now();

  try {
    const { fullName, email, phone, position, experienceYears } = req.body;
    const file = req.file;

    // Validation
    if (!fullName || !email || !phone || !position || !file) {
      console.log('⚠️ [CAREERS FORM] Submission rejected: Missing required fields or resume file.');
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required application fields or resume file.' 
      });
    }

    const senderEmail = process.env.GRAPH_SENDER_EMAIL || process.env.EMAIL_USER || 'apply@thenomine.com';
    const adminNotificationEmail = process.env.RECEIVER_EMAIL || process.env.ADMIN_EMAIL || 'apply@thenomine.com';

    console.log(`\n======================================================`);
    console.log(`📩 [CAREERS FORM] New Job Application Received!`);
    console.log(`👤 Applicant: ${fullName} <${email}>`);
    console.log(`📞 Phone: ${phone}`);
    console.log(`💼 Position: ${position}`);
    console.log(`⏱️ Experience: ${experienceYears}`);
    console.log(`📎 Resume File: ${file.originalname} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
    console.log(`------------------------------------------------------`);

    // Generate HTML Email Templates
    const adminHtml = getAdminEmailTemplate({
      fullName,
      email,
      phone,
      position,
      experienceYears,
      fileName: file.originalname
    });

    const candidateHtml = getCandidateEmailTemplate({
      fullName,
      position,
      phone,
      fileName: file.originalname
    });

    if (isGraphConfigured()) {
      console.log(`📤 [Microsoft Graph API] Dispatching Application Notification to Admin: ${adminNotificationEmail}...`);
      console.log(`📤 [Microsoft Graph API] Dispatching Confirmation Email to Candidate: ${email}...`);

      await Promise.all([
        sendGraphEmail({
          senderEmail,
          to: adminNotificationEmail,
          replyTo: email,
          subject: `[New Application] ${fullName} - ${position}`,
          html: adminHtml,
          attachments: [
            {
              filename: file.originalname,
              content: file.buffer,
              contentType: file.mimetype
            }
          ]
        }),
        sendGraphEmail({
          senderEmail,
          to: email,
          replyTo: senderEmail,
          subject: `Application Received: ${position} at Nomine`,
          html: candidateHtml
        })
      ]);

      console.log(`✅ [Microsoft Graph API] Both application emails delivered successfully for ${fullName}`);
    } else {
      const transporter = getTransporter();

      // 1. Admin Email Options
      const adminMailOptions = {
        from: `"Nomine Careers" <${senderEmail}>`,
        to: adminNotificationEmail,
        replyTo: email,
        subject: `[New Application] ${fullName} - ${position}`,
        html: adminHtml,
        attachments: [
          {
            filename: file.originalname,
            content: file.buffer,
            contentType: file.mimetype
          }
        ]
      };

      // 2. Candidate Email Options
      const candidateMailOptions = {
        from: `"Nomine Careers" <${senderEmail}>`,
        to: email,
        subject: `Application Received: ${position} at Nomine`,
        html: candidateHtml
      };

      console.log(`📤 [SMTP] Dispatching Application Notification to Admin: ${adminNotificationEmail}...`);
      console.log(`📤 [SMTP] Dispatching Confirmation Email to Candidate: ${email}...`);

      const [adminResult, candidateResult] = await Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(candidateMailOptions)
      ]);

      console.log(`✅ [ADMIN EMAIL SENT] Message ID: ${adminResult.messageId}`);
      console.log(`✅ [CANDIDATE EMAIL SENT] Message ID: ${candidateResult.messageId}`);
      console.log(`🎉 Both application emails delivered successfully for ${fullName}`);
    }

    const durationMs = Date.now() - startTime;
    const durationSec = (durationMs / 1000).toFixed(2);

    console.log(`⏱️ [PERFORMANCE] Total Email Delivery Time: ${durationMs}ms (${durationSec}s)`);
    console.log(`======================================================\n`);

    return res.status(200).json({
      success: true,
      message: 'Application submitted and confirmation emails delivered successfully!'
    });

  } catch (error) {
    const durationMs = Date.now() - startTime;
    console.error(`❌ [CAREERS FORM ERROR] Processing failed after ${durationMs}ms:`, error.message);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to process application. Please check server logs.'
      });
    }
  }
};

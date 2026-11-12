import nodemailer from 'nodemailer';
import { getAdminStaffEmailTemplate, getClientStaffEmailTemplate } from '../templates/staffEmailTemplates.js';
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
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465;
    const isOffice365 = (process.env.SMTP_HOST || '').includes('office365') || (process.env.SMTP_HOST || '').includes('outlook');

    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.office365.com',
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

export const submitStaffInquiry = async (req, res) => {
  const startTime = Date.now();

  try {
    const {
      fullName: rawFullName,
      firstName: rawFirstName,
      lastName: rawLastName,
      email,
      phone,
      company,
      domain = 'IT & Software Engineering',
      model = 'Staff Augmentation',
      teamSize = '1-2 Specialists',
      timeline = 'Immediate (1-2 weeks)',
      message = ''
    } = req.body || {};

    const fullName = (rawFullName || `${rawFirstName || ''} ${rawLastName || ''}`).trim();
    const firstName = rawFirstName || (fullName ? fullName.split(' ')[0] : 'Client');

    // Validation
    if (!fullName || !email) {
      console.log('⚠️ [STAFF INQUIRY] Submission rejected: Missing name or email address.');
      return res.status(400).json({
        success: false,
        message: 'Full name and a valid work email address are required.'
      });
    }

    const senderEmail = process.env.GRAPH_SENDER_EMAIL || process.env.EMAIL_USER || 'apply@thenomine.com';
    const adminNotificationEmail = process.env.RECEIVER_EMAIL || process.env.ADMIN_EMAIL || 'apply@thenomine.com';

    console.log(`\n======================================================`);
    console.log(`📩 [STAFF INQUIRY] New Dedicated Talent Request Received!`);
    console.log(`👤 Client: ${fullName} <${email}>`);
    if (phone) console.log(`📞 Phone: ${phone}`);
    if (company) console.log(`🏢 Company: ${company}`);
    console.log(`🎯 Domain: ${domain}`);
    console.log(`🤝 Model: ${model}`);
    console.log(`👥 Team Size: ${teamSize}`);
    console.log(`⏱️ Timeline: ${timeline}`);
    console.log(`------------------------------------------------------`);

    // Generate HTML Email Templates
    const adminHtml = getAdminStaffEmailTemplate({
      fullName,
      email,
      phone: phone || '',
      company: company || '',
      domain,
      model,
      teamSize,
      timeline,
      message: message || ''
    });

    const clientHtml = getClientStaffEmailTemplate({
      firstName,
      company: company || '',
      domain,
      model,
      teamSize,
      timeline
    });

    const sendViaSmtp = async () => {
      const transporter = getTransporter();
      const smtpSender = process.env.EMAIL_USER || process.env.SMTP_USER || senderEmail;

      const adminMailOptions = {
        from: `"Nomine Staffing" <${smtpSender}>`,
        to: adminNotificationEmail,
        replyTo: email,
        subject: `[Staff Request] ${company ? company + ' - ' : ''}${fullName} (${domain})`,
        html: adminHtml
      };

      const clientMailOptions = {
        from: `"Nomine Talent Partnership" <${smtpSender}>`,
        to: email,
        replyTo: smtpSender,
        subject: `Staff Augmentation Inquiry Received - Nomine`,
        html: clientHtml
      };

      console.log(`📤 [SMTP] Dispatching Staff Request to Admin: ${adminNotificationEmail}...`);
      console.log(`📤 [SMTP] Dispatching Confirmation to Client: ${email}...`);

      const [adminResult, clientResult] = await Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(clientMailOptions)
      ]);

      console.log(`✅ [ADMIN STAFF ALERT SENT via SMTP] Message ID: ${adminResult.messageId}`);
      console.log(`✅ [CLIENT STAFF CONFIRMATION SENT via SMTP] Message ID: ${clientResult.messageId}`);
    };

    let delivered = false;

    if (isGraphConfigured()) {
      try {
        console.log(`📤 [Microsoft Graph] Dispatching Staff Request to Admin: ${adminNotificationEmail}...`);
        console.log(`📤 [Microsoft Graph] Dispatching Confirmation to Client: ${email}...`);

        // Send concurrently to avoid doubling the dispatch time
        await Promise.all([
          sendGraphEmail({
            senderEmail,
            to: adminNotificationEmail,
            replyTo: email,
            subject: `[Staff Request] ${company ? company + ' - ' : ''}${fullName} (${domain})`,
            html: adminHtml
          }),
          sendGraphEmail({
            senderEmail,
            to: email,
            replyTo: senderEmail,
            subject: `Staff Augmentation Inquiry Received - Nomine`,
            html: clientHtml
          })
        ]);

        delivered = true;
        console.log(`✅ [Microsoft Graph] Both staff inquiry emails delivered successfully for ${fullName}`);
      } catch (graphErr) {
        console.warn(`⚠️ [Microsoft Graph failed: ${graphErr.message}] -> Engaging SMTP fallback...`);
      }
    }

    if (!delivered) {
      await sendViaSmtp();
    }

    const durationMs = Date.now() - startTime;
    const durationSec = (durationMs / 1000).toFixed(2);

    console.log(`⏱️ [PERFORMANCE] Staff Inquiry Processed in: ${durationMs}ms (${durationSec}s)`);
    console.log(`======================================================\n`);

    return res.status(200).json({
      success: true,
      message: 'Staff augmentation request submitted successfully! Our team will contact you shortly.'
    });

  } catch (error) {
    const durationMs = Date.now() - startTime;
    console.error(`❌ [STAFF FORM ERROR] Processing failed after ${durationMs}ms:`, error.message);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to process staff augmentation request. Please try again or contact apply@thenomine.com.'
      });
    }
  }
};

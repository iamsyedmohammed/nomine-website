/**
 * Generate HTML email template for Company Admin when a Staff Augmentation / Dedicated Team Inquiry is submitted
 */
export const getAdminStaffEmailTemplate = ({
  fullName,
  email,
  phone,
  company,
  domain,
  model,
  teamSize,
  timeline,
  message
}) => {
  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; width: 100%; max-width: 620px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e6; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); box-sizing: border-box;">
      <div style="background-color: #111115; padding: 22px 24px; border-bottom: 4px solid #CC0101;">
        <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 800; letter-spacing: -0.5px;"><span style="color: #CC0101;">Nomine</span> Staff Augmentation</h1>
        <p style="color: #a0a0ab; font-size: 11px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">New Talent & Dedicated Team Request</p>
      </div>
      
      <div style="padding: 24px 20px; box-sizing: border-box;">
        <h2 style="font-size: 18px; color: #111115; margin-top: 0; margin-bottom: 12px;">Staffing Inquiry Details</h2>
        <p style="color: #555560; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">An enterprise client has submitted a dedicated talent request through the Nomine Staff Augmentation portal.</p>

        <div style="background-color: #fafafc; border: 1px solid #ebebef; border-radius: 10px; padding: 18px 16px; margin-bottom: 20px; box-sizing: border-box; overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; table-layout: fixed; box-sizing: border-box;">
            <tr>
              <td style="padding: 9px 8px 9px 0; color: #777782; font-weight: 600; width: 35%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-word;">Client Contact:</td>
              <td style="padding: 9px 0; color: #111115; font-weight: 700; width: 65%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-word; overflow-wrap: anywhere;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding: 9px 8px 9px 0; color: #777782; font-weight: 600; width: 35%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-word;">Work Email:</td>
              <td style="padding: 9px 0; width: 65%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-all; overflow-wrap: anywhere;">
                <a href="mailto:${email}" style="color: #111115; text-decoration: underline; font-weight: 600;">${email}</a>
              </td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding: 9px 8px 9px 0; color: #777782; font-weight: 600; width: 35%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-word;">Phone Number:</td>
              <td style="padding: 9px 0; width: 65%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-all; overflow-wrap: anywhere;">
                <a href="tel:${phone}" style="color: #111115; text-decoration: none; font-weight: 600;">${phone}</a>
              </td>
            </tr>
            ` : ''}
            ${company ? `
            <tr>
              <td style="padding: 9px 8px 9px 0; color: #777782; font-weight: 600; width: 35%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-word;">Company / Organization:</td>
              <td style="padding: 9px 0; color: #111115; font-weight: 700; width: 65%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-word;">${company}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 9px 8px 9px 0; color: #777782; font-weight: 600; width: 35%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-word;">Domain / Practice:</td>
              <td style="padding: 9px 0; color: #CC0101; font-weight: 800; width: 65%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-word;">${domain}</td>
            </tr>
            <tr>
              <td style="padding: 9px 8px 9px 0; color: #777782; font-weight: 600; width: 35%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-word;">Delivery Model:</td>
              <td style="padding: 9px 0; color: #111115; font-weight: 700; width: 65%; vertical-align: top; border-bottom: 1px solid #f0f0f4;">${model}</td>
            </tr>
            <tr>
              <td style="padding: 9px 8px 9px 0; color: #777782; font-weight: 600; width: 35%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-word;">Team Size:</td>
              <td style="padding: 9px 0; color: #111115; font-weight: 700; width: 65%; vertical-align: top; border-bottom: 1px solid #f0f0f4;">${teamSize}</td>
            </tr>
            <tr>
              <td style="padding: 9px 8px 9px 0; color: #777782; font-weight: 600; width: 35%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-word;">Timeline:</td>
              <td style="padding: 9px 0; color: #111115; font-weight: 700; width: 65%; vertical-align: top; border-bottom: 1px solid #f0f0f4;">${timeline}</td>
            </tr>
          </table>

          ${message ? `
            <div style="margin-top: 16px; padding-top: 14px; border-top: 1px dashed #e0e0e8;">
              <span style="color: #777782; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">Role Requirements & Notes:</span>
              <p style="color: #111115; font-size: 13.5px; line-height: 1.55; margin: 0; white-space: pre-wrap; background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e8e8ee; word-break: break-word;">${message}</p>
            </div>
          ` : ''}
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <a href="mailto:${email}?subject=Re: Staff Augmentation Inquiry - Nomine (${encodeURIComponent(domain)})" style="background-color: #CC0101; color: #ffffff; padding: 12px 28px; border-radius: 999px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">Reply to Inquiry</a>
        </div>
      </div>

      <div style="background-color: #fafafc; padding: 16px 20px; border-top: 1px solid #ebebef; text-align: center; font-size: 11px; color: #888892;">
        Nomine Enterprise Staffing &bull; Confidential Inquiry Notification
      </div>
    </div>
  `;
};

/**
 * Generate HTML email template for Client Confirmation
 */
export const getClientStaffEmailTemplate = ({
  firstName,
  company,
  domain,
  model,
  teamSize,
  timeline
}) => {
  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; width: 100%; max-width: 620px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e6; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); box-sizing: border-box;">
      <div style="background-color: #111115; padding: 22px 24px; border-bottom: 4px solid #CC0101;">
        <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 800; letter-spacing: -0.5px;"><span style="color: #CC0101;">Nomine</span></h1>
        <p style="color: #a0a0ab; font-size: 11px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Talent Request Received</p>
      </div>
      
      <div style="padding: 24px 20px; box-sizing: border-box;">
        <h2 style="font-size: 18px; color: #111115; margin-top: 0; margin-bottom: 12px;">Thank you for reaching out, ${firstName}!</h2>
        
        <p style="color: #555560; font-size: 14px; line-height: 1.55; margin-bottom: 14px;">
          We have received your staff augmentation inquiry for <strong>${domain}</strong>${company ? ` at <strong>${company}</strong>` : ''}. Our talent partnership and engineering leadership team is reviewing your requirements.
        </p>

        <p style="color: #555560; font-size: 14px; line-height: 1.55; margin-bottom: 20px;">
          A dedicated talent specialist will reach out within <strong>24 business hours</strong> to present curated specialist profiles, schedule technical alignment calls, and outline delivery options.
        </p>

        <div style="background-color: #fafafc; border: 1px solid #ebebef; border-radius: 10px; padding: 18px 16px; margin-bottom: 20px; box-sizing: border-box;">
          <h3 style="font-size: 14px; color: #111115; margin-top: 0; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">Request Summary</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13.5px;">
            <tr>
              <td style="padding: 6px 0; color: #777782; width: 40%;">Specialization:</td>
              <td style="padding: 6px 0; color: #111115; font-weight: 600; width: 60%;">${domain}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #777782; width: 40%;">Engagement Model:</td>
              <td style="padding: 6px 0; color: #111115; font-weight: 600; width: 60%;">${model}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #777782; width: 40%;">Requested Team Size:</td>
              <td style="padding: 6px 0; color: #111115; font-weight: 600; width: 60%;">${teamSize}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #777782; width: 40%;">Target Timeline:</td>
              <td style="padding: 6px 0; color: #111115; font-weight: 600; width: 60%;">${timeline}</td>
            </tr>
          </table>
        </div>

        <p style="color: #777782; font-size: 13px; line-height: 1.5; margin: 0;">
          Need immediate assistance? Feel free to reply directly to this email or reach us at <a href="mailto:apply@thenomine.com" style="color: #CC0101; text-decoration: none; font-weight: 600;">apply@thenomine.com</a>.
        </p>
      </div>

      <div style="background-color: #fafafc; padding: 16px 20px; border-top: 1px solid #ebebef; text-align: center; font-size: 11px; color: #888892;">
        &copy; ${new Date().getFullYear()} Nomine. All rights reserved. &bull; Enterprise Talent & Dedicated Teams
      </div>
    </div>
  `;
};

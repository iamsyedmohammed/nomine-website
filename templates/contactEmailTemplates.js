/**
 * Generate HTML email template for Company Admin when a Contact / Project Inquiry is submitted
 */
export const getAdminContactEmailTemplate = ({ firstName, lastName, email, interests, budget, message, files }) => {
  const fullName = `${firstName} ${lastName}`.trim();
  const fileNamesList = files && files.length > 0 
    ? files.map(f => f.originalname).join(', ') 
    : 'None';

  const cleanBudget = budget && typeof budget === 'string' ? budget.trim() : '';
  const isScale = cleanBudget && (cleanBudget.toLowerCase().includes('user') || cleanBudget.toLowerCase().includes('endpoint'));
  const budgetLabel = isScale ? 'Team Scale:' : 'Estimated Budget:';
  const displayBudget = cleanBudget && cleanBudget !== 'Not Specified' && !cleanBudget.includes('Not Specified')
    ? (isScale ? cleanBudget : (cleanBudget.startsWith('₹') ? cleanBudget : `₹${cleanBudget.replace(/^[₹£]/, '').trim()}`))
    : 'Not Specified';

  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e6; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); box-sizing: border-box;">
      <div style="background-color: #111115; padding: 22px 24px; border-bottom: 4px solid #CC0101;">
        <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 800; letter-spacing: -0.5px;"><span style="color: #CC0101;">Nomine</span> Studio</h1>
        <p style="color: #a0a0ab; font-size: 11px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">New Project Inquiry</p>
      </div>
      
      <div style="padding: 24px 20px; box-sizing: border-box;">
        <h2 style="font-size: 18px; color: #111115; margin-top: 0; margin-bottom: 12px;">Inquiry Details</h2>
        <p style="color: #555560; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">A potential client has submitted a new inquiry through the Nomine contact form.</p>

        <div style="background-color: #fafafc; border: 1px solid #ebebef; border-radius: 10px; padding: 18px 16px; margin-bottom: 20px; box-sizing: border-box; overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; table-layout: fixed; box-sizing: border-box;">
            <tr>
              <td style="padding: 9px 8px 9px 0; color: #777782; font-weight: 600; width: 35%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-word;">Client Name:</td>
              <td style="padding: 9px 0; color: #111115; font-weight: 700; width: 65%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-word; overflow-wrap: anywhere;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding: 9px 8px 9px 0; color: #777782; font-weight: 600; width: 35%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-word;">Email Address:</td>
              <td style="padding: 9px 0; width: 65%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-all; overflow-wrap: anywhere;">
                <a href="mailto:${email}" style="color: #111115; text-decoration: underline; font-weight: 600; word-break: break-all; overflow-wrap: anywhere;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 9px 8px 9px 0; color: #777782; font-weight: 600; width: 35%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-word;">Services Needed:</td>
              <td style="padding: 9px 0; color: #CC0101; font-weight: 800; width: 65%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-word; overflow-wrap: anywhere;">${interests}</td>
            </tr>
            <tr>
              <td style="padding: 9px 8px 9px 0; color: #777782; font-weight: 600; width: 35%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-word;">${budgetLabel}</td>
              <td style="padding: 9px 0; color: #111115; font-weight: 700; width: 65%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-word; overflow-wrap: anywhere;">${displayBudget}</td>
            </tr>
            <tr>
              <td style="padding: 9px 8px 9px 0; color: #777782; font-weight: 600; width: 35%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-word;">Attached Files:</td>
              <td style="padding: 9px 0; color: #111115; font-weight: 600; width: 65%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-word; overflow-wrap: anywhere;">${fileNamesList}</td>
            </tr>
          </table>

          ${message ? `
            <div style="margin-top: 16px; padding-top: 14px; border-top: 1px dashed #e0e0e8;">
              <span style="color: #777782; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">Message / Requirements:</span>
              <p style="color: #111115; font-size: 13.5px; line-height: 1.55; margin: 0; white-space: pre-wrap; background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e8e8ee; word-break: break-word; overflow-wrap: anywhere;">${message}</p>
            </div>
          ` : ''}
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <a href="mailto:${email}?subject=Re: Project Inquiry from ${encodeURIComponent(fullName)}" style="background-color: #CC0101; color: #ffffff; padding: 12px 28px; border-radius: 999px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">Reply to Inquiry</a>
        </div>
      </div>

      <div style="background-color: #fafafc; padding: 16px 20px; border-top: 1px solid #ebebef; text-align: center; font-size: 11px; color: #888892;">
        Nomine Studio System &bull; Confidential Inquiry Notification
      </div>
    </div>
  `;
};

/**
 * Generate HTML email template for Candidate / Client Confirmation
 */
export const getCandidateContactEmailTemplate = ({ firstName, interests, budget }) => {
  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e6; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); box-sizing: border-box;">
      <div style="background-color: #111115; padding: 22px 24px; border-bottom: 4px solid #CC0101;">
        <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 800; letter-spacing: -0.5px;"><span style="color: #CC0101;">Nomine</span></h1>
        <p style="color: #a0a0ab; font-size: 11px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Inquiry Received</p>
      </div>
      
      <div style="padding: 24px 20px; box-sizing: border-box;">
        <h2 style="font-size: 18px; color: #111115; margin-top: 0; margin-bottom: 12px;">Thank you for getting in touch, ${firstName}!</h2>
        
        <p style="color: #555560; font-size: 14px; line-height: 1.55; margin-bottom: 14px;">
          We have received your project inquiry and our team is excited to learn more about your goals.
        </p>

        <p style="color: #555560; font-size: 14px; line-height: 1.55; margin-bottom: 24px;">
          Our leads review all incoming inquiries promptly. We will review your requirements and reach out to you within <strong>2 to 4 business hours</strong>.
        </p>

        <div style="border-top: 1px solid #ebebef; padding-top: 18px;">
          <p style="margin: 0; font-weight: 700; color: #111115; font-size: 14px;">Best regards,</p>
          <p style="margin: 4px 0 0 0; color: #666672; font-size: 13.5px;">The <span style="color: #CC0101; font-weight: 700;">Nomine</span> Team</p>
        </div>
      </div>

      <div style="background-color: #fafafc; padding: 16px 20px; border-top: 1px solid #ebebef; text-align: center; font-size: 11px; color: #888892;">
        &copy; ${new Date().getFullYear()} Nomine Creative Studio &bull; All rights reserved.
      </div>
    </div>
  `;
};

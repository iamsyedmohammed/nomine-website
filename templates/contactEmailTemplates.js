/**
 * Generate HTML email template for Company Admin when a Contact / Project Inquiry is submitted
 */
export const getAdminContactEmailTemplate = ({ firstName, lastName, email, interests, budget, message, files }) => {
  const fullName = `${firstName} ${lastName}`.trim();
  const fileNamesList = files && files.length > 0 
    ? files.map(f => f.originalname).join(', ') 
    : 'None';

  const cleanBudget = budget && typeof budget === 'string' ? budget.trim() : '';
  const displayBudget = cleanBudget && cleanBudget !== 'Not Specified' && !cleanBudget.includes('Not Specified')
    ? (cleanBudget.startsWith('₹') ? cleanBudget : `₹${cleanBudget.replace(/^[₹£]/, '').trim()}`)
    : 'Not Specified';

  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e6; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
      <div style="background-color: #111115; padding: 28px 32px; border-bottom: 4px solid #CC0101;">
        <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 800; letter-spacing: -0.5px;"><span style="color: #CC0101;">Nomine</span> Studio</h1>
        <p style="color: #a0a0ab; font-size: 12px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">New Project Inquiry</p>
      </div>
      
      <div style="padding: 32px;">
        <h2 style="font-size: 20px; color: #111115; margin-top: 0; margin-bottom: 16px;">Inquiry Details</h2>
        <p style="color: #555560; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">A potential client has submitted a new project inquiry through the Nomine contact form.</p>

        <div style="background-color: #fafafc; border: 1px solid #ebebef; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14.5px;">
            <tr>
              <td style="padding: 10px 0; color: #777782; font-weight: 600; width: 160px; border-bottom: 1px solid #f0f0f4;">Client Name:</td>
              <td style="padding: 10px 0; color: #111115; font-weight: 700; border-bottom: 1px solid #f0f0f4;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #777782; font-weight: 600; border-bottom: 1px solid #f0f0f4;">Email Address:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f4;"><a href="mailto:${email}" style="color: #111115; text-decoration: underline; font-weight: 600;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #777782; font-weight: 600; border-bottom: 1px solid #f0f0f4;">Services Needed:</td>
              <td style="padding: 10px 0; color: #CC0101; font-weight: 800; border-bottom: 1px solid #f0f0f4;">${interests}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #777782; font-weight: 600; border-bottom: 1px solid #f0f0f4;">Estimated Budget:</td>
              <td style="padding: 10px 0; color: #111115; font-weight: 700; border-bottom: 1px solid #f0f0f4;">${displayBudget}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #777782; font-weight: 600; border-bottom: 1px solid #f0f0f4;">Attached Files:</td>
              <td style="padding: 10px 0; color: #111115; font-weight: 600; border-bottom: 1px solid #f0f0f4;">${fileNamesList}</td>
            </tr>
          </table>

          ${message ? `
            <div style="margin-top: 18px; padding-top: 16px; border-top: 1px dashed #e0e0e8;">
              <span style="color: #777782; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 8px;">Message / Requirements:</span>
              <p style="color: #111115; font-size: 14.5px; line-height: 1.6; margin: 0; white-space: pre-wrap; background: #ffffff; padding: 14px; border-radius: 8px; border: 1px solid #e8e8ee;">${message}</p>
            </div>
          ` : ''}
        </div>

        <div style="text-align: center; margin-top: 28px;">
          <a href="mailto:${email}?subject=Re: Project Inquiry from ${encodeURIComponent(fullName)}" style="background-color: #CC0101; color: #ffffff; padding: 14px 30px; border-radius: 999px; text-decoration: none; font-weight: 700; font-size: 14.5px; display: inline-block;">Reply to Inquiry</a>
        </div>
      </div>

      <div style="background-color: #fafafc; padding: 18px 32px; border-top: 1px solid #ebebef; text-align: center; font-size: 12px; color: #888892;">
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
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e6; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
      <div style="background-color: #111115; padding: 28px 32px; border-bottom: 4px solid #CC0101;">
        <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 800; letter-spacing: -0.5px;"><span style="color: #CC0101;">Nomine</span></h1>
        <p style="color: #a0a0ab; font-size: 12px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Inquiry Received</p>
      </div>
      
      <div style="padding: 32px;">
        <h2 style="font-size: 20px; color: #111115; margin-top: 0; margin-bottom: 16px;">Thank you for getting in touch, ${firstName}!</h2>
        
        <p style="color: #555560; font-size: 15px; line-height: 1.6; margin-bottom: 16px;">
          We have received your project inquiry and our team is excited to learn more about your goals.
        </p>

        <p style="color: #555560; font-size: 15px; line-height: 1.6; margin-bottom: 28px;">
          Our creative leads review all incoming inquiries promptly. We will review your requirements and reach out to you within <strong>2 to 4 business hours</strong>.
        </p>

        <div style="border-top: 1px solid #ebebef; padding-top: 20px;">
          <p style="margin: 0; font-weight: 700; color: #111115; font-size: 15px;">Best regards,</p>
          <p style="margin: 4px 0 0 0; color: #666672; font-size: 14px;">The <span style="color: #CC0101; font-weight: 700;">Nomine</span> Creative Leadership Team</p>
        </div>
      </div>

      <div style="background-color: #fafafc; padding: 18px 32px; border-top: 1px solid #ebebef; text-align: center; font-size: 12px; color: #888892;">
        &copy; ${new Date().getFullYear()} Nomine Creative Studio &bull; All rights reserved.
      </div>
    </div>
  `;
};

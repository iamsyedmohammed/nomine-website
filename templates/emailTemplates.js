/**
 * Generate HTML email template for Company / HR Admin Notification
 */
export const getAdminEmailTemplate = ({ fullName, email, phone, position, experienceYears, fileName }) => {
  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e6; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); box-sizing: border-box;">
      <div style="background-color: #111115; padding: 22px 24px; border-bottom: 4px solid #CC0101; box-sizing: border-box;">
        <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 800; letter-spacing: -0.5px;"><span style="color: #CC0101;">Nomine</span> Careers</h1>
        <p style="color: #a0a0ab; font-size: 11px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">New Candidate Application</p>
      </div>
      
      <div style="padding: 24px 20px; box-sizing: border-box;">
        <h2 style="font-size: 18px; color: #111115; margin-top: 0; margin-bottom: 12px; word-break: break-word;">Candidate Profile Submission</h2>
        <p style="color: #555560; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">A new candidate has submitted their application via the Nomine Careers portal.</p>

        <div style="background-color: #fafafc; border: 1px solid #ebebef; border-radius: 10px; padding: 18px 16px; margin-bottom: 20px; box-sizing: border-box; overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; table-layout: fixed; box-sizing: border-box;">
            <tr>
              <td style="padding: 9px 8px 9px 0; color: #777782; font-weight: 600; width: 38%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-word;">Full Name:</td>
              <td style="padding: 9px 0; color: #111115; font-weight: 700; width: 62%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-word; overflow-wrap: anywhere;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding: 9px 8px 9px 0; color: #777782; font-weight: 600; width: 38%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-word;">Position Applied:</td>
              <td style="padding: 9px 0; color: #CC0101; font-weight: 800; width: 62%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-word; overflow-wrap: anywhere;">${position}</td>
            </tr>
            <tr>
              <td style="padding: 9px 8px 9px 0; color: #777782; font-weight: 600; width: 38%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-word;">Email Address:</td>
              <td style="padding: 9px 0; width: 62%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-all; overflow-wrap: anywhere;">
                <a href="mailto:${email}" style="color: #111115; text-decoration: underline; font-weight: 600; word-break: break-all; overflow-wrap: anywhere;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 9px 8px 9px 0; color: #777782; font-weight: 600; width: 38%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-word;">Phone Number:</td>
              <td style="padding: 9px 0; color: #111115; font-weight: 600; width: 62%; vertical-align: top; border-bottom: 1px solid #f0f0f4; word-break: break-word; overflow-wrap: anywhere;">
                <a href="tel:${phone}" style="color: #111115; text-decoration: none;">${phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 9px 8px 9px 0; color: #777782; font-weight: 600; width: 38%; vertical-align: top; word-break: break-word;">Relevant Experience:</td>
              <td style="padding: 9px 0; color: #111115; font-weight: 600; width: 62%; vertical-align: top; word-break: break-word; overflow-wrap: anywhere;">${experienceYears}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #fde8e8; border: 1px solid #f8c8c8; border-radius: 10px; padding: 14px 16px; margin-bottom: 24px; box-sizing: border-box; word-break: break-word; overflow-wrap: anywhere;">
          <span style="color: #CC0101; font-weight: 700; font-size: 13.5px;">📎 Resume Attached:</span>
          <span style="color: #111115; font-weight: 600; font-size: 13px; margin-left: 6px; word-break: break-all; overflow-wrap: anywhere;">${fileName}</span>
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <a href="mailto:${email}?subject=Re: Application for ${encodeURIComponent(position)} at Nomine" style="background-color: #CC0101; color: #ffffff; padding: 12px 28px; border-radius: 999px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">Reply to Candidate</a>
        </div>
      </div>

      <div style="background-color: #fafafc; padding: 16px 20px; border-top: 1px solid #ebebef; text-align: center; font-size: 11px; color: #888892; box-sizing: border-box;">
        Nomine Careers System &bull; Confidential Application Notification
      </div>
    </div>
  `;
};

/**
 * Generate HTML email template for Candidate (User Confirmation)
 */
export const getCandidateEmailTemplate = ({ fullName, position }) => {
  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e6; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); box-sizing: border-box;">
      <div style="background-color: #111115; padding: 22px 24px; border-bottom: 4px solid #CC0101; box-sizing: border-box;">
        <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 800; letter-spacing: -0.5px;"><span style="color: #CC0101;">Nomine</span></h1>
        <p style="color: #a0a0ab; font-size: 11px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Application Received</p>
      </div>
      
      <div style="padding: 24px 20px; box-sizing: border-box;">
        <h2 style="font-size: 18px; color: #111115; margin-top: 0; margin-bottom: 12px; word-break: break-word;">Thank you for applying, ${fullName}!</h2>
        
        <p style="color: #555560; font-size: 14px; line-height: 1.6; margin-bottom: 16px; word-break: break-word;">
          We have received your application for the <strong style="color: #CC0101;">${position}</strong> role at Nomine.
        </p>

        <p style="color: #555560; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
          Our creative and talent team will review your qualifications and experience. If your background aligns with our current needs, we will reach out directly to arrange an initial conversation.
        </p>

        <div style="border-top: 1px solid #ebebef; padding-top: 18px;">
          <p style="margin: 0; font-weight: 700; color: #111115; font-size: 14px;">Best regards,</p>
          <p style="margin: 4px 0 0 0; color: #666672; font-size: 13.5px;">The <span style="color: #CC0101; font-weight: 700;">Nomine</span> Talent Team</p>
        </div>
      </div>

      <div style="background-color: #fafafc; padding: 16px 20px; border-top: 1px solid #ebebef; text-align: center; font-size: 11px; color: #888892; box-sizing: border-box;">
        &copy; ${new Date().getFullYear()} Nomine Creative Studio &bull; All rights reserved.
      </div>
    </div>
  `;
};

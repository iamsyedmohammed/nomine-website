/**
 * Generate HTML email template for Company / HR Admin Notification
 */
export const getAdminEmailTemplate = ({ fullName, email, phone, position, experienceYears, fileName }) => {
  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e6; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
      <div style="background-color: #111115; padding: 28px 32px; border-bottom: 4px solid #CC0101;">
        <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 800; letter-spacing: -0.5px;"><span style="color: #CC0101;">Nomine</span> Careers</h1>
        <p style="color: #a0a0ab; font-size: 12px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">New Candidate Application</p>
      </div>
      
      <div style="padding: 32px;">
        <h2 style="font-size: 20px; color: #111115; margin-top: 0; margin-bottom: 16px;">Candidate Profile Submission</h2>
        <p style="color: #555560; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">A new candidate has submitted their application via the Nomine Careers portal.</p>

        <div style="background-color: #fafafc; border: 1px solid #ebebef; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14.5px;">
            <tr>
              <td style="padding: 10px 0; color: #777782; font-weight: 600; width: 160px; border-bottom: 1px solid #f0f0f4;">Full Name:</td>
              <td style="padding: 10px 0; color: #111115; font-weight: 700; border-bottom: 1px solid #f0f0f4;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #777782; font-weight: 600; border-bottom: 1px solid #f0f0f4;">Position Applied:</td>
              <td style="padding: 10px 0; color: #CC0101; font-weight: 800; border-bottom: 1px solid #f0f0f4;">${position}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #777782; font-weight: 600; border-bottom: 1px solid #f0f0f4;">Email Address:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f4;"><a href="mailto:${email}" style="color: #111115; text-decoration: underline; font-weight: 600;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #777782; font-weight: 600; border-bottom: 1px solid #f0f0f4;">Phone Number:</td>
              <td style="padding: 10px 0; color: #111115; font-weight: 600; border-bottom: 1px solid #f0f0f4;"><a href="tel:${phone}" style="color: #111115; text-decoration: none;">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #777782; font-weight: 600;">Relevant Experience:</td>
              <td style="padding: 10px 0; color: #111115; font-weight: 600;">${experienceYears}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #fde8e8; border: 1px solid #f8c8c8; border-radius: 10px; padding: 14px 18px; margin-bottom: 24px;">
          <span style="color: #CC0101; font-weight: 700; font-size: 14px;">📎 Resume Attached:</span>
          <span style="color: #111115; font-weight: 600; font-size: 13.5px; margin-left: 8px;">${fileName}</span>
        </div>

        <div style="text-align: center; margin-top: 28px;">
          <a href="mailto:${email}?subject=Re: Application for ${encodeURIComponent(position)} at Nomine" style="background-color: #CC0101; color: #ffffff; padding: 14px 30px; border-radius: 999px; text-decoration: none; font-weight: 700; font-size: 14.5px; display: inline-block;">Reply to Candidate</a>
        </div>
      </div>

      <div style="background-color: #fafafc; padding: 18px 32px; border-top: 1px solid #ebebef; text-align: center; font-size: 12px; color: #888892;">
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
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e6; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
      <div style="background-color: #111115; padding: 28px 32px; border-bottom: 4px solid #CC0101;">
        <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 800; letter-spacing: -0.5px;"><span style="color: #CC0101;">Nomine</span></h1>
        <p style="color: #a0a0ab; font-size: 12px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Application Received</p>
      </div>
      
      <div style="padding: 32px;">
        <h2 style="font-size: 20px; color: #111115; margin-top: 0; margin-bottom: 16px;">Thank you for applying, ${fullName}!</h2>
        
        <p style="color: #555560; font-size: 15px; line-height: 1.6; margin-bottom: 16px;">
          We have received your application for the <strong style="color: #CC0101;">${position}</strong> role at Nomine.
        </p>

        <p style="color: #555560; font-size: 15px; line-height: 1.6; margin-bottom: 28px;">
          Our creative and talent team will review your qualifications and experience. If your background aligns with our current needs, we will reach out directly to arrange an initial conversation.
        </p>

        <div style="border-top: 1px solid #ebebef; padding-top: 20px;">
          <p style="margin: 0; font-weight: 700; color: #111115; font-size: 15px;">Best regards,</p>
          <p style="margin: 4px 0 0 0; color: #666672; font-size: 14px;">The <span style="color: #CC0101; font-weight: 700;">Nomine</span> Talent Team</p>
        </div>
      </div>

      <div style="background-color: #fafafc; padding: 18px 32px; border-top: 1px solid #ebebef; text-align: center; font-size: 12px; color: #888892;">
        &copy; ${new Date().getFullYear()} Nomine Creative Studio &bull; All rights reserved.
      </div>
    </div>
  `;
};

/**
 * Microsoft Graph API Email Service
 * Uses OAuth 2.0 Client Credentials Grant with Microsoft Entra ID (Azure AD)
 * to send transactional emails via POST /v1.0/users/{sender}/sendMail
 */

let cachedAccessToken = null;
let tokenExpiresAt = 0;

/**
 * Acquire or reuse cached OAuth 2.0 Access Token from Microsoft Entra ID
 */
export const getGraphAccessToken = async () => {
  const tenantId = process.env.MICROSOFT_TENANT_ID || process.env.AZURE_TENANT_ID;
  const clientId = process.env.MICROSOFT_CLIENT_ID || process.env.AZURE_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET || process.env.AZURE_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error('[Microsoft Graph OAuth] Missing MICROSOFT_TENANT_ID, MICROSOFT_CLIENT_ID, or MICROSOFT_CLIENT_SECRET in environment variables.');
  }

  // Check if we have a valid cached token (with a 5-minute safety buffer)
  if (cachedAccessToken && Date.now() < tokenExpiresAt - 5 * 60 * 1000) {
    return cachedAccessToken;
  }

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('scope', 'https://graph.microsoft.com/.default');
  params.append('grant_type', 'client_credentials');

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`[Microsoft Graph OAuth] Token request failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  cachedAccessToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in || 3600) * 1000;
  return cachedAccessToken;
};

/**
 * Send an email via Microsoft Graph API
 *
 * @param {Object} options
 * @param {string} options.to - Recipient email (or array of emails)
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML body
 * @param {string} [options.replyTo] - Reply-to email address
 * @param {string} [options.senderEmail] - Sender mailbox (default: GRAPH_SENDER_EMAIL or EMAIL_USER or vijay@thenomine.com)
 * @param {Array<Object>} [options.attachments] - Array of { filename, content: Buffer|string, contentType }
 */
export const sendGraphEmail = async ({
  to,
  subject,
  html,
  replyTo,
  senderEmail,
  attachments = []
}) => {
  const token = await getGraphAccessToken();
  const sender = senderEmail || process.env.GRAPH_SENDER_EMAIL || process.env.EMAIL_USER || 'apply@thenomine.com';

  const recipientList = (Array.isArray(to) ? to : [to])
    .filter(Boolean)
    .map((addr) => ({
      emailAddress: { address: addr.trim() }
    }));

  if (recipientList.length === 0) {
    throw new Error('[Microsoft Graph sendMail] No recipient email specified.');
  }

  const message = {
    subject,
    body: {
      contentType: 'HTML',
      content: html
    },
    toRecipients: recipientList
  };

  if (replyTo) {
    const replyToList = (Array.isArray(replyTo) ? replyTo : [replyTo])
      .filter(Boolean)
      .map((addr) => ({
        emailAddress: { address: addr.trim() }
      }));
    if (replyToList.length > 0) {
      message.replyTo = replyToList;
    }
  }

  if (attachments && attachments.length > 0) {
    message.attachments = attachments.map((att) => {
      let base64String = '';
      if (Buffer.isBuffer(att.content)) {
        base64String = att.content.toString('base64');
      } else if (typeof att.content === 'string') {
        base64String = att.content.startsWith('data:')
          ? att.content.split(',')[1]
          : Buffer.from(att.content).toString('base64');
      }

      return {
        '@odata.type': '#microsoft.graph.fileAttachment',
        name: att.filename,
        contentType: att.contentType || 'application/octet-stream',
        contentBytes: base64String
      };
    });
  }

  const sendMailUrl = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(sender)}/sendMail`;

  const response = await fetch(sendMailUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message,
      saveToSentItems: false
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`[Microsoft Graph sendMail] Failed (${response.status}): ${errorBody}`);
  }

  return { success: true };
};

# Nomine Careers Backend Server

This is the backend service for processing job application submissions from the Nomine Careers page.

## Directory Structure

```
server/
├── config/
│   └── multer.js              # File upload configuration (PDF/DOC/DOCX, 10MB limit)
├── controllers/
│   └── applicationController.js # Logic for sending admin & candidate emails
├── routes/
│   └── applicationRoutes.js   # API endpoint routes (/api/apply)
├── templates/
│   └── emailTemplates.js      # Branded HTML email templates
└── server.js                  # Express server entry point
```

## Environment Variables (`.env`)

Create a `.env` file in the project root with your SMTP credentials:

```env
PORT=5000
SMTP_USER=careers@yourcompany.com
SMTP_PASS=your-app-password-or-api-key
ADMIN_EMAIL=hr@yourcompany.com
```

## Running the Server

From the project root directory, run:

```bash
npm run server
```

The server will start listening at `http://localhost:5000`.

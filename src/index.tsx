import { serve } from 'bun';
import index from './index.html';
import nodemailer from 'nodemailer';

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    '/*': index,

    '/api/send-email': {
      async POST(req) {
        const body = await req.json(); // Convert ReadableStream to JSON
        const { message } = body;

        console.log({ body });

        if (!message) {
          return Response.json({ status: 400, error: 'Missing required fields' });
        }

        async function sendEmail() {
          const transporter = nodemailer.createTransport({
            service: 'gmail', // or use SMTP settings
            auth: {
              user: 'chris.james.haupt@gmail.com', // Replace with your email
              pass: 'nako wygo jjep szut',
            },
          });

          const mailOptions = {
            from: 'haupt landing page',
            to: 'chris.james.haupt@gmail.com',
            subject: 'Haupt Music - Feedback Form - New Feedback',
            text: message,
          };

          try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent:', info.response);
            return { success: true, message: 'Email sent successfully' };
          } catch (error) {
            console.error('Email sending failed:', error);
            return { success: false, message: 'Email sending failed', error };
          }
        }

        try {
          await sendEmail();
          console.log('sending success!');
          return Response.json({
            message: 'email sent!',
            method: 'PUT',
          });
        } catch (err) {
          console.error({ err });
        }
      },
    },

    '/api/hello/:name': async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== 'production',
});

console.log(`🚀 Server running at ${server.url}`);

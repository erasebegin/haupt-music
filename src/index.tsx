import { serve } from 'bun';
import index from './index.html';
import nodemailer from 'nodemailer';

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    '/*': index,

    '/api/send-email': {
      async POST(req) {
        const body = await req.json();
        const { message } = body;

        if (!message) {
          return Response.json({ status: 400, error: 'Missing required fields' });
        }

        async function sendEmail() {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'music.haupt@gmail.com',
              pass: 'mlhv bffp gwti yfpo',
            },
          });

          const mailOptions = {
            from: 'haupt landing page',
            to: 'music.haupt@gmail.com',
            subject: 'Haupt Music - Feedback Form - New Feedback',
            text: message,
          };

          try {
            await transporter.sendMail(mailOptions);
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

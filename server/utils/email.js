const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: 'mohamed nasr <hello@monasr.io>',
    to: options.email,
    subject: 'Your password reset token (valid for only 10 minutes)',
    text: options.message,
  };
  await transport.sendMail(mailOptions);
};
module.exports = sendEmail;

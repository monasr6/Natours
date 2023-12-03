const nodemailer = require('nodemailer');

const sendEmail = async () => {
  const transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 25,
    auth: {
      user: 'daa27eaf714704',
      pass: 'aff72ad69d1a70',
    },
  });

  const mailOptions = {
    from: 'Jonas Schmedtman',
    to: 'mahamednasr6@gmail.com',
    subject: 'Your password reset token (valid for only 10 minutes)',
    text: 'Hello world?',
  };

  await transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

sendEmail();

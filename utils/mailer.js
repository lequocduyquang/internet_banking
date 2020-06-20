const nodeMailer = require('nodemailer');

const sendMail = async (email, message) => {
  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.FROM_EMAIL || 'jobfit.hcmus@gmail.com',
      pass: 'jyvs pmea tkxc zlkx',
    },
  });
  const options = {
    from: process.env.FROM_EMAIL || 'jobfit.hcmus@gmail.com',
    to: email,
    subject: 'Thong bao nhac no',
    html: message,
  };
  const info = await transporter.sendMail(options);
  return info.messageId;
};

module.exports = {
  sendMail,
};

const nodemailer = require("nodemailer");
const config = require("../config");
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.email.emailUser,
      pass: config.email.emailPass,
    },
  });

  await transporter.sendMail({
    from: config.email.emailUser,
    to,
    subject,
    html: text,
  });
};

module.exports = { sendEmail };

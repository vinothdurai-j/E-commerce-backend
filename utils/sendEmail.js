const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {

         console.log("Sending email to:", to);

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER or EMAIL_PASS missing in .env");
  }

  const info = await transporter.sendMail({
    from: `"My App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log("Email sent:", info.messageId);
    console.log("Message ID:", info.messageId);
  return info;
};

module.exports = sendEmail;
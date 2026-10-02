const nodemailer = require("nodemailer");

const optSend = async (opt, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();
    console.log("SMTP Connected");

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject:"One Time Password (OTP) Verification",
      html: `
        <h2>Email Verification</h2>
        <p>Your verification code is: <strong>${opt}</strong></p>

        <p>Don't share this code with anyone</p>
      `,
    });

    console.log("Email Sent Successfully");
  } catch (error) {
    console.log("Email Error:", error.message);
  }
};

module.exports = optSend;
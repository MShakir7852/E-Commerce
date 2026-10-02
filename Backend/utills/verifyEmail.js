const nodemailer = require("nodemailer");

const verifyEmail = async (token, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `
        <h2>Email Verification</h2>
        <p>Click the link below to verify your email:</p>

        <a href="http://localhost:5173/verify/${token}">Verify Email</a>


      `,
    });

    // console.log("Email Sent Successfully");
  } catch (error) {
    console.log("Email Error:", error.message);
  }
};

module.exports = verifyEmail;
const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  try {
    // Standard transport creation
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"SHREE CHIRANJEEVI Clinic" <${process.env.EMAIL_USER || 'no-reply@chiranjeeviclinic.com'}>`,
      to,
      subject,
      html,
    };

    // Only attempt sending if email credentials are provided
    if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'placeholder-email@gmail.com') {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully: ${info.messageId}`);
      return true;
    } else {
      console.log(`[Email Mock Service] Log: To: ${to} | Subject: ${subject}`);
      console.log(`Content:\n${html.replace(/<[^>]*>/g, ' ')}`);
      return false;
    }
  } catch (error) {
    console.error(`Email Sending Failed: ${error.message}`);
    return false;
  }
};

module.exports = sendEmail;

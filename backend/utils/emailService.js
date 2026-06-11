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

const sendAppointmentNotificationToDoctor = async ({ patientName, patientPhone, patientEmail, date, time, symptoms }) => {
  try {
    const doctorEmails = process.env.DOCTOR_EMAILS || process.env.DOCTOR_EMAIL || 'yateshgahukar4@gmail.com';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <div style="text-align: center; border-bottom: 2px solid #f59e0b; padding-bottom: 15px; margin-bottom: 20px;">
          <h2 style="color: #065f46; margin: 0; font-family: 'Georgia', serif;">SHREE CHIRANJEEVI Clinic</h2>
          <p style="color: #f59e0b; font-size: 11px; font-weight: bold; text-transform: uppercase; tracking-wider: 0.1em; margin: 5px 0 0 0;">Ayurveda & Panchakarma</p>
        </div>
        
        <h3 style="color: #111827; font-size: 18px; margin-top: 0;">New Consultation Request</h3>
        <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">Dear Doctor,</p>
        <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">A new appointment has been scheduled by a patient on the online portal.</p>
        
        <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #f3f4f6;">
          <h4 style="margin: 0 0 10px 0; color: #065f46; font-size: 14px; border-bottom: 1px dashed #e5e7eb; padding-bottom: 5px;">Patient Information</h4>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #374151;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 35%;">Full Name:</td>
              <td style="padding: 6px 0;">${patientName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Phone Number:</td>
              <td style="padding: 6px 0;">${patientPhone}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Email Address:</td>
              <td style="padding: 6px 0;">${patientEmail}</td>
            </tr>
          </table>
          
          <h4 style="margin: 15px 0 10px 0; color: #065f46; font-size: 14px; border-bottom: 1px dashed #e5e7eb; padding-bottom: 5px;">Booking Details</h4>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #374151;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 35%;">Preferred Date:</td>
              <td style="padding: 6px 0;">${date}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Time Slot:</td>
              <td style="padding: 6px 0;">${time}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; vertical-align: top;">Symptoms/Reason:</td>
              <td style="padding: 6px 0; vertical-align: top; line-height: 1.4;">${symptoms}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px; font-size: 13px; color: #b45309; border-radius: 4px; margin-bottom: 20px;">
          <strong>Action Required:</strong> Please login to dashboard to confirm or reject.
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; text-align: center;">
          <p style="margin: 0; font-size: 11px; color: #9ca3af;">This is an automated notification from the SHREE CHIRANJEEVI Clinic booking system.</p>
        </div>
      </div>
    `;

    return await sendEmail({
      to: doctorEmails,
      subject: `New Appointment Request - ${patientName}`,
      html,
    });
  } catch (error) {
    console.error(`sendAppointmentNotificationToDoctor Failed: ${error.message}`);
    return false;
  }
};

module.exports = {
  sendEmail,
  sendAppointmentNotificationToDoctor,
};

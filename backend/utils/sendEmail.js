const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `"Sofia Shop" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    // Attempt to send
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.response);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    
    // Log the content (OTP) to terminal so developer can still see it
    console.log('\n------------------- OFFLINE EMAIL LOG -------------------');
    console.log('TO:', to);
    console.log('SUBJECT:', subject);
    console.log('CONTENT:', html.replace(/<[^>]*>?/gm, '')); // Strip HTML tags for terminal
    console.log('----------------------------------------------------------\n');
    
    // Return true anyway so the registration flow doesn't break for the user
    // They can check the terminal for the code if email delivery fails
    return true; 
  }
};

module.exports = sendEmail;

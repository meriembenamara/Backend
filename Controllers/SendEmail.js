import nodemailer from 'nodemailer';

// Function to generate a random verification code
export function generateVerificationCode() {
    const length = 9; 
    let result = '';
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }


  
// email reset password
export const SendEmailResetPassword = async (email, verificationCode, firstName) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "hamzaamry009@gmail.com",  // change this ////
        pass: "fdfl vhtu yhis sjbq",  // change this ////
      },
    });
  
    const emailContent = `
      Hi ${firstName},
  
      You have requested to reset your password.
  
      Please use the following code to reset your password within 1 hour: ${verificationCode}
  
      If you did not request a password reset, please ignore this email.
  
      Best regards,
  
      The Team
    `;
  
    const mailOptions = {
      from: 'Tfa9adni <hamzaamry009@gmail.com>', // change this //// 
      to: email,
      subject: 'Password Reset Request',
      text: emailContent,
    };
  
    await transporter.sendMail(mailOptions);
  };
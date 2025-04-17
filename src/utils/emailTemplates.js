const APP_NAME = "Qube";
const APP_URL = "https://glintqube.vercel.app/";
const LOGO_URL =
  "https://res.cloudinary.com/dsvtqbsea/image/upload/t_reducedDimension/vpf02nji60ba2ht7ujdn";

const emailTemplates = {
  header: `
    <div style="text-align: center; padding: 20px;">
      <img src="${LOGO_URL}" alt="${APP_NAME} Logo" style="width: 150px; margin-bottom: 10px;">
    </div>
  `,

  footer: `
    <div style="text-align: center; padding: 10px; font-size: 12px; color: #777;">
      <p>Need help? <a href="${APP_URL}/support" style="color: #007BFF; text-decoration: none;">Contact Support</a></p>
      <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
    </div>
  `,

  passwordResetOTP: (user, otp) => `
    <html>
    <body>

    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px; background: #f9f9f9;">
            <div style="text-align: center; padding: 20px;">
      <img src="${LOGO_URL}" alt="${APP_NAME} Logo" style="width: 150px; margin-bottom: 10px;">
    </div>
    <h2 style="color: #333;">Password Reset Request</h2>
    <p>Hi <strong>${user || "User"}</strong>,</p>
    <p>You requested a password reset. Use the OTP below:</p>
    <h3 style="background: #007BFF; color: #fff; padding: 10px; border-radius: 5px; text-align: center;">${otp}</h3>
    <p>This OTP is valid for 15 minutes. If you did not request this, please ignore this email.</p>
        <div style="text-align: center; padding: 10px; font-size: 12px; color: #777;">
      <p>Need help? <a href="${APP_URL}/support" style="color: #007BFF; text-decoration: none;">Contact Support</a></p>
      <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
    </div>
    </div>
    </body>
    </html>
  `,

  passwordResetSuccess: (user) => `

    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px; background: #f9f9f9;">
        <div style="text-align: center; padding: 20px;">
      <img src="${LOGO_URL}" alt="${APP_NAME} Logo" style="width: 150px; margin-bottom: 10px;">
    </div>
      <h2 style="color: #28a745;">Password Reset Successful</h2>
      <p>Hi <strong>${user || "User"}</strong>,</p>
      <p>Your password has been successfully changed.</p>
      <p>If you did not perform this action, please contact support immediately.</p>
    <div style="text-align: center; padding: 10px; font-size: 12px; color: #777;">
      <p>Need help? <a href="${APP_URL}/support" style="color: #007BFF; text-decoration: none;">Contact Support</a></p>
      <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
    </div>
    </div>
  `,

  loginSuccess: (user) => `
    
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px; background: #f9f9f9;">
        <div style="text-align: center; padding: 20px;">
      <img src="${LOGO_URL}" alt="${APP_NAME} Logo" style="width: 150px; margin-bottom: 10px;">
    </div>
      <h2 style="color: #333;">Login Successful</h2>
      <p>Hi <strong>${user.name || "User"}</strong>,</p>
      <p>You have successfully logged into your account.</p>
      <p>If this wasn't you, please <a href="${APP_URL}/reset-password" style="color: #dc3545;">reset your password</a> immediately.</p>
          <div style="text-align: center; padding: 10px; font-size: 12px; color: #777;">
      <p>Need help? <a href="${APP_URL}/support" style="color: #007BFF; text-decoration: none;">Contact Support</a></p>
      <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
    </div>
    </div>
  `,

  registrationSuccess: (user) => `
    ${emailTemplates.header}
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px; background: #f9f9f9;">
      <h2 style="color: #007BFF;">Welcome to ${APP_NAME}!</h2>
      <p>Hi <strong>${user.name || "User"}</strong>,</p>
      <p>Thank you for registering with us! Your account has been created successfully.</p>
      <p>We are excited to have you on board.</p>
      ${emailTemplates.footer}
    </div>
  `,

  otpVerification: (user, otp) => `
    ${emailTemplates.header}
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px; background: #f9f9f9;">
      <h2 style="color: #333;">OTP Verification</h2>
      <p>Hi <strong>${user.name || "User"}</strong>,</p>
      <p>Your One-Time Password (OTP) for verification is:</p>
      <h3 style="background: #007BFF; color: #fff; padding: 10px; border-radius: 5px; text-align: center;">${otp}</h3>
      <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
      ${emailTemplates.footer}
    </div>
  `,
};

module.exports = { emailTemplates };

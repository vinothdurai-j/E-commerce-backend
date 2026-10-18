// // Welcome mail template (simple)
module.exports.welcomeEmail = (name) => ({
  subject: "Welcome to My App",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; color: #333;">
      <h2>Hello ${name},</h2>
      <p>Thank you for registering. Your account has been created successfully.</p>
      <p>If you have any questions, just reply to this email.</p>
      <p>Regards,<br/>My App Team</p>
    </div>
  `,
});

module.exports.otpEmail = (name, otp) => ({
    subject: "Your Password Reset OTP",
    html: `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e5e5e5;border-radius:8px">
        <h2 style="color:#333;margin-top:0">Password Reset</h2>
        <p style="color:#555">Hi ${name || "there"},</p>
        <p style="color:#555">Use the OTP below to reset your password:</p>

        <div style="text-align:center;margin:24px 0">
            <span style="display:inline-block;font-size:32px;font-weight:bold;letter-spacing:8px;padding:12px 24px;background:#f4f4f4;border-radius:6px;color:#111">
                ${otp}
            </span>
        </div>

        <p style="color:#555">This OTP is valid for <b>10 minutes</b>.</p>
        <p style="color:#999;font-size:13px">If you didn't request this, you can safely ignore this email.</p>
    </div>`
})


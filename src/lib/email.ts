import { Resend } from "resend"

let _resend: Resend | null = null
function getResend() {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY || "")
  }
  return _resend
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@codetutor.dev"
const FROM_EMAIL = "CodeTutor <onboarding@resend.dev>"

export async function sendNewDeviceAlert({
  userEmail,
  userName,
  userAgent,
  ipAddress,
  loginAt,
}: {
  userEmail: string
  userName: string | null
  userAgent: string
  ipAddress: string | null
  loginAt: Date
}) {
  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `⚠️ התחברות ממכשיר חדש: ${userEmail}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #EF4444;">🔔 זוהתה התחברות ממכשיר חדש</h2>
          <div style="background: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p><strong>משתמש:</strong> ${userName || "N/A"} (${userEmail})</p>
            <p><strong>כתובת IP:</strong> ${ipAddress || "לא ידוע"}</p>
            <p><strong>מכשיר:</strong> ${userAgent}</p>
            <p><strong>זמן:</strong> ${loginAt.toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" })}</p>
          </div>
          <p style="color: #6B7280; font-size: 14px;">
            התראה זו נשלחה כי המשתמש התחבר ממכשיר שלא תועד קודם לכן.
          </p>
        </div>
      `,
    })
  } catch (error) {
    console.error("Failed to send new device alert email:", error)
  }
}

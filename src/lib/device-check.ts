import { createHash } from "crypto"
import { db } from "@/lib/db"
import { sendNewDeviceAlert } from "@/lib/email"

function hashFingerprint(userAgent: string): string {
  return createHash("sha256").update(userAgent).digest("hex")
}

export interface DeviceCheckResult {
  isNewDevice: boolean
  isFirstLogin: boolean
}

export async function checkDeviceLogin({
  userId,
  userEmail,
  userName,
  userAgent,
  ipAddress,
}: {
  userId: string
  userEmail: string
  userName: string | null
  userAgent: string
  ipAddress: string | null
}): Promise<DeviceCheckResult> {
  const fingerprintHash = hashFingerprint(userAgent)
  const now = new Date()

  const existingDevices = await db.deviceLogin.findMany({
    where: { userId },
    orderBy: { lastLoginAt: "desc" },
  })

  const knownDevice = existingDevices.find(
    (d) => d.fingerprintHash === fingerprintHash
  )

  if (knownDevice) {
    await db.deviceLogin.update({
      where: { id: knownDevice.id },
      data: { lastLoginAt: now, ipAddress },
    })
    return { isNewDevice: false, isFirstLogin: false }
  }

  await db.deviceLogin.create({
    data: {
      userId,
      fingerprintHash,
      userAgent,
      ipAddress,
      lastLoginAt: now,
    },
  })

  const isFirstLogin = existingDevices.length === 0

  if (!isFirstLogin) {
    sendNewDeviceAlert({
      userEmail,
      userName,
      userAgent,
      ipAddress,
      loginAt: now,
    }).catch((err) => console.error("Device alert email failed:", err))
  }

  return { isNewDevice: !isFirstLogin, isFirstLogin }
}

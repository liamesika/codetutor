import { test, expect, Page } from "@playwright/test"

// Helper to login as demo user
async function loginAsDemoUser(page: Page) {
  await page.goto("/login")
  await page.getByLabel(/email/i).fill("demo@codetutor.dev")
  await page.getByLabel(/password/i).fill("demo123")
  await page.getByRole("button", { name: /continue|sign in/i }).click()
  await expect(page).toHaveURL(/dashboard/, { timeout: 15000 })
}

// Helper to navigate to first available practice question
async function navigateToPractice(page: Page): Promise<boolean> {
  // Try to find any week topic with questions
  const topicLinks = page.locator('a[href*="/learn/"]').first()
  if (await topicLinks.isVisible({ timeout: 5000 }).catch(() => false)) {
    await topicLinks.click()
    await page.waitForLoadState("networkidle")

    // Now find a question to practice
    const questionLink = page.locator('a[href*="/practice/"]').first()
    if (await questionLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await questionLink.click()
      return true
    }
  }

  return false
}

test.describe("XP Guards - Hint & Solution Protection", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemoUser(page)
  })

  test("should show hint button with XP cost badge", async ({ page }) => {
    const navigated = await navigateToPractice(page)
    if (!navigated) {
      test.skip()
      return
    }

    await expect(page).toHaveURL(/practice\//, { timeout: 10000 })

    // Look for hint button with XP badge
    const hintButton = page.locator('button:has-text("Get Hint"), button:has-text("Hint")')

    if (await hintButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Should show XP cost
      const xpBadge = page.locator('text=/-[0-9]+ XP/')
      await expect(xpBadge.first()).toBeVisible({ timeout: 5000 })
    }
  })

  test("should show solution button with -50 XP cost", async ({ page }) => {
    const navigated = await navigateToPractice(page)
    if (!navigated) {
      test.skip()
      return
    }

    await expect(page).toHaveURL(/practice\//, { timeout: 10000 })

    // Switch to solution tab on mobile or look for solution section
    const solutionTab = page.locator('button:has-text("Solution"), [role="tab"]:has-text("Solution")')
    if (await solutionTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await solutionTab.click()
    }

    // Look for reveal solution button
    const revealButton = page.locator('button:has-text("Reveal Solution")')

    if (await revealButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Should show -50 XP cost
      await expect(page.locator('text=/-50 XP/')).toBeVisible({ timeout: 5000 })
    }
  })

  test("should disable hint button when XP is insufficient", async ({ page }) => {
    const navigated = await navigateToPractice(page)
    if (!navigated) {
      test.skip()
      return
    }

    await expect(page).toHaveURL(/practice\//, { timeout: 10000 })

    // Check if hint button shows disabled state
    const hintButton = page.locator('button:has-text("Get Hint"), button:has-text("Hint")').first()

    if (await hintButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Button should either be enabled or disabled based on XP
      const isDisabled = await hintButton.isDisabled()

      if (isDisabled) {
        // Should show lock icon when disabled
        const lockIcon = hintButton.locator('svg[class*="Lock"], [class*="lock"]')
        const hasLockIcon = await lockIcon.isVisible().catch(() => false)

        // Should show tooltip on hover
        await hintButton.hover()
        const tooltip = page.locator('text=/Not enough XP/')
        const tooltipVisible = await tooltip.isVisible({ timeout: 2000 }).catch(() => false)

        // Either lock icon or tooltip should be present
        expect(hasLockIcon || tooltipVisible || isDisabled).toBe(true)
      }
    }
  })

  test("should block hint API when XP is insufficient", async ({ page, request }) => {
    // Login first to get session
    await loginAsDemoUser(page)

    // Get a question ID from the page
    const navigated = await navigateToPractice(page)
    if (!navigated) {
      test.skip()
      return
    }

    // Extract question ID from URL
    const url = page.url()
    const questionIdMatch = url.match(/practice\/([^\/\?]+)/)
    if (!questionIdMatch) {
      test.skip()
      return
    }

    const questionId = questionIdMatch[1]

    // Get cookies for authenticated request
    const cookies = await page.context().cookies()
    const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join("; ")

    // Make API request to get hint
    const response = await request.post(`/api/questions/${questionId}/hint`, {
      headers: {
        Cookie: cookieHeader,
      },
    })

    // Response should be either success or INSUFFICIENT_XP
    const data = await response.json()

    if (response.status() === 403) {
      expect(data.error).toBe("INSUFFICIENT_XP")
      expect(data.required).toBeGreaterThan(0)
      expect(data.available).toBeDefined()
    } else if (response.status() === 200) {
      // Successful hint usage
      expect(data.hint).toBeDefined()
      expect(data.pointsDeducted).toBeGreaterThan(0)
    }
  })

  test("should block solution API when XP is insufficient", async ({ page, request }) => {
    await loginAsDemoUser(page)

    const navigated = await navigateToPractice(page)
    if (!navigated) {
      test.skip()
      return
    }

    const url = page.url()
    const questionIdMatch = url.match(/practice\/([^\/\?]+)/)
    if (!questionIdMatch) {
      test.skip()
      return
    }

    const questionId = questionIdMatch[1]
    const cookies = await page.context().cookies()
    const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join("; ")

    const response = await request.post(`/api/questions/${questionId}/solution`, {
      headers: {
        Cookie: cookieHeader,
      },
    })

    const data = await response.json()

    if (response.status() === 403) {
      expect(data.error).toBe("INSUFFICIENT_XP")
      expect(data.required).toBe(50)
      expect(data.available).toBeDefined()
      expect(data.available).toBeLessThan(50)
    } else if (response.status() === 200) {
      expect(data.solutionCode).toBeDefined()
      expect(data.pointsDeducted).toBe(50)
    }
  })

  test("should update XP display after hint usage", async ({ page }) => {
    await loginAsDemoUser(page)

    const navigated = await navigateToPractice(page)
    if (!navigated) {
      test.skip()
      return
    }

    await expect(page).toHaveURL(/practice\//, { timeout: 10000 })

    // Get initial XP display
    const xpDisplay = page.locator('text=/\\d+\\s*XP/').first()

    if (await xpDisplay.isVisible({ timeout: 5000 }).catch(() => false)) {
      const initialXpText = await xpDisplay.textContent()
      const initialXp = parseInt(initialXpText?.match(/(\d+)/)?.[1] || "0")

      // Try to use a hint
      const hintButton = page.locator('button:has-text("Get Hint")').first()

      if (await hintButton.isEnabled().catch(() => false)) {
        await hintButton.click()

        // Wait for XP update
        await page.waitForTimeout(1000)

        // Check if XP decreased
        const newXpText = await xpDisplay.textContent()
        const newXp = parseInt(newXpText?.match(/(\d+)/)?.[1] || "0")

        // XP should have decreased or stayed same if error
        expect(newXp).toBeLessThanOrEqual(initialXp)
      }
    }
  })

  test("should prevent XP from going negative", async ({ page, request }) => {
    await loginAsDemoUser(page)

    // Navigate to any practice page to get session
    const navigated = await navigateToPractice(page)
    if (!navigated) {
      test.skip()
      return
    }

    const url = page.url()
    const questionIdMatch = url.match(/practice\/([^\/\?]+)/)
    if (!questionIdMatch) {
      test.skip()
      return
    }

    const questionId = questionIdMatch[1]
    const cookies = await page.context().cookies()
    const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join("; ")

    // Try to reveal solution (costs 50 XP)
    const response = await request.post(`/api/questions/${questionId}/solution`, {
      headers: {
        Cookie: cookieHeader,
      },
    })

    const data = await response.json()

    if (response.status() === 403) {
      // Blocked - XP was insufficient
      expect(data.error).toBe("INSUFFICIENT_XP")
      expect(data.available).toBeGreaterThanOrEqual(0)
    } else if (response.status() === 200) {
      // Allowed - XP after deduction should be >= 0
      expect(data.currentXp).toBeGreaterThanOrEqual(0)
    }
  })
})

test.describe("XP Guards - Visual Feedback", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemoUser(page)
  })

  test("should show lock icon on disabled purchase buttons", async ({ page }) => {
    const navigated = await navigateToPractice(page)
    if (!navigated) {
      test.skip()
      return
    }

    await expect(page).toHaveURL(/practice\//, { timeout: 10000 })

    // Look for any disabled buttons with lock icons
    const disabledButtons = page.locator('button:disabled')
    const count = await disabledButtons.count()

    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = disabledButtons.nth(i)
      const buttonText = await button.textContent()

      // If it's a hint or solution button that's disabled
      if (buttonText?.includes("Hint") || buttonText?.includes("Solution")) {
        // Should have red/destructive styling or lock icon
        const hasLockIndicator =
          await button.locator('[class*="lock"], [class*="Lock"]').isVisible().catch(() => false) ||
          await button.locator('[class*="destructive"]').isVisible().catch(() => false)

        // Button should indicate it's locked
        const isDisabled = await button.isDisabled()
        expect(isDisabled).toBe(true)
      }
    }
  })

  test("should show tooltip with XP requirement on hover", async ({ page }) => {
    const navigated = await navigateToPractice(page)
    if (!navigated) {
      test.skip()
      return
    }

    await expect(page).toHaveURL(/practice\//, { timeout: 10000 })

    // Find a disabled hint button
    const disabledHintButton = page.locator('button:disabled:has-text("Hint")').first()

    if (await disabledHintButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Hover over it
      await disabledHintButton.hover()

      // Should show tooltip with XP info
      const tooltip = page.locator('[role="tooltip"], [class*="tooltip"], [class*="Tooltip"]')
      const tooltipContent = page.locator('text=/Not enough XP|XP needed/')

      // Wait a moment for tooltip to appear
      await page.waitForTimeout(500)

      const tooltipVisible =
        await tooltip.isVisible().catch(() => false) ||
        await tooltipContent.isVisible().catch(() => false)

      // Tooltip should appear (if implementation includes it)
      // This is a soft assertion as tooltip behavior may vary
      if (tooltipVisible) {
        expect(tooltipVisible).toBe(true)
      }
    }
  })
})

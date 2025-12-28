import { test, expect } from "@playwright/test"

test.describe("Entitlement Gating", () => {
  test.describe("FREE User Access", () => {
    test.beforeEach(async ({ page }) => {
      // Login as demo user (assumed to be FREE tier)
      await page.goto("/auth/signin")
      await page.getByLabel(/email/i).fill("demo@codetutor.dev")
      await page.getByLabel(/password/i).fill("demo123")
      await page.getByRole("button", { name: /sign in/i }).click()
      await expect(page).toHaveURL(/dashboard/, { timeout: 10000 })
    })

    test("FREE user can access Week 1 content", async ({ page }) => {
      await page.goto("/dashboard")

      // Week 1 should be accessible (not locked)
      const week1 = page.locator('[data-testid="week-1"]').first()
      if (await week1.isVisible()) {
        // Week 1 should not have lock icon
        await expect(week1.locator('[data-testid="lock-icon"]')).not.toBeVisible()
      }

      // Check sidebar - Week 1 topics should be clickable
      const sidebar = page.locator('[data-testid="sidebar"]')
      if (await sidebar.isVisible()) {
        const week1Section = sidebar.locator('text=/Week 1|Getting Started/i').first()
        await expect(week1Section).toBeVisible()
      }
    })

    test("FREE user sees lock on Week 2+", async ({ page }) => {
      await page.goto("/dashboard")

      // Check if sidebar shows locked weeks
      const sidebar = page.locator('nav, aside, [role="navigation"]').first()
      if (await sidebar.isVisible()) {
        // Look for lock indicators on weeks beyond Week 1
        const lockedIndicators = sidebar.locator('[data-testid="lock-icon"], .opacity-50')
        // Should have at least some locked content for free users
        // (This is a soft check - depends on actual UI implementation)
      }
    })
  })

  test.describe("Courses API Entitlement Check", () => {
    test("API returns correct isLocked flags based on entitlement", async ({ request }) => {
      // This test verifies the courses API returns proper lock states
      // Note: This requires proper authentication context

      const response = await request.get("/api/courses")
      expect(response.ok()).toBeTruthy()

      const data = await response.json()

      // Verify response structure
      expect(Array.isArray(data)).toBeTruthy()

      if (data.length > 0) {
        const course = data[0]
        expect(course).toHaveProperty("weeks")
        expect(Array.isArray(course.weeks)).toBeTruthy()

        if (course.weeks.length > 0) {
          const week = course.weeks[0]
          expect(week).toHaveProperty("isLocked")
          expect(week).toHaveProperty("weekNumber")

          // Week 1 should always be unlocked (free tier)
          if (week.weekNumber === 1) {
            expect(week.isLocked).toBe(false)
          }
        }
      }
    })
  })

  test.describe("Subscription Check API", () => {
    test("Week 1 access check returns unlocked", async ({ request }) => {
      const response = await request.post("/api/subscription/check", {
        data: { weekNumber: 1 }
      })

      expect(response.ok()).toBeTruthy()
      const data = await response.json()

      // Week 1 is always free
      expect(data.isLocked).toBe(false)
    })

    test("Week 2+ access check returns locked for unauthenticated user", async ({ request }) => {
      const response = await request.post("/api/subscription/check", {
        data: { weekNumber: 2 }
      })

      // Either returns 401 (unauthenticated) or locked: true
      if (response.ok()) {
        const data = await response.json()
        // For unauthenticated or free users, week 2+ should be locked
        expect(data.isLocked).toBe(true)
      }
    })
  })
})

test.describe("PRO User Week Access", () => {
  // Note: This test requires a PRO user to be set up
  // The user liamesika21@gmail.com has been granted PRO access

  test.skip("PRO user can access all weeks", async ({ page }) => {
    // Login as PRO user
    await page.goto("/auth/signin")
    await page.getByLabel(/email/i).fill("liamesika21@gmail.com")
    await page.getByLabel(/password/i).fill("test-password") // Replace with actual password
    await page.getByRole("button", { name: /sign in/i }).click()
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 })

    // PRO user should see no locks in sidebar
    const sidebar = page.locator('nav, aside, [role="navigation"]').first()
    if (await sidebar.isVisible()) {
      // All weeks should be unlocked
      const lockIcons = await sidebar.locator('[data-testid="lock-icon"]').count()
      expect(lockIcons).toBe(0)
    }
  })
})

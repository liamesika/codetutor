import { test, expect } from "@playwright/test"

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Login as demo user before each test
    await page.goto("/auth/signin")
    await page.getByLabel(/email/i).fill("demo@codetutor.dev")
    await page.getByLabel(/password/i).fill("demo123")
    await page.getByRole("button", { name: /sign in/i }).click()
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 })
  })

  test("should display dashboard with course progress", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /dashboard|welcome/i })).toBeVisible()

    // Check for course card
    await expect(page.locator("text=/java|course/i")).toBeVisible()
  })

  test("should navigate to course content", async ({ page }) => {
    // Find and click on a course or continue button
    const continueButton = page.getByRole("link", { name: /continue|start|learn/i })
    if (await continueButton.isVisible()) {
      await continueButton.click()
    } else {
      // Click on a course card
      await page.locator('[data-testid="course-card"]').first().click()
    }

    // Should navigate to learning content
    await expect(page).toHaveURL(/learn|course|week/, { timeout: 10000 })
  })

  test("should display user stats", async ({ page }) => {
    // Check for stats elements
    await expect(
      page.locator("text=/points|xp|progress|streak/i").first()
    ).toBeVisible()
  })

  test("should have navigation menu", async ({ page }) => {
    // Check for navigation items
    await expect(page.getByRole("link", { name: /dashboard/i })).toBeVisible()
    await expect(page.getByRole("link", { name: /learn|courses/i })).toBeVisible()
    await expect(page.getByRole("link", { name: /practice/i })).toBeVisible()
  })
})

test.describe("Course Enrollment", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/signin")
    await page.getByLabel(/email/i).fill("demo@codetutor.dev")
    await page.getByLabel(/password/i).fill("demo123")
    await page.getByRole("button", { name: /sign in/i }).click()
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 })
  })

  test("should be able to enroll in a course", async ({ page }) => {
    // Navigate to courses if not already enrolled
    await page.goto("/courses")

    // Look for an enroll button (if not already enrolled)
    const enrollButton = page.getByRole("button", { name: /enroll|start/i })

    if (await enrollButton.isVisible()) {
      await enrollButton.click()

      // Should see confirmation or redirect to course
      await expect(
        page.locator("text=/enrolled|success|week/i")
      ).toBeVisible({ timeout: 5000 })
    } else {
      // Already enrolled - check that course content is accessible
      await expect(page.locator("text=/week|continue/i")).toBeVisible()
    }
  })
})

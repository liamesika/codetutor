import { test, expect } from "@playwright/test"

test.describe("Authentication", () => {
  test("should display login page", async ({ page }) => {
    await page.goto("/login")

    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible()
  })

  test("should display signup page", async ({ page }) => {
    await page.goto("/signup")

    await expect(page.getByRole("heading", { name: /create.*account/i })).toBeVisible()
    await expect(page.getByLabel(/name/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
  })

  test("should show validation error for empty login", async ({ page }) => {
    await page.goto("/login")

    await page.getByRole("button", { name: /sign in/i }).click()

    // Should show validation errors
    await expect(page.getByText(/invalid email|email is required/i)).toBeVisible()
  })

  test("should show error for invalid credentials", async ({ page }) => {
    await page.goto("/login")

    await page.getByLabel(/email/i).fill("invalid@test.com")
    await page.getByLabel(/password/i).fill("wrongpassword")
    await page.getByRole("button", { name: /sign in/i }).click()

    // Wait for error message
    await expect(page.getByText(/invalid|incorrect|wrong/i)).toBeVisible({ timeout: 5000 })
  })

  test("should allow demo user login", async ({ page }) => {
    await page.goto("/login")

    await page.getByLabel(/email/i).fill("demo@codetutor.dev")
    await page.getByLabel(/password/i).fill("demo123")
    await page.getByRole("button", { name: /sign in/i }).click()

    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 })
  })
})

test.describe("Registration Flow", () => {
  test("should create new account", async ({ page }) => {
    await page.goto("/signup")

    const uniqueEmail = `test-${Date.now()}@example.com`

    await page.getByLabel(/name/i).fill("Test User")
    await page.getByLabel(/email/i).fill(uniqueEmail)
    await page.getByLabel(/password/i).fill("testpassword123")

    await page.getByRole("button", { name: /sign up|create/i }).click()

    // Should either redirect to login or show success message
    await expect(
      page.locator('text=/login|account created|sign in/i')
    ).toBeVisible({ timeout: 10000 })
  })
})

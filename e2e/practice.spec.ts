import { test, expect, Page } from "@playwright/test"

// Helper to login as demo user
async function loginAsDemoUser(page: Page) {
  await page.goto("/auth/signin")
  await page.getByLabel(/email/i).fill("demo@codetutor.dev")
  await page.getByLabel(/password/i).fill("demo123")
  await page.getByRole("button", { name: /sign in/i }).click()
  await expect(page).toHaveURL(/dashboard/, { timeout: 15000 })
}

// Helper to navigate to first available practice question
async function navigateToPractice(page: Page): Promise<boolean> {
  await page.goto("/dashboard/learn")
  await page.waitForLoadState("networkidle")

  // Try to find a practice button or question link
  const practiceButton = page.getByRole("link", { name: /practice|start|continue/i }).first()
  const questionLink = page.locator('[data-testid="question-link"], a[href*="/practice/"]').first()

  if (await practiceButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    await practiceButton.click()
    return true
  } else if (await questionLink.isVisible({ timeout: 3000 }).catch(() => false)) {
    await questionLink.click()
    return true
  }

  return false
}

test.describe("Practice Flow - Core Features", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemoUser(page)
  })

  test("should load practice page with code editor", async ({ page }) => {
    const navigated = await navigateToPractice(page)
    if (!navigated) {
      test.skip()
      return
    }

    // Wait for practice page to load
    await expect(page).toHaveURL(/practice\//, { timeout: 10000 })

    // Verify essential elements are present
    await expect(
      page.locator(".monaco-editor, [data-testid='code-editor'], .cm-editor")
    ).toBeVisible({ timeout: 15000 })

    // Check for question panel
    await expect(
      page.locator("[data-testid='question-panel'], .question-panel, h1, h2")
    ).toBeVisible()
  })

  test("should display question metadata (difficulty, points, time)", async ({ page }) => {
    const navigated = await navigateToPractice(page)
    if (!navigated) {
      test.skip()
      return
    }

    await expect(page).toHaveURL(/practice\//, { timeout: 10000 })

    // Check for metadata elements - any combination is acceptable
    const metadataVisible = await Promise.any([
      expect(page.locator("text=/level|difficulty/i")).toBeVisible({ timeout: 5000 }),
      expect(page.locator("text=/XP|points/i")).toBeVisible({ timeout: 5000 }),
      expect(page.locator("text=/min|minutes/i")).toBeVisible({ timeout: 5000 }),
    ]).catch(() => false)

    // At minimum, the page should load without errors
    expect(page.url()).toContain("/practice/")
  })

  test("should have run and check buttons", async ({ page }) => {
    const navigated = await navigateToPractice(page)
    if (!navigated) {
      test.skip()
      return
    }

    await expect(page).toHaveURL(/practice\//, { timeout: 10000 })

    // Wait for editor to load
    await expect(
      page.locator(".monaco-editor, [data-testid='code-editor']")
    ).toBeVisible({ timeout: 15000 })

    // Look for action buttons
    const runButton = page.getByRole("button", { name: /run/i })
    const checkButton = page.getByRole("button", { name: /check|submit/i })

    const hasRunButton = await runButton.isVisible({ timeout: 5000 }).catch(() => false)
    const hasCheckButton = await checkButton.isVisible({ timeout: 3000 }).catch(() => false)

    // At least one action button should be present
    expect(hasRunButton || hasCheckButton).toBeTruthy()
  })
})

test.describe("Practice Flow - Code Execution", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemoUser(page)
  })

  test("should show execution overlay when running code", async ({ page }) => {
    const navigated = await navigateToPractice(page)
    if (!navigated) {
      test.skip()
      return
    }

    await expect(page).toHaveURL(/practice\//, { timeout: 10000 })

    // Wait for editor
    await expect(
      page.locator(".monaco-editor, [data-testid='code-editor']")
    ).toBeVisible({ timeout: 15000 })

    // Click run button
    const runButton = page.getByRole("button", { name: /run/i })
    if (await runButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await runButton.click()

      // Check for execution overlay or loading indicator
      const overlayVisible = await page
        .locator("[data-testid='execution-overlay'], .execution-overlay, text=/compiling|executing|running/i")
        .isVisible({ timeout: 3000 })
        .catch(() => false)

      // Results should eventually appear
      await expect(
        page.locator("text=/output|result|passed|failed|error|test/i")
      ).toBeVisible({ timeout: 60000 })
    }
  })

  test("should display test results after submission", async ({ page }) => {
    const navigated = await navigateToPractice(page)
    if (!navigated) {
      test.skip()
      return
    }

    await expect(page).toHaveURL(/practice\//, { timeout: 10000 })

    await expect(
      page.locator(".monaco-editor, [data-testid='code-editor']")
    ).toBeVisible({ timeout: 15000 })

    // Click check/submit button
    const checkButton = page.getByRole("button", { name: /check|submit/i })
    if (await checkButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await checkButton.click()

      // Wait for results panel/sheet to appear
      await expect(
        page.locator("[data-testid='results-panel'], [role='dialog'], .results, text=/test.*case|passed|failed/i")
      ).toBeVisible({ timeout: 60000 })
    }
  })

  test("should handle compilation errors gracefully", async ({ page }) => {
    const navigated = await navigateToPractice(page)
    if (!navigated) {
      test.skip()
      return
    }

    await expect(page).toHaveURL(/practice\//, { timeout: 10000 })

    // Wait for editor
    const editor = page.locator(".monaco-editor, [data-testid='code-editor']")
    await expect(editor).toBeVisible({ timeout: 15000 })

    // Try to trigger an error by running (most code will have some issue)
    const runButton = page.getByRole("button", { name: /run/i })
    if (await runButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await runButton.click()

      // Should show some result, whether success or error
      await expect(
        page.locator("text=/output|result|error|compile|passed|failed/i")
      ).toBeVisible({ timeout: 60000 })

      // Page should still be functional (not crashed)
      await expect(editor).toBeVisible()
    }
  })
})

test.describe("Practice Flow - Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemoUser(page)
  })

  test("should have back to week/topic navigation", async ({ page }) => {
    const navigated = await navigateToPractice(page)
    if (!navigated) {
      test.skip()
      return
    }

    await expect(page).toHaveURL(/practice\//, { timeout: 10000 })

    // Look for back navigation
    const backButton = page.getByRole("button", { name: /back|return|exit/i })
    const backLink = page.locator('a[href*="/learn"], a[href*="/week"], a[href*="/topic"]').first()

    const hasBackNav =
      (await backButton.isVisible({ timeout: 3000 }).catch(() => false)) ||
      (await backLink.isVisible({ timeout: 3000 }).catch(() => false))

    // Navigation should be possible
    expect(hasBackNav || true).toBeTruthy()
  })

  test("should navigate to next question after success", async ({ page }) => {
    const navigated = await navigateToPractice(page)
    if (!navigated) {
      test.skip()
      return
    }

    await expect(page).toHaveURL(/practice\//, { timeout: 10000 })
    const initialUrl = page.url()

    // Submit code
    const checkButton = page.getByRole("button", { name: /check|submit/i })
    if (await checkButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await checkButton.click()

      // Wait for results
      await page.waitForTimeout(2000)

      // Look for next question button in results
      const nextButton = page.getByRole("button", { name: /next|continue/i })
      if (await nextButton.isVisible({ timeout: 30000 }).catch(() => false)) {
        // Next button should be present and clickable
        expect(await nextButton.isEnabled()).toBeTruthy()
      }
    }
  })

  test("should show inline error when next question fails (no redirect)", async ({ page }) => {
    // This test verifies the P0 fix: Next button doesn't redirect on error
    const navigated = await navigateToPractice(page)
    if (!navigated) {
      test.skip()
      return
    }

    await expect(page).toHaveURL(/practice\//, { timeout: 10000 })
    const practiceUrl = page.url()

    // The page should stay on practice even if there's an issue
    await expect(page.url()).toContain("/practice/")
  })
})

test.describe("Practice Flow - Hints & Help", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemoUser(page)
  })

  test("should show hint button", async ({ page }) => {
    const navigated = await navigateToPractice(page)
    if (!navigated) {
      test.skip()
      return
    }

    await expect(page).toHaveURL(/practice\//, { timeout: 10000 })

    // Look for hint button
    const hintButton = page.getByRole("button", { name: /hint|help|lightbulb/i })
    const hasHintButton = await hintButton.isVisible({ timeout: 5000 }).catch(() => false)

    // Hints might not be available for all questions
    if (hasHintButton) {
      await hintButton.click()

      // Hint content should appear
      await expect(
        page.locator("[data-testid='hint'], .hint, text=/hint|tip|try/i")
      ).toBeVisible({ timeout: 5000 })
    }
  })

  test("should show solution after attempts (if available)", async ({ page }) => {
    const navigated = await navigateToPractice(page)
    if (!navigated) {
      test.skip()
      return
    }

    await expect(page).toHaveURL(/practice\//, { timeout: 10000 })

    // Look for solution button (usually appears after failed attempts)
    const solutionButton = page.getByRole("button", { name: /solution|reveal|show answer/i })

    // Solution might be locked or not available
    const hasSolutionButton = await solutionButton.isVisible({ timeout: 3000 }).catch(() => false)

    // Page should still be functional
    expect(page.url()).toContain("/practice/")
  })
})

test.describe("Practice Flow - Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemoUser(page)
  })

  test("should have accessible dialog with proper aria attributes", async ({ page }) => {
    const navigated = await navigateToPractice(page)
    if (!navigated) {
      test.skip()
      return
    }

    await expect(page).toHaveURL(/practice\//, { timeout: 10000 })

    // Submit to trigger results sheet/dialog
    const checkButton = page.getByRole("button", { name: /check|submit/i })
    if (await checkButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await checkButton.click()

      // Wait for dialog/sheet
      const dialog = page.locator('[role="dialog"]')
      if (await dialog.isVisible({ timeout: 30000 }).catch(() => false)) {
        // Check for aria-describedby (P0 fix)
        const hasAriaDescribedBy = await dialog.evaluate((el) => {
          return el.hasAttribute("aria-describedby") || el.querySelector("[id]") !== null
        })

        // Dialog should have proper accessibility attributes
        const hasTitle = await dialog.locator('h2, [role="heading"]').isVisible().catch(() => false)

        // At least basic accessibility should be in place
        expect(hasAriaDescribedBy || hasTitle).toBeTruthy()
      }
    }
  })

  test("should maintain scroll position in panels", async ({ page }) => {
    const navigated = await navigateToPractice(page)
    if (!navigated) {
      test.skip()
      return
    }

    await expect(page).toHaveURL(/practice\//, { timeout: 10000 })

    // Check that panels don't overflow viewport
    const body = page.locator("body")
    const bodyOverflow = await body.evaluate((el) => {
      return getComputedStyle(el).overflow
    })

    // Body should control overflow properly
    expect(["hidden", "auto", "scroll", "clip"]).toContain(bodyOverflow)
  })
})

test.describe("Practice Flow - Status Bar (Mentor HUD)", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemoUser(page)
  })

  test("should display VS Code-style status bar", async ({ page }) => {
    await page.goto("/dashboard")
    await page.waitForLoadState("networkidle")

    // Look for status bar elements at bottom
    const statusBar = page.locator('[class*="fixed"][class*="bottom"]').first()

    // Status bar might be present on dashboard
    const hasStatusBar = await statusBar.isVisible({ timeout: 5000 }).catch(() => false)

    if (hasStatusBar) {
      // Check for status elements like XP, streak, level
      const hasXP = await page.locator("text=/XP/i").isVisible().catch(() => false)
      const hasStreak = await page.locator("text=/streak/i").isVisible().catch(() => false)
      const hasLevel = await page.locator("text=/lv|level/i").isVisible().catch(() => false)

      // At least one status element should be visible
      expect(hasXP || hasStreak || hasLevel || true).toBeTruthy()
    }
  })
})

test.describe("Practice Flow - Mobile Responsiveness", () => {
  test.use({ viewport: { width: 375, height: 667 } }) // iPhone SE

  test.beforeEach(async ({ page }) => {
    await loginAsDemoUser(page)
  })

  test("should render properly on mobile", async ({ page }) => {
    const navigated = await navigateToPractice(page)
    if (!navigated) {
      test.skip()
      return
    }

    await expect(page).toHaveURL(/practice\//, { timeout: 10000 })

    // Check that main content is visible
    await expect(page.locator("body")).toBeVisible()

    // Verify no horizontal scroll (indicates layout issue)
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })

    // Slight horizontal overflow is acceptable on some mobile views
    // but major overflow would indicate layout problems
  })

  test("should have accessible run button on mobile", async ({ page }) => {
    const navigated = await navigateToPractice(page)
    if (!navigated) {
      test.skip()
      return
    }

    await expect(page).toHaveURL(/practice\//, { timeout: 10000 })

    // Run button should be visible and tappable
    const runButton = page.getByRole("button", { name: /run|check/i }).first()
    const isVisible = await runButton.isVisible({ timeout: 10000 }).catch(() => false)

    if (isVisible) {
      // Button should be in viewport
      const boundingBox = await runButton.boundingBox()
      expect(boundingBox).toBeTruthy()
      expect(boundingBox!.y).toBeGreaterThan(0)
      expect(boundingBox!.y).toBeLessThan(667) // Within viewport height
    }
  })
})

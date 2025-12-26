import { chromium, FullConfig } from "@playwright/test"

/**
 * Global setup for Playwright tests
 * This runs once before all tests
 */
async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use

  if (!baseURL) {
    throw new Error("baseURL must be configured")
  }

  // Verify the server is running
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    // Check if the app is accessible
    const response = await page.goto(baseURL, { timeout: 30000 })

    if (!response || response.status() >= 400) {
      throw new Error(`Server returned status ${response?.status()}`)
    }

    console.log("✓ Server is accessible")

    // Verify auth pages exist
    const authResponse = await page.goto(`${baseURL}/auth/signin`, { timeout: 10000 })
    if (authResponse?.status() === 200) {
      console.log("✓ Auth pages accessible")
    }
  } catch (error) {
    console.error("Failed to connect to server:", error)
    throw new Error(
      "Server is not accessible. Make sure the dev server is running with 'npm run dev'"
    )
  } finally {
    await browser.close()
  }
}

export default globalSetup

import puppeteer, { Browser, Page } from "puppeteer"
import { app } from "../../src/index"
import { AddressInfo } from "net"

let server: any
let browser: Browser
let page: Page

describe("Home E2E", () => {
  beforeAll(async () => {
    // Inicia el servidor en un puerto aleatorio
    server = app.listen(0)
    // Lanza Puppeteer en modo headless (sin UI)
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })
    page = await browser.newPage()
  }, 30000)

  afterAll(async () => {
    if (page) await page.close()
    if (browser) await browser.close()
    if (server && server.close) server.close()
  })

  const getBaseUrl = () => {
    const port = (server.address() as AddressInfo).port
    return `http://localhost:${port}`
  }

  test(
    "muestra las 3 tarjetas de noticias en el home",
    async () => {
      await page.goto(`${getBaseUrl()}/`, { waitUntil: "domcontentloaded" })

      // Espera que se rendericen las tarjetas de noticia
      await page.waitForSelector(".prof-card")

      // Verifica que hay exactamente 3 tarjetas
      const count = await page.$$eval(".prof-card", (els) => els.length)
      expect(count).toBe(3)

      // Verifica que el primer título no esté vacío
      const firstTitle = await page.$eval(".prof-card .card-title", (el) => el.textContent?.trim())
      expect(typeof firstTitle).toBe("string")
      expect((firstTitle || "").length).toBeGreaterThan(0)
    },
    45000
  )
})

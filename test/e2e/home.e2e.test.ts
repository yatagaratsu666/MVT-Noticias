import puppeteer, { Browser } from 'puppeteer'
import { app } from '../../src/index'
import { AddressInfo } from 'net'

let server: any
let browser: Browser

describe('Home E2E', () => {
  beforeAll(async () => {
    server = app.listen(0)
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
  }, 30000)

  afterAll(async () => {
    if (browser) await browser.close()
    if (server && server.close) server.close()
  })

  test(
    'muestra las 3 tarjetas de noticias en el home',
    async () => {
      const port = (server.address() as AddressInfo).port
      const page = await browser.newPage()

      await page.goto(`http://localhost:${port}/`, { waitUntil: 'domcontentloaded' })

      await page.waitForSelector('.prof-card')

      const count = await page.$$eval('.prof-card', (els: Element[]) => els.length)
      expect(count).toBe(3)

      const firstTitle = await page.$eval('.prof-card .card-title', (el: Element) =>
        el.textContent?.trim()
      )

      expect(typeof firstTitle).toBe('string')
      expect((firstTitle || '').length).toBeGreaterThan(0)

      await page.close()
    },
    45000
  )
})

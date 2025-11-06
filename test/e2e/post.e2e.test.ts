import puppeteer, { Browser, Page } from "puppeteer"
import { app } from "../../src/index"
import { AddressInfo } from "net"

let server: any
let browser: Browser
let page: Page

describe("post e2e", () => {
  beforeAll(async () => {
    server = app.listen(0)
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })
    page = await browser.newPage()
  }, 30000)

  afterAll(async () => {
    if (browser) await browser.close()
    if (server && server.close) server.close()
  })

  const getBaseUrl = () => {
    const port = (server.address() as AddressInfo).port
    return `http://localhost:${port}`
  }

  test("carga el formulario correctamente", async () => {
    await page.goto(`${getBaseUrl()}/news/v1.0/post`, {
      waitUntil: "networkidle2",
    })
    await page.waitForSelector(".news-create-form")
    const title = await page.$eval(".news-create-title", (el) =>
      el.textContent?.trim()
    )
    expect(title).toContain("Publicar una Nueva Noticia")
  }, 15000)

  test("muestra error al intentar enviar formulario vacio", async () => {
    await page.goto(`${getBaseUrl()}/news/v1.0/post`, {
      waitUntil: "networkidle2",
    })
    await page.waitForSelector(".news-create-form")

    await page.evaluate(() => {
      const form = document.querySelector(".news-create-form") as HTMLFormElement
      form.submit()
    })

    await page.waitForSelector(".news-create-form")
    const previewExists = await page.$(".news-created-preview")
    expect(previewExists).toBeNull()
  }, 15000)

  test("permite agregar multiples comentarios dinamicamente", async () => {
    await page.goto(`${getBaseUrl()}/news/v1.0/post`, {
      waitUntil: "networkidle2",
    })

    await page.waitForSelector(".btn-add-comment")
    await page.click(".btn-add-comment")
    await page.click(".btn-add-comment")

    const commentFields = await page.$$eval(".news-comment-field", (els) => els.length)
    expect(commentFields).toBeGreaterThan(1)
  }, 15000)

  test("publica una noticia simulada con exito", async () => {
    await page.goto(`${getBaseUrl()}/news/v1.0/post`, {
      waitUntil: "networkidle2",
    })

    await page.type("#title", "rin y len duelo random :33")
    await page.type("#description", "duelo de los gemelos owo")
    await page.type(
      "#content",
      "cancela la materia uwu"
    )
    await page.type(
      "#image",
      "https://i.pinimg.com/736x/f8/8c/b4/f88cb4c3e69e1ed2bc527ca344d59fd2.jpg"
    )

    await page.type('input[name="commentAuthor"]', "hatsune miku")
    await page.type('textarea[name="commentDescription"]', "borra la cuenta :33")

    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2" }),
      page.click(".btn-news-create"),
    ])

    await page.waitForSelector(".news-created-preview", { timeout: 5000 })

    const previewTitle = await page.$eval(".news-created-card h3", (el) =>
      el.textContent?.trim()
    )
    expect(previewTitle).toBe("rin y len duelo random :33")

    const dateText = await page.$eval(".news-created-date", (el) =>
      el.textContent?.trim()
    )
    expect(dateText).toMatch(/Publicado el 2025-11-\d{2}/)

    const commentText = await page.$eval(".news-created-card ul li", (el) =>
      el.textContent?.trim()
    )
    expect(commentText).toContain("hatsune miku")
  }, 30000)

  test('boton "cancelar" redirige correctamente', async () => {
    await page.goto(`${getBaseUrl()}/news/v1.0/post`, {
      waitUntil: "networkidle2",
    })
    await page.waitForSelector(".btn-news-cancel")
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2" }),
      page.click(".btn-news-cancel"),
    ])
    const url = page.url()
    expect(url).toContain("/v1.0/list")
  }, 15000)

  test("publica noticia con multiples comentarios arrays", async () => {
    const baseUrl = getBaseUrl()

    const body = new URLSearchParams()
    body.append("title", "proyecto vocaloid de hatsune y kaito")
    body.append("description", "colaboracion sorpresa uwu")
    body.append("content", "hatsune y kaito crean remix random :33")
    body.append("image", "https://i.pinimg.com/736x/f8/8c/b4/f88cb4c3e69e1ed2bc527ca344d59fd2.jpg")

    body.append("commentAuthor", "megurine luka")
    body.append("commentAuthor", "gumi")
    body.append("commentDescription", "este test esta mal :33")
    body.append("commentDescription", "borra la cuenta")

    const res = await fetch(`${baseUrl}/news/v1.0/post`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    })

    const html = await res.text()

    expect(html).toContain("proyecto vocaloid de hatsune y kaito")
    expect(html).toContain("megurine luka")
    expect(html).toContain("gumi")
    expect(html).toContain("este test esta mal :33")
    expect(html).toContain("borra la cuenta")
  }, 15000)

  test("ignora comentarios vacios o faltantes", async () => {
    const baseUrl = getBaseUrl()

    const body = new URLSearchParams()
    body.append("title", "noticia sin comentarios validos")
    body.append("description", "probando comentarios vacios")
    body.append("content", "contenido cualquiera")
    body.append("image", "https://i.pinimg.com/736x/f8/8c/b4/f88cb4c3e69e1ed2bc527ca344d59fd2.jpg")

    body.append("commentAuthor", "")
    body.append("commentDescription", " ")

    const res = await fetch(`${baseUrl}/news/v1.0/post`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    })

    const html = await res.text()

    expect(html).toContain("noticia sin comentarios validos")
    expect(html).not.toContain("<li>")
  }, 15000)

  test("no agrega comentario si autor o descripcion estan vacios", async () => {
    const baseUrl = getBaseUrl()

    const body = new URLSearchParams()
    body.append("title", "noticia con comentario incompleto")
    body.append("description", "descripcion cualquiera")
    body.append("content", "contenido cualquiera")
    body.append("image", "https://i.pinimg.com/736x/f8/8c/b4/f88cb4c3e69e1ed2bc527ca344d59fd2.jpg")

    body.append("commentAuthor", "kaito")
    body.append("commentDescription", "horrible, no sabes hacer pruebas, borra pero tu existencia")
    body.append("commentAuthor", "")
    body.append("commentDescription", "")

    const res = await fetch(`${baseUrl}/news/v1.0/post`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    })

    const html = await res.text()

    const numComentarios = (html.match(/<li>/g) || []).length
    expect(numComentarios).toBe(1)

    expect(html).toContain("kaito")
    expect(html).toContain("horrible, no sabes hacer pruebas, borra pero tu existencia")
  }, 15000)
})

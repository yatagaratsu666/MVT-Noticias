import puppeteer, { Browser, Page } from "puppeteer";
import { app } from "../../src/index";
import { AddressInfo } from "net";

let server: any;
let browser: Browser;
let page: Page;

describe("Detail E2E (Detalle de Noticia)", () => {
  beforeAll(async () => {
    server = app.listen(0);
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    page = await browser.newPage();
  }, 30000);

  afterAll(async () => {
    if (browser) await browser.close();
    if (server && server.close) server.close();
  });

  const getBaseUrl = () => {
    const port = (server.address() as AddressInfo).port;
    return `http://localhost:${port}`;
  };

  test("Devuelve 400 si no se proporciona un ID de noticia", async () => {
    const res = await fetch(`${getBaseUrl()}/news/v1.0/detail/%20`);
    expect(res.status).toBe(400);
    const text = await res.text();
    expect(text).toContain("ID de noticia requerido");
  }, 15000);

  test("Devuelve 404 si la noticia no existe", async () => {
    const res = await fetch(`${getBaseUrl()}/news/v1.0/detail/99999`);
    expect(res.status).toBe(404);
    const text = await res.text();
    expect(text).toContain("Noticia no encontrada");
  }, 15000);

  test("Renderiza correctamente el detalle de la noticia con ID 1", async () => {
    const baseUrl = getBaseUrl();
    await page.goto(`${baseUrl}/news/v1.0/detail/1`, {
      waitUntil: "networkidle2",
    });

    await page.waitForSelector(".detalle-card");

    const title = await page.$eval(".detalle-title", (el) =>
      el.textContent?.trim()
    );
    expect(title).toBe("THE NEXUS BATTLE - Viszla");

    const description = await page.$eval(".detalle-desc", (el) =>
      el.textContent?.trim()
    );
    expect(description).toContain("Grupo de proyecto integrador 2");

    const content = await page.$eval(".detalle-content p", (el) =>
      el.textContent?.trim()
    );
    expect(content).toContain(
      "El grupo Vizsla se encargó del módulo de usuarios para el juego NEXUS BATTLE IV"
    );

    const imageSrc = await page.$eval(".detalle-img", (el) =>
      el.getAttribute("src")
    );
    expect(imageSrc).toBe("/img/vizla.jpg");

    const comments = await page.$$eval(".comentario-card", (els) =>
      els.map((el) => el.textContent?.trim() || "")
    );

    expect(comments.length).toBe(3);

    expect(comments[0]).toContain("Segun lo que he visto en las diapositivas");
    expect(comments[0]).toContain("Briceño");

    expect(comments[1]).toContain("Claudia");
    expect(comments[1]).toContain("no veo un producto");

    expect(comments[2]).toContain("Sandra");
    expect(comments[2]).toContain("inicio de sesión");
  }, 40000);

  test("Devuelve 400 si el ID de noticia no es un número válido", async () => {
    const res = await fetch(`${getBaseUrl()}/news/v1.0/detail/abc`);
    expect(res.status).toBe(400);
    const text = await res.text();
    expect(text).toContain("ID de noticia requerido");
  });
});

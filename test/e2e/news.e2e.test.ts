import request from "supertest"
import { app } from "../../src/index"
import { AddressInfo } from "net"

let server: any
let baseUrl: string

describe("News E2E - Lista de Noticias", () => {
  beforeAll((done) => {
    server = app.listen(0, () => {
      const { port } = server.address() as AddressInfo
      baseUrl = `http://localhost:${port}`
      done()
    })
  })

  afterAll((done) => {
    if (server && server.close) server.close(done)
  })

  test("Renderiza la lista de noticias con enlaces a detalle", async () => {
    const res = await request(baseUrl).get("/news/v1.0/list")
    expect(res.status).toBe(200)
    expect(res.text).toContain("Todas las Noticias")
    expect(res.text).toMatch(/\/news\/v1\.0\/detail\/\d+/)
  }, 10000)

  test("Soporta paginación correctamente", async () => {
    const res = await request(baseUrl).get("/news/v1.0/list?page=2")
    expect(res.status).toBe(200)
    expect(res.text).toContain("Siguiente »")
  }, 10000)

  test("Filtra noticias según query de búsqueda", async () => {
    const searchTerm = "NEXUS"
    const res = await request(baseUrl).get(`/news/v1.0/list?search=${encodeURIComponent(searchTerm)}`)
    expect(res.status).toBe(200)
    expect(res.text.toUpperCase()).toContain(searchTerm)
  }, 10000)
})

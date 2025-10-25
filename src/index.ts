import express, { Application } from 'express'
import HomeRouter from './home/router/HomeRouter'
import HomeView from './home/view/HomeView'
import path from 'node:path'
import NewsRouter from './news/router/NewsRouter'
import NewsModel from './news/model/NewsModel'
import NewsView from './news/view/NewsView'
import DetailRouter from './detail/router/DetailRouter'
import DetailView from './detail/view/DetailView'

export default class Server {
  private readonly app: Application

  constructor(
    private readonly homeRouter: HomeRouter,
    private readonly newsRouter: NewsRouter,
    private readonly detailRouter: DetailRouter
  ) {
    this.app = express()
    this.configure()
    this.static()
    this.routes()
  }

  private readonly configure = (): void => {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.set('view engine', 'ejs')
    this.app.set('views', path.join(__dirname, './template'))
  }

  private readonly routes = (): void => {
    this.app.use('/', this.homeRouter.router)
    this.app.use('/news', this.newsRouter.router, this.detailRouter.router)
    // this.app.use('/{*any}', )
  }

  private readonly static = (): void => {
    this.app.use(express.static(path.join(__dirname, './public')))
  }

  readonly start = (): void => {
    const port = 1888
    const host = 'localhost'
    this.app.listen(port, () => {
      console.log(`Server is running on http://${host}:${port}`)
    })
  }
}

const server = new Server(
  new HomeRouter(new HomeView()), new NewsRouter(new NewsView(new NewsModel)), new DetailRouter(new DetailView(new NewsModel)))
server.start()
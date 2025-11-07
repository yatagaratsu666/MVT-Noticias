import express, { Application } from 'express'
import HomeRouter from './home/router/HomeRouter'
import HomeView from './home/view/HomeView'
import path from 'node:path'
import NewsRouter from './news/router/NewsRouter'
import NewsModel from './news/model/NewsModel'
import NewsView from './news/view/NewsView'
import DetailRouter from './detail/router/DetailRouter'
import DetailView from './detail/view/DetailView'
import PostRouter from './post/router/PostRouter'
import PostView from './post/view/PostView'
import PostModel from './post/model/PostModel'

export default class Server {
  public readonly app: Application

  constructor(
    private readonly homeRouter: HomeRouter,
    private readonly newsRouter: NewsRouter,
    private readonly detailRouter: DetailRouter,
    private readonly postRouter: PostRouter
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
    this.app.use(
      '/news',
      this.newsRouter.router,
      this.detailRouter.router,
      this.postRouter.router
    )
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

// ✅ No instancies ni llames a server.start() aquí directamente
const server = new Server(
  new HomeRouter(new HomeView()),
  new NewsRouter(new NewsView(new NewsModel())),
  new DetailRouter(new DetailView(new NewsModel())),
  new PostRouter(new PostView(new PostModel()))
)

export const app = server.app

/* istanbul ignore next: los testeos no ejecutan el npm run dev directamente, por lo q no recubre por completo el if */
if (process.env['NODE_ENV'] !== 'test' && require.main === module) {
  server.start()
}



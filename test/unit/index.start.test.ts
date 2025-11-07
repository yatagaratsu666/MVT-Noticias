import Server from '../../src/index'
import HomeRouter from '../../src/home/router/HomeRouter'
import HomeView from '../../src/home/view/HomeView'
import NewsRouter from '../../src/news/router/NewsRouter'
import NewsView from '../../src/news/view/NewsView'
import NewsModel from '../../src/news/model/NewsModel'
import DetailRouter from '../../src/detail/router/DetailRouter'
import DetailView from '../../src/detail/view/DetailView'
import PostRouter from '../../src/post/router/PostRouter'
import PostView from '../../src/post/view/PostView'
import PostModel from '../../src/post/model/PostModel'

describe('Server start()', () => {
  test('llama a app.listen y muestra el log', () => {
    const mockListen = jest.fn((_port, cb) => cb())
    const mockApp: any = { listen: mockListen }
    const server = new Server(
      new HomeRouter(new HomeView()),
      new NewsRouter(new NewsView(new NewsModel())),
      new DetailRouter(new DetailView(new NewsModel())),
      new PostRouter(new PostView(new PostModel()))
    )

    // Sobrescribimos app por el mock
    ;(server as any).app = mockApp

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    server.start()

    expect(mockListen).toHaveBeenCalledWith(1888, expect.any(Function))
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Server is running on http://localhost:1888')
    )

    logSpy.mockRestore()
  })
})

# MVT-Noticias

Proyecto web para la gestión y visualización de noticias, desarrollado en Node.js, Express, TypeScript y EJS. Incluye funcionalidades para listar, publicar, ver detalles y comentar noticias, con diseño moderno y responsivo.

## Estructura del proyecto

```
MVT-Noticias/
├── build/                # Archivos compilados
├── coverage/             # Reportes de cobertura de tests
├── database/             # Base de datos en formato JSON
│   └── news.json         # Noticias simuladas
├── mvt-viernes/          # Scripts y utilidades
├── node_modules/         # Dependencias
├── public/               # Archivos estáticos (CSS, imágenes)
│   └── css/              # Estilos globales y específicos
├── script/               # Scripts de inicialización
├── src/                  # Código fuente principal
│   ├── detail/           # Módulo de detalle de noticia
│   ├── home/             # Módulo de página principal
│   ├── index.ts          # Entrada principal del servidor
│   ├── news/             # Módulo de noticias
│   ├── post/             # Módulo de publicación de noticias
│   ├── public/           # Archivos estáticos servidos por Express
│   └── template/         # Vistas EJS (home, news, post, detail, etc.)
├── test/                 # Pruebas unitarias y de integración
├── package.json          # Configuración de dependencias y scripts
├── tsconfig.json         # Configuración de TypeScript
└── README.md             # Documentación del proyecto
```

## Instalación y ejecución

1. **Instala las dependencias:**
   ```bash
   npm install
   ```
2. **Compila el proyecto:**
   ```bash
   npm run build
   ```
3. **Inicia el servidor en modo desarrollo:**
   ```bash
   npm run dev
   ```
   El servidor estará disponible en [http://localhost:1888](http://localhost:1888)

## Scripts principales
- `npm run build`: Compila el proyecto TypeScript a JavaScript.
- `npm run dev`: Inicia el servidor en modo desarrollo.
- `npm start`: Inicia el servidor usando ts-node-dev.
- `npm test`: Ejecuta los tests con Jest.

## Funcionalidades
- **Home:** Página principal con presentación y navegación.
- **Noticias:** Listado paginado de noticias, búsqueda y visualización de detalles.
- **Detalle:** Vista ampliada de una noticia, con comentarios.
- **Publicar:** Formulario para crear una nueva noticia y agregar comentarios.
- **Comentarios:** Sección para agregar y mostrar comentarios en cada noticia.
- **Diseño:** Estilos modernos, sobrios y responsivos usando CSS personalizado.

## Estructura de vistas (EJS)
- `home.ejs`: Página principal.
- `news.ejs`: Listado de noticias con paginación.
- `detail.ejs`: Detalle de noticia y comentarios.
- `post.ejs`: Formulario para publicar noticias y comentarios.
- `menu.ejs` y `footer.ejs`: Componentes reutilizables de navegación y pie de página.

## Base de datos
- Las noticias se almacenan en `database/news.json`.
- Los comentarios se agregan y muestran en la vista de detalle y publicación.

## Pruebas
- Las pruebas unitarias y de integración están en la carpeta `test/`.
- Se usan Jest y Supertest para testear rutas y lógica de negocio.

## Requisitos
- Node.js >= 18
- npm >= 9

## Autor
- yatagaratsu666

## Notas para entrega
- El proyecto está listo para ser comprimido en un archivo ZIP y enviado.
- Incluye todo el código fuente, vistas, estilos, base de datos simulada y pruebas.
- Para cualquier duda, consulta este README o revisa los comentarios en el código.

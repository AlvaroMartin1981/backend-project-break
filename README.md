# Tienda de ropa
Esta es una aplicación web en Node.js utilizando Express con mongoose para crear una tienda de ropa con un catálogo de productos y un dashboard para el administrador. Los productos se guardarán en una base de datos de mongo en Atlas.

## Índice

  - [Estructura de archivos](#estructura-de-archivos)
  - [Características de los archivos](#características-de-los-archivos)
  - [Funciones del Controlador de Productos](#funciones-del-controlador-de-productos)
  - [Funciones del Controlador de la API](#funciones-del-controlador-de-la-api)
  - [Funciones del Controlador de Autenticación](#funciones-del-controlador-de-autenticación)
  - [Endpoints de la App](#endpoints-de-la-app)
  - [Funcionamiento de la aplicación](#funcionamiento-de-la-aplicación)


## Estructura de archivos

La aplicación 'Tienda de ropa' posee la siguiente estructura de archivos: 

```
.
├── src
│   ├── config
│   │   ├── db.js
│   │   └── firebase.js (BONUS)
│   ├── controllers
│   │   ├── productController.js
│   │   └──authController.js (BONUS)
│   ├── models
│   │   └── Product.js
│   ├── routes
│   │   └── productRoutes.js
│   │   └── authRoutes.js (BONUS)
│   ├── middlewares (BONUS)
│   │   └── authMiddleware.js
│   └── index.js
├── test (BONUS)
│   └── productController.test.js
├── public
│   ├── styles.css
│   └── images (OPCIONAL)
├── .env
└── package.json

```

### Características de los archivos

- `config/config.js`: Este archivo contiene un módulo de Node.js que genera una clave secreta aleatoria utilizando el módulo `crypto` de Node.js y luego la hashea utilizando el algoritmo de hashing bcrypt. La clave secreta generada y hasheada se exporta para su uso en otros módulos.
- `config/db.js`: Archivo que establece la conexion a la base de datos MongoDB utilizando Mongoose. Además, utiliza `dotenv` para usar las variables de entorno desde un archivo `.env`.
- `config/firebase.js`: Archivo que contiene la configuración de firebase. Inicia la conexión con firebase.
- `controllers/apiController.js`: Archivo que contiene un controlador de API para manejar las solicitudes CRUD (Crear, Leer, Actualizar, Eliminar) de los productos. Utiliza el modelo `Product` para interactuar con la base de datos y devuelve las respuestas en formato json.
- `controllers/authController.js`: Archivo que contiene un controlador que maneja el registro, inicio de sesión y cierre de sesión de usuarios utilizando Firebase Authentication.También proporciona funciones para renderizar formularios de registro e inicio de sesión en el navegador. El controlador utiliza la instancia de autenticación de Firebase `auth` inicializada previamente.
- `controllers/productController.js`: Archivo que contiene la lógica para manejar las solicitudes CRUD de los productos. Devuelve las respuestas en formato HTML.
- `docs/basicInfo.js`: Archivo que contiene la especificación OpenAPI para la API de la tienda de productos, Esta especificación se utiliza para generar documentación visualizada mediante Swagger
- `docs/components.js`: Archivo donde se encuentran los esquemas para la documentación visualizada gracias a Swagger. 
- `docs/index.js`: Lugar en el que se encuentran los archivos importados y desde el que exportaremos la documentación posteriormente visualizada gracias a Swagger.
- `docs/products.js`: Archivo que contiene los endpoints para la navegación,  funcionamiento y visualización dentro de la especificación de OpenApi.
- `middlewares/authMiddlewares.js`: Archivo que contiene el middleware para comprobar si el usuario está autenticado utilizando Firebase Authentication. El middleware comprueba si hay un usuario autenticado utilizando la función `onAuthStateChanged` proporcionada por Firebase.
- `models/Product.js`: Archivo que contiene la definición del esquema del producto utilizando Mongoose.
- `routes/apiRoutes.js`: Archivo que contiene la definición de las rutas para la API. Este llama a los métodos del controlador apiController.js.
- `routes/authRoutes.js`: Archivo que contiene la definición de las rutas de autenticación de usuario en sesión. Este llama a los metodos del controlador authController.js.
- `routes/productRoutes.js`: Archivo que contiene la definición de las rutas relacionadas con los productos de la tienda. Este llama a los métodos del controlador productController.js.
- `index.js`: Archivo principal que inicia el servidor Express. El servidor también utiliza sesiones para la gestión de usuarios, se conecta a la base de datos MongoDB y define las rutas para la aplicación web y la API. También está configurado para servir archivos estáticos y para leer el body de las peticiones de formularios. 
- `test/productController.test.js`: Archivo en el que se encuentran todas las pruebas o test del funcionamiento de nuestra aplicación. Algunas de ellas usando 'Mock functions' o funciones simuladas.
- `public/styles.css`: Archivo que contiene los estilos de la aplicación.
- `public/images`: Carpeta que contiene las imágenes de los productos.
- `.env`: Archivo que contiene las variables de entorno. Contiene la uri de la base de datos de Atlas conjunta para los dos usuarios, el puerto de la aplicación y las credenciales del proyecto de firebase.
- `package.json`: Archivo que contendrá las dependencias del proyecto. Crearemos un script para iniciar el servidor con node y otro para iniciar el servidor con nodemon.("start": "node src/index.js", "dev": "nodemon src/index.js").

## Funciones del Controlador de Productos:

- `getNavBar`: Renderiza la barra de navegación según la ruta proporcionada.
- `getProducts`: Renderiza una lista de productos.
- `getProduct`: Renderiza un único producto.
- `showProducts`: Muestra todos los productos disponibles.
- `showProductById`: Muestra los detalles de un producto específico por su ID.
- `showNewProductForm`: Renderiza un formulario para crear un nuevo producto.
- `createProduct`: Procesa la creación de un nuevo producto.
- `updateProductById`: Procesa la actualización de un producto existente por su ID.
- `showEditProductForm`: Renderiza un formulario para editar un producto existente.
- `deleteProductById`: Elimina un producto existente por su ID.

## Funciones del Controlador de la API:

- `showProductsApi`: Devuelve todos los productos disponibles.
- `showProductByIdApi`: Devuelve un producto específico por su ID.
- `createProductApi`: Crea un nuevo producto.
- `updateProductByIdApi`: Actualiza un producto existente por su ID.
- `deleteProductByIdApi`: Elimina un producto existente por su ID.

## Funciones del Controlador de Autenticación:

- `createUser`: Renderiza un formulario de registro de usuario.
- `loginUserform`: Renderiza un formulario de inicio de sesión de usuario.
- `saveUser`: Procesa el registro de un nuevo usuario utilizando Firebase Authentication.
- `loginUser`: Procesa el inicio de sesión de un usuario existente utilizando Firebase Authentication.
- `logout`: Cierra la sesión del usuario actual.


## Endpoints de la App

La aplicación 'Tienda de ropa' contiene diferentes rutas según sea para el uso del cliente comprador o ya sea para el uso del administrador/es de la app.

#### Para el uso del cliente, los endpoints a los cuales puede acceder son:

- `router.get('/')`: Redirecciona a `/products/`.
- `router.get('/products/', productController.showProducts)`: Devuelve todos los productos. Cada uno de ellos dispone de un enlace a su página de detalle.
- `router.get('/products/:productId', productController.showProductById)`: Devuelve el detalle de un producto concreto.

##### El backend dispone de un enrutado especifico que devuelve los datos en formato json para la API.

- `router.get('/products', apiController.showProductsApi)`: Devuelve todos los productos. Cada uno de ellos dispone de un enlace a su página de detalle.
- `router.get('/products/:productId', apiController.showProductByIdApi)`: Devuelve el detalle de un producto concreto.

#### Para el uso del administrador.

La aplicación 'Tienda de ropa' esta especialmente pensada para el uso en el backend de los administradores de esta. Por ello dispone de un sistema de autenticación, la encriptacion y el hash realizado por crypto y bcrypt, mientras que el middleware de sesión autenticada comprobada gracias a la configuración del proyecto en `firebase`. 

- `router.get('/login/',authController.loginUserform)`: Devuelve el formulario para realizar el login al usuario/administrador. La respuesta devuelta viene en formato HTML. Desde aqui tambien podemos acceder al formulario de registro.
- `router.post('/login/', authController.loginUser)`: Envia el email y el password aportado por el usuario/administrador, lo autentica y si las credenciales son correctas redirecciona al dashboard de productos de administrador, si no redirecciona de nuevo a login.

- `router.get('/register/', authController.createUser)`: Devuelve el formulario para realizar la creacion de usuario. La respuesta devuelta viene en formato HTML.

- `router.post('/register/', authController.saveUser)`: Guarda la autenticacion mediante email y contraseña del usuario creado y lo redirecciona al dashboard de productos de administrador.

- `router.get('/logout', authController.logout)`: Cierra sesión de usuario autenticada y redirecciona a la pagina principal.

##### Una vez el administrador ha sido autenticado los endpoints a los que puede acceder son:

- `router.get('/dashboard/',checksession, productController.showProducts)`: Devuelve todos los productos. Cada uno de ellos dispone de un enlace a su página de detalle. 
- `router.get('/dashboard/:productId',checksession, productController.showProductById)`: Devuelve el detalle de un producto concreto, el cuál se puede editar o borrar siendo administrador.
- `router.get('/dashboard/new',checksession, productController.showNewProductForm);`: Devuelve el formulario para la creación de un nuevo producto.
- `router.get('/dashboard/:productId/edit',checksession, productController.showEditProductForm)`: Devuelve el formulario para la edición de un producto concreto.
- `router.get('/dashboard/:productId/delete',checksession, productController.deleteProductById)`: Elimina un producto y devuelve un mensaje.

En todos ellos se usa la funcion `checksession` que actúa como middleware para comprobar si hay una sesión iniciada. Si no lo está, redirige al login.


##### El backend dispone de un enrutado especifico que devuelve los datos en formato json para la API.

- `router.post('/dashboard', apiController.createProductApi)`: Crea un nuevo producto y nos envía un mensaje de confirmación.
- `router.put('/dashboard/:productId', apiController.updateProductByIdApi)`: Modifica y actualiza un producto. También nos devuelve un mensaje de confirmación.
- `router.get('/dashboard/:productId/delete', apiController.deleteProductByIdApi)`: Elimina un producto y nos devuelve un mensaje de confirmación.


## Funcionamiento de la aplicación

La aplicación 'Tienda de ropa' esta desarrollada en Node.js. Para ello se han utilizado varias dependencias que explicaremos a continuación.

-`bcrypt`: Bcrypt es una función de hash de contraseñas y derivación de claves para contraseñas basada en el cifrado Blowfish.

- `connect-mongo`: Conector para almacenar las sesiones de Express en MongoDB.

-`crypto`: Herramienta que permite encriptar y desencriptar String en Node.js.

-`dotenv`: Es un módulo de dependencia cero que carga las variables de entorno desde un archivo .env.

-`express`: Es el entorno de trabajo en el que se ha desarrollado la app y por el cual se ha lanzado un servidor el cual está escuchando por variable de entorno en:  http://localhost:${PORT};

-`express-session`: Es un middleware que almacena los datos de sesión en el servidor.

-`firebase`: Es una solución creada por Google para el desarrollo de aplicaciones y mejora de partes de estas. En nuestro caso hemos desarrollado la autenticación del usuario/administrador.

-`method-override`: Middleware para Express que permite utilizar métodos HTTP como PUT o DELETE en formularios HTML.

-`mongoose`: Es una librería de Node.js que nos permite realizar consultas y peticiones a bases de datos alojadas en MongoDB Atlas.

-`swagger-ui-express`: Es una infraestructura de visualización que puede analizar la especificación OpenAPI y generar una consola de API para que los usuarios puedan aprender y ejecutar la API REST de forma rápida y sencilla. En nuestro caso solo se ejecutarán las rutas "api".

-`jest`: Es una biblioteca de Node.js para crear, ejecutar y estructurar pruebas o test. En nuestro caso se han realizado los test a las funciones de la aplicación.

-`fl0`: Aunque no es una dependencia utilizamos el implementador de aplicaciones backend y bases de datos llamado `fl0` en el cual hemos creado nuestro proyecto y lo hemos desplegado.


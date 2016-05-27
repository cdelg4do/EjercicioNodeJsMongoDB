# Práctica JS/Node.js/MongoDB de Carlos Delgado Andrés


### RAÍZ DE LA APLICACIÓN:
---
El proyecto se encuentra dentro de la carpeta **/nodepop** del repositorio.


### CONEXIÓN A LA BBDD:
---

Los datos de conexión a la base de datos se encuentran en el fichero **/lib/dbConnect.js**


### RUTAS DE LA API:
---


##### - Descarga de ficheros estáticos (imágenes de los anuncios):

Acceder a la ruta **/images/advertisements/_<nombre_del_fichero>_** (petición GET).

Consultar la sección **Datos Iniciales** más abajo para saber qué ficheros de imágen están accesibles en esta ruta (campo **photo** de cada elemento del array de **advertisements**).


#### - Creación de usuarios:

Petición POST a **/api/v1/users** con los siguientes parámetros en el *body*:

* **name**: nombre del nuevo usuario
* **email**: dirección de correo que identifica al nuevo usuario
* **password**: contraseña del nuevo usuario


#### - Autenticación de usuarios:

Petición POST a **/api/v1/users/authenticate** con los siguientes parámetros en el *body*:

* **email**: dirección de correo que identifica al usuario
* **password**: contraseña del usuario


#### - Registrar un nuevo token de push:

Petición POST a **/api/v1/pushtokens** con los siguientes parámetros en el *body*:

* **platform**: plataforma del cliente (ej. ios, android)
* **token**: token de push del cliente
* **user**: id del usuario al que pertenece el token **(opcional)**


#### - Listado de tags del sistema:

Petición GET a **/api/v1/tag** sin ningún parámetro en la *url* ni en el *body*.


#### - Listado de anuncios:

Petición GET a **/api/v1/advertisements** con los siguientes parámetros en la *URL*:

* Parámetros obligatorios:
  * **token**: el token auth del usuario que hace la petición	(obligatorio)


* Filtros opcionales:
  * **name**: texto por el que comienza el nombre del artículo
  * **sale**: (true/false) indica si el artículo es de venta o no.
  * **price**: filtro de precios (no implementado)
  * **tags**: etiquetas del artículo
  * **start**: nº del resultado inicial a devolver
  * **limit**: nº de resultados que se devolverán, como máximo
  * **includeTotal**: (true/false) indica si se incluye un campo adicional con el total de artículos en la respuesta.


### Nota:
**Para la internacionalización, todas las peticiones soportan un parámetro opcional "lang" (en la URL para peticiones GET, en el *body* para peticiones POST) con el lenguaje del cliente (en/es). Si no se especifica este parámetro o no es ninguno de esos dos, se usará el inglés como idioma por defecto.**


### DATOS INICIALES:
---

Puede poblarse la base de datos utilizando el script **install_db.js** de la carpeta **/tools** de la aplicación.

Para usar el script, ejecutar desde la carpeta raíz del proyecto: **node ./tools/install_db.js**

Los datos se cargarán del fichero **initial_data.json** de esa misma carpeta, cuyo contenido es el siguiente:

	
    {
      "users": [
        {
          "name": "Carlos",
          "email": "carlos@mail.com",
          "password": "b0bcc62c2e93"
        },
        {
          "name": "Pepe",
          "email": "pepe@hotmail.es",
          "password": "b0bcc62c2e93"
        }
      ],
      "advertisements": [
        {
          "name": "Bicicleta",
          "sale": true,
          "price": 230.15,
          "photo": "bici.jpg",
          "tags": [
            "lifestyle",
            "motor"
          ]
        },
        {
          "name": "iPhone 3GS",
          "sale": false,
          "price": 50,
          "photo": "iphone.jpg",
          "tags": [
            "lifestyle",
            "mobile"
          ]
        },
        {
          "name": "Lavadora",
          "sale": true,
          "price": 130,
          "photo": "lavadora.jpg",
          "tags": [
            "work"
          ]
        },
        {
          "name": "Reloj",
          "sale": false,
          "price": 25.5,
          "photo": "reloj.jpg",
          "tags": [
            "lifestyle"
          ]
        },
        {
          "name": "Bicicleta Verde",
          "sale": true,
          "price": 175.10,
          "photo": "bici_verde.jpg",
          "tags": [
            "lifestyle",
            "motor"
          ]
        },
        {
          "name": "Auriculares",
          "sale": true,
          "price": 40.25,
          "photo": "auriculares.jpg",
          "tags": [
            "work",
            "lifestyle",
            "mobile"
          ]
        }
      ]
    }



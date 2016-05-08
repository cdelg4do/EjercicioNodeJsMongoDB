PRÁCTICA JS/Node.js/MongoDB de Carlos Delgado Andrés

El proyecto se encuentra dentro de la carpeta /nodepop del repositorio.


CONEXIÓN A LA BBDD:
-------------------

Los datos de conexión a la base de datos se encuentran en el fichero "/lib/dbConnect.js"



RUTAS DE LA API:
-----------------

/images/advertisements	---->	carpeta de imágenes de los anuncios

/api/v1/users	------------------->	para peticiones POST de creación de usuarios

	Parámetros necesarios en el body: name, email, password


/api/v1/users/authenticate	--->	para peticiones POST de autenticación

	Parámetros necesarios en el body: email, password


/api/v1/tag	--->	peticiones GET para el listado de tags (sin parámetros)

/api/v1/pushtokens	---->	peticiones POST para nuevos tokens de push

/api/v1/advertisements	---->	para peticiones GET de listados de anuncios

	Parámetro obligatorio:	"token" el token auth del usuario que hace la petición	

	Filtros opcionales: 	"name" (nombre del artículo)
				"sale" (si el articulo es de venta: true/false)
			        "price" (precio, filtro no implementado)
			        "tags" (etiquetas del artículo)
				"start"	(inicio de los resultados)
				"limit"	(límite de resultados)
				"includeTotal"	(si se debe incluir un campo más con el total de artículos en la respuesta, true/false()


Nota:	Para la internacionalización, todas las peticiones soportan un parámetro adicional "lang" (en/es) con el lenguaje del cliente.
	Si no se especifica este parámetro o no es ninguno de esos dos, se usará el inglés como idioma por defecto.



DATOS INICIALES:
-----------------

Puede poblarse la base de datos utilizando el script "install_db.js" de la carpeta /tools.

Para ejecutarlo, desde la carpeta raíz del proyecto: "node ./tools/install_db.js"

Los datos se cargarán del fichero "initial_data.json" de esa misma carpeta, cuyo contenido es el siguiente:

	
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



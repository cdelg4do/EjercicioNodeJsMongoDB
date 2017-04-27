# NODEPOP, a simple Node.js backend

This is a small proptotype of a backend for an online shop where users can publish advertisements to buy/sell articles. It is made with Node.js, Express.js and MongoDB. It also uses some other dependencies like Crypto (to encrypt the user passwords), JSONWebToken (for session control) or Mongoose (for MongoDB object modeling).

The project can be found inside the **/nodepop** folder of the repository.

.
### Connection to the database:
---
The database connection data is located inside the **/lib/dbConnect.js** file.

.
### API ROUTES:
---

#### - Download of static files:

The static files of the app are located under the **/nodepop/public** folder. In particular, the endpoint to retrieve the advertisement pictures is:

[GET] request to **/images/advertisements/_<image_file>_**


#### - User registration:

[POST] request to **/api/v1/users** with the following *body* parameters:

* **name**: screen name for the new user
* **email**: a unique email address (this will be the username)
* **password**: password for the new user


#### - User authentication:

[POST] request to **/api/v1/users/authenticate** with the following *body* parameters:

* **email**: user's email address
* **password**: user's password


#### - Register a new push token (for push notifications):

[POST] request to **/api/v1/pushtokens** with the following *body* parameters:

* **platform**: client's platform (i.e. ios, android)
* **token**: the client's push token
* **user**: id of the user the token belongs to **(optional)**


#### - List of existing article tags:

[GET] request to **/api/v1/tags**


#### - Advertisement search:

[GET] request to **/api/v1/advertisements** with the following *URL* parameters:

* Mandatory param:
  * **token**: the JWT token of the user that is sending the request

* Optional params:
  * **name**: text to filter articles which name starts with it.
  * **sale**: (true/false) to search articles for sale or demanded.
  * **tags**: to search articles by tag (several tags can be used here, separated by comma).
  * **start**: initial result to retrieve (useful to paginate results).
  * **limit**: how many results should be retrieved (useful to paginate results).
  * **includeTotal**: (true/false) to include the total number of matches or not (useful to paginate results).


### Note:
**All API requests support an optional parameter **"lang"** (in the *URL* for GET requests, in the *body* for POST requests) with the language of the client, currently "en" & "es" are supported. This is useful to localize the error messages, for instance. If this parameter is not provided, or the value provided is not supported, English will be used by default.**

.
### Initial data:
---

The database can be populated using the script **install_db.js** located in the **/tools** folder.

To execute the script, just type from the /nodepop folder: **node ./tools/install_db.js**

Data will be loaded from the file **initial_data.json** located in the **/tools** folder, whose contents are as follows:

```json
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
          "name": "Bicycle",
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
          "name": "Washing Machine",
          "sale": true,
          "price": 130,
          "photo": "lavadora.jpg",
          "tags": [
            "work"
          ]
        },
        {
          "name": "Clock",
          "sale": false,
          "price": 25.5,
          "photo": "reloj.jpg",
          "tags": [
            "lifestyle"
          ]
        },
        {
          "name": "Bicycle (green)",
          "sale": true,
          "price": 175.10,
          "photo": "bici_verde.jpg",
          "tags": [
            "lifestyle",
            "motor"
          ]
        },
        {
          "name": "Headphones",
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
```

**(The password for both default users "Carlos" & "Pepe" is: 123456)**

# Nodepop

## Notas para la practica del módulo DEVOPS

Esta aplicacion de node se ha desplegado en una instancia EC2 de AWS, utilizando NGINX como servidor WEB y haciendo proxy inverso para esta app de node llamada NODEPOP.

Este despliegue dará servicio a los siguientes dominios:
IP: 63.34.67.252 
  -Se servirá una página estática, utilizando una plantilla Bootstrap,
DNS publico proporcionado por AWS: ec2-63-34-67-252.eu-west-1.compute.amazonaws.com
  -Se servirá la API creada en Node llamada NODEPOP
  
 
## Descripción

Práctica de una aplicación backend que corre en nodejs y crea un servidor http que proporciona un API con recursos para gestionar una  colección de anuncios de artículos de compra/venta en una base de datos MongoDB.

El API está disponible en la url **http://localhost:[port]/apiv1/anuncios**

**(si no hay establecido un puerto válido en una variable de entorno *PORT*, el puerto por defecto será *3000*)**

Así mismo hay una página principal **http://localhost:[port]/** que ofrece un renderizado html de la lista de anuncios, a la que se le pueden pasar parametros en la *query string* de la url, para modificar los resultados de la lista (filtros, orden, etc..).

*Nodepop* utiliza *MONGODB*, base de datos *nodepop* y la colección *anuncios* que almacena un *documento* por cada anuncio, con los siguientes registros:

- *nombre*: nombre del artículo
- *venta*: true (se vende), false (se compra)
- *precio*: precio de venta o compra
- *urlFoto*: nombre del archivo de la foto
- *tags*: cada anuncio contendrá uno o varios de estos: motor, mobile, lifestyle, work

## Inicializando base de datos, *Nodepop* y microservicio de creación de Thumbnail

Hay que tener instalado *nodejs* y *mongoDB*

Para inicializar el servidor de la base de datos *mongoDB*, ir a la ruta donde esté instalado y ejecutar el archivo *mongod* indicando la ruta donde se guardaran los archivos de la base de datos con la opcion *--dbpath [ruta]* e indicando la opción *--directoryperdb* si querermos que cada base de datos se guarde en un directorio independiente. *Ej ./bin/mongod --dbpath ./data/db --directoryperdb*

Si no hemos indicado otro puerto, por defecto *MongoDB* utilizará el 27017.

Antes de inicializar *Nodepop* hay que definir una variable de entorno que especifique la url de conexión a la base de datos MongoDB establecida previamente. Esta debe quedar guardad en un archivo, en la raiz del proyecto, llamado *.env*. Dentro se debe establecer la variable de entorno *MONGOOSE_CONNECTION_STRING* que indique la url (en protocolo mongodb://) para conectar a la base de datos. Ej. *MONGOOSE_CONNECTION_STRING=mongodb://localhost:27017/nodepop*. Cambiar el puerto si se ha establecido otro cuando lenvantamos el servidor mongoDB. */nodepop* en la url indica la base de datos a la que se va a conectar.

Podemos restablecer un contenido inicial de ejemplo en la base de datos ejecutando: *"npm run installDB"*. Previamente eliminará todo contenido de las colecciones *anuncios* y *usuarios* de la base de datos si los hubiera, y creará luego, unos anuncios y usuarios ya preestablecidos, a modo de mockdata, en la carpeta del proyecto: *initial_data*, archivso en formato *JSON*: *"anuncios.json"* y *"usuarios.json"*.

Para inicializar *Nodepop* se puede hacer en los siguientes entornos:
- Desarrollo: *"npm run dev"* (ejecutará nodemon)
- Producción: *"npm start"* (ejecutará node)

Para inicializar microserivcio de creación de thumbnail se puede hacer ejecutando el script:
- *"npm run microservice-thumbnail"*

Nota: Es recomendable utilizar un gestor de procesos como PM2 para desplegar tanto la aplicacion como los servicios de una manera más cómoda y automatizada, siendo totalmente configurable, por ejemplo se pueden establecer nº de instancias de microservicios, rutas para los *logs* y *logs de error* etc..



## Recursos del API

El API responderá a la ruta **http://localhost:[port]/apiv1/anuncios**, devolviendo un objeto con la propiedades:
- *success*: con valores *true* o *false*, que indicaran el exito o no de la petición.

- *result*: Si la peticióm ha tenido éxito devolverá el objeto u objetos que responden a los parametros del request, o en caso de haber ocurrido un error a la hora de tratar la petición, se mostrará el error.

Para hacer uso del API se requiere autentificación. Se debe mandar en las cabeceras de las peticiones, en el parámetro *x-access-token*, un token firmado que nos proporcionará el propio api tras autenticarse.

### Hacer login para obtener token de autentificación
#### POST http://localhost:[port]/apiv1/authenticate [enctype = x-www-form-urlencoded]

Hacer peticion POST con las keys: *email* y *password*.

A modo de mockdata, en la colección *usuarios* de la Base de Datos, estarán pesistidos como usuarios registrados los indicados en el archivo: *./initial_data/usuarios.json*, esto es: *email: user@example.com, password: 1234 (en la BD queda persistido un hash del password)*.
Si el login se realiza de manera satisfactoria el API proporcionará un token valido para 2 días, que deberemos enviar en la cabecera bajo el parámetro *x-access-token*, en cada una de las peticiones, para poder hacer uso del API

### Respuestas a peticiones GET (parámetros en la query string)

#### Filtros de listado a los registros de los documentos (campos de los anuncios)
#### GET http://localhost:[port]/apiv1/anuncios?[query string]
Los siguientes son los parámetros que el API utilizará para filtrar la lista de anuncios:
- *nombre:* Anuncios que empiecen por el dato especificado
- *venta:* Posibles valores *true* (artículo en venta), *false* (se busca artículo para comprar)
- *precio:* Se puede especificar un precio exacto, un rango de precio (min a max), un precio igual o mínimo, un precio igual o máximo. El dato se pasará en el siguiente formato respectivamente: num, nunMin-numMax, num-, -num. *"Ej 300, 100-600, 300-, -300"*
- *tags:* Anuncio que contenga uno o más de los 4 tags permitidos: *mobile, motor, lifestyle, work*. Si se especifica más de un tag, en la query separarán con espacios entre ellos.
- *urlFoto:* nombre del archivo de la foto del artículo (se guardarán en raiz, como ruta estática, en el path "*images/anuncios/*")

#### Opciones de listado
#### GET http://localhost:[port]/apiv1/anuncios?[query string]
Los siguientes son los parámetros que el API utilizará para moldear la lista:
- *limit:* Establece un máximo de artículos a listar, por defecto queda establecido en 8
- *skip:* Mostrar anuncios a partir del siguiente al dato especificado
- *sort:* Ordenación ascendente del listado por el campo del anuncio indicado. Si se indica en negativo, con un signo "*-*" delante, el orden será descendente
- *page:* En una lista paginada, muestra los anuncios correspondiente a la pagina indicada en el valor, mostrando un máximo de anuncios por página establecido por el parámetro limit o en su defecto de 8. Sólo se permite uno de estos 2 parámetros a la vez en la query string: *page* o *skip*. Si se establece *page* se obviará *skip* (simpre prevalecerá el parámetro page sobre skip)
- *fields:* Muestra sólo el campo o los campos del anuncio indicados (con un espacio entre ellos si son varios campos). Omitirá, por el contrario, si se indica con el "*-*" delante. Por defecto, siempre mostrára también su identificativo *_id* en la base de datos. Este último se puede omitir si se desea indicándolo, *Ej*: "*-_id*"

#### Obtener listado de tags utilizados en el total de anuncios
#### GET http://localhost:[port]/apiv1/tags
Para obtener un listado completo de tags utilizado en el total de anuncios, el API los devolverá antendiendo a una petición GET a la ruta: **http://localhost:[port]/apiv1/anuncios/tags**

#### Obtener anuncio por su identificador en base de datos
#### GET http://localhost:[port]/apiv1/:id
Se podrá obtener un único anuncio especificando su *_id* en la base de datos, pasándolo como parámetro a la ruta del API: **http://localhost:[port]/apiv1/anuncios/:id**

### Respuestas a peticiones POST

#### Crear un anuncio
#### POST http://localhost:[port]/apiv1/anuncios [enctype = multipart/form-data]
Se podrá crear un anuncio, haciendo una petición *post* a la raiz de la url del API **http://localhost:[port]/apiv1/anuncios/**, e indicando en el body de la misma los registros y sus valores, no siendo persistido ningun registro en la base de datos que no corresponda con los establecidos en el modelo: *nombre, precio, venta, tags*. Todos estos son obligatorios/requeridos.
Opcionalmente se puede enviar un archivo de una imagen, quedando persistida en la BD el nombre del archivo bajo el registro: *urlFoto*. Este archivo quedará guardado en la carpeta *./public/images/anuncios*.

A su vez, el servidor solicitará a un microservicio la creacion de un thumbnail de 100x100 de esa misma imagen, que tambien se guardará en la misma ruta que la imagen original con el prefijo *"thumbnail-"* en el nombre, y persistirá también en la BD el nombre del archivo bajo el registro: *urlThumbnail*.

### Respuestas a peticiones DELETE
#### Eliminar un anuncio
#### DELETE http://localhost:[port]/apiv1/anuncios:id
Se podrá eliminar un anuncio, haciendo una petición *delete* a la raiz de la url del API **http://localhost:[port]/apiv1/anuncios/**, e indicando como parámetro en la ruta, el identificador del anuncio *_id*. Si la operación ha tenido éxito devolverá como resultado el objeto del anuncio eliminado.

### Respuestas a peticiones PUT
#### Actualizar un auncio
#### PUT http://localhost:[port]/apiv1/anuncios:id
Se podrá actualizar valores en los registros de un anuncio, haciendo una petición *put* a la raiz de la url del API **http://localhost:[port]/apiv1/anuncios/**, e indicando como parámetro en la ruta, el identificador del anuncio *_id*. Si la operación ha tenido éxito devolverá como resultado el objeto del anuncio actualizado.

## Uso de la pagina principal de WEB APP
#### http://localhost:[port]/
Se podrá acceder a la pagina principal en la ruta **http://localhost:[port]/**, donde se mostrará un página html con una lista de los anuncios. Esta lista igualmente se puede filtrar por medio de la query string (mismos parametros que los descritos en el uso del API), y moldear con los parametros: limit, skip, sort, para limitar el numero de anuncios listados, mostrar a partir del anuncio siguiente al especificado, y ordenar ascendente o descendente (con el "*-*" delante), respectivamente.

La pagina servida hace uso de la Internaciolización y es multidioma (español, inglés), quedando registrada la preferencia indicada por el usuario durante 2 dias. Si no lo ha indicado expresamente en la página, se considerarán las preferencias indicadas por el cliente en la cabecera de la petición.

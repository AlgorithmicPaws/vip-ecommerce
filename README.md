# README del Proyecto: vip-ecommerce

Este archivo README explica cómo configurar y ejecutar el proyecto `vip-ecommerce` localmente utilizando Git y Docker.

## Prerrequisitos

Antes de comenzar, asegúrate de tener instalados los siguientes programas:

* **Git:** [https://git-scm.com/](https://git-scm.com/)
* **Docker y Docker Compose:** [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

## Pasos para la Ejecución

Sigue estos pasos para poner en marcha el proyecto en tu máquina local:

1.  **Clona el repositorio:**
    Abre tu terminal o línea de comandos y ejecuta:
    ```bash
    git clone git@github.com:AlgorithmicPaws/vip-ecommerce.git
    ```
    *(Si usas HTTPS, el comando sería `git clone https://github.com/AlgorithmicPaws/vip-ecommerce.git`)*

2.  **Navega al directorio del proyecto:**
    ```bash
    cd vip-ecommerce
    ```

3.  **Cambia a la rama 'docker':**
    Dentro del directorio del proyecto, ejecuta:
    ```bash
    git checkout docker
    ```
    *Esto te cambiará a la rama que contiene la configuración de Docker.*

4.  **Levanta los contenedores con Docker Compose:**
    Asegúrate de que Docker Desktop (o el demonio de Docker) esté corriendo en tu sistema. Luego, ejecuta:
    ```bash
    docker-compose up --build
    ```
    * El comando `docker-compose up` leerá el archivo `docker-compose.yml`, construirá las imágenes necesarias (si no existen o si usas `--build`) y creará e iniciará los contenedores definidos.
    * La opción `--build` fuerza la reconstrucción de las imágenes, lo cual es útil si hubo cambios en el Dockerfile o en el código fuente base.
    * Este proceso puede tardar unos minutos la primera vez, ya que necesita descargar las imágenes base y construir las dependencias. Verás la salida de los logs de los contenedores en tu terminal.

## Accediendo a la Aplicación

Una vez que los contenedores estén corriendo (verás los logs activos en la terminal), podrás acceder a las diferentes partes de la aplicación:

* **Frontend:** Abre tu navegador web y ve a:
    `http://localhost`

* **API (Documentación Interactiva):** Abre tu navegador web y ve a:
    `http://localhost:8000/docs`


## ¡Importante! Flujo de Configuración Inicial

Actualmente, mientras se finaliza la migración completa y se perfeccionan algunas funcionalidades, es necesario seguir estos pasos iniciales después de levantar la aplicación por primera vez para poder empezar a crear productos:

1.  **Crea un usuario:** Ve al frontend (`http://localhost`) y regístrate como un nuevo usuario a través del formulario de registro.
2.  **Inicia sesión:** Accede a la aplicación con las credenciales (email/usuario y contraseña) del usuario que acabas de crear.
3.  **Conviértete en Vendedor:** Dentro de la aplicación (ya logueado), busca y haz clic en el botón o enlace "Vende con Nosotros" (o un texto similar). Esto modificará tu cuenta para darle permisos de vendedor.
4.  **Autentícate en la API:**
    * Ve a la documentación de la API (`http://localhost:8000/docs`).
    * Busca y haz clic en el botón "Authorize" (generalmente en la esquina superior derecha).
    * Se abrirá un modal o sección para la autenticación. Ingresa el **nombre de usuario (o email) y la contraseña** del usuario que **acabas de convertir en vendedor**. Completa el proceso de autorización (puede ser un login tipo OAuth2 password flow o similar). Esto te permitirá ejecutar endpoints protegidos desde la interfaz de `/docs`.
5.  **Crea una Categoría:**
    * Dentro de la documentación de la API (`/docs`), busca el endpoint correspondiente para **crear categorías** (usualmente bajo una sección "Categories" o similar, método POST).
    * Asegúrate de estar autenticado como vendedor (paso 4).
    * Ejecuta el endpoint para crear al menos una categoría de productos (por ejemplo: Cementos y Concretos, Acabados y Revestimientos, Estructuras y Metales, Impermeabilizantes y Selladores
Adhesivos y Pegantes.). Necesitarás proporcionar los datos que requiera la API (como el nombre de la categoría).

## Uso Posterior

Una vez que hayas completado el flujo de configuración inicial y **hayas creado al menos una categoría a través de la API**, podrás gestionar la creación de productos y otras funcionalidades de vendedor directamente desde la interfaz del **frontend** (`http://localhost`). El paso inicial por la API es un requisito temporal mientras se ajusta la migración.

## Detener la Aplicación

Para detener los contenedores, vuelve a la terminal donde ejecutaste `docker-compose up` y presiona `Ctrl + C`.

Si quieres asegurarte de que los contenedores se detienen y eliminan (liberando los puertos y recursos), puedes ejecutar (en el mismo directorio donde está el `docker-compose.yml`):
```bash
docker-compose down

# KOS aplicación web para mujeres, construída con Django y React  
## Cómo configurar y correr el backend de Django
*Esta guía es para Windows*

Para trabajar en aplicaciones de Django es necesario configurar un entorno virtual de python (venv: virtual environment)

1- Con tu backend de Django abierto en tu editor de código, abre una terminal en la carpeta del `/backend ` para ahí crear el entorno virtual con el comando:

    py -m venv env

2-  (Debes tener los Scripts de tu computadora habilitados para activarlo)
Para activar el venv ejecuta el comando:

    .\env\Scripts\activate

3- Si se activó debe verse un `(env)` a la izquierda de la ruta de tu terminal.
Ya asegurandote que el entorno esta activat, puedes instalar las dependencias del proyecto que se encuentran en el archivo requirements.txt al ejecutar:

    pip install -r requirements.txt

## Cómo configurar y correr el frontend de Nextjs
1- Primero en tu terminal entra a la carpeta `/frontend`

2- Debes usar una versión de node reciente como la `20.10.0`

3- Aquí instala las dependencias de `node` con:

    npm install

4- Corre el servidor localhost:3000 con:

    npm run dev

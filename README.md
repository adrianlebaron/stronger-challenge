﻿# Stronger challenge es la aplicación de KOS para mujeres, construída con `Django` y `React + Vite`
## Cómo configurar y correr el backend
*Esta guía es para Windows*

Para trabajar en aplicaciones de Django es necesario configurar un entorno virtual de python (venv: virtual environment)

1. Con tu backend de Django abierto en tu editor de código, abre una terminal en la carpeta del `/backend ` para ahí crear el entorno virtual con el comando:

       py -m venv env

2. (Debes tener los Scripts de tu computadora habilitados para activarlo)
Para activar el venv ejecuta el comando:

       .\env\Scripts\activate

3. Si se activó debe verse un `(env)` a la izquierda de la ruta de tu terminal.
Ya asegurandote que el entorno esta activat, puedes instalar las dependencias del proyecto que se encuentran en el archivo requirements.txt al ejecutar:

       pip install -r requirements.txt

4. Luego, ejecuta el servidor local, el cual correrá en: `127.0.0.1:8000`, con:

       py manage.py runserver

## Cómo configurar y correr el frontend
1. Primero en tu terminal entra a la carpeta `/frontend`

2. Aquí instala las dependencias de `node` con:

       npm install

3. Luego, ejecuta el servidor local, el cual correrá en: `localhost:5173`, con:

       npm run dev

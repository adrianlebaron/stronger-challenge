# women-kos
Para trabajar en aplicaciones de Django es necesario configurar un entorno virtual de python (venv: virtual environment) *Esta guía es para Windows*

1- Con tu backend de Django abierto en tu editor de código, abre una terminal posicionado en la carpeta raíz del proyecto para ahí crear el entorno virtual con el comando:

```
py -m venv env
```

2-  (Debes tener los Scripts de tu computadora habilitados para activarlo)
Para activar el venv ejecuta el comando:

```
.\env\Scripts\activate
```

3- Si se activó debe verse un (env) a la izquierda de la ruta de tu terminal.
Ahora instala las dependencias del proyecto que se encuentran en el archivo requirements.txt al ejecutar:

```
pip install -r requirements.txt
```
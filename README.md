# Taiko Nina - Atelier Collection E-Commerce

Bienvenido al repositorio de **Taiko Nina**, una plataforma de comercio electrónico diseñada para una marca de indumentaria "Atelier Collection". El sistema se enfoca en ofrecer una experiencia de usuario fluida, minimalista y moderna ("Defining modern femininity through precision and grace"), con integración completa para compras, autenticación y exploración de catálogos dinámicos a través de videos (Outfits).

Este proyecto no es solo una página web, sino un ecosistema compuesto por múltiples **módulos**:
1. **Frontend Estático:** Interfaz de usuario enriquecida (HTML, Tailwind CSS, JS vainilla).
2. **Backend de Pagos:** Funciones serverless para procesar pagos con Mercado Pago.
3. **Scripts de Automatización (Python):** Herramientas para actualizar dinámicamente el contenido y la estructura del sitio.
4. **Base de Datos (Supabase):** Autenticación de usuarios y suscripciones a newsletter.

---

## 🚀 Puesta en marcha paso a paso

A continuación, se detalla qué hace cada módulo y cuáles son los pasos exactos para levantarlo o ejecutarlo en tu entorno local.

### 1. Servidor Local y Frontend (con Checkout)
Este módulo se encarga de servir la página web y de habilitar la ruta `/api/checkout` para que la integración con **Mercado Pago** funcione en local.

**Requisitos:** Tener instalado **Node.js** en tu computadora.

**Pasos:**
1. Abre tu terminal en la carpeta principal del proyecto.
2. Instala las dependencias necesarias de Node.js (solo la primera vez):
   ```bash
   npm install
   ```
3. Asegúrate de tener tu archivo de credenciales `.env.local` creado en la raíz del proyecto. Debe contener tu token de Mercado Pago:
   ```env
   MP_ACCESS_TOKEN=APP_USR-lo-que-siga-de-tu-token
   ```
4. Levanta el ecosistema web localmente ejecutando:
   ```bash
   npm start
   ```
5. Esto levantará un servidor con Express. Ingresa a tu navegador a `http://localhost:3000` para ver la tienda funcionando con el flujo de carrito y pagos integrado.

---

### 2. Módulo de Autenticación y Base de Datos (Supabase)
El proyecto utiliza [Supabase](https://supabase.com) como backend as a service para manejar:
- Sistema de Log In / Sign Up de usuarios.
- Registro de emails para el Newsletter.

**Pasos:**
- **No es necesario levantar nada localmente:** Supabase funciona 100% en la nube a través de la SDK inyectada en el `script.js`.
- Asegúrate de tener conexión a internet. Automáticamente la web se comunicará con tu base de datos configurada para almacenar suscriptores y comprobar inicios de sesión.

---

### 3. Módulo de Automatización de Contenido (Python)
Para hacer que el mantenimiento de la tienda sea más fácil, el proyecto incluye pequeños scripts construidos en Python.

**Requisitos:** Tener instalado Python 3.

**¿Para qué sirve cada uno y cómo ejecutarlo?**

* **`build_outfits.py`**
  Este script lee todas las carpetas que tengas dentro de `VIDEOS_OUTFITS`, comprueba cuáles están "ACTIVE" en su archivo `content.txt`, y autogenera un archivo `outfits_data.js` con toda la información y videos para el Frontend.
  * *¿Cómo ejecutarlo?* `python3 build_outfits.py`
  * *¿Cuándo usarlo?* Cada vez que agregues o quites un video/outfit nuevo de la carpeta `VIDEOS_OUTFITS`.

* **`update_site.py`**
  Este script inyecta y actualiza automáticamente bloques de código repetitivos (como el Footer) a través de todos los archivos `.html` del proyecto. También se encarga de autogenerar vistas como `client_care.html`.
  * *¿Cómo ejecutarlo?* `python3 update_site.py`
  * *¿Cuándo usarlo?* Si modificas o corriges algo en el diseño de un pie de página (footer) y necesitas que el cambio impacte en las 10+ páginas del sitio a la vez.

* **`add_favicon.py`**
  Automatiza la inyección de la etiqueta y la imagen de tu logo (`favicon`) en el encabezado de todas las páginas HTML.
  * *¿Cómo ejecutarlo?* `python3 add_favicon.py`

---

## 📦 Estructura de Proyecto (Resumen)

- `*.html`: Vistas de la página (Inicio, Shop, Contacto, Inspo, etc).
- `script.js` / `style.css`: Lógica del frontend y estilos de la interfaz.
- `local_server.js` / `api/checkout.js`: Corazón del backend y de los flujos de pago local.
- `package.json`: Gestor de dependencias de Node.js.
- `*.py`: Automatizaciones administrativas.

Disfruta desarrollando en **Taiko Nina** 🖤.     
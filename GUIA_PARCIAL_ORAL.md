# Guía Completa — Parcial Oral Programación Web 2026
## Proyecto: taiko nina — E-commerce de Moda

---

## MOMENTO 1: Comprensión General, Arquitectura y CI/CD (30 pts)

### ¿Qué es taiko nina?

taiko nina es un e-commerce de moda construido como sitio web estático con contenido dinámico. No usa frameworks como React o Next.js. Está construido con **HTML + CSS (TailwindCSS) + JavaScript vanilla**, conectado a servicios externos para base de datos (Supabase), pagos (Mercado Pago) y hosting (Vercel).

### Estructura del proyecto

```
Proyecto_final_progra_web/
├── index.html          ← Home: video hero, novedades, colecciones, lookbook
├── shop.html           ← Catálogo: grilla de productos con filtros
├── product.html        ← Detalle de producto dinámico (según URL param)
├── outfits.html        ← Lookbooks en video con productos asociados
├── inspo.html          ← Página editorial de inspiración
├── contact.html        ← Formulario de contacto
├── client_care.html    ← Atención al cliente
│
├── script.js           ← TODA la lógica JS (1246 líneas)
├── style.css           ← Animaciones custom (fade-up)
├── outfits_data.js     ← Datos de outfits (título, video, productos)
│
├── api/                ← Serverless Functions (Vercel)
│   ├── supabase-config.js  ← Devuelve credenciales de Supabase de forma segura
│   └── checkout.js         ← Crea preferencia de pago en Mercado Pago
│
├── local_server.js     ← Servidor Express para desarrollo local
├── package.json        ← Dependencias: express, dotenv, mercadopago
│
├── DDBB/               ← Scripts SQL del esquema de base de datos
├── VIDEOS/             ← Videos del hero en index
├── VIDEOS_INSPO/       ← Videos de la página de inspiración
├── VIDEOS_OUTFITS/     ← Videos de los lookbooks
│
├── .env.local          ← Variables de entorno (NO se sube a GitHub)
├── .gitignore          ← Excluye .env.local, node_modules, etc.
└── favicon_taiko_nina.jpg
```

### Separación de responsabilidades

| Tecnología | Rol | Archivos |
|-----------|-----|----------|
| **HTML** | **Estructura** — Define el contenido y la organización semántica de cada página | `index.html`, `shop.html`, `product.html`, etc. |
| **CSS (TailwindCSS + style.css)** | **Estilos** — Apariencia visual: colores, tipografía, layout responsive, animaciones | TailwindCSS CDN + `style.css` |
| **JavaScript** | **Lógica** — Comportamiento dinámico: carga de datos, carrito, búsqueda, autenticación, pagos | `script.js`, `outfits_data.js` |

### Tecnologías utilizadas

| Tecnología | Para qué se usa |
|-----------|-----------------|
| **HTML5** | Estructura semántica de las páginas |
| **TailwindCSS** (CDN) | Framework de utilidades CSS para estilos rápidos |
| **CSS custom** (`style.css`) | Animaciones como fade-up con IntersectionObserver |
| **Google Fonts** | Tipografías: Noto Serif (títulos) y Manrope (cuerpo) |
| **Material Symbols** | Íconos vectoriales de Google |
| **JavaScript ES6+** | Lógica del frontend: async/await, fetch, template literals, arrow functions |
| **Supabase** | Backend-as-a-Service: base de datos PostgreSQL + autenticación |
| **Mercado Pago** | Pasarela de pagos: checkout externo seguro |
| **Vercel** | Hosting + Serverless Functions + deploy automático |
| **GitHub** | Control de versiones y trigger del deploy |
| **localStorage** | Persistencia del carrito en el navegador del usuario |

---

## Pipeline completo: Qué pasa cuando un usuario entra a la web

### Paso 1 — Petición HTTP
El usuario escribe la URL o hace click en un link. El navegador envía una petición HTTP GET al servidor (Vercel en producción, localhost:3000 en desarrollo). Vercel responde con `index.html` como archivo estático.

### Paso 2 — El navegador parsea el HTML
Lee `index.html` de arriba hacia abajo y construye el **DOM** (Document Object Model):

1. `<head>` — Carga dependencias externas:
   - TailwindCSS (CDN) → estilos utilitarios
   - Google Fonts → tipografías Noto Serif + Manrope
   - Material Symbols → íconos
   - Supabase JS SDK (CDN) → cliente de base de datos
   - `style.css` → animaciones custom
   - `script.js` → toda la lógica

2. `<body>` — Renderiza los elementos visibles:
   - `<nav>` → barra de navegación
   - `<main>` → contenido principal (hero, productos, etc.)
   - `<footer>` → pie de página con newsletter

### Paso 3 — JavaScript se ejecuta (`DOMContentLoaded`)
Cuando el HTML termina de cargarse, se disparan los event listeners. El flujo principal:

#### 3a. Conexión segura a Supabase
```
script.js llama a initSupabase()
    → fetch('/api/supabase-config')
        → Vercel Serverless Function lee variables de entorno
        → Devuelve { url, anonKey } al frontend
    → supabase.createClient(url, anonKey)
    → Conexión a PostgreSQL lista
```
**¿Por qué no poner las credenciales directo en el JS?**
Porque cualquier usuario podría ver el código fuente del navegador y robar las API keys. Al servirlas desde una Serverless Function, las keys solo están en el servidor (Vercel) como variables de entorno, nunca expuestas al público.

#### 3b. Carga de productos desde la base de datos
```
fetchProducts()
    → supabaseClient.from('products').select('*')
    → PostgreSQL devuelve un array de objetos:
      [{ name, price, image_url, color, origin, stock_xs, stock_s, stock_m, stock_l, ... }]
    → Se guarda en window.allProducts (variable global en memoria)
```

#### 3c. Renderizado dinámico en el DOM
```
renderSupabaseProducts(products)
    → Recorre el array con forEach
    → Genera HTML para cada producto usando template literals (`${variable}`)
    → Lo inyecta en el DOM con insertAdjacentHTML('beforeend', cardHTML)
    → Cada tarjeta tiene: imagen, nombre, precio, color, botón "Add to Cart"
```

#### 3d. Fallback si Supabase no responde
```
populateFallbackProducts()
    → Lee los productos que ya están escritos en el HTML estático
    → Los agrega a window.allProducts
    → Así la búsqueda y filtros funcionan aunque la BD esté caída
```

### Paso 4 — Interacción del usuario

#### Navbar con efecto scroll
```
window.addEventListener('scroll')
    → Si se hizo scroll más allá de la altura del viewport:
        → Navbar: transparente → blanca con backdrop-blur
        → Texto: blanco → negro
    → Si vuelve arriba:
        → Navbar: blanca → transparente
        → Texto: negro → blanco
```

#### Menú mobile (hamburguesa)
```
Click en ícono ☰ → toggle clase 'hidden' en el overlay del menú
Click fuera del menú → se cierra automáticamente
```

### Paso 5 — Búsqueda de productos
```
Click en ícono 🔍
    → Se abre un modal fullscreen con un input de texto
    → El usuario escribe → se dispara evento 'input' en cada tecla
    → window.allProducts.filter(p => p.name.includes(query))
    → Se renderiza la lista de resultados dinámicamente
    → Si no hay resultados → muestra "No products found"
    → Click en un resultado → navega a product.html?name=NombreDelProducto
```

### Paso 6 — Página de detalle de producto
```
El navegador carga product.html?name=Double-Face%20Cashmere%20Coat
    → JavaScript lee el parámetro con:
        const params = new URLSearchParams(window.location.search)
        const productName = params.get('name')
    → Busca el producto en window.allProducts
    → Actualiza dinámicamente el DOM:
        - Título (h1) → product.name
        - Imagen (#product-main-image) → product.image_url
        - Precio → product.price
        - Color/breadcrumb → product.color
        - Origen → product.origin
        - Stock por talla → deshabilita talles sin stock
```

### Paso 7 — Carrito de compras (localStorage)
```
Click "Add to Cart"
    → addToCart({ name, price, img, size })
    → Verifica stock disponible en la talla seleccionada
    → Si ya existe en el carrito → incrementa quantity
    → Si no existe → agrega nuevo item con quantity: 1
    → Guarda en localStorage con JSON.stringify(cart)
    → renderCart() → genera HTML del sidebar
    → Abre el sidebar del carrito con animación
    → Actualiza badge del ícono 🛍️ con la cantidad total
```

**¿Por qué localStorage?**
Porque el carrito persiste aunque el usuario cierre el navegador y vuelva después. No se necesita backend para guardar esta información temporal. Se lee con `JSON.parse(localStorage.getItem('taiko_cart'))`.

### Paso 8 — Checkout con Mercado Pago
```
Click "Checkout securely"
    → initCheckout()
    → fetch POST a '/api/checkout' con JSON: { cartItems: cart }
    → Serverless Function (api/checkout.js):
        - Importa SDK de Mercado Pago
        - Lee MERCADOPAGO_ACCESS_TOKEN de variables de entorno
        - Crea una preferencia de pago con los items del carrito
        - Devuelve { init_point: "https://www.mercadopago.com.ar/..." }
    → Frontend recibe la URL
    → window.location.href = init_point
    → El usuario es redirigido a Mercado Pago para pagar de forma segura
```

### Paso 9 — Autenticación de usuarios
```
Click en ícono 👤:
    SI no está logueado:
        → Abre modal con formulario email + password
        → Botón "Sign In" → supabaseClient.auth.signInWithPassword()
        → Botón "Create Account" → supabaseClient.auth.signUp()
        → Si hay error → muestra mensaje de error
        → Si es exitoso → onAuthStateChange se dispara → cierra modal
    
    SI está logueado:
        → Abre sidebar "My Account"
        → Muestra email del usuario
        → Botón "Sign Out" → supabaseClient.auth.signOut()
```

### Paso 10 — Filtros en Shop
```
En shop.html hay 4 dropdowns: Categoría, Talla, Color, Ordenar
    → Click en dropdown → toggle visibilidad
    → Click en opción → se guarda en currentFilters = { category, size, color }
    → applyFilters():
        - Filtra window.allProducts según los filtros activos
        - Ordena por precio (asc/desc) o por fecha (new arrivals)
        - Llama a renderSupabaseProducts(filtered) → actualiza la grilla
```

### Paso 11 — Animaciones con IntersectionObserver
```
Elementos con clase 'fade-up' empiezan con:
    - opacity: 0
    - transform: translateY(20px)

IntersectionObserver vigila cuándo entran al viewport (15% visible)
    → Agrega clase 'visible'
    → CSS transition los anima suavemente a:
        - opacity: 1
        - transform: translateY(0)
    → Se dejan de observar (unobserve) para no repetir
```

### Paso 12 — Newsletter
```
En el footer hay un formulario con input de email
    → Submit → supabaseClient.from('newsletter_subscribers').insert([{ email }])
    → Si el email ya existe (error 23505, unique constraint) → "¡Ya estás suscrito!"
    → Si es nuevo → "Suscrito con éxito"
```

---

## Flujo CI/CD (Deploy Automático)

```
1. Edito código en VS Code
2. git add . → git commit -m "mensaje" → git push origin main
3. GitHub recibe el push
4. Vercel detecta el nuevo commit automáticamente (webhook)
5. Vercel ejecuta el build (en este caso solo copia archivos estáticos)
6. Vercel publica en la URL: proyecto-final-progra-f1pa8dw4l-lpires211002s-projects.vercel.app
7. Las variables de entorno (API keys) están configuradas en el dashboard de Vercel
   → SUPABASE_URL, SUPABASE_ANON_KEY, MERCADOPAGO_ACCESS_TOKEN
   → Nunca se suben al código, solo existen en Vercel
```

**¿Qué es CI/CD conceptualmente?**
- **CI (Continuous Integration)**: Cada vez que hago push, el código se integra automáticamente
- **CD (Continuous Deployment)**: Después de integrarse, se despliega automáticamente a producción
- En nuestro caso el "pipeline" es simple: GitHub → Vercel → URL pública. No hay tests automatizados ni etapas intermedias.

---

## MOMENTO 2: Fundamentos HTML, CSS y JavaScript (25 pts)

### HTML Semántico
En el proyecto se usan etiquetas semánticas:
- `<nav>` → barra de navegación
- `<main>` → contenido principal de cada página
- `<section>` → secciones dentro del main (hero, novedades, colecciones)
- `<header>` → cabecera en product.html
- `<footer>` → pie de página con newsletter y links
- `<form>` → formularios (newsletter, login, contacto)
- `<h1>` a `<h4>` → jerarquía de títulos

**¿Por qué importa?** Porque ayuda a:
- Buscadores (SEO) a entender la estructura
- Lectores de pantalla (accesibilidad) a navegar
- Desarrolladores a leer el código

### Accesibilidad (ARIA)
- Atributos `alt` en imágenes para lectores de pantalla
- Inputs con atributo `required` para validación nativa
- Inputs con `type="email"` para validación de formato
- Contraste de colores (texto oscuro sobre fondo claro)
- Íconos con texto descriptivo (Material Symbols)

### Responsive Design
Se usa TailwindCSS con breakpoints:
- Mobile first: estilos base aplican a móvil
- `md:` → ≥768px (tablet)
- `lg:` → ≥1024px (desktop)

Ejemplos concretos:
- `grid-cols-1 md:grid-cols-4` → 1 columna en mobile, 4 en desktop
- `px-4 md:px-12` → menos padding en mobile
- `hidden md:flex` → menú desktop oculto en mobile, se reemplaza por hamburguesa
- `text-xl md:text-2xl` → tamaño de fuente responsivo

Layout con **Flexbox** (`flex`, `items-center`, `justify-between`) y **Grid** (`grid grid-cols-12`).

### Eventos en JavaScript
Eventos usados en el proyecto:
- `click` → agregar al carrito, abrir búsqueda, navegación
- `input` → búsqueda en tiempo real mientras el usuario escribe
- `submit` → newsletter, login/registro (con `e.preventDefault()`)
- `scroll` → cambio de estilo del navbar
- `mouseenter` / `mouseleave` → reproducir/pausar videos en outfits
- `DOMContentLoaded` → inicializar toda la app

### Asincronía con fetch
```javascript
// Ejemplo real del código (simplificado):
async function fetchProducts() {
    const { data, error } = await supabaseClient
        .from('products')
        .select('*');
    return data;
}
```

**¿Qué es async/await?**
- `async` marca la función como asíncrona
- `await` pausa la ejecución hasta que la promesa se resuelve
- Sin await, el código seguiría ejecutándose sin esperar la respuesta del servidor, y `data` sería undefined

**¿Qué es fetch?**
Es la API nativa del navegador para hacer peticiones HTTP. Devuelve una Promise. En nuestro caso, Supabase lo abstrae internamente, pero en el checkout lo usamos directamente:
```javascript
const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cartItems: cart })
});
const data = await response.json();
```

### Validación de formularios
- Newsletter: `<input type="email" required>` → el navegador valida formato de email automáticamente
- Login: campos `required` evitan envío vacío
- Stock: JavaScript verifica que no se agregue más cantidad al carrito de la que hay disponible

### Módulos ES6 (conceptual)
En el código del servidor (`local_server.js`) se usan módulos ES6:
```javascript
import express from 'express';
import dotenv from 'dotenv';
```
En el frontend, `script.js` se carga con `<script src="script.js">` de forma tradicional (no como módulo ES6), pero conceptualmente la idea es la misma: organizar el código en archivos separados con responsabilidades distintas.

---

## MOMENTO 3: React y Next (conceptual) (25 pts)

> Nota: El proyecto NO usa React ni Next.js, pero debés poder explicar los conceptos.

### ¿Qué es un componente?
Un bloque de UI reutilizable. En React, sería una función que devuelve JSX:
```jsx
function ProductCard({ name, price, image }) {
    return (
        <div>
            <img src={image} />
            <h3>{name}</h3>
            <p>${price}</p>
        </div>
    );
}
```
En nuestro proyecto, el equivalente es la función `renderSupabaseProducts()` que genera el HTML de cada tarjeta de producto con template literals.

### ¿Qué es props?
Son los datos que un componente padre le pasa a un componente hijo. Son **de solo lectura** (el hijo no los modifica). Ejemplo: `<ProductCard name="Coat" price={890} />`

### ¿Qué es state?
Es un dato interno del componente que **puede cambiar**. Cuando cambia, React re-renderiza el componente automáticamente. Ejemplo: `const [cart, setCart] = useState([])`

En nuestro proyecto, el equivalente es la variable `cart` que se actualiza manualmente y luego llamamos `renderCart()` para actualizar el DOM.

### ¿Qué es useEffect?
Es un hook que ejecuta código después de que el componente se renderiza. Se usa para efectos secundarios: cargar datos, suscribirse a eventos, etc.
```jsx
useEffect(() => {
    fetchProducts().then(data => setProducts(data));
}, []); // [] = solo se ejecuta una vez al montar
```
En nuestro proyecto, el equivalente es `DOMContentLoaded` → `fetchProducts().then(...)`.

### Rutas en Next.js (conceptual)
Next.js usa un sistema de rutas basado en archivos:
- `pages/index.js` → ruta `/`
- `pages/shop.js` → ruta `/shop`
- `pages/product/[id].js` → ruta dinámica `/product/123`

En nuestro proyecto, usamos archivos HTML separados (`index.html`, `shop.html`, etc.) y parámetros de URL (`?name=...`) para la ruta dinámica del producto.

### Renderizado cliente vs servidor (conceptual)
- **Cliente (CSR)**: El navegador recibe HTML vacío + JS, y JavaScript construye la página. Es lo que hacemos nosotros.
- **Servidor (SSR)**: El servidor ejecuta el código y envía HTML ya completado. Mejor para SEO.
- **Estático (SSG)**: El HTML se genera en tiempo de build, no en cada petición. El más rápido.

---

## MOMENTO 4: Uso de IA (20 pts)

### Herramienta utilizada
**Antigravity (Gemini/Claude)** como asistente de programación integrado en el editor de código.

### Cómo se utilizó
- Generación de estructura HTML y estilos TailwindCSS
- Implementación de lógica JavaScript (carrito, búsqueda, filtros)
- Integración con Supabase (auth, base de datos)
- Integración con Mercado Pago (serverless functions)
- Debugging y resolución de errores
- Responsive design y animaciones

### Cómo se validaba el código
1. Probando en el navegador (localhost y Vercel preview)
2. Revisando la consola del navegador por errores
3. Verificando que las funcionalidades trabajen end-to-end
4. Comprobando responsive en distintos tamaños de pantalla

### Errores de la IA y cómo se resolvieron
- La IA hardcodeó URLs de imágenes que luego no coincidían con los productos reales → se reemplazaron con imágenes de Supabase
- Variables de entorno expuestas en el frontend → se movieron a Serverless Functions
- Selectores CSS complejos que fallaban en ciertos contextos → se simplificaron con IDs

### Documentación de prompts
(Referir al documento de prompts adjunto al proyecto)

---

## Conceptos clave para responder rápido

| Pregunta | Respuesta corta |
|----------|----------------|
| ¿Qué es el DOM? | Representación en árbol de los elementos HTML que el navegador construye para poder manipularlos con JS |
| ¿Qué es fetch? | API nativa del navegador para hacer peticiones HTTP (GET, POST, etc.) |
| ¿Qué es async/await? | Sintaxis para manejar código asíncrono. `await` espera a que una Promise se resuelva |
| ¿Qué es una Promise? | Un objeto que representa un valor que todavía no está disponible pero lo estará en el futuro |
| ¿Qué es localStorage? | Almacenamiento key-value en el navegador que persiste entre sesiones |
| ¿Qué es una Serverless Function? | Código que se ejecuta en el servidor bajo demanda, sin mantener un server permanente |
| ¿Qué es una API? | Interfaz que permite que dos sistemas se comuniquen (ej: nuestro JS con Supabase) |
| ¿Qué es JSON? | Formato de texto para intercambiar datos estructurados (JavaScript Object Notation) |
| ¿Qué es responsive design? | Diseño que se adapta a distintos tamaños de pantalla |
| ¿Qué es Flexbox? | Sistema de layout CSS para alinear elementos en una dimensión (fila o columna) |
| ¿Qué es Grid? | Sistema de layout CSS para organizar elementos en dos dimensiones (filas y columnas) |
| ¿Qué es un CDN? | Content Delivery Network. Servidores distribuidos que sirven archivos estáticos rápidamente |
| ¿Qué es CI/CD? | Integración y despliegue continuos. Automatizar el proceso de subir código a producción |
| ¿Qué es `.gitignore`? | Archivo que lista lo que Git debe ignorar (ej: `.env.local`, `node_modules`) |
| ¿Qué es IntersectionObserver? | API del navegador para detectar cuándo un elemento entra o sale del viewport |

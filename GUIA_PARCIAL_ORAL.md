# Guía Completa — Parcial Oral Programación Web 2026
## Proyecto: taiko nina — E-commerce de Moda

---

## MOMENTO 1: Arquitectura y Puesta en Producción

### ¿De qué trata taiko nina?
Es un e-commerce de indumentaria "luxury" centrado en el minimalismo. Originado como un proyecto con HTML/CSS/JS base, migró 100% a un ecosistema moderno utilizando **Next.js 15 (App Router)** y **React 19** para asegurar mayor escalabilidad, modularidad y excelente performance.

### ¿Qué tecnología compone el proyecto?
- **Next.js 15:** Framework de React con Server y Client Components.
- **TailwindCSS:** Estilos, animaciones e utilidades rápidas integradas al flujo de Next.js.
- **Supabase:** Plataforma Backend-as-a-Service, provee base de datos PostgreSQL en la nube y el esquema de autenticación.
- **Mercado Pago:** SDK nativo manejado desde el lado del servidor para garantizar cobros seguros.
- **Vercel:** Plataforma de hosting y CI/CD (Continuous Deployment). 

### Organización del Proyecto en Next.js
*   `/app`: Aquí viven las páginas (`page.js`) y layouts (`layout.js`). El router asigna las URLs (Ej: `app/shop/page.js` es `/shop`).
*   `/components`: Elementos visuales reutilizables: `Navbar.jsx`, `Footer.jsx`, `ProductCard.jsx`.
*   `/context`: Contenedor del estado global con la *Context API* (`AppContext.jsx`).
*   `/lib`: Clientes de infraestructura técnica (ej: `supabase.js`).
*   `/legacy_vanilla`: Código viejo como respaldo histórico de la cursada.

---

## MOMENTO 2: Flujo y Experiencia de Usuario (Paso a Paso)

### 1. El usuario entra en la web (El ciclo de Next.js)
Escribe la URL y llega a `taiko-nina.vercel.app`. El servidor Next.js de Vercel evalúa la petición. Al ser "App Router", el `layout.js` abraza a la página principal `page.js`. Como estas páginas utilizan el directivo `'use client'` (Client Components), React toma las riendas y renderiza con interacción instántanea en el navegador.

### 2. Sincronización del Estado Global (React Context)
Apenas carga el `layout.js`, el usuario es envuelto en un **Provider** (`AppContext`).
Este contexto ejecuta una de las cosas más importantes (vía `useEffect`): se fija si en el **`localStorage`** del navegador hay un carrito guardado anteriormente, y verifica con Supabase si el usuario tiene una sesión activa (Token en cookies). Todo el frontend empieza a reaccionar a esta data y actualiza el contador de la bolsita en el menú automáticamente.

### 3. Cargar la Colección Dinámica (Fetch & Hooks)
Al dirigirse al `<Shop />` (`/shop`):
1.  Se dispara un `useEffect` que realiza un `supabase.from('products').select('*')`.
2.  Next.js recibe el Array de productos y lo guarda en su estado (`useState`).
3.  La variable `filteredProducts` reactivamente construye cada `<ProductCard />` basándose en los filtros elegidos en tiempo real por el usuario.

### 4. Animaciones "Scroll"
Las *product cards* cuentan con clases como `fade-up`. Cuando llegan, un `IntersectionObserver` de Javascript detecta su entrada en pantalla y les transfiere visibilidad (quitando su opacidad y transformaciones), dándole ese toque "cinemático" a la marca.

### 5. Checkout Seguro (Serverless API)
Cuando el usuario aprieta *"Checkout Securely"* en el sidebar:
1.  Se junta todo el `cart` (Estado global provisto por el context) y se manda una petición HTTP `POST` a `/api/checkout`.
2.  El archivo `app/api/checkout/route.js` intercepta la petición. Al ser una ruta de API de Next.js, la lógica **ocurre en el servidor, no en el navegador**. 
3.  Aprovecha esa zona segura para leer tu token secreto (`MP_ACCESS_TOKEN`) desde las variables de entorno sin que nunca llegue la clave a manos del usuario. 
4.  Le exige a Mercado Pago generar un enlace (`init_point`), devuelve esa URL blanca, y el fronend redirige exitosamente a la pasarela de pago. 

---

## MOMENTO 3: Conceptos Orales "React/Next.js" (Lo más Tomado)

### ¿Qué ganaste pasando el proyecto a Next.js / React en lugar de tu versión inicial?
"La modularidad y reactividad".
En lugar de repetir el HTML del Nav o Footer, logré aislar todo en `<Navbar />` y `<Footer />`. El pase de datos es directo como "Props", y gracias a *Hooks* como `useState` y `useEffect`, cuando un usuario busca o actualiza el carrito, el *Virtual DOM* de React inyecta los visuales inmediatamente sin recargar páginas ni ensuciarse reconstruyendo `<li>` infinitos con HTML puro en grandes archivos JS.

### ¿Por qué guardaste el Carrito en el `localStorage` en vez de Supabase?
Porque el carrito es una "intención de compra" temporal. Gastar recursos golpeando a la base de datos ralentizaría la experiencia, mientras que persistir localmente es instantáneo. Sólo en el *Checkout* se manda la información a un servidor (Mercado Pago).

### Diferencia entre Server y Client Components
- **Client Components (`'use client'`):** Necesarios si querés interactuividad en el DOM: `onClick`, `useState`, `IntersectionObserver`. Son ejecutados y resueltos por el JS del Navegador.
- **Route Handlers / Serverless Functions (`/api/checkout`):** Lógica privada. Ocultan contraseñas y protegen transacciones comunicándose directo servidor-a-servidor (Nuestro código a Mercado Pago). 

---

## Conceptos Clave (Glosario Rápido)

- **DOM Virtual:** Concepto de React. Una réplica inteligente del DOM que sólo actualiza lo que verdaderamente se modificó ahorrando muchísimos cálculos a la computadora.
- **Props (Propiedades):** Parámetros que reciben los componentes visuales para pintarse con variables distintas en cada uso. 
- **Array Map:** Función clave en React para generar listas en pantalla. (`products.map(p => <ProductCard p={p}/>)`).
- **Environment Variables (`.env.local`):** Textos con paswords o licencias resguardados fuera de GitHub y protegidos en la pestaña "Settings" del alojamiento de Vercel.

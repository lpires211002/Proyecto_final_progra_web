# taiko nina | Atelier Collection

E-commerce moderno construido con **Next.js 15 (App Router)**, diseñado bajo una estética minimalista y un riguroso sistema de componentes en React.

## 🚀 Tecnologías Principales

- **Frontend:** Next.js 15, React 19, TailwindCSS v4.
- **Backend & Base de Datos:** Supabase (PostgreSQL, Autenticación).
- **Pasarela de Pagos:** Mercado Pago SDK (Integrado en Serverless API Routes).
- **Estado Global:** React Context API para persistencia de Session y Shopping Cart.

## 📦 Estructura del Proyecto

- `app/` → Rutas, páginas y layouts principales (Home, Shop, Outfits, API Routes).
- `components/` → Componentes de interfaces reutilizables (Navbar, ProductCard, Modals).
- `context/` → Manejo de estado global (AppContext).
- `lib/` → Configuración de clientes externos (Supabase).
- `legacy_vanilla/` → (Backup) Código fuente de la primera versión sin frameworks.

## 💻 Desarrollo Local

Para correr este proyecto en tu computadora:

1. Instalar dependencias:
```bash
npm install
```

2. Configurar las variables de entorno (`.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_aqui
MP_ACCESS_TOKEN=tu_token_aqui

# URL pública y estable del deploy (evita redirecciones de MP a URLs de prueba)
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app

# (Opcional pero recomendado) Service Role Key de Supabase.
# La usa el servidor para registrar/confirmar órdenes salteando RLS.
# Si no se define, se usa la anon key con las policies del script SQL.
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
```

3. Iniciar el servidor local:
```bash
npm run dev
```

Abri [http://localhost:3000](http://localhost:3000) para ver la tienda.

## 🔐 Panel de administración

La app tiene un panel de administración protegido por rol (`superadmin`), disponible en `/admin`.
Cuando iniciás sesión con una cuenta superadmin aparece el botón **Admin** en la barra de navegación.

**Cuenta de administrador (demo/corrección):**

| Email | Contraseña |
|-------|-----------|
| `superadminprograweb@gmail.com` | `123456` |

**Secciones del panel:**
- **Outfits** (`/admin/outfits`) → alta/edición/baja de looks y sus productos.
- **Productos y stock** (`/admin/products`) → CRUD de productos (nombre, precio, categoría, color, descripción, imagen por URL o upload) y stock por talle (xs/s/m/l).
- **Resumen de ventas** (`/admin/sales`) → facturación, órdenes, ticket promedio, unidades y productos más vendidos, leídos de la tabla `orders`.

**Puesta en marcha (una sola vez):**
1. En Supabase → **SQL Editor**, ejecutar `supabase_admin_panel.sql`. Esto:
   - asigna el rol `superadmin` a `superadminprograweb@gmail.com`,
   - habilita la escritura de `products` sólo para superadmin,
   - crea las tablas `orders` y `order_items` con sus policies.
2. (Opcional) Para subir imágenes de producto desde el panel, ejecutar `supabase_storage_product_images.sql` (crea el bucket público `product-images` y sus permisos). Si no, se usa la imagen por URL.
3. (Recomendado) Definir `SUPABASE_SERVICE_ROLE_KEY` y `NEXT_PUBLIC_APP_URL` en el entorno (local y Vercel).

**Ventas y webhook de Mercado Pago:**
El checkout registra cada orden como `pending`, setea `external_reference` (id de la orden) y `notification_url` → `/api/webhook`. Tras el pago, MP redirige a `back_urls` absolutas: `/pago-completado`, `/pago-fallido` o `/pago-pendiente` (con `auto_return: 'approved'`). Cuando MP confirma el pago, el webhook marca la orden como `approved` y se refleja en el resumen de ventas.

**Pagos de prueba (sandbox):** para probar sin plata real, usar credenciales de **usuarios de prueba** (vendedor + comprador) creados desde la cuenta de developer de MP, no las de la cuenta real. Se ponen las credenciales del **vendedor de prueba** en `MP_ACCESS_TOKEN`/`MP_PUBLIC_KEY`, y se paga logueado como el **comprador de prueba** con una tarjeta de prueba (nombre del titular `APRO` para aprobar el pago). El error "una de las partes es de prueba" aparece cuando se mezclan credenciales reales con cuentas/tarjetas de prueba. Tarjetas: https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/test-cards

## 🌐 Deploy
La aplicación está configurada para **Continuous Deployment (CD)** al hacer push a la rama principal en GitHub, impactando automáticamente en los servidores de **Vercel**.

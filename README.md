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
2. Ejecutar `supabase_stock_on_sale.sql` (descuenta el stock del talle vendido cuando el pago se aprueba, de forma idempotente).
3. (Opcional) Para subir imágenes de producto desde el panel, ejecutar `supabase_storage_product_images.sql` (crea el bucket público `product-images` y sus permisos). Si no, se usa la imagen por URL.
4. (Recomendado) Definir `SUPABASE_SERVICE_ROLE_KEY` y `NEXT_PUBLIC_APP_URL` en el entorno (local y Vercel).

**Ventas y webhook de Mercado Pago:**
El checkout registra cada orden como `pending`, setea `external_reference` (id de la orden) y `notification_url` → `/api/webhook`. Tras el pago, MP redirige a `back_urls` absolutas: `/pago-completado`, `/pago-fallido` o `/pago-pendiente` (con `auto_return: 'approved'`). Cuando MP confirma el pago, el webhook marca la orden como `approved`, descuenta el stock del talle vendido (función `apply_order_stock`, idempotente) y se refleja en el resumen de ventas.

**Pagos de prueba (sandbox — para la corrección):**
El pago se prueba en el entorno de test de Mercado Pago, sin plata real. El vendedor usa credenciales de **usuario de prueba**; para pagar hay que loguearse con el **comprador de prueba** (no una cuenta real), si no MP tira "una de las partes es de prueba".

1. En una ventana de **incógnito**, entrar a la tienda, agregar un producto y hacer checkout.
2. En Mercado Pago, iniciar sesión con el **comprador de prueba**:
   - Usuario: `TESTUSER2813426909791848214`
   - Contraseña: `XljCkLo6TN`
3. Pagar con una **tarjeta de prueba**, titular **APRO** (pago aprobado), DNI `12345678`:
   - Mastercard `5031 7557 3453 0604` · CVV `123` · venc `11/30`
4. El pago se aprueba → redirige a `/pago-completado` → el webhook confirma la orden → aparece en `/admin/sales`.

> Credenciales de test de MP (sandbox), sólo para la corrección. Lista completa de tarjetas: https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/test-cards

## 🌐 CI/CD
- **CI** — GitHub Actions (`.github/workflows/ci.yml`): en cada Pull Request y en push a `main`/`react` corre `lint` (informativo) y `build`. Si el build falla, el check queda en rojo. Como todas las páginas que consultan la BD son `force-dynamic`, el build no necesita variables de entorno.
- **CD** — Vercel: cada push despliega automáticamente y cada PR genera un deploy de **preview**.

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
```

3. Iniciar el servidor local:
```bash
npm run dev
```

Abri [http://localhost:3000](http://localhost:3000) para ver la tienda.

## 🌐 Deploy
La aplicación está configurada para **Continuous Deployment (CD)** al hacer push a la rama principal en GitHub, impactando automáticamente en los servidores de **Vercel**.

# Revisión del proyecto vs. grilla — taiko nina

_Auditoría del código real contra la rúbrica del curso (E1–E6 + criterios transversales). Recordá que la grilla pide **EXCELENTE en los 5 criterios transversales** para aprobar._

## Veredicto rápido

| Ítem | Estado | Riesgo |
|------|--------|--------|
| E1 · Repo + pipeline + preview | 🟢 Muy bueno | CI agregado (GitHub Actions: lint+build en PRs); CD por Vercel |
| E2 · Landing + vistas responsivas | 🟢 Muy bueno | Accesibilidad: `alt` vacíos, `<img>` en vez de `next/Image` |
| E3 · Formularios dinámicos + fetch + validación | 🟡 Bueno | **Form de contacto muerto** (no valida ni envía) |
| E4 · Catálogo + API | 🟢 Muy bueno | — |
| E5 · CRUD Supabase + admin | 🟢 Excelente | — |
| E6 · Checkout + webhook | 🟢 Excelente | — |
| Funcionalidad (40%) | 🟢 Alta | Solo el form de contacto no funciona |
| Código / Estructura (20%) | 🟡 Bueno | `npm run lint` falla: **8 errores** |
| Interfaz / Accesibilidad (15%) | 🟡 Bueno | `alt`, labels en forms, `lang="en"` con contenido bilingüe |
| Despliegue (15%) | 🟢 Excelente | — |
| Documentación (10%) | 🟢 Muy bueno | — |

**Los tres puntos que conviene cerrar antes de la defensa:** (1) form de contacto, (2) CI en GitHub Actions, (3) limpiar los errores de lint.

---

## Entregables

### E1 · Repo + pipeline + preview (10%)
- ✅ Repo operativo en GitHub, PR #1 abierto con checklist.
- ✅ **Preview por PR**: Vercel genera un deploy de preview por cada push/rama (visto en la lista de Deployments).
- ✅ **CI/CD**: **CD** por Vercel + **CI** con GitHub Actions (`.github/workflows/ci.yml`) que corre `lint` (informativo, no bloquea) y `build` en cada PR y push a `main`/`react`.

### E2 · Landing + vistas clave responsivas (15%)
- ✅ Maquetado semántico: `<section>`, `<h1>`–`<h4>`, `<nav>`, `<footer>`, `<main>`.
- ✅ SEO fuerte: `metadata` con Open Graph/Twitter, `sitemap.js`, `robots.js`, canonical, `next/font` self-hosted.
- ✅ Responsive: grids `md:`, hero fluido; búsqueda y carrito ya corregidos en mobile.
- 🟡 Accesibilidad/performance: varias `<img alt="">` (landing e `inspo`) sin texto alternativo; en la landing se usa `<img>` en vez de `next/Image`.
- 🟡 La sección "Novedades" de la home usa **4 productos hardcodeados** (no del catálogo real).

### E3 · Formularios dinámicos con fetch + validación (15%)
- ✅ **AuthModal**: login/registro con `required`, `fetch` a Supabase Auth y manejo de errores.
- ✅ **Newsletter (Footer)**: `preventDefault`, insert a Supabase, valida email, detecta duplicados y da feedback.
- ✅ **Admin (productos/outfits)**: formularios dinámicos con validación y persistencia.
- ❌ **Formulario de Contacto (`/contact`): no funciona.** El botón es `type="button"` sin handler, sin validación y sin `fetch`. Es una página visible en el menú, así que se nota.
- **Acción:** hacerlo funcional (validación + guardado/fetch + mensaje de éxito/error).

### E4 · Catálogo navegable + API básica (20%)
- ✅ Catálogo navegable: `/shop` con filtros (categoría, color, talle, orden), `/product/[name]`, búsqueda y `/outfits`.
- ✅ API interna: `/api/checkout` y `/api/webhook` con lógica funcional (precios verificados server-side, confirmación de pago).
- ✅ Checklist en el PR.
- Nota: los productos se leen directo de Supabase en Server Components (patrón válido y moderno).

### E5 · CRUD funcional en Supabase + admin (20%)
- ✅ BD modelada: `products`, `outfits`, `outfit_products`, `orders`, `order_items`, `user_roles`, `profiles`, `newsletter_subscribers`.
- ✅ CRUD completo: productos (alta/edición/baja + stock por talle) y outfits.
- ✅ Persistencia real + descuento de stock en la venta.
- ✅ Panel admin protegido por rol `superadmin` con RLS. **Credenciales documentadas** para la corrección.

### E6 · Checkout + webhook funcionales (20%)
- ✅ Checkout con Mercado Pago (preferencia, `external_reference`, precios validados en el servidor).
- ✅ Webhook confirma el pago, persiste la orden y **descuenta stock de forma idempotente**.
- ✅ Redirección a páginas dedicadas (`/pago-completado`, `/pago-fallido`, `/pago-pendiente`) con `auto_return`.
- ✅ Demo probada (dinero en cuenta y tarjeta APRO).

---

## Criterios transversales

- **Funcionalidad (40%):** el flujo e-commerce completo funciona en producción. Único hueco: el form de contacto.
- **Código / Estructura (20%):** buena separación (`app/`, `components/`, `context/`, `lib/`). Pero `npm run lint` termina con **8 errores** (setState dentro de effects en `AppContext`/`SearchSidebar`, comillas sin escapar en `page.js`/`inspo`) y hay `<img>` sin optimizar. Si el profe corre `npm run lint`, ve errores.
- **Interfaz / Accesibilidad (15%):** visualmente muy cuidada y coherente. Accesibilidad mejorable: `alt` descriptivos, `label`/`aria-label` en inputs, `lang` del `<html>`.
- **Despliegue (15%):** público y estable en Vercel, con deploy continuo. Fuerte.
- **Documentación (10%):** README completo (setup, panel admin, MP, stock, credenciales de prueba) + `diagrama_mermaid.txt` + guía oral.

---

## Quick-wins priorizados

1. **Form de contacto funcional** — cierra el hueco de E3 y Funcionalidad. _(alta, ~15 min)_
2. **CI en GitHub Actions** (lint + build en cada PR) — cierra E1. _(alta, ~10 min)_
3. **Limpiar los 8 errores de lint** — sube Código/Estructura. _(media)_
4. **Accesibilidad**: `alt` descriptivos + `aria-label` en inputs de búsqueda/contacto. _(media)_
5. _(Opcional)_ "Novedades" desde el catálogo real y `next/Image` en la landing.

# Changelog de Redmotos — guía del proyecto

Sitio estático (Astro) que publica el changelog público de las apps de Redmotos.
Deploy: GitHub Pages en https://redmotos.github.io/changelog/, vía push a `main`
(workflow `.github/workflows/deploy.yml`, action `withastro/action@v3`).

**El repo es público y el sitio no tiene login.** Cualquier imagen o texto que se
publique es visible para cualquiera en internet — ver la sección de privacidad
más abajo antes de subir capturas de pantalla.

## Stack

- Astro 7 + `@astrojs/mdx` + content collections (`src/content.config.ts`).
- `zod` para el schema de frontmatter.
- `sharp` como servicio de optimización de imágenes de `astro:assets` (necesario
  para que `astro build` genere los `.webp`; sin él el build falla).
- Node 22 requerido (Astro 7 no corre en Node 20). El workflow de CI fija
  `node-version: "22"` explícitamente en el step de `withastro/action@v3`
  porque el runner de GitHub Actions trae Node 20 por defecto.
- pnpm (versión pineada en `package.json`, `packageManager: pnpm@8.15.6`).

## Modelo de datos

Un **release = una versión de `shoppingcart`** (el monorepo real en
`redmotos/shoppingcart`), no un release por app. Un mismo release puede tocar
varias áreas del producto a la vez (ej. Backoffice y Shopping Cart), así que el
frontmatter tiene `apps: string[]` (no `app: string`), donde cada string es el
`slug` de `src/data/apps.ts` (`shoppingcart`, `backoffice`, `catalogos`) y se
renderiza como badge de color.

Contenido en `src/content/changelog/*.mdx` (sin subcarpetas por app — se
aplanó a propósito). Rutas: `/[slug]/` (ej. `/v1-13-78/`), no `/[app]/[slug]/`.

Frontmatter de cada entrada:

```yaml
apps: [backoffice, shoppingcart]   # una o más, deben existir en src/data/apps.ts
version: "1.13.78"
date: 2026-09-12T17:06:10Z         # SIEMPRE con hora real (ISO), no solo la fecha
title: Título en infinitivo/impersonal, sin voseo ni "tú"
description: Un párrafo breve, mismo tono que el título
image: ./cover.png                 # opcional, portada para la card del timeline
tag: v1.13.78-odoo                 # opcional
```

**Importante sobre `date`:** el home ordena por `date` descendente (LIFO). Si
varios releases del mismo día llevan solo la fecha sin hora, el `sort` empata y
el orden visual pasa a depender del orden de archivos (no del cronológico
real). Usar siempre el timestamp completo de `publishedAt` que devuelve
`gh release view --json publishedAt`.

## Tono de la copy

- Títulos y `description`: infinitivo o impersonal, tercera persona. Nunca
  voseo ("cargá", "gestioná") ni "tú" directo ("puedes", "vas a ver").
  Ejemplos correctos: "Cargar imágenes de productos y gestionar catálogos
  asignados a clientes por lotes", "Se agregó...", "Permitir agregar...".
- Nada de emojis en encabezados (`## ✨ Nuevo` → `## Nuevo`).
- Escribir para el usuario final: evitar jerga interna (nombres de columnas de
  DB, endpoints, nombres de archivos internos) salvo que aporte contexto real.
- Secciones estándar dentro del body: `## Nuevo`, `## Correcciones`, `## Otros`
  (en ese orden, las que apliquen).

## Estructura del body (timeline de cambios + imágenes en contexto)

Cada cambio dentro de una sección es un `<ChangeItem>` con **título corto** +
una oración de descripción, envueltos en `<ul class="changes">` (da el punto y
la línea vertical). Si el cambio tiene captura(s), va inmediatamente un
`<ReleaseGallery>` con las imágenes de ese cambio puntual — nunca todas las
imágenes juntas al principio de la página.

```mdx
import ChangeItem from "../../components/ChangeItem.astro";
import ReleaseGallery from "../../components/ReleaseGallery.astro";
import miCaptura from "./v1-13-79-01.png";

## Nuevo

<ul class="changes">
  <ChangeItem title="Título corto del cambio">
    Oración describiendo el cambio, en el mismo tono del resto.

    <ReleaseGallery images={[miCaptura]} alt="Descripción de la imagen" />

  </ChangeItem>
</ul>
```

- `ReleaseGallery` (`src/components/ReleaseGallery.astro`) muestra como máximo
  2 imágenes en el preview (collage si son 2); si hay más, la 2ª miniatura
  muestra un overlay "+N". Al hacer click abre un lightbox (`<dialog>`) a
  pantalla completa con flechas para navegar **todas** las imágenes del grupo,
  no solo las visibles en el preview.
- Los imports de imágenes van arriba del `.mdx` (uno por archivo); el campo
  `image` del frontmatter es solo la portada que se ve en la card del home.

## Flujo para agregar un release nuevo (trayendo datos reales de GitHub)

1. `gh release list --repo redmotos/shoppingcart --limit 5` para ver qué hay.
2. Por cada release: `gh release view <tag> --repo redmotos/shoppingcart --json body,publishedAt` —
   el body trae la lista de PRs ("What's Changed").
3. Por cada PR: `gh pr view <n> --repo redmotos/shoppingcart --json title,body`
   para sacar el contexto real (qué/por qué) y redactar título+descripción con
   el tono de arriba. Si el PR menciona "ver capturas en los comentarios",
   revisar también `gh api repos/redmotos/shoppingcart/issues/<n>/comments`.
4. Buscar imágenes: `grep -oE 'user-attachments/assets/[a-f0-9-]+'` sobre el
   body/comentarios de cada PR.
5. Descargar cada imagen (el link de `user-attachments` da 404 sin sesión):
   ```bash
   TOKEN=$(gh auth token)
   curl -sL -H "Authorization: Bearer $TOKEN" -o out.png "https://github.com/user-attachments/assets/<id>"
   ```
6. **Antes de publicar cualquier captura**, revisarla (Read/mirar la imagen) y
   confirmar con el usuario si aparecen datos reales de clientes (nombre,
   teléfono, dirección, email) — el sitio es público. No asumir que "son
   datos de prueba"; preguntar.
7. Copiar las imágenes a `src/content/changelog/` junto al `.mdx`, escribir el
   contenido siguiendo la estructura de arriba, y `pnpm build` para validar.

## Comandos útiles

- `pnpm build` — corre `astro check && astro build`; siempre validar antes de
  dar por buena una entrada nueva.
- `pnpm exec astro dev --host` — levanta el dev server en todas las interfaces
  de red (por defecto solo escucha en `localhost`). Usar `astro dev stop`
  antes de relanzar, sobre todo después de tocar `content.config.ts`: el
  content store queda cacheado y puede mostrar releases "vacíos" si no se
  reinicia.
- `pnpm exec astro dev status` — confirma si el dev server está corriendo y en
  qué IPs.

## Al terminar cambios de contenido/diseño

`git add -A && git commit && git push origin main` dispara el deploy. Vigilar
el run con `gh run list --repo redmotos/changelog --limit 3` y
`gh run watch <id> --repo redmotos/changelog --exit-status` — si falla por
versión de Node, revisar que `deploy.yml` siga fijando `node-version: "22"`.

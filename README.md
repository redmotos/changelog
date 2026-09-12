# changelog

Novedades de las apps de Redmotos, publicadas con [Astro](https://astro.build) en GitHub Pages.

## Agregar una entrada

Cada release es un archivo `.mdx` en `src/content/changelog/<app>/<version>.mdx`.

```
src/content/changelog/shoppingcart/v1-13-72.mdx
```

Frontmatter:

```yaml
---
app: shoppingcart # debe existir en src/data/apps.ts
version: "1.13.72" # sin la "v"
date: 2026-09-12
tag: v1.13.72-odoo # opcional, tag real del release
---
```

Cuerpo agrupado por tipo, mismo vocabulario que los commits (`feat`, `fix`, `chore`):

```markdown
## ✨ Nuevo

- ...

## 🐛 Arreglos

- ...

## 🔧 Otros

- ...
```

GIFs e imágenes van en `src/assets/gifs/<app>/<version>/` y se referencian con ruta relativa.
Nota: al ser `.mdx`, los comentarios se escriben `{/* así */}`, no con `<!-- -->`.

## Agregar una app nueva

Sumar una entrada en `src/data/apps.ts` (`slug`, `name`, `description`, `color`) y crear la carpeta
`src/content/changelog/<slug>/` con su primera entrada.

## Desarrollo local

```bash
pnpm install
pnpm dev
```

## Deploy

Push a `main` dispara el workflow de GitHub Actions que buildea y publica en GitHub Pages
(`https://redmotos.github.io/changelog/`).

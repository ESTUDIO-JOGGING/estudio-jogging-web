# Estudio Jogging — Sitio web

Sitio web de **Estudio Jogging**, estudio creativo de diseño, comunicación y tecnología 3D.
Diseño y desarrollo: **Andrea Florentin**.

Publicado en **https://estudiojogging.netlify.app** (cada cambio en `main` se publica solo, vía Netlify).

---

## Páginas

- **Home** (`app/page.jsx`): hero ilustrado con botones sobre el escritorio, frase "A tiempos rápidos, movimientos suaves", collage del equipo, lista de servicios, marcas con las que trabajamos, reels y footer.
- **Servicios**, **Nosotros** y **Proyectos** (`app/servicios`, `app/nosotros`, `app/proyectos`): páginas internas con la línea que se dibuja al hacer scroll.
- **Un proyecto** (`app/proyectos/[slug]`): se arma con bloques según el material de cada caso (video con relato, piezas en fila, carrusel, dato destacado).

## Dónde se editan los contenidos

| Qué | Archivo |
|---|---|
| Proyectos (textos, ficha y bloques) | `lib/proyectos.js` |
| Reels (videos, títulos y descripciones) | `lib/reels.js` |
| Servicios | `components/ServiceList.jsx` |
| Marcas, redes, WhatsApp | `lib/data.js` |
| Imágenes y videos de cada proyecto | `public/media/proyectos/<proyecto>/` |
| Colores y tipografías de la marca | `BRAND.md` |

## Stack

- **Next.js 15** (App Router, exportado como sitio estático) y **React 19**
- **CSS** con variables, en hojas parciales importadas desde `app/globals.css`
- **GSAP** (ScrollTrigger, InertiaPlugin) para las animaciones y **Lenis** para el scroll suave

## Desarrollo

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # genera el sitio estático en out/
node lib/runPath.test.mjs   # pruebas del recorrido de la línea de las páginas internas
```

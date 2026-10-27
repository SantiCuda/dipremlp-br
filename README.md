# Landing Diprem (BR) — prototipo

Sitio estático: `index.html` + `styles.css` + `script.js`. Sin build.

## Reemplazar assets
| Archivo | Uso |
|---|---|
| `assets/logo-diprem.svg` / `logo-diprem-branco.svg` | Logo header / footer (los actuales son aproximaciones, usar el oficial) |
| `assets/hero.jpg`, `assets/footer.jpg` | Fondos (se desenfocan y tiñen de azul por CSS) |
| `assets/emergencia.jpg` | Foto RCP (~800×750) |
| `assets/clientes/{pampa,bayer,pepsico,siemens,cfe}.png` | Logos clientes (si falta, muestra el nombre) |

## Formulario
`data-endpoint` vacío en `<form>` = modo prototipo (solo `console.info`).
Para producción poner la URL del POST (WordPress / Formspree).

## Deploy
- **Vercel**: importar repo → Framework "Other" → deploy.
- **GitHub Pages**: Settings → Pages → Branch `main` / root.

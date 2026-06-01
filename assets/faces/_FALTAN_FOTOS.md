# 📸 Fotos de caras

Esta carpeta (`PAGINA WEB/web/assets/faces/`) contiene las fotos de cara que
aparecen en la cabecera de cada ficha. **Aquí mismo es donde van las imágenes.**

## ✅ Estado: 70 / 70 personas con foto (completo)

No falta ninguna. Este archivo se queda como guía por si en el futuro añades
nodos nuevos en las timelines.

## Cómo añadir / reemplazar una foto

1. Guarda la imagen **en esta carpeta** con el nombre **exacto del `id` del
   nodo** y extensión `.jpg`, `.png` o `.webp` (vale mayúscula `.PNG`).
   Ejemplos: `bob_lazar.png`, `nick_pope.PNG`.
2. Desde `PAGINA WEB/web/` ejecuta:
   ```
   node enrich-data.js
   ```
   Autodetecta cualquier archivo nombrado como un id de nodo y lo asigna a su
   ficha (no hay que editar nada más).
3. `git add . && git commit && git push` → Cloudflare Pages redespliega solo.

> El nombre del archivo debe ser el **id del nodo** (no el nombre de la
> persona). Para saber el id de un nodo nuevo: es el slug de su `Headline`
> (lo antes de los `:`) en el xlsx de la timeline, en minúsculas y con guiones
> bajos. Si dudas, ejecuta `node enrich-data.js` y mira si lo recoge.
>
> ⚠️ Cloudflare distingue mayúsculas/minúsculas: el script ya guarda la ruta
> con la extensión tal cual está el archivo, así que no la cambies a mano.

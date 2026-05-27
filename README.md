# Redescubriendo · Mapa galáctico UAP/NHI

Web estática que visualiza el corpus de vídeos del podcast **Redescubriendo**
como una galaxia interactiva: personas, eventos, programas, agencias y canales
orbitan alrededor del fenómeno. Los nodos se conectan por co‑ocurrencia en los
resúmenes de los vídeos del corpus.

```
                                    npm run build
┌─────────────────────────────┐         │          ┌──────────┐    ┌────────────┐
│ Transcripciones/            │         │          │ data.js  │ →  │ index.html │
│   Videos_RDC.xlsx (corpus)  │ ───┐    │          └──────────┘    └────────────┘
├─────────────────────────────┤    │    │
│ LINEAS DE TIEMPO/           │    ├───►┤
│   Personas.xlsx             │    │    │          (output, autogenerado;
│   Eventos.xlsx              │ ───┘    │           NO editar a mano)
│   Grupos_y_Programas.xlsx   │
└─────────────────────────────┘
        ↑
        TÚ EDITAS AQUÍ (una sola copia, sin duplicaciones)
```

- Fuentes únicas → `Transcripciones/Videos_RDC.xlsx` + los 3 xlsx de
  `LINEAS DE TIEMPO/`. **Las editas tú directamente.**
- `data.js` → derivado, lo genera `scripts/build-data.js`. **No editar a mano.**
- `index.html` + `*.jsx` → la app, lee `window.RDC_DATA` y dibuja la galaxia.

---

## Estado actual

| Métrica | Valor |
|---|---|
| Vídeos procesados (`Videos_RDC.xlsx`) | **366** |
| Personas (timeline) | 70 |
| Eventos (timeline) | 66 |
| Agencias + Programas (timeline) | 76 |
| Canales (mapeados a brazos de la galaxia) | 15 / 13 |
| Nodos totales en el grafo | 228 |
| Edges (co‑ocurrencias + bridges) | 561 |
| Hilos transversales curados | 12 |

---

## Flujo de actualización

### 1. Añadir un vídeo nuevo al corpus

Edita `Transcripciones/Videos_RDC.xlsx` y añade una fila al final, manteniendo
numeración secuencial. Columnas:

| Columna | Contenido |
|---|---|
| `Nº` | Número secuencial. |
| `Título del Video` | Título exacto de YouTube. |
| `Canal` | **Tiene que coincidir** con uno de los 15 canales registrados en `CHANNELS` dentro de `scripts/build-data.js`. Si introduces un canal nuevo, primero añádelo a esa lista. |
| `URL` | URL completa del vídeo. |
| `Fecha Guardado` | YYYY-MM-DD. |
| `Temas` | 1-3 temas separados por ` \| ` (ver lista en `CLAUDE.md`). |
| `Por qué lo guardé` | Razón editorial. |
| `Estado` | `Resumido` si tiene transcript procesado. |
| `Duración` | MM:SS. |
| `Resumen` | 2-3 párrafos (250-400 caracteres). |
| `Highlights` | 5-10 bullets con timestamps. |
| `Archivo Local` | Nombre del .txt en `Transcripciones/`. |
| `Episodio` | `(pendiente)` o el episodio al que pertenece. |
| `Fecha Procesado` | YYYY-MM-DD. |

### 2. Añadir una persona / evento / programa / agencia

Edita el xlsx correspondiente en `LINEAS DE TIEMPO/`:

- Persona → `ReDescubriendo Podcast- Personas.xlsx`
- Evento → `ReDescubriendo_Podcast-_Eventos.xlsx`
- Agencia o Programa → `ReDescubriendo_Podcast-_Grupos_y_Programas.xlsx`

Los tres comparten el formato de TimelineJS (KnightLab). **Columnas que
debes rellenar siempre:**

| Columna | Qué va aquí |
|---|---|
| `Year` | Año principal del nodo (numérico). |
| `Month`, `Day` | Opcional, mismo formato. |
| `Display Date` | Opcional, fecha legible si quieres anular el formateo de TimelineJS. |
| `Headline` | **`"Nombre: Rol corto"`** — el id se genera del slug del nombre. |
| `Text` | HTML rico (admite `<p>`, `<strong>`, `<em>`, `<u>`). |
| `Media` | URL del vídeo / imagen destacada que aparece en la ficha. |
| `Media Credit` | Crédito que sale al lado del botón ▶. |
| `Media Caption` | Pie corto del recurso. |
| `Type` | El **cluster**: `"Periodistas Clave"`, `"Crashes y Recuperaciones"`, `"Agencias de Inteligencia"`, etc. Marca el `group` del nodo y el hub al que cae si no tiene co-ocurrencias. |
| `Group` | **Tiene que ser igual a Type** — TimelineJS lo usa para asignar el carril horizontal. Si lo dejas vacío, la entrada cae en la línea base de la timeline pública. |
| `Background` | Color del card en la timeline (opcional). |

Reglas que aplica el build automáticamente:

- **Tipo del nodo**: el xlsx de Personas → `person`, el de Eventos → `event`, el de Grupos y Programas → `program` si `Type` matchea `/Programa|Marco Legisla|Precedente|Audiencias y Legisla/i`, si no `agency`.
- **ID**: slug del `Headline` antes de `:` (truncado a 50 chars). Colisiones se resuelven con sufijo `_event`, `_program`, `_org` o `_person`.
- **Bio**: el `Text` con HTML eliminado, conservando saltos `\n\n` entre párrafos.

### 3. Tras cualquier cambio en los xlsx fuente

```bash
cd PAGINA\ WEB/web
npm run build           # regenera data.js
git add data.js         # commit solo el output
git commit -m "..."
git push                # Cloudflare Pages redespliega automáticamente
```

Las timelines públicas (Personas, Eventos, Grupos) son embeds de Google Sheets
publicados. Para que los cambios al xlsx se vean en redescubriendo.com,
**tienes que reimportar el xlsx a la Google Sheet correspondiente** (Archivo
→ Importar → Reemplazar hoja de cálculo). El URL del embed no cambia.

### 4. Si añades un nodo y no quiere salir conectado

El script reconoce un nodo en un vídeo cuando alguno de sus **aliases** aparece
en `titulo + resumen + highlights` como palabra delimitada.

- Para **personas**, el script genera automáticamente: nombre completo + último apellido (si tiene ≥4 chars y no está en `BANNED_WORDS`).
- Para el resto, genera el nombre tal cual.

Si un nodo nuevo no se conecta al grafo (sale solo, en degree 0), añade entradas
en `ALIASES_BY_ID` de [scripts/build-data.js](scripts/build-data.js):

```js
const ALIASES_BY_ID = {
  // ...
  el_id_de_tu_nodo: ['palabra clave 1', 'siglas', 'apellido'],
  // ...
};
```

Si un alias muy genérico produce falsos positivos (matchea cosas que no son),
añádelo a `BANNED_WORDS`.

### 5. Si añades un canal nuevo al corpus

Edita la constante `CHANNELS` en [scripts/build-data.js](scripts/build-data.js) y añade:

```js
{
  id: 'ch_slug_del_canal',
  name: 'Nombre visible en la ficha',
  corpusName: 'EXACTAMENTE como aparece en la columna Canal de Videos_RDC.xlsx',
  bloc: 6   // brazo de la galaxia (1-13). Reutiliza el bloc de un canal afín
            // si ya hay 13 brazos ocupados (varios canales pueden compartir bloc).
}
```

El sidebar usa `CANAL_LIST` en [panels.jsx](panels.jsx) para mostrar los chips
de canal — si añades un bloc nuevo (14+), tendrás que ampliar también
`CANAL_LIST` y `NUM_ARMS` en [graph.jsx](graph.jsx).

---

## Threads (hilos transversales)

Los **threads** son lecturas curadas del corpus: una lista de IDs de nodos que
cuentan juntos una historia (la "Era de los Denunciantes", "AATIP y los
programas serios", "Casos clásicos", etc.). El sidebar los muestra como botones
y al hacer click sólo se ven esos nodos.

**No se autogeneran.** Están definidos a mano dentro del array `THREADS` en
[scripts/build-data.js](scripts/build-data.js). El campo `blocs` de cada thread
se recalcula automáticamente como unión de los `blocs` de sus nodos.

### Añadir un thread

```js
{
  id: 't_nombre_corto',           // único, prefijo t_ por convención
  title: 'Título visible en el sidebar',
  desc:  'Una frase larga explicando qué une a estos nodos.',
  nodes: [
    'id_del_nodo_1',
    'id_del_nodo_2',
    // …
  ]
}
```

Si referencias un ID que no existe en el grafo, el build lo avisa con un
`WARN thread "t_xxx" referencia IDs inexistentes: …`. Compruébalo y o bien
añade el nodo a su xlsx, o corrige el ID.

---

## Estructura del repo

```
ReDesCubriendo/                       (carpeta-padre, NO está en git)
├── LINEAS DE TIEMPO/                 ← FUENTE de las 3 timelines
│   ├── ReDescubriendo Podcast- Personas.xlsx
│   ├── ReDescubriendo_Podcast-_Eventos.xlsx
│   └── ReDescubriendo_Podcast-_Grupos_y_Programas.xlsx
├── Transcripciones/                  ← FUENTE del corpus
│   ├── Videos_RDC.xlsx
│   └── ...
└── PAGINA WEB/web/                   ← ESTE REPO (Cloudflare Pages lo sirve)
    ├── index.html                   ← Entrypoint
    ├── style.css
    ├── data.js                      ← GENERADO. No editar.
    ├── app.jsx, graph.jsx, panels.jsx, chat.jsx, tweaks-panel.jsx
    ├── assets/                      ← Logos, iconos
    ├── scripts/
    │   └── build-data.js            ← Pipeline xlsx → data.js
    └── package.json                 ← Dep: xlsx
```

**Las fuentes (`LINEAS DE TIEMPO/`, `Transcripciones/`) están FUERA del repo
web**, en sus carpetas propias de trabajo. El script las lee con rutas
relativas. No hay duplicación.

---

## Pipeline interno de `build-data.js`

Para referencia rápida si tienes que tocar el script:

1. Lee `Transcripciones/Videos_RDC.xlsx` (corpus) y los 3 xlsx de `LINEAS DE TIEMPO/` (descarta la fila `Type === "title"`).
2. Por cada fila xlsx construye un nodo: `id = slugify(headline antes de ":")`, `name`, `role`, `type`, `group = Type`, `bio = stripHTML(Text)`, `year`, `media`, `mediaCredit`, `mediaCaption`. Resuelve colisiones de id.
3. Construye los 15 nodos `channel` desde la constante `CHANNELS`.
4. Construye aliases por nodo (default + extras de `ALIASES_BY_ID`, filtrados por `BANNED_WORDS`).
5. Por cada vídeo del corpus, detecta qué nodos están mencionados.
6. Edges:
   - **`related`**: par de nodos con ≥2 co‑ocurrencias.
   - **`mentioned_by`**: canal → nodo con ≥2 vídeos del canal que lo mencionan.
7. Calcula `blocs`, `canal` principal, `videos` (top 10 por nº), `videoCount`, `degree`.
8. **Bridge**: nodos sin ninguna edge `related` se conectan al hub de su mismo `group` (el que tenga más vídeos en ese grupo). Edge nota: "Misma categoría".
9. Threads: usa la lista curada `THREADS` y recalcula `blocs` por unión.
10. Antepone `the_phenomenon` como primer nodo y escribe `data.js`.

---

## Cosas a tener en cuenta

- **`data.js` se regenera completo cada vez.** Cualquier edición manual se pierde. Si necesitas un retoque ad‑hoc, hazlo en `build-data.js` y vuelve a ejecutar.
- **Las fuentes están fuera del repo.** Si alguien clona el repo y quiere reconstruir `data.js`, necesita acceso a las dos carpetas-hermanas (`LINEAS DE TIEMPO/`, `Transcripciones/`) — no las publicamos en git para no exponer los .xlsx con todo el contenido editorial. El `data.js` ya generado sí va al repo y es lo que sirve la web.
- **No hay tests.** Si algo se rompe, mira el log que imprime `npm run build` — debería decir `Threads OK (12 hilos, 0 IDs huérfanos)` y el recuento final debe parecerte razonable.

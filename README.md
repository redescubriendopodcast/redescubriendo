# Redescubriendo · Mapa galáctico UAP/NHI

Web estática que visualiza el corpus de vídeos del podcast **Redescubriendo**
como una galaxia interactiva: personas, eventos, programas, agencias y canales
orbitan alrededor del fenómeno. Los nodos se conectan por co‑ocurrencia en los
resúmenes de los vídeos del corpus.

```
┌────────────────────┐    npm run build    ┌──────────┐    abrir   ┌────────────┐
│  source/ (fuentes) │ ─────────────────► │ data.js  │ ──────────► │ index.html │
└────────────────────┘                     └──────────┘             └────────────┘
```

- `source/` → única fuente de verdad. **Tú la editas.**
- `data.js` → derivado, generado por `scripts/build-data.js`. **No editar a mano.**
- `index.html` + `*.jsx` → la app, lee `window.RDC_DATA` y dibuja la galaxia.

---

## Estado actual

| Métrica                                     | Valor   |
|---------------------------------------------|---------|
| Vídeos procesados (`corpus_full.json`)      | **366** |
| Personas (Personas.xlsx)                    | 70      |
| Eventos (Eventos.xlsx)                      | 66      |
| Agencias + Programas (GruposProgramas.xlsx) | 76      |
| Canales (mapeados a brazos de la galaxia)   | 15 / 13 |
| Nodos totales en el grafo                   | 228     |
| Edges (co‑ocurrencias + bridges)            | 560     |
| Hilos transversales curados                 | 12      |

---

## Flujo de actualización

### 1. Añadir un vídeo nuevo al corpus

Edita [source/corpus_full.json](source/corpus_full.json) y añade una entrada al
final del array, manteniendo numeración secuencial:

```json
{
  "n": "367",
  "titulo": "Título exacto del vídeo en YouTube",
  "canal": "Jesse Michels",
  "url": "https://www.youtube.com/watch?v=XXXXXXXXXXX",
  "fecha": "2026-05-26",
  "temas": "OVNI/UAP | Programas Secretos | Testimonios",
  "porque": "Razón por la que merece estar en el corpus.",
  "estado": "Resumido",
  "duracion": "112:20",
  "resumen": "2-3 párrafos densos (250-400 caracteres).",
  "highlights": "• [05:21] Bullet con timestamp\n• [16:40] Otro punto clave",
  "archivo": "Canal_Descripcion_2026-05-26.txt",
  "episodio": "(pendiente)",
  "procesado": "2026-05-26"
}
```

> El campo `canal` **tiene que coincidir exactamente** con uno de los 15
> canales registrados en `CHANNELS` dentro de [scripts/build-data.js](scripts/build-data.js).
> Si introduces un canal nuevo, primero añádelo a esa lista (ver más abajo).

### 2. Añadir una persona / evento / programa / agencia

Edita el `.xlsx` correspondiente:

- Persona → [source/Personas.xlsx](source/Personas.xlsx)
- Evento → [source/Eventos.xlsx](source/Eventos.xlsx)
- Agencia o Programa → [source/GruposProgramas.xlsx](source/GruposProgramas.xlsx)

Las tres hojas comparten el formato de TimelineJS (KnightLab). **Columnas que
debes rellenar siempre:**

| Columna           | Qué va aquí                                                          |
|-------------------|----------------------------------------------------------------------|
| `Year`            | Año principal del nodo (numérico).                                   |
| `Month`, `Day`    | Opcional, mismo formato.                                             |
| `Display Date`    | Opcional, fecha legible si quieres anular el formateo de TimelineJS. |
| `Headline`        | **`"Nombre: Rol corto"`** — el id se genera del slug del nombre.     |
| `Text`            | HTML rico (admite `<p>`, `<strong>`, `<em>`, `<u>`).                 |
| `Media`           | URL del vídeo / imagen destacada que aparece en la ficha.            |
| `Media Credit`    | Crédito que sale al lado del botón ▶.                                |
| `Media Caption`   | Pie corto del recurso.                                               |
| `Type`            | El **cluster**: "Periodistas Clave", "Crashes y Recuperaciones",     |
|                   | "Agencias de Inteligencia", etc. Marca el `group` del nodo y el      |
|                   | hub al que cae si no tiene co‑ocurrencias.                           |
| `Background`      | Color del card en la timeline (opcional).                            |

Reglas que aplica el build automáticamente:

- **Tipo del nodo**: `Personas.xlsx → person`, `Eventos.xlsx → event`,
  `GruposProgramas.xlsx → program` si `Type` matchea
  `/Programa|Marco Legisla|Precedente|Audiencias y Legisla/i`, si no `agency`.
- **ID**: slug del `Headline` antes de `:` (truncado a 50 chars). Colisiones se
  resuelven con sufijo `_event`, `_program`, `_org` o `_person`.
- **Bio**: el `Text` con HTML eliminado, conservando saltos `\n\n` entre
  párrafos.

### 3. Tras cualquier cambio en `source/`

```bash
npm run build      # regenera data.js
# revisa el resumen impreso (nodos / edges / threads, IDs huérfanos en threads)
git add data.js source/  # solo lo que tocaste
git commit -m "feat(corpus): añade vídeo #367 + persona X"
git push
```

### 4. Si añades un nodo y no quiere salir conectado

El script reconoce un nodo en un vídeo cuando alguno de sus **aliases** aparece
en `titulo + resumen + highlights` como palabra delimitada.

- Para **personas**, el script genera automáticamente: nombre completo + último
  apellido (si tiene ≥4 chars y no está en `BANNED_WORDS`).
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

### 5. Si añades un canal nuevo a `corpus_full.json`

Edita la constante `CHANNELS` en [scripts/build-data.js](scripts/build-data.js)
y añade:

```js
{
  id: 'ch_slug_del_canal',
  name: 'Nombre visible en la ficha',
  corpusName: 'EXACTAMENTE como aparece en corpus_full.json',
  bloc: 6   // brazo de la galaxia (1-13). Reutiliza el bloc de un canal afín
            // si ya hay 13 brazos ocupados (varios canales pueden compartir bloc).
}
```

El sidebar usa la constante `CANAL_LIST` de [panels.jsx](panels.jsx) para
mostrar los chips de canal — si añades un bloc nuevo (14+), tendrás que ampliar
también `CANAL_LIST` y `NUM_ARMS` en [graph.jsx](graph.jsx).

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
`WARN thread "t_xxx" referencia IDs inexistentes: …`. Cómpralo y o bien
añade el nodo a su xlsx, o corrige el ID.

### Modificar un thread existente

Añade o quita IDs del array `nodes`. Si renombras un thread, mantén el `id`
(es el que usa el frontend para selección persistente).

---

## Estructura del repo

```
web/
├── index.html              ← Entrypoint
├── style.css
├── data.js                 ← GENERADO. No editar.
├── data.js.backup-pre-build← Snapshot anterior al primer build automatizado
├── app.jsx                 ← App raíz (tabs, layout)
├── graph.jsx               ← Galaxia 3D en canvas
├── panels.jsx              ← Sidebar, panel de detalle, CANAL_LIST
├── chat.jsx                ← Chat overlay
├── tweaks-panel.jsx        ← Panel de configuración visual
├── assets/                 ← Logos, iconos
├── source/                 ← FUENTE. Tú editas esto.
│   ├── corpus_full.json
│   ├── Personas.xlsx
│   ├── Eventos.xlsx
│   ├── GruposProgramas.xlsx
│   └── _backup_*           ← Backups antes del primer build automatizado
├── scripts/
│   └── build-data.js       ← Pipeline xlsx + corpus → data.js
└── package.json            ← Solo dep: xlsx
```

---

## Pipeline interno de `build-data.js`

Para referencia rápida si tienes que tocar el script:

1. Lee `source/corpus_full.json` y los 3 xlsx (descarta la fila `Type === "title"`).
2. Por cada fila xlsx construye un nodo: `id = slugify(headline antes de ":")`,
   `name`, `role`, `type`, `group = Type`, `bio = stripHTML(Text)`, `year`,
   `media`, `mediaCredit`, `mediaCaption`. Resuelve colisiones de id.
3. Construye los 15 nodos `channel` desde la constante `CHANNELS`.
4. Construye aliases por nodo (default + extras de `ALIASES_BY_ID`, filtrados
   por `BANNED_WORDS`).
5. Por cada vídeo del corpus, detecta qué nodos están mencionados.
6. Edges:
   - **`related`**: par de nodos con ≥2 co‑ocurrencias.
   - **`mentioned_by`**: canal → nodo con ≥2 vídeos del canal que lo mencionan.
7. Calcula `blocs`, `canal` principal, `videos` (top 10 por nº), `videoCount`,
   `degree`.
8. **Bridge**: nodos sin ninguna edge `related` se conectan al hub de su mismo
   `group` (el que tenga más vídeos en ese grupo). Edge nota: "Misma categoría".
9. Threads: usa la lista curada `THREADS` y recalcula `blocs` por unión.
10. Antepone `the_phenomenon` como primer nodo y escribe `data.js`.

---

## Cosas a tener en cuenta

- **`data.js` se regenera completo cada vez.** Cualquier edición manual se
  pierde. Si necesitas un retoque ad‑hoc, hazlo en `build-data.js` y vuelve a
  ejecutar.
- **El JSON del corpus es la fuente más volátil**, los xlsx cambian poco. Cuida
  la coherencia del campo `canal` (debe estar en `CHANNELS.corpusName`).
- **No hay tests.** Si algo se rompe, mira el log que imprime `npm run build`
  — debería decir "Threads OK (12 hilos, 0 IDs huérfanos)" y el recuento final
  debe parecerte razonable.
- **Personas.xlsx, Eventos.xlsx, GruposProgramas.xlsx** son hojas de TimelineJS
  además de fuente para el grafo. Si las publicas como Google Sheet TimelineJS
  para los tabs de timeline, los IDs internos de TimelineJS (`_rn`) no afectan
  al grafo.

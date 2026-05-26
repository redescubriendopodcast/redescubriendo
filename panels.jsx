// DetailPanel + Sidebar + ThreadList components

function DetailPanel({ node, data, onSelect, onClose }) {
  if (!node) return null;
  const color = TYPE_COLORS[node.type];
  const typeLabel = {
    person: "Persona", agency: "Agencia / Grupo", event: "Evento",
    program: "Programa", concept: "Concepto / Tema", channel: "Canal",
    phenomenon: "Núcleo galáctico"
  }[node.type];

  // find connections
  const connections = [];
  for (const e of data.edges) {
    if (e[0] === node.id) {
      const other = data.nodes.find(n => n.id === e[1]);
      if (other) connections.push({ node: other, kind: e[2], note: e[3], dir: "out" });
    } else if (e[1] === node.id) {
      const other = data.nodes.find(n => n.id === e[0]);
      if (other) connections.push({ node: other, kind: e[2], note: e[3], dir: "in" });
    }
  }
  // sort: same-type first by name, others after
  connections.sort((a, b) => {
    const ta = a.node.type, tb = b.node.type;
    const order = ["person","agency","event","program","channel","concept"];
    return order.indexOf(ta) - order.indexOf(tb) || a.node.name.localeCompare(b.node.name);
  });
  // group by other node type
  const grouped = {};
  for (const c of connections) {
    if (!grouped[c.node.type]) grouped[c.node.type] = [];
    grouped[c.node.type].push(c);
  }
  const typeOrder = ["person","agency","event","program","channel","concept"];

  // Split bio into paragraphs (after HTML strip, paragraphs are \n\n separated)
  const bioParas = (node.bio || "").split(/\n\n+/).filter(s => s.trim()).slice(0, 8);

  return (
    <div className="panel">
      <div className="panel-head">
        <div className="panel-head-top">
          <span className="type-pill" style={{borderColor: color, color}}>
            <span className="dot" style={{background: color}}></span>
            {typeLabel}
          </span>
          <button className="close" onClick={onClose} aria-label="cerrar">×</button>
        </div>
        <h2 className="panel-name">{node.name}</h2>
        {node.role && node.role !== node.name && <div className="panel-role">{node.role}</div>}
        {node.group && node.group !== node.role && <div className="panel-group">{node.group}</div>}
        {node.year && <div className="panel-year">{node.year}</div>}
        <div className="meta-row">
          {node.blocs && node.blocs.length > 0 && (
            <div className="bloc-row">
              {node.blocs.map(b => {
                const c = CANAL_LIST.find(x => x.id === b);
                return <span key={b} className="bloc-chip" title={c?.name || ("B"+b)}>{c?.short || ("B"+b)}</span>;
              })}
            </div>
          )}
          {node.videoCount > 0 && (
            <div className="vid-count-pill">
              {node.videoCount} vídeo{node.videoCount > 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>

      <div className="panel-body">
        {bioParas.length > 0 && (
          <section>
            {bioParas.map((p, i) => <p key={i} className="bio">{p}</p>)}
          </section>
        )}

        {node.media && (
          <section>
            <h3 className="section-h">Recurso destacado</h3>
            <a href={node.media} target="_blank" rel="noopener" className="media-link">
              <span className="play-i">▶</span>
              <span className="ml-body">
                <span className="ml-cred">{node.mediaCredit || "YouTube"}</span>
                {node.mediaCaption && <span className="ml-cap">{node.mediaCaption}</span>}
              </span>
              <span className="ml-arrow">↗</span>
            </a>
          </section>
        )}

        {node.videos && node.videos.length > 0 && (
          <section>
            <h3 className="section-h">Aparece en {node.videoCount} vídeo{node.videoCount > 1 ? "s" : ""} {node.videoCount > node.videos.length ? "· top " + node.videos.length : ""}</h3>
            <ul className="video-list">
              {node.videos.map((v, i) => (
                <li key={i}>
                  <a href={v.u} target="_blank" rel="noopener" className="video-item">
                    <span className="vi-num">#{v.n}</span>
                    <span className="vi-body">
                      <span className="vi-title">{v.t}</span>
                      <span className="vi-meta">{v.c} {v.d ? "· " + v.d : ""}</span>
                    </span>
                    <span className="vi-arrow">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h3 className="section-h">Conexiones · {connections.length}</h3>
          {connections.length === 0 && <p className="empty">Sin conexiones detectadas.</p>}
          {typeOrder.map(t => grouped[t] && (
            <div key={t} className="conn-group">
              <div className="conn-group-h" style={{color: TYPE_COLORS[t]}}>
                <span className="dot" style={{background: TYPE_COLORS[t]}}></span>
                {TYPE_LABEL_ES[t]} <span className="cg-count">{grouped[t].length}</span>
              </div>
              <ul className="conn-list">
                {grouped[t].map((c, i) => (
                  <li key={i}>
                    <button className="conn-item" onClick={() => onSelect(c.node.id)}>
                      <span className="conn-name">{c.node.name}</span>
                      {c.note && <span className="conn-note">{c.note}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

// ============== SIDEBAR (search + filters + legend) ==============

const CANAL_LIST = [
  { id: 1,  name: "Corbell + Knapp",        short: "Corbell/Knapp" },
  { id: 2,  name: "Jason Samosa",           short: "Samosa" },
  { id: 3,  name: "Area52 / DEBRIEFED",     short: "Area52" },
  { id: 4,  name: "UAP Gerb",               short: "UAP Gerb" },
  { id: 5,  name: "The Sol Foundation",     short: "Sol Foundation" },
  { id: 6,  name: "American Alchemy",       short: "Michels" },
  { id: 7,  name: "Richard Dolan",          short: "Dolan" },
  { id: 8,  name: "Ashton Forbes",          short: "Forbes" },
  { id: 9,  name: "NewsNation / Coulthart", short: "NewsNation" },
  { id: 10, name: "That UFO Podcast",       short: "That UFO" },
  { id: 11, name: "Polarity",               short: "Polarity" },
  { id: 12, name: "VETTED",                 short: "VETTED" },
  { id: 13, name: "Dr. Steven Greer",       short: "Greer" }
];

function Sidebar({ data, query, setQuery, filters, setFilters, onSelect, selectedId, onThread, threadId }) {
  const allTypes = ["person","agency","event","program","channel","concept"];
  const allBlocs = CANAL_LIST.map(c => c.id);

  const toggleType = (t) => setFilters({...filters, types: {...filters.types, [t]: !filters.types[t]}});
  const toggleBloc = (b) => setFilters({...filters, blocs: {...filters.blocs, [b]: !filters.blocs[b]}});

  const counts = React.useMemo(() => {
    const c = {};
    for (const n of data.nodes) c[n.type] = (c[n.type]||0) + 1;
    return c;
  }, [data]);

  const blocCounts = React.useMemo(() => {
    const c = {};
    for (const n of data.nodes) {
      for (const b of (n.blocs || [])) c[b] = (c[b]||0) + 1;
    }
    return c;
  }, [data]);

  const searchResults = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return data.nodes
      .filter(n => n.name.toLowerCase().includes(q) ||
                   (n.role||"").toLowerCase().includes(q) ||
                   (n.group||"").toLowerCase().includes(q) ||
                   (n.bio||"").toLowerCase().includes(q))
      .slice(0, 14);
  }, [query, data]);

  return (
    <aside className="sidebar">
      <div className="search-wrap">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar persona, evento, programa…"
          className="search"
        />
        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map(n => (
              <button key={n.id} className="search-result" onClick={() => { onSelect(n.id); setQuery(""); }}>
                <span className="dot" style={{background: TYPE_COLORS[n.type]}}></span>
                <span className="sr-name">{n.name}</span>
                <span className="sr-type">{TYPE_LABEL_ES[n.type].slice(0,-1).toLowerCase()}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <section className="filter-section">
        <div className="filter-h">
          <span>Tipos</span>
          <button className="mini-btn" onClick={() => {
            const all = allTypes.reduce((acc,t) => ({...acc, [t]: true}), {});
            setFilters({...filters, types: all});
          }}>todos</button>
        </div>
        <div className="type-grid">
          {allTypes.filter(t => counts[t] > 0).map(t => (
            <button key={t}
              className={`type-btn ${filters.types[t] ? "on" : "off"}`}
              onClick={() => toggleType(t)}
              style={{"--c": TYPE_COLORS[t]}}>
              <span className="dot" style={{background: TYPE_COLORS[t]}}></span>
              <span className="t-name">{TYPE_LABEL_ES[t]}</span>
              <span className="t-count">{counts[t]||0}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="filter-section">
        <div className="filter-h">
          <span>Canales / fuentes</span>
          <button className="mini-btn" onClick={() => {
            const none = allBlocs.reduce((acc,b) => ({...acc, [b]: false}), {});
            setFilters({...filters, blocs: none});
          }}>todos</button>
        </div>
        <div className="canal-list">
          {CANAL_LIST.map(c => (
            <button key={c.id}
              className={`canal-btn ${filters.blocs[c.id] ? "on" : ""}`}
              onClick={() => toggleBloc(c.id)}>
              <span className="canal-num">{String(c.id).padStart(2,"0")}</span>
              <span className="canal-name">{c.name}</span>
              <span className="canal-count">{blocCounts[c.id] || 0}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="filter-section">
        <div className="filter-h"><span>Hilos transversales</span></div>
        <div className="thread-list">
          {data.threads.map(th => (
            <button key={th.id}
              className={`thread-btn ${threadId === th.id ? "on" : ""}`}
              onClick={() => onThread(threadId === th.id ? null : th.id)}>
              <div className="th-title">{th.title}</div>
              <div className="th-count">{th.nodes.length} nodos</div>
            </button>
          ))}
        </div>
      </section>

      <div className="legend-footer">
        Click en un nodo para ficha · Arrastra para reorganizar · Scroll para zoom
      </div>
    </aside>
  );
}

window.DetailPanel = DetailPanel;
window.Sidebar = Sidebar;
window.CANAL_LIST = CANAL_LIST;

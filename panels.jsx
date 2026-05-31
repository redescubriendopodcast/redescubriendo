// DetailPanel + Sidebar + ThreadList components

function DetailPanel({ node, data, onSelect, onClose, lang }) {
  const { t } = window.useT();
  if (!node) return null;

  // Read localised fields when available
  const L = lang === "en";
  const displayName  = (L && node.name_en)  || node.name;
  const displayRole  = (L && node.role_en)  || node.role  || "";
  const displayGroup = (L && node.group_en) || node.group || "";
  const displayBio   = (L && node.bio_en)   || node.bio   || "";

  const color = TYPE_COLORS[node.type];
  const typeLabel = {
    person:    t("panel.type.person"),
    agency:    t("panel.type.agency"),
    event:     t("panel.type.event"),
    program:   t("panel.type.program"),
    concept:   t("panel.type.concept"),
    channel:   t("panel.type.channel"),
    phenomenon:t("panel.type.phenomenon")
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

  // Type labels for connection group headers
  const connTypeLabel = (type) => ({
    person:    t("type.person"),
    agency:    t("type.agency"),
    event:     t("type.event"),
    program:   t("type.program"),
    concept:   t("type.concept"),
    channel:   t("type.channel"),
    phenomenon:t("type.phenomenon"),
  }[type] || type);

  // Split bio into paragraphs
  const bioParas = (displayBio).split(/\n\n+/).filter(s => s.trim()).slice(0, 8);

  const videoWord = (n) => n === 1 ? t("panel.video") : t("panel.videos");

  const ytDesc = node.youtube && ((L && node.youtube.desc_en) || node.youtube.desc || "");

  return (
    <div className="panel">
      <div className="panel-head">
        <div className="panel-head-top">
          <span className="type-pill" style={{borderColor: color, color}}>
            <span className="dot" style={{background: color}}></span>
            {typeLabel}
          </span>
          <button className="close" onClick={onClose} aria-label={t("panel.close")}>×</button>
        </div>
        {node.photo
          ? <div className="panel-name-row">
              <img className="panel-face" src={node.photo} alt={displayName}
                   loading="lazy" onError={e => { e.target.style.display = 'none'; }} />
              <h2 className="panel-name">{displayName}</h2>
            </div>
          : <h2 className="panel-name">{displayName}</h2>}
        {displayRole && displayRole !== displayName && <div className="panel-role">{displayRole}</div>}
        {displayGroup && displayGroup !== displayRole && <div className="panel-group">{displayGroup}</div>}
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
              {node.videoCount} {videoWord(node.videoCount)}
            </div>
          )}
        </div>
      </div>

      <div className="panel-body">
        {node.youtube && node.youtube.url && (
          <section>
            <a href={node.youtube.url} target="_blank" rel="noopener" className="channel-link">
              <span className="yt-i">▶</span>
              <span className="cl-body">
                <span className="cl-cta">{t("panel.visitChannel")}</span>
                {ytDesc && <span className="cl-desc">{ytDesc}</span>}
              </span>
              <span className="ml-arrow">↗</span>
            </a>
          </section>
        )}

        {bioParas.length > 0 && (
          <section>
            {bioParas.map((p, i) => <p key={i} className="bio">{p}</p>)}
          </section>
        )}

        {node.media && (
          <section>
            <h3 className="section-h">{t("panel.featured")}</h3>
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

        {node.papers && node.papers.length > 0 && (
          <section>
            <h3 className="section-h">{t("panel.publications")}</h3>
            <ul className="paper-list">
              {node.papers.map((p, i) => (
                <li key={i}>
                  <a href={p.url} target="_blank" rel="noopener" className="paper-item">
                    <span className="paper-i">📄</span>
                    <span className="paper-title">{p.titulo}</span>
                    <span className="ml-arrow">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {node.videos && node.videos.length > 0 && (
          <section>
            <h3 className="section-h">
              {t("panel.appearsIn")} {node.videoCount} {videoWord(node.videoCount)}
              {node.videoCount > node.videos.length ? " · " + t("panel.top") + " " + node.videos.length : ""}
            </h3>
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
          <h3 className="section-h">{t("panel.connections")} · {connections.length}</h3>
          {connections.length === 0 && <p className="empty">{t("panel.noConnections")}</p>}
          {typeOrder.map(type => grouped[type] && (
            <div key={type} className="conn-group">
              <div className="conn-group-h" style={{color: TYPE_COLORS[type]}}>
                <span className="dot" style={{background: TYPE_COLORS[type]}}></span>
                {connTypeLabel(type)} <span className="cg-count">{grouped[type].length}</span>
              </div>
              <ul className="conn-list">
                {grouped[type].map((c, i) => (
                  <li key={i}>
                    <button className="conn-item" onClick={() => onSelect(c.node.id)}>
                      <span className="conn-name">{(lang === 'en' && c.node.name_en) || c.node.name}</span>
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
  const { t, lang } = window.useT();
  const allTypes = ["person","agency","event","program","channel","concept"];
  const allBlocs = CANAL_LIST.map(c => c.id);

  const toggleType = (type) => setFilters({...filters, types: {...filters.types, [type]: !filters.types[type]}});
  const toggleBloc = (b) => setFilters({...filters, blocs: {...filters.blocs, [b]: !filters.blocs[b]}});

  const typeLabel = (type) => ({
    person:  t("type.person"),
    agency:  t("type.agency"),
    event:   t("type.event"),
    program: t("type.program"),
    concept: t("type.concept"),
    channel: t("type.channel"),
    phenomenon: t("type.phenomenon"),
  })[type] || type;

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
    const isEN = lang === 'en';
    return data.nodes
      .filter(n => n.name.toLowerCase().includes(q) ||
                   (isEN && (n.name_en||"").toLowerCase().includes(q)) ||
                   (isEN ? (n.role_en||n.role||"") : (n.role||"")).toLowerCase().includes(q) ||
                   (isEN ? (n.group_en||n.group||"") : (n.group||"")).toLowerCase().includes(q) ||
                   (isEN ? (n.bio_en||n.bio||"") : (n.bio||"")).toLowerCase().includes(q))
      .slice(0, 14);
  }, [query, data, lang]);

  return (
    <aside className="sidebar">
      <div className="search-wrap">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t("search.placeholder")}
          className="search"
        />
        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map(n => (
              <button key={n.id} className="search-result" onClick={() => { onSelect(n.id); setQuery(""); }}>
                <span className="dot" style={{background: TYPE_COLORS[n.type]}}></span>
                <span className="sr-name">{(lang === 'en' && n.name_en) || n.name}</span>
                <span className="sr-type">{typeLabel(n.type).slice(0,-1).toLowerCase()}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <section className="filter-section">
        <div className="filter-h">
          <span>{t("filter.types")}</span>
          <button className="mini-btn" onClick={() => {
            const all = allTypes.reduce((acc, type) => ({...acc, [type]: true}), {});
            setFilters({...filters, types: all});
          }}>{t("filter.all")}</button>
        </div>
        <div className="type-grid">
          {allTypes.filter(type => counts[type] > 0).map(type => (
            <button key={type}
              className={`type-btn ${filters.types[type] ? "on" : "off"}`}
              onClick={() => toggleType(type)}
              style={{"--c": TYPE_COLORS[type]}}>
              <span className="dot" style={{background: TYPE_COLORS[type]}}></span>
              <span className="t-name">{typeLabel(type)}</span>
              <span className="t-count">{counts[type]||0}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="filter-section">
        <div className="filter-h">
          <span>{t("filter.channels")}</span>
          <button className="mini-btn" onClick={() => {
            const none = allBlocs.reduce((acc, b) => ({...acc, [b]: false}), {});
            setFilters({...filters, blocs: none});
          }}>{t("filter.all")}</button>
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
        <div className="filter-h"><span>{t("filter.threads")}</span></div>
        <div className="thread-list">
          {data.threads.map(th => {
            const thTitle = (lang === "en" && th.title_en) || th.title;
            return (
              <button key={th.id}
                className={`thread-btn ${threadId === th.id ? "on" : ""}`}
                onClick={() => onThread(threadId === th.id ? null : th.id)}>
                <div className="th-title">{thTitle}</div>
                <div className="th-count">{th.nodes.length} {t("threads.nodeCount")}</div>
              </button>
            );
          })}
        </div>
      </section>

      <div className="legend-footer">
        {t("graph.hint")}
      </div>
    </aside>
  );
}

window.DetailPanel = DetailPanel;
window.Sidebar = Sidebar;
window.CANAL_LIST = CANAL_LIST;

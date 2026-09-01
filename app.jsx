// REDESCUBRIENDO — main app

const { useState, useEffect, useMemo, useRef } = React;

const DEFAULT_TWEAKS = /*EDITMODE-BEGIN*/{
  "glow": 1,
  "spread": 1,
  "showGrid": true,
  "palette": "cyan",
  "starfield": true,
  "edgeStyle": "neon"
} /*EDITMODE-END*/;

const PALETTES = {
  cyan: {
    person: "#7ee0ff", agency: "#ffb86b", event: "#ff6b9d",
    program: "#b48cff", concept: "#7cffb8", channel: "#ffe06b"
  },
  ice: {
    person: "#a5f0ff", agency: "#cfe7ff", event: "#ffd9e6",
    program: "#e0d6ff", concept: "#d6ffe6", channel: "#fff4c8"
  },
  signal: {
    person: "#00e5ff", agency: "#ff9e1f", event: "#ff3d7f",
    program: "#9d4dff", concept: "#1fffa3", channel: "#ffd11f"
  },
  forensic: {
    person: "#d4d4d4", agency: "#e9c46a", event: "#e76f51",
    program: "#a8dadc", concept: "#83c5be", channel: "#f1faee"
  }
};

// ── Timelines ─────────────────────────────────────────────────────────────

const TIMELINES = [
{
  titleKey: "tl.tab1.title",
  subtitleKey: "tl.tab1.sub",
  src: "https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=v2%3A2PACX-1vTsuebMx2acQpKWMicwGbhOvvseIEH5flAFkMXx_j-qOJYK_H4T8jXeUOjQyZ2ZGA&font=Default&lang=en&initial_zoom=2&width=100%25&height=720"
},
{
  titleKey: "tl.tab2.title",
  subtitleKey: "tl.tab2.sub",
  src: "https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=v2%3A2PACX-1vShbTjzp5yHCEBn3mnN0HHL6mITya0z4MnE9Xxscb72mqLKfTJe42px4zrHMeyaTw&font=Default&lang=en&initial_zoom=2&width=100%25&height=720"
},
{
  titleKey: "tl.tab3.title",
  subtitleKey: "tl.tab3.sub",
  src: "https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=v2%3A2PACX-1vT6V2iIy1v_01eFAyiSbS0w9sTLhoWtRWETMYii8e3zP3W66W2o8386iGBdjcoBqQ&font=Default&lang=en&initial_zoom=2&width=100%25&height=720"
}];

// English-language Google Sheets sources for the same timelines
const TIMELINES_EN = [
{
  titleKey: "tl.tab1.title",
  subtitleKey: "tl.tab1.sub",
  src: "https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=v2%3A2PACX-1vQvmq-eQiviURVid1U1SuORpMdst-1pzbi-PIBL3P8k1-rwsacRzGHlap-Jq3Mtbg&font=Default&lang=en&initial_zoom=2&width=100%25&height=650"
},
{
  titleKey: "tl.tab2.title",
  subtitleKey: "tl.tab2.sub",
  src: "https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=v2%3A2PACX-1vRULrFKLWc-bgRuIGcqyU2RNgDuVRk-GGjDNe-esRY7zxlUW5s-1UDZzsx1UkGdbA&font=Default&lang=en&initial_zoom=2&width=100%25&height=650"
},
{
  titleKey: "tl.tab3.title",
  subtitleKey: "tl.tab3.sub",
  src: "https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=v2%3A2PACX-1vQ2MUGcKj40VAvc26ax_73Qx_7wC_0-5qn7tazNb2d5_PINPJBBoTUleWc3xiBEqA&font=Default&lang=en&initial_zoom=2&width=100%25&height=650"
}];

// Static timeline labels (not in i18n because they live only in TIMELINES arrays)
const TIMELINE_LABELS = {
  es: [
    { title: "Personas",           subtitle: "Investigadores, testigos, militares y figuras políticas" },
    { title: "Eventos",            subtitle: "Crashes, avistamientos, audiencias y contactos" },
    { title: "Grupos y programas", subtitle: "Agencias, programas secretos, contratistas y marcos legales" }
  ],
  en: [
    { title: "People",             subtitle: "Researchers, witnesses, military and political figures" },
    { title: "Events",             subtitle: "Crashes, sightings, hearings and contacts" },
    { title: "Groups and programs",subtitle: "Agencies, secret programs, contractors and legal frameworks" }
  ]
};

function App({ tweaks }) {
  const data = window.RDC_DATA;
  const { t, lang } = window.useT();
  const [tab, setTab] = useState("timelines");
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");
  const [threadId, setThreadId] = useState(null);
  const [focusId, setFocusId] = useState(null);
  const [chatMode, setChatMode] = useState("closed"); // closed | open | thinking

  const [filters, setFilters] = useState({
    types: { person: true, agency: true, event: true, program: true, concept: true, channel: true },
    blocs: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false, 13: false, 14: false }
  });

  // Apply palette via TYPE_COLORS mutation
  useEffect(() => {
    const p = PALETTES[tweaks.palette] || PALETTES.cyan;
    Object.assign(window.TYPE_COLORS, p);
  }, [tweaks.palette]);

  // When thread is selected, filter to its nodes (override types/blocs by filter inside the data)
  const effectiveData = useMemo(() => {
    if (!threadId) return data;
    const th = data.threads.find((t) => t.id === threadId);
    if (!th) return data;
    const allowed = new Set(th.nodes);
    return {
      ...data,
      nodes: data.nodes.filter((n) => allowed.has(n.id)),
      edges: data.edges.filter((e) => allowed.has(e[0]) && allowed.has(e[1]))
    };
  }, [data, threadId]);

  const selectedNode = selectedId ? data.nodes.find((n) => n.id === selectedId) : null;

  const handleSelect = (id) => {
    setSelectedId(id);
    if (id) setFocusId(id + ":" + Date.now()); // trigger focus effect via dep change
  };

  return (
    <div className="app">
      <Starfield enabled={tweaks.starfield} />

      <header className="topbar">
        <div className="brand-bar">
          <img src="assets/logo.png" alt="RDC" className="brand-bar-logo" />
          <div>
            <div className="brand-bar-title">REDESCUBRIENDO</div>
            <div className="brand-bar-sub">{t("topbar.sub")}</div>
          </div>
        </div>
        <nav className="tabs">
          <button className={`tab ${tab === "timelines" ? "on" : ""}`} onClick={() => setTab("timelines")}>
            <span className="tab-i">⟶</span> {t("tabs.timelines")}
          </button>
          <button className={`tab ${tab === "graph" ? "on" : ""}`} onClick={() => setTab("graph")}>
            <span className="tab-i">◉</span> {t("tabs.graph")}
          </button>
          <button className={`tab ${tab === "threads" ? "on" : ""}`} onClick={() => setTab("threads")}>
            <span className="tab-i">≋</span> {t("tabs.threads")}
          </button>
          <button className={`tab ${tab === "about" ? "on" : ""}`} onClick={() => setTab("about")}>
            <span className="tab-i">?</span> {t("tabs.about")}
          </button>
        </nav>
        <div className="topbar-meta">
          <span className="counter">{effectiveData.nodes.length} {t("counter.nodes")} · {effectiveData.edges.length} {t("counter.connections")}</span>
          <button
            className="lang-toggle"
            onClick={() => window.changeLang(lang === "es" ? "en" : "es")}
            title={lang === "es" ? "Switch to English" : "Cambiar a español"}
          >
            {t("topbar.langToggle")}
          </button>
        </div>
      </header>

      {tab === "graph" &&
      <div className="layout">
          <Sidebar
          data={data}
          query={query} setQuery={setQuery}
          filters={filters} setFilters={setFilters}
          onSelect={handleSelect} selectedId={selectedId}
          onThread={(id) => {setThreadId(id);setSelectedId(null);}}
          threadId={threadId} />

          <main className="canvas-wrap">
            <NetworkGraph
            data={effectiveData}
            selectedId={selectedId}
            onSelect={handleSelect}
            filters={filters}
            tweaks={tweaks}
            focusId={focusId}
            chatMode={chatMode} />

            <ZoomControls />
            {threadId && (() => {
              const activeThread = data.threads.find((th) => th.id === threadId);
              const activeTitle = (lang === "en" && activeThread?.title_en) || activeThread?.title || "";
              return (
                <div className="thread-banner">
                  <span>{t("banner.viewing")} <b>{activeTitle}</b></span>
                  <button onClick={() => setThreadId(null)}>{t("banner.viewAll")}</button>
                </div>
              );
            })()}
            <ChatWidget
            data={data}
            selectedNode={selectedNode}
            filters={filters}
            threadId={threadId}
            onMode={setChatMode}
            lang={lang} />

          </main>
          {selectedNode &&
        <DetailPanel
          node={selectedNode}
          data={data}
          onSelect={handleSelect}
          onClose={() => setSelectedId(null)}
          lang={lang} />

        }
        </div>
      }

      {tab === "threads" &&
      <ThreadsView data={data} onOpenGraph={(id) => {setThreadId(id);setTab("graph");}} onOpenNode={(id) => {handleSelect(id);setTab("graph");}} />
      }

      {tab === "timelines" &&
      <TimelinesView lang={lang} />
      }

      {tab === "about" &&
      <AboutView data={data} onOpenGraph={(id) => {setThreadId(id);setSelectedId(null);setTab("graph");}} />
      }
    </div>);

}

// ============== FULLSCREEN BUTTON ==============

function FullscreenButton() {
  const { t } = window.useT();
  const [isFull, setIsFull] = useState(false);
  const [fallback, setFallback] = useState(false);
  useEffect(() => {
    const onChange = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);
  const toggle = async () => {
    if (fallback) {
      window.open(window.location.href, "_blank", "noopener");
      return;
    }
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else {
        throw new Error("Fullscreen API not supported");
      }
    } catch (e) {
      console.warn("Fullscreen blocked, switching to new-tab fallback:", e?.message || e);
      setFallback(true);
      window.open(window.location.href, "_blank", "noopener");
    }
  };
  return (
    <button className="fs-btn" onClick={toggle} title={
    fallback ? t("fs.newTab") :
    isFull ? t("fs.exit") : t("fs.full")
    }>
      {fallback ?
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M11 1h4v4M15 1l-6 6M7 3H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V9" />
        </svg> :
      isFull ?
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 1v3a2 2 0 0 1-2 2H5M6 15v-3a2 2 0 0 1 2-2h3M1 6h3a2 2 0 0 0 2-2V1M15 10h-3a2 2 0 0 0-2 2v3" />
        </svg> :

      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M1 5V1h4M11 1h4v4M15 11v4h-4M5 15H1v-4" />
        </svg>
      }
      <span>
        {fallback ? t("fs.openApart") : isFull ? t("fs.exitShort") : t("fs.full")}
      </span>
    </button>);

}

// ============== ZOOM CONTROLS ==============

function ZoomControls() {
  const { t } = window.useT();
  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    const id = setInterval(() => {
      if (window.__rdcGraph) {
        const k = window.__rdcGraph.getZoom();
        setZoom((z) => Math.abs(z - k) > 0.01 ? k : z);
      }
    }, 200);
    return () => clearInterval(id);
  }, []);
  const zoomIn = () => window.__rdcGraph?.zoomBy(1.3);
  const zoomOut = () => window.__rdcGraph?.zoomBy(1 / 1.3);
  const reset = () => window.__rdcGraph?.reset();
  return (
    <div className="zoom-controls">
      <button className="zc-btn" onClick={zoomIn} title={t("zoom.in")}>+</button>
      <div className="zc-val">{Math.round(zoom * 100)}%</div>
      <button className="zc-btn" onClick={zoomOut} title={t("zoom.out")}>−</button>
      <div className="zc-sep"></div>
      <button className="zc-btn zc-reset" onClick={reset} title={t("zoom.reset")}>⊙</button>
    </div>);

}

// ============== STARFIELD BACKGROUND ==============

function Starfield({ enabled }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!enabled) return;
    const cv = ref.current;
    const ctx = cv.getContext("2d");
    let raf, w, h, stars;
    const init = () => {
      w = cv.width = window.innerWidth;
      h = cv.height = window.innerHeight;
      stars = Array.from({ length: 220 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.2,
        a: Math.random() * 0.6 + 0.1,
        s: Math.random() * 0.005 + 0.001,
        phase: Math.random() * Math.PI * 2
      }));
    };
    init();
    window.addEventListener("resize", init);
    const step = (t) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const flicker = Math.sin(t * s.s + s.phase) * 0.4 + 0.6;
        ctx.fillStyle = `rgba(180,230,255,${s.a * flicker})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {cancelAnimationFrame(raf);window.removeEventListener("resize", init);};
  }, [enabled]);
  if (!enabled) return null;
  return <canvas ref={ref} className="starfield" />;
}

// ============== THREADS VIEW ==============

function ThreadsView({ data, onOpenGraph, onOpenNode }) {
  const { t } = window.useT();
  return (
    <div className="threads-view">
      <div className="threads-head">
        <div className="th-eyebrow">{t("threads.eyebrow")}</div>
        <h1>{t("threads.heading1")}<br /><em>{t("threads.heading2")}</em></h1>
        <p>{t("threads.desc")}</p>
        <div className="th-stats">
          <div><b>{data.threads.length}</b><span>{t("threads.stat.threads")}</span></div>
          <div><b>{data.nodes.length}</b><span>{t("threads.stat.nodes")}</span></div>
          <div><b>{data.edges.length}</b><span>{t("threads.stat.connections")}</span></div>
        </div>
      </div>
      <div className="threads-grid">
        {data.threads.map((th, idx) => {
          const { lang } = window.useT();
          const thTitle = (lang === "en" && th.title_en) || th.title;
          const thDesc  = (lang === "en" && th.desc_en)  || th.desc;
          return (
          <article key={th.id} className="thread-card">
            <div className="th-card-num">{String(idx + 1).padStart(2, "0")}</div>
            <header>
              <h3>{thTitle}</h3>
              <div className="th-blocs">
                {th.blocs.map((b) => {
                  const c = window.CANAL_LIST.find((x) => x.id === b);
                  return <span key={b} className="bloc-chip" title={c?.name || "B" + b}>{c?.short || "B" + b}</span>;
                })}
              </div>
            </header>
            <p>{thDesc}</p>
            <div className="th-nodes">
              {th.nodes.map((nid) => {
                const n = data.nodes.find((x) => x.id === nid);
                if (!n) return null;
                const displayName = (lang === "en" && n.name_en) || n.name;
                return (
                  <button key={nid} className="th-node" onClick={() => onOpenNode(nid)}>
                    <span className="dot" style={{ background: TYPE_COLORS[n.type] }}></span>
                    {displayName}
                  </button>
                );
              })}
            </div>
            <button className="th-open" onClick={() => onOpenGraph(th.id)}>
              <span>{t("threads.goTo")}</span>
              <span className="arrow">→</span>
            </button>
          </article>
          );
        })}
      </div>
    </div>);

}

// ============== TIMELINES VIEW ==============

function TimelinesView({ lang }) {
  const { t } = window.useT();
  const [idx, setIdx] = useState(0);
  const tlSet = lang === "en" ? TIMELINES_EN : TIMELINES;
  const labels = TIMELINE_LABELS[lang] || TIMELINE_LABELS.es;

  const calcHeight = () =>
    typeof window === "undefined" ? 600 : Math.max(420, window.innerHeight - 140);
  const [iframeHeight, setIframeHeight] = useState(calcHeight);

  useEffect(() => {
    let ti;
    const onResize = () => {
      clearTimeout(ti);
      ti = setTimeout(() => {
        const h = calcHeight();
        setIframeHeight((prev) => (Math.abs(prev - h) > 30 ? h : prev));
      }, 250);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(ti);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const currentSrc = tlSet[idx].src.replace(/height=\d+/, `height=${iframeHeight}`);

  return (
    <div className="timelines-view">
      <div className="tl-nav">
        <div className="tl-nav-eyebrow">{t("tl.eyebrow")}</div>
        <div className="tl-tabs">
          {tlSet.map((tl, i) =>
          <button key={i} className={`tl-tab ${idx === i ? "on" : ""}`} onClick={() => setIdx(i)}>
              <span className="tl-tab-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="tl-tab-body">
                <span className="tl-tab-title">{labels[i].title}</span>
                <span className="tl-tab-sub">{labels[i].subtitle}</span>
              </span>
            </button>
          )}
        </div>
      </div>
      <div className="tl-frame-wrap">
        <iframe key={`${idx}-${iframeHeight}-${lang}`} src={currentSrc} className="tl-iframe" allowFullScreen></iframe>
      </div>
    </div>);

}

// ============== ABOUT VIEW ==============

function AboutView({ data, onOpenGraph }) {
  const { t, lang } = window.useT();
  const stats = useMemo(() => {
    const byType = {};
    for (const n of data.nodes) byType[n.type] = (byType[n.type] || 0) + 1;
    return byType;
  }, [data]);

  const typeLabel = (type) => {
    const labels = {
      es: { person: "personas", agency: "agencias", event: "eventos", program: "programas", concept: "conceptos", channel: "canales", phenomenon: "fenómeno" },
      en: { person: "people", agency: "agencies", event: "events", program: "programs", concept: "concepts", channel: "channels", phenomenon: "phenomenon" }
    };
    return (labels[lang] || labels.es)[type] || type;
  };

  const channelList = t("about.channels.list");

  return (
    <div className="about-view">
      <div className="about-hero">
        <img src="assets/banner.png" alt="Redescubriendo" className="about-banner" />
      </div>

      <div className="about-content">
        <section className="about-intro">
          <div className="about-eyebrow">{t("about.eyebrow")}</div>
          <p className="about-lead" dangerouslySetInnerHTML={{ __html: t("about.lead") }} />
          <p dangerouslySetInnerHTML={{ __html: t("about.p1") }} />
          <p dangerouslySetInnerHTML={{ __html: t("about.p2") }} />
          <p dangerouslySetInnerHTML={{ __html: t("about.p3") }} />
        </section>

        <section className="about-section">
          <div className="about-eyebrow">{t("about.pillars.eyebrow")}</div>
          <div className="about-pillars">
            {[1,2,3,4,5,6].map(n => (
              <article key={n} className="pillar">
                <div className="pillar-num">0{n}</div>
                <h3>{t(`about.pillar${n}.title`)}</h3>
                <p dangerouslySetInnerHTML={{ __html: t(`about.pillar${n}.body`) }} />
                {n === 6 &&
                  <button className="pillar-cta" onClick={() => onOpenGraph && onOpenGraph("t_mh370")}>
                    {t("about.pillar6.cta")}
                  </button>
                }
              </article>
            ))}
          </div>
        </section>

        <section className="about-section">
          <div className="about-eyebrow">{t("about.channels.eyebrow")}</div>
          <p className="about-section-intro">{t("about.channels.intro")}</p>
          <ul className="about-channels">
            {(Array.isArray(channelList) ? channelList : []).map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </section>

        <section className="about-section">
          <div className="about-eyebrow">{t("about.coverage.eyebrow")}</div>
          <ul className="stats">
            {Object.entries(stats).map(([type, n]) =>
            <li key={type}>
                <span className="dot" style={{ background: TYPE_COLORS[type] }}></span>
                <b>{n}</b> {typeLabel(type)}
              </li>
            )}
            <li><span className="dot" style={{ background: "var(--cyan)" }}></span><b>{data.edges.length}</b> {t("about.coverage.connections")}</li>
            <li><span className="dot" style={{ background: "var(--cyan-bright)" }}></span><b>{data.threads.length}</b> {t("about.coverage.threads")}</li>
          </ul>
          <p className="about-footnote">{t("about.coverage.note")}</p>
        </section>

        <section className="about-section about-yt">
          <div className="about-eyebrow">{t("about.yt.eyebrow")}</div>
          <div className="yt-cta">
            <div className="yt-cta-body">
              <h3>{t("about.yt.title")}</h3>
              <p>{t("about.yt.body")}</p>
            </div>
            <div className="yt-cta-actions">
              <a className="yt-btn yt-btn-primary" href="https://www.youtube.com/@ReDescubriendo" target="_blank" rel="noopener">
                <span className="yt-ico">▶</span> {t("about.yt.watch")}
              </a>
              <a className="yt-btn yt-btn-ghost" href="https://www.youtube.com/@ReDescubriendo?sub_confirmation=1" target="_blank" rel="noopener">
                {t("about.yt.subscribe")}
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>);

}

// ============== TWEAKS PANEL ==============

function RDCTweaks({ tweaks, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Paleta" />
      <TweakRadio
        label="Color de nodos"
        value={tweaks.palette}
        options={["cyan", "signal", "ice", "forensic"]}
        onChange={(v) => setTweak("palette", v)} />
      <TweakSection label="Grafo" />
      <TweakSlider label="Glow" value={tweaks.glow} min={0.2} max={2.4} step={0.1}
      onChange={(v) => setTweak("glow", v)} />
      <TweakSlider label="Separación" value={tweaks.spread} min={0.6} max={2.0} step={0.1}
      onChange={(v) => setTweak("spread", v)} />
      <TweakSection label="Atmósfera" />
      <TweakToggle label="Fondo estelado" value={tweaks.starfield}
      onChange={(v) => setTweak("starfield", v)} />
      <TweakToggle label="Cuadrícula" value={tweaks.showGrid}
      onChange={(v) => setTweak("showGrid", v)} />
    </TweaksPanel>);

}

function Root() {
  const [tweaks, setTweak] = useTweaks(DEFAULT_TWEAKS);
  return (
    <React.Fragment>
      <App tweaks={tweaks} />
      <RDCTweaks tweaks={tweaks} setTweak={setTweak} />
    </React.Fragment>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);

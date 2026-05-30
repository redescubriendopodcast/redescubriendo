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

function App({ tweaks }) {
  const data = window.RDC_DATA;
  const [tab, setTab] = useState("timelines");
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");
  const [threadId, setThreadId] = useState(null);
  const [focusId, setFocusId] = useState(null);
  const [chatMode, setChatMode] = useState("closed"); // closed | open | thinking

  const [filters, setFilters] = useState({
    types: { person: true, agency: true, event: true, program: true, concept: true, channel: true },
    blocs: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false, 13: false }
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
            <div className="brand-bar-sub">Mapa interactivo · UAP/UFO</div>
          </div>
        </div>
        <nav className="tabs">
          <button className={`tab ${tab === "timelines" ? "on" : ""}`} onClick={() => setTab("timelines")}>
            <span className="tab-i">⟶</span> Líneas de tiempo
          </button>
          <button className={`tab ${tab === "graph" ? "on" : ""}`} onClick={() => setTab("graph")}>
            <span className="tab-i">◉</span> Galaxia de conexiones
          </button>
          <button className={`tab ${tab === "threads" ? "on" : ""}`} onClick={() => setTab("threads")}>
            <span className="tab-i">≋</span> Hilos transversales
          </button>
          <button className={`tab ${tab === "about" ? "on" : ""}`} onClick={() => setTab("about")}>
            <span className="tab-i">?</span> Sobre el proyecto
          </button>
        </nav>
        <div className="topbar-meta">
          <span className="counter">{effectiveData.nodes.length} nodos · {effectiveData.edges.length} conexiones</span>
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
            {threadId &&
          <div className="thread-banner">
                <span>Viendo hilo: <b>{data.threads.find((t) => t.id === threadId).title}</b></span>
                <button onClick={() => setThreadId(null)}>× ver todo</button>
              </div>
          }
            <ChatWidget
            data={data}
            selectedNode={selectedNode}
            filters={filters}
            threadId={threadId}
            onMode={setChatMode} />
          
          </main>
          {selectedNode &&
        <DetailPanel
          node={selectedNode}
          data={data}
          onSelect={handleSelect}
          onClose={() => setSelectedId(null)} />

        }
        </div>
      }

      {tab === "threads" &&
      <ThreadsView data={data} onOpenGraph={(id) => {setThreadId(id);setTab("graph");}} onOpenNode={(id) => {handleSelect(id);setTab("graph");}} />
      }

      {tab === "timelines" &&
      <TimelinesView />
      }

      {tab === "about" &&
      <AboutView data={data} />
      }
    </div>);

}

// ============== FULLSCREEN BUTTON ==============

function FullscreenButton() {
  const [isFull, setIsFull] = useState(false);
  const [fallback, setFallback] = useState(false);
  useEffect(() => {
    const onChange = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);
  const toggle = async () => {
    // If we're sandboxed and fullscreen API is not allowed, open in new tab
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
      // Fullscreen blocked (typically iframe sandbox) → fall back to opening in new tab
      console.warn("Fullscreen blocked, switching to new-tab fallback:", e?.message || e);
      setFallback(true);
      window.open(window.location.href, "_blank", "noopener");
    }
  };
  return (
    <button className="fs-btn" onClick={toggle} title={
    fallback ? "Abrir en nueva pestaña (pantalla completa)" :
    isFull ? "Salir de pantalla completa" : "Pantalla completa"
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
        {fallback ? "Abrir aparte" : isFull ? "Salir" : "Pantalla completa"}
      </span>
    </button>);

}

// ============== ZOOM CONTROLS ==============

function ZoomControls() {
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
      <button className="zc-btn" onClick={zoomIn} title="Acercar">+</button>
      <div className="zc-val">{Math.round(zoom * 100)}%</div>
      <button className="zc-btn" onClick={zoomOut} title="Alejar">−</button>
      <div className="zc-sep"></div>
      <button className="zc-btn zc-reset" onClick={reset} title="Restablecer vista">⊙</button>
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
  return (
    <div className="threads-view">
      <div className="threads-head">
        <div className="th-eyebrow">PATRONES DETECTADOS</div>
        <h1>Hilos<br /><em>transversales</em></h1>
        <p>Patrones recurrentes que atraviesan canales, épocas y testigos. Cada hilo aísla un subgrafo navegable de entidades co-ocurrentes.</p>
        <div className="th-stats">
          <div><b>{data.threads.length}</b><span>hilos</span></div>
          <div><b>{data.nodes.length}</b><span>nodos</span></div>
          <div><b>{data.edges.length}</b><span>conexiones</span></div>
        </div>
      </div>
      <div className="threads-grid">
        {data.threads.map((th, idx) =>
        <article key={th.id} className="thread-card">
            <div className="th-card-num">{String(idx + 1).padStart(2, "0")}</div>
            <header>
              <h3>{th.title}</h3>
              <div className="th-blocs">
                {th.blocs.map((b) => {
                const c = window.CANAL_LIST.find((x) => x.id === b);
                return <span key={b} className="bloc-chip" title={c?.name || "B" + b}>{c?.short || "B" + b}</span>;
              })}
              </div>
            </header>
            <p>{th.desc}</p>
            <div className="th-nodes">
              {th.nodes.map((nid) => {
              const n = data.nodes.find((x) => x.id === nid);
              if (!n) return null;
              return (
                <button key={nid} className="th-node" onClick={() => onOpenNode(nid)}>
                    <span className="dot" style={{ background: TYPE_COLORS[n.type] }}></span>
                    {n.name}
                  </button>);

            })}
            </div>
            <button className="th-open" onClick={() => onOpenGraph(th.id)}>
              <span>Ir a la constelación</span>
              <span className="arrow">→</span>
            </button>
          </article>
        )}
      </div>
    </div>);

}

// ============== TIMELINES VIEW ==============

const TIMELINES = [
{
  title: "Personas",
  subtitle: "Investigadores, testigos, militares y figuras políticas",
  src: "https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=v2%3A2PACX-1vTsuebMx2acQpKWMicwGbhOvvseIEH5flAFkMXx_j-qOJYK_H4T8jXeUOjQyZ2ZGA&font=Default&lang=en&initial_zoom=2&width=100%25&height=720"
},
{
  title: "Eventos",
  subtitle: "Crashes, avistamientos, audiencias y contactos",
  src: "https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=v2%3A2PACX-1vShbTjzp5yHCEBn3mnN0HHL6mITya0z4MnE9Xxscb72mqLKfTJe42px4zrHMeyaTw&font=Default&lang=en&initial_zoom=2&width=100%25&height=720"
},
{
  title: "Grupos y programas",
  subtitle: "Agencias, programas secretos, contratistas y marcos legales",
  src: "https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=v2%3A2PACX-1vT6V2iIy1v_01eFAyiSbS0w9sTLhoWtRWETMYii8e3zP3W66W2o8386iGBdjcoBqQ&font=Default&lang=en&initial_zoom=2&width=100%25&height=720"
}];


function TimelinesView() {
  const [idx, setIdx] = useState(0);
  // Calcula la altura disponible para el iframe en función del viewport
  // (descontando topbar ~60px + tl-nav ~70px + algún margen). TimelineJS
  // necesita un valor concreto en píxeles — si lo dejamos fijo (720) se
  // desborda en pantallas menores y crea un scroll vertical externo.
  const calcHeight = () =>
    typeof window === "undefined" ? 600 : Math.max(420, window.innerHeight - 140);
  const [iframeHeight, setIframeHeight] = useState(calcHeight);

  useEffect(() => {
    let t;
    const onResize = () => {
      clearTimeout(t);
      // Debounce y umbral de 30px para evitar recargas constantes del iframe
      t = setTimeout(() => {
        const h = calcHeight();
        setIframeHeight((prev) => (Math.abs(prev - h) > 30 ? h : prev));
      }, 250);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const currentSrc = TIMELINES[idx].src.replace(/height=\d+/, `height=${iframeHeight}`);

  return (
    <div className="timelines-view">
      <div className="tl-nav">
        <div className="tl-nav-eyebrow">LÍNEAS DE TIEMPO</div>
        <div className="tl-tabs">
          {TIMELINES.map((t, i) =>
          <button key={i} className={`tl-tab ${idx === i ? "on" : ""}`} onClick={() => setIdx(i)}>
              <span className="tl-tab-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="tl-tab-body">
                <span className="tl-tab-title">{t.title}</span>
                <span className="tl-tab-sub">{t.subtitle}</span>
              </span>
            </button>
          )}
        </div>
      </div>
      <div className="tl-frame-wrap">
        <iframe key={`${idx}-${iframeHeight}`} src={currentSrc} className="tl-iframe" allowFullScreen></iframe>
      </div>
    </div>);

}

// ============== ABOUT VIEW ==============

function AboutView({ data }) {
  const stats = useMemo(() => {
    const byType = {};
    for (const n of data.nodes) byType[n.type] = (byType[n.type] || 0) + 1;
    return byType;
  }, [data]);
  return (
    <div className="about-view">
      <div className="about-hero">
        <img src="assets/banner.png" alt="Redescubriendo" className="about-banner" />
      </div>

      <div className="about-content">
        <section className="about-intro">
          <div className="about-eyebrow">EL PROYECTO</div>
          <p className="about-lead">
            <em>Redescubriendo</em> es un podcast de Carlos Díaz, que nace con la voluntad de ofrecer a la gente una 
            <strong> primera fuente seria</strong> sobre el fenómeno UAP/OVNI — y, sobre todo, sobre
            lo que los gobiernos han hecho y siguen haciendo con esta información.
          </p>
          <p>
            El problema de mirar todo este corpus de manera objetiva es que, <em>independientemente
            de si los alienígenas existen o no</em>, hay un hecho que ya no se puede pasar por alto:
            durante décadas, <strong>muchos gobiernos — por no decir todos los que sabían algo —
            han ocultado información a su población</strong>. Y existe un factor de fenómeno no identificado
            real, físicamente medido y testificado, que merece estar en el centro de la conversación.
          </p>
          <p>
            La meta no es vender una conclusión sino <strong>traer el debate al centro</strong> y empezar
            a entender las consecuencias que conlleva. Esta web es una herramienta de navegación
            que irá creciendo con el tiempo — de momento reúne más de 300 vídeos junto a otros
            documentos y fuentes que han ido alimentando las líneas de tiempo.
          </p>
          <p>
            Es un trabajo <em>en evolución</em>. Todos estamos en este camino de entender lo que está
            pasando y, de alguna manera, todos tenemos que ayudar a quienes saben un poquito menos
            para, entre todos, poder saber un poquito más.
          </p>
        </section>

        <section className="about-section">
          <div className="about-eyebrow">TEMAS, EVENTOS Y FIGURAS QUE NO DEBERÍAS IGNORAR</div>
          <div className="about-pillars">
            <article className="pillar">
              <div className="pillar-num">01</div>
              <h3>David Grusch y la audiencia del Congreso</h3>
              <p>
                En julio 2023 un ex-oficial de inteligencia con credenciales impecables testificó <strong>bajo juramento</strong> ante el
                Congreso de EE.UU. que el gobierno posee programas encubiertos de recuperación
                de naves de origen no humano. El ICIG calificó su queja como <em>urgente y creíble</em>.
                Es el momento bisagra de toda la "era post-Grusch".
              </p>
            </article>
            <article className="pillar">
              <div className="pillar-num">02</div>
              <h3>Project Blue Book y la trilogía del encubrimiento</h3>
              <p>
                Sign (1947) → Grudge → Blue Book (cerrado 1969). La respuesta oficial de la USAF
                al fenómeno OVNI durante 22 años. El <strong>memo Bolander</strong> cerró el programa públicamente
                pero la investigación continuó en secreto, abriendo la senda al moderno AATIP.
              </p>
            </article>
            <article className="pillar">
              <div className="pillar-num">03</div>
              <h3>Proyecto Stargate — espionaje psíquico</h3>
              <p>
                17 de las 19 agencias de inteligencia de EE.UU. obtuvieron resultados positivos
                usando visión remota (1978-1995). Operadores como Joe McMoneagle localizaron objetivos
                verificables. La telepatía y la psionics como capacidades operacionales reales — no especulación.
              </p>
            </article>
            <article className="pillar">
              <div className="pillar-num">04</div>
              <h3>Declaraciones recientes en el Congreso</h3>
              <p>
                Las audiencias 2023-2025 (Grusch, Fravor, Graves; después Mellon, McConnell, Gallaudet,
                Davis) son la mayor cadena de testimonios oficiales bajo juramento de la historia del campo.
                Por primera vez senadores y congresistas reconocen abiertamente que <em>existen objetos
                que ni el Congreso ni los departamentos saben qué son</em>.
              </p>
            </article>
            <article className="pillar">
              <div className="pillar-num">05</div>
              <h3>Página oficial UAP del gobierno de EE.UU. (mayo 2026)</h3>
              <p>
                La creación de un portal oficial de divulgación UAP por parte del ejecutivo
                estadounidense marca un cambio estructural: por primera vez la administración
                reconoce el fenómeno como categoría legítima de comunicación pública con el ciudadano.
              </p>
            </article>
          </div>
        </section>

        <section className="about-section">
          <div className="about-eyebrow">CANALES Y FUENTES DEL CORPUS</div>
          <p className="about-section-intro">
            La base documental es una lectura cruzada del trabajo de los principales investigadores
            independientes y medios especializados del campo. Cada nodo del mapa está enlazado a los
            vídeos donde aparece:
          </p>
          <ul className="about-channels">
            <li><strong>American Alchemy</strong> · Jesse Michels — gonzo journalism + foco técnico en propulsión</li>
            <li><strong>Weaponized</strong> · Jeremy Corbell &amp; George Knapp — testimonios de whistleblowers</li>
            <li><strong>NewsNation / Reality Check</strong> · Ross Coulthart — periodismo de investigación</li>
            <li><strong>The Sol Foundation</strong> — simposios académicos: Nolan, Davis, Puthoff, Nell, Loeb…</li>
            <li><strong>Richard Dolan</strong> — historiador clásico del fenómeno</li>
            <li><strong>Area52 / DEBRIEFED</strong> — entrevistas largas a actores clave</li>
            <li><strong>Jason Samosa</strong> — series temáticas largas (Vallée, Collins Elite, Pandulfi)</li>
            <li><strong>UAP Gerb</strong> — investigador emergente con acceso directo a ex-militares</li>
            <li><strong>Ashton Forbes</strong> — MH370, ZPE, free energy y warp drive</li>
            <li><strong>That UFO Podcast</strong> · <strong>Polarity</strong> · <strong>VETTED</strong> · <strong>Dr. Steven Greer</strong> — cobertura complementaria</li>
          </ul>
        </section>

        <section className="about-section">
          <div className="about-eyebrow">COBERTURA ACTUAL</div>
          <ul className="stats">
            {Object.entries(stats).map(([t, n]) =>
            <li key={t}>
                <span className="dot" style={{ background: TYPE_COLORS[t] }}></span>
                <b>{n}</b> {TYPE_LABEL_ES[t].toLowerCase()}
              </li>
            )}
            <li><span className="dot" style={{ background: "var(--cyan)" }}></span><b>{data.edges.length}</b> conexiones documentadas</li>
            <li><span className="dot" style={{ background: "var(--cyan-bright)" }}></span><b>{data.threads.length}</b> hilos transversales</li>
          </ul>
          <p className="about-footnote">
            Trabajo en proceso · El corpus crece episodio a episodio · Última actualización mayo 2026
          </p>
        </section>

        <section className="about-section about-yt">
          <div className="about-eyebrow">EL CANAL</div>
          <div className="yt-cta">
            <div className="yt-cta-body">
              <h3>Redescubriendo en YouTube</h3>
              <p>Cada episodio desgrana una pieza de este mapa. Suscríbete para seguir el hilo completo del fenómeno.</p>
            </div>
            <div className="yt-cta-actions">
              <a className="yt-btn yt-btn-primary" href="https://www.youtube.com/@ReDescubriendo" target="_blank" rel="noopener">
                <span className="yt-ico">▶</span> Ver el canal
              </a>
              <a className="yt-btn yt-btn-ghost" href="https://www.youtube.com/@ReDescubriendo?sub_confirmation=1" target="_blank" rel="noopener">
                Suscribirse
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
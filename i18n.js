// REDESCUBRIENDO — Internationalization (ES / EN)
// Loaded before all JSX files. Exposes window.I18N and window.useT.

window.I18N = {
  es: {
    // ── Topbar ──────────────────────────────────────────────
    "topbar.sub":              "Mapa interactivo · UAP/UFO",
    "topbar.langToggle":       "EN",

    // ── Tabs ────────────────────────────────────────────────
    "tabs.timelines":          "Líneas de tiempo",
    "tabs.graph":              "Galaxia de conexiones",
    "tabs.threads":            "Hilos transversales",
    "tabs.about":              "Sobre el proyecto",

    // ── Counter ─────────────────────────────────────────────
    "counter.nodes":           "nodos",
    "counter.connections":     "conexiones",

    // ── Search ──────────────────────────────────────────────
    "search.placeholder":      "Buscar persona, evento, programa…",

    // ── Filters ─────────────────────────────────────────────
    "filter.types":            "Tipos",
    "filter.all":              "todos",
    "filter.channels":         "Canales / fuentes",
    "filter.threads":          "Hilos transversales",

    // ── Type labels (sidebar buttons) ────────────────────────
    "type.person":             "Personas",
    "type.agency":             "Agencias",
    "type.event":              "Eventos",
    "type.program":            "Programas",
    "type.concept":            "Conceptos",
    "type.channel":            "Canales",
    "type.phenomenon":         "Fenómeno",

    // ── Panel type labels (detail pill) ──────────────────────
    "panel.type.person":       "Persona",
    "panel.type.agency":       "Agencia / Grupo",
    "panel.type.event":        "Evento",
    "panel.type.program":      "Programa",
    "panel.type.concept":      "Concepto / Tema",
    "panel.type.channel":      "Canal",
    "panel.type.phenomenon":   "Núcleo galáctico",

    // ── Panel body ───────────────────────────────────────────
    "panel.close":             "cerrar",
    "panel.featured":          "Recurso destacado",
    "panel.appearsIn":         "Aparece en",
    "panel.video":             "vídeo",
    "panel.videos":            "vídeos",
    "panel.top":               "top",
    "panel.connections":       "Conexiones",
    "panel.noConnections":     "Sin conexiones detectadas.",

    // ── Graph legend ─────────────────────────────────────────
    "graph.hint":              "Click en un nodo para ficha · Arrastra para reorganizar · Scroll para zoom",

    // ── Zoom controls ────────────────────────────────────────
    "zoom.in":                 "Acercar",
    "zoom.out":                "Alejar",
    "zoom.reset":              "Restablecer vista",

    // ── Fullscreen button ────────────────────────────────────
    "fs.full":                 "Pantalla completa",
    "fs.exit":                 "Salir de pantalla completa",
    "fs.newTab":               "Abrir en nueva pestaña (pantalla completa)",
    "fs.exitShort":            "Salir",
    "fs.openApart":            "Abrir aparte",

    // ── Thread banner ────────────────────────────────────────
    "banner.viewing":          "Viendo hilo:",
    "banner.viewAll":          "× ver todo",

    // ── Threads view ─────────────────────────────────────────
    "threads.eyebrow":         "PATRONES DETECTADOS",
    "threads.heading1":        "Hilos",
    "threads.heading2":        "transversales",
    "threads.desc":            "Patrones recurrentes que atraviesan canales, épocas y testigos. Cada hilo aísla un subgrafo navegable de entidades co-ocurrentes.",
    "threads.stat.threads":    "hilos",
    "threads.stat.nodes":      "nodos",
    "threads.stat.connections":"conexiones",
    "threads.goTo":            "Ir a la constelación",
    "threads.nodeCount":       "nodos",

    // ── Timelines view ───────────────────────────────────────
    "tl.eyebrow":              "LÍNEAS DE TIEMPO",

    // ── About view ───────────────────────────────────────────
    "about.eyebrow":           "EL PROYECTO",
    "about.lead":              "<em>Redescubriendo</em> es un podcast de Carlos Díaz, que nace con la voluntad de ofrecer a la gente una <strong> primera fuente seria</strong> sobre el fenómeno UAP/OVNI — y, sobre todo, sobre lo que los gobiernos han hecho y siguen haciendo con esta información.",
    "about.p1":                "El problema de mirar todo este corpus de manera objetiva es que, <em>independientemente de si los alienígenas existen o no</em>, hay un hecho que ya no se puede pasar por alto: durante décadas, <strong>muchos gobiernos — por no decir todos los que sabían algo — han ocultado información a su población</strong>. Y existe un factor de fenómeno no identificado real, físicamente medido y testificado, que merece estar en el centro de la conversación.",
    "about.p2":                "La meta no es vender una conclusión sino <strong>traer el debate al centro</strong> y empezar a entender las consecuencias que conlleva. Esta web es una herramienta de navegación que irá creciendo con el tiempo — de momento reúne más de 300 vídeos junto a otros documentos y fuentes que han ido alimentando las líneas de tiempo.",
    "about.p3":                "Es un trabajo <em>en evolución</em>. Todos estamos en este camino de entender lo que está pasando y, de alguna manera, todos tenemos que ayudar a quienes saben un poquito menos para, entre todos, poder saber un poquito más.",
    "about.pillars.eyebrow":   "TEMAS, EVENTOS Y FIGURAS QUE NO DEBERÍAS IGNORAR",
    "about.pillar1.title":     "David Grusch y la audiencia del Congreso",
    "about.pillar1.body":      "En julio 2023 un ex-oficial de inteligencia con credenciales impecables testificó <strong>bajo juramento</strong> ante el Congreso de EE.UU. que el gobierno posee programas encubiertos de recuperación de naves de origen no humano. El ICIG calificó su queja como <em>urgente y creíble</em>. Es el momento bisagra de toda la \"era post-Grusch\".",
    "about.pillar2.title":     "Project Blue Book y la trilogía del encubrimiento",
    "about.pillar2.body":      "Sign (1947) → Grudge → Blue Book (cerrado 1969). La respuesta oficial de la USAF al fenómeno OVNI durante 22 años. El <strong>memo Bolander</strong> cerró el programa públicamente pero la investigación continuó en secreto, abriendo la senda al moderno AATIP.",
    "about.pillar3.title":     "Proyecto Stargate — espionaje psíquico",
    "about.pillar3.body":      "17 de las 19 agencias de inteligencia de EE.UU. obtuvieron resultados positivos usando visión remota (1978-1995). Operadores como Joe McMoneagle localizaron objetivos verificables. La telepatía y la psionics como capacidades operacionales reales — no especulación.",
    "about.pillar4.title":     "Declaraciones recientes en el Congreso",
    "about.pillar4.body":      "Las audiencias 2023-2025 (Grusch, Fravor, Graves; después Mellon, McConnell, Gallaudet, Davis) son la mayor cadena de testimonios oficiales bajo juramento de la historia del campo. Por primera vez senadores y congresistas reconocen abiertamente que <em>existen objetos que ni el Congreso ni los departamentos saben qué son</em>.",
    "about.pillar5.title":     "Página oficial UAP del gobierno de EE.UU. (mayo 2026)",
    "about.pillar5.body":      "La creación de un portal oficial de divulgación UAP por parte del ejecutivo estadounidense marca un cambio estructural: por primera vez la administración reconoce el fenómeno como categoría legítima de comunicación pública con el ciudadano.",
    "about.channels.eyebrow":  "CANALES Y FUENTES DEL CORPUS",
    "about.channels.intro":    "La base documental es una lectura cruzada del trabajo de los principales investigadores independientes y medios especializados del campo. Cada nodo del mapa está enlazado a los vídeos donde aparece:",
    "about.channels.list":     [
      "<strong>American Alchemy</strong> · Jesse Michels — gonzo journalism + foco técnico en propulsión",
      "<strong>Weaponized</strong> · Jeremy Corbell &amp; George Knapp — testimonios de whistleblowers",
      "<strong>NewsNation / Reality Check</strong> · Ross Coulthart — periodismo de investigación",
      "<strong>The Sol Foundation</strong> — simposios académicos: Nolan, Davis, Puthoff, Nell, Loeb…",
      "<strong>Richard Dolan</strong> — historiador clásico del fenómeno",
      "<strong>Area52 / DEBRIEFED</strong> — entrevistas largas a actores clave",
      "<strong>Jason Samosa</strong> — series temáticas largas (Vallée, Collins Elite, Pandulfi)",
      "<strong>UAP Gerb</strong> — investigador emergente con acceso directo a ex-militares",
      "<strong>Ashton Forbes</strong> — MH370, ZPE, free energy y warp drive",
      "<strong>That UFO Podcast</strong> · <strong>Polarity</strong> · <strong>VETTED</strong> · <strong>Dr. Steven Greer</strong> — cobertura complementaria"
    ],
    "about.coverage.eyebrow":  "COBERTURA ACTUAL",
    "about.coverage.note":     "Trabajo en proceso · El corpus crece episodio a episodio · Última actualización mayo 2026",
    "about.coverage.connections": "conexiones documentadas",
    "about.coverage.threads":  "hilos transversales",
    "about.yt.eyebrow":        "EL CANAL",
    "about.yt.title":          "Redescubriendo en YouTube",
    "about.yt.body":           "Cada episodio desgrana una pieza de este mapa. Suscríbete para seguir el hilo completo del fenómeno.",
    "about.yt.watch":          "Ver el canal",
    "about.yt.subscribe":      "Suscribirse",

    // ── Chat widget ──────────────────────────────────────────
    "chat.fab":                "Pregunta a Redescubriendo",
    "chat.title":              "Redescubriendo · IA",
    "chat.thinking":           "Pensando…",
    "chat.focused":            "Centrado en",
    "chat.connected":          "Conectado al mapa",
    "chat.intro":              "Soy una guía interna del mapa. Puedo explicar cualquier nodo que veas o ayudarte a orientarte si no sabes por dónde empezar.",
    "chat.placeholder":        "Pregunta sobre lo que ves…",
    "chat.error":              "No he podido responder ahora. Inténtalo de nuevo.",

    // ── Chat suggestions (generic) ───────────────────────────
    "chat.sugg.g0":            "¿Qué es Redescubriendo?",
    "chat.sugg.g1":            "¿Por dónde empiezo si no sé nada del fenómeno?",
    "chat.sugg.g2":            "¿Cuáles son los 3 eventos más importantes?",
    "chat.sugg.g3":            "¿Quién es David Grusch y por qué importa?",

    // ── Chat suggestions (person) ────────────────────────────
    "chat.sugg.person0":       "¿Por qué es relevante {name}?",
    "chat.sugg.person1":       "¿Qué dijo bajo juramento o por escrito?",
    "chat.sugg.person2":       "¿Qué otros nodos del mapa están relacionados con {name}?",

    // ── Chat suggestions (event) ─────────────────────────────
    "chat.sugg.event0":        "Resume {name} en 3 frases",
    "chat.sugg.event1":        "¿Por qué importa este caso hoy?",
    "chat.sugg.event2":        "¿Qué testigos lo respaldan?",

    // ── Chat suggestions (program) ───────────────────────────
    "chat.sugg.program0":      "¿Qué hace exactamente {name}?",
    "chat.sugg.program1":      "¿Quién lo dirige o lo dirigió?",
    "chat.sugg.program2":      "¿Está activo o se cerró?",

    // ── Chat suggestions (agency) ────────────────────────────
    "chat.sugg.agency0":       "¿Qué papel juega {name} en el fenómeno?",
    "chat.sugg.agency1":       "¿Quiénes han trabajado allí en este contexto?",
    "chat.sugg.agency2":       "¿Hay críticas documentadas?",

    // ── Chat suggestions (phenomenon) ────────────────────────
    "chat.sugg.phenomenon0":   "¿Por qué es el centro de todo esto?",
    "chat.sugg.phenomenon1":   "¿Qué nombres ha tenido a lo largo del tiempo?",
    "chat.sugg.phenomenon2":   "¿Por qué los gobiernos lo han ocultado?",
  },

  en: {
    // ── Topbar ──────────────────────────────────────────────
    "topbar.sub":              "Interactive Map · UAP/UFO",
    "topbar.langToggle":       "ES",

    // ── Tabs ────────────────────────────────────────────────
    "tabs.timelines":          "Timelines",
    "tabs.graph":              "Galaxy of Connections",
    "tabs.threads":            "Cross-cutting Threads",
    "tabs.about":              "About",

    // ── Counter ─────────────────────────────────────────────
    "counter.nodes":           "nodes",
    "counter.connections":     "connections",

    // ── Search ──────────────────────────────────────────────
    "search.placeholder":      "Search person, event, program…",

    // ── Filters ─────────────────────────────────────────────
    "filter.types":            "Types",
    "filter.all":              "all",
    "filter.channels":         "Channels / sources",
    "filter.threads":          "Cross-cutting Threads",

    // ── Type labels (sidebar buttons) ────────────────────────
    "type.person":             "People",
    "type.agency":             "Agencies",
    "type.event":              "Events",
    "type.program":            "Programs",
    "type.concept":            "Concepts",
    "type.channel":            "Channels",
    "type.phenomenon":         "Phenomenon",

    // ── Panel type labels (detail pill) ──────────────────────
    "panel.type.person":       "Person",
    "panel.type.agency":       "Agency / Group",
    "panel.type.event":        "Event",
    "panel.type.program":      "Program",
    "panel.type.concept":      "Concept / Topic",
    "panel.type.channel":      "Channel",
    "panel.type.phenomenon":   "Galactic Core",

    // ── Panel body ───────────────────────────────────────────
    "panel.close":             "close",
    "panel.featured":          "Featured Resource",
    "panel.appearsIn":         "Appears in",
    "panel.video":             "video",
    "panel.videos":            "videos",
    "panel.top":               "top",
    "panel.connections":       "Connections",
    "panel.noConnections":     "No connections detected.",

    // ── Graph legend ─────────────────────────────────────────
    "graph.hint":              "Click a node for details · Drag to rearrange · Scroll to zoom",

    // ── Zoom controls ────────────────────────────────────────
    "zoom.in":                 "Zoom in",
    "zoom.out":                "Zoom out",
    "zoom.reset":              "Reset view",

    // ── Fullscreen button ────────────────────────────────────
    "fs.full":                 "Fullscreen",
    "fs.exit":                 "Exit fullscreen",
    "fs.newTab":               "Open in new tab (fullscreen)",
    "fs.exitShort":            "Exit",
    "fs.openApart":            "Open separately",

    // ── Thread banner ────────────────────────────────────────
    "banner.viewing":          "Viewing thread:",
    "banner.viewAll":          "× view all",

    // ── Threads view ─────────────────────────────────────────
    "threads.eyebrow":         "DETECTED PATTERNS",
    "threads.heading1":        "Cross-cutting",
    "threads.heading2":        "Threads",
    "threads.desc":            "Recurring patterns that span channels, eras, and witnesses. Each thread isolates a navigable subgraph of co-occurring entities.",
    "threads.stat.threads":    "threads",
    "threads.stat.nodes":      "nodes",
    "threads.stat.connections":"connections",
    "threads.goTo":            "Go to constellation",
    "threads.nodeCount":       "nodes",

    // ── Timelines view ───────────────────────────────────────
    "tl.eyebrow":              "TIMELINES",

    // ── About view ───────────────────────────────────────────
    "about.eyebrow":           "THE PROJECT",
    "about.lead":              "<em>Redescubriendo</em> is a podcast by Carlos Díaz, born with the ambition of offering people a <strong>first serious source</strong> on the UAP/UFO phenomenon — and, above all, on what governments have done and continue to do with this information.",
    "about.p1":                "The challenge of looking at this entire corpus objectively is that, <em>regardless of whether aliens exist or not</em>, there is a fact that can no longer be ignored: for decades, <strong>many governments — if not all those who knew anything — have withheld information from their populations</strong>. And there is a real, physically measured and witnessed unidentified phenomenon that deserves to be at the center of the conversation.",
    "about.p2":                "The goal is not to sell a conclusion but to <strong>bring the debate to the fore</strong> and begin to understand the consequences it entails. This website is a navigation tool that will grow over time — for now it brings together more than 300 videos alongside other documents and sources that have fed into the timelines.",
    "about.p3":                "This is a work <em>in progress</em>. We are all on this journey of understanding what is happening and, in some way, we all need to help those who know a little less so that, together, we can all know a little more.",
    "about.pillars.eyebrow":   "TOPICS, EVENTS AND FIGURES YOU SHOULDN'T IGNORE",
    "about.pillar1.title":     "David Grusch and the Congressional Hearing",
    "about.pillar1.body":      "In July 2023, a former intelligence officer with impeccable credentials testified <strong>under oath</strong> before the U.S. Congress that the government possesses covert programs for the recovery of craft of non-human origin. The ICIG classified his complaint as <em>urgent and credible</em>. It is the pivotal moment of the entire \"post-Grusch era\".",
    "about.pillar2.title":     "Project Blue Book and the Cover-up Trilogy",
    "about.pillar2.body":      "Sign (1947) → Grudge → Blue Book (closed 1969). The USAF's official response to the UFO phenomenon for 22 years. The <strong>Bolander memo</strong> publicly closed the program but the investigation continued in secret, paving the way for the modern AATIP.",
    "about.pillar3.title":     "Project Stargate — Psychic Spying",
    "about.pillar3.body":      "17 of the 19 U.S. intelligence agencies obtained positive results using remote viewing (1978-1995). Operators such as Joe McMoneagle located verifiable targets. Telepathy and psionics as real operational capabilities — not speculation.",
    "about.pillar4.title":     "Recent Congressional Testimony",
    "about.pillar4.body":      "The 2023-2025 hearings (Grusch, Fravor, Graves; then Mellon, McConnell, Gallaudet, Davis) represent the largest chain of official sworn testimony in the history of the field. For the first time, senators and congressmembers openly acknowledge that <em>objects exist that neither Congress nor the departments can identify</em>.",
    "about.pillar5.title":     "Official U.S. Government UAP Website (May 2026)",
    "about.pillar5.body":      "The creation of an official UAP disclosure portal by the U.S. executive marks a structural shift: for the first time the administration recognizes the phenomenon as a legitimate category of public communication with citizens.",
    "about.channels.eyebrow":  "CHANNELS AND SOURCES OF THE CORPUS",
    "about.channels.intro":    "The documentary base is a cross-reading of the work of the leading independent researchers and specialist media in the field. Each node on the map is linked to the videos where it appears:",
    "about.channels.list":     [
      "<strong>American Alchemy</strong> · Jesse Michels — gonzo journalism + technical focus on propulsion",
      "<strong>Weaponized</strong> · Jeremy Corbell &amp; George Knapp — whistleblower testimony",
      "<strong>NewsNation / Reality Check</strong> · Ross Coulthart — investigative journalism",
      "<strong>The Sol Foundation</strong> — academic symposia: Nolan, Davis, Puthoff, Nell, Loeb…",
      "<strong>Richard Dolan</strong> — classic historian of the phenomenon",
      "<strong>Area52 / DEBRIEFED</strong> — long-form interviews with key figures",
      "<strong>Jason Samosa</strong> — long thematic series (Vallée, Collins Elite, Pandulfi)",
      "<strong>UAP Gerb</strong> — emerging researcher with direct access to ex-military",
      "<strong>Ashton Forbes</strong> — MH370, ZPE, free energy and warp drive",
      "<strong>That UFO Podcast</strong> · <strong>Polarity</strong> · <strong>VETTED</strong> · <strong>Dr. Steven Greer</strong> — complementary coverage"
    ],
    "about.coverage.eyebrow":  "CURRENT COVERAGE",
    "about.coverage.note":     "Work in progress · The corpus grows episode by episode · Last updated May 2026",
    "about.coverage.connections": "documented connections",
    "about.coverage.threads":  "cross-cutting threads",
    "about.yt.eyebrow":        "THE CHANNEL",
    "about.yt.title":          "Redescubriendo on YouTube",
    "about.yt.body":           "Each episode unpacks a piece of this map. Subscribe to follow the full thread of the phenomenon.",
    "about.yt.watch":          "Watch the channel",
    "about.yt.subscribe":      "Subscribe",

    // ── Chat widget ──────────────────────────────────────────
    "chat.fab":                "Ask Redescubriendo",
    "chat.title":              "Redescubriendo · AI",
    "chat.thinking":           "Thinking…",
    "chat.focused":            "Focused on",
    "chat.connected":          "Connected to the map",
    "chat.intro":              "I'm an internal guide to the map. I can explain any node you see or help you get oriented if you don't know where to start.",
    "chat.placeholder":        "Ask about what you see…",
    "chat.error":              "I couldn't respond right now. Please try again.",

    // ── Chat suggestions (generic) ───────────────────────────
    "chat.sugg.g0":            "What is Redescubriendo?",
    "chat.sugg.g1":            "Where do I start if I know nothing about the phenomenon?",
    "chat.sugg.g2":            "What are the 3 most important events?",
    "chat.sugg.g3":            "Who is David Grusch and why does he matter?",

    // ── Chat suggestions (person) ────────────────────────────
    "chat.sugg.person0":       "Why is {name} relevant?",
    "chat.sugg.person1":       "What did they say under oath or in writing?",
    "chat.sugg.person2":       "What other nodes on the map are connected to {name}?",

    // ── Chat suggestions (event) ─────────────────────────────
    "chat.sugg.event0":        "Summarize {name} in 3 sentences",
    "chat.sugg.event1":        "Why does this case matter today?",
    "chat.sugg.event2":        "Which witnesses support it?",

    // ── Chat suggestions (program) ───────────────────────────
    "chat.sugg.program0":      "What exactly does {name} do?",
    "chat.sugg.program1":      "Who runs or ran it?",
    "chat.sugg.program2":      "Is it active or was it closed?",

    // ── Chat suggestions (agency) ────────────────────────────
    "chat.sugg.agency0":       "What role does {name} play in the phenomenon?",
    "chat.sugg.agency1":       "Who has worked there in this context?",
    "chat.sugg.agency2":       "Are there documented criticisms?",

    // ── Chat suggestions (phenomenon) ────────────────────────
    "chat.sugg.phenomenon0":   "Why is this the center of everything?",
    "chat.sugg.phenomenon1":   "What names has it had over time?",
    "chat.sugg.phenomenon2":   "Why have governments hidden it?",
  }
};

// ── useT hook ──────────────────────────────────────────────────────────────
// Returns { t, lang } where t(key) looks up I18N[lang][key] with ES fallback.
// Re-renders when the 'rdcLangChange' custom event fires.
window.useT = function useT() {
  const [lang, setLang] = React.useState(function() {
    return localStorage.getItem('lang') ||
           new URLSearchParams(window.location.search).get('lang') ||
           'es';
  });

  React.useEffect(function() {
    function handler(e) { setLang(e.detail); }
    window.addEventListener('rdcLangChange', handler);
    return function() { window.removeEventListener('rdcLangChange', handler); };
  }, []);

  function t(key) {
    var dict = window.I18N[lang] || window.I18N.es;
    var val = dict[key];
    if (val !== undefined) return val;
    // fallback to ES
    val = window.I18N.es[key];
    return val !== undefined ? val : key;
  }

  return { t: t, lang: lang };
};

// ── changeLang ─────────────────────────────────────────────────────────────
window.changeLang = function changeLang(newLang) {
  localStorage.setItem('lang', newLang);
  try {
    var url = new URL(window.location.href);
    url.searchParams.set('lang', newLang);
    history.replaceState(null, '', url.toString());
  } catch(e) {}
  window.dispatchEvent(new CustomEvent('rdcLangChange', { detail: newLang }));
};

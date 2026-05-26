// REDESCUBRIENDO — AI chat widget powered by window.claude.complete

const { useState: useStateChat, useEffect: useEffectChat, useRef: useRefChat } = React;

function ChatWidget({ data, selectedNode, filters, threadId, onMode }) {
  const [open, setOpen] = useStateChat(false);
  const [messages, setMessages] = useStateChat([]);
  const [input, setInput] = useStateChat("");
  const [thinking, setThinking] = useStateChat(false);
  const bodyRef = useRefChat(null);

  // Notify parent of mode so the galaxy can animate accordingly
  useEffectChat(() => {
    if (!onMode) return;
    if (!open) onMode("closed");
    else if (thinking) onMode("thinking");
    else onMode("open");
  }, [open, thinking, onMode]);

  // Scroll to bottom on new message
  useEffectChat(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, thinking]);

  // Build dense context describing what the user is seeing
  const buildContext = () => {
    const parts = [];
    if (selectedNode) {
      const node = selectedNode;
      parts.push(`El usuario tiene seleccionado el nodo "${node.name}" (${node.type}${node.role ? ", " + node.role : ""}).`);
      if (node.bio) parts.push(`Ficha: ${node.bio.substring(0, 800)}`);
      const conn = [];
      for (const e of data.edges) {
        if (e[0] === node.id) { const o = data.nodes.find(n => n.id === e[1]); if (o) conn.push(o.name); }
        if (e[1] === node.id) { const o = data.nodes.find(n => n.id === e[0]); if (o) conn.push(o.name); }
      }
      if (conn.length) parts.push(`Conectado con: ${[...new Set(conn)].slice(0, 25).join(", ")}.`);
    }
    if (threadId) {
      const th = data.threads.find(t => t.id === threadId);
      if (th) parts.push(`Hilo activo: "${th.title}" — ${th.desc}`);
    }
    const activeBlocs = Object.entries(filters.blocs).filter(([k,v]) => v).map(([k]) => k);
    if (activeBlocs.length) parts.push(`Canales filtrados activos: ${activeBlocs.join(", ")}.`);
    return parts.join("\n");
  };

  const ask = async (q) => {
    const text = (q || "").trim();
    if (!text) return;
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setInput("");
    setThinking(true);
    try {
      const ctx = buildContext();
      const sys =
        "Eres Redescubriendo, la guía interna del podcast del mismo nombre sobre el fenómeno UAP/OVNI. " +
        "Hablas con la gente que está explorando el mapa. " +
        "TONO: cercano y humano, como un amigo bien informado que te explica algo apasionante. Neutral en el juicio (ni creyente ni escéptico), pero NO técnico ni periodístico-distante. " +
        "REGLAS DURAS:\n" +
        "- NO cites cifras del corpus (nº de entidades, conexiones, vídeos). El usuario ya las ve.\n" +
        "- NO presumas del mapa ni hables de 'la base de datos'. Habla del fenómeno, no de la app.\n" +
        "- Sé conciso: 2–5 frases, lenguaje directo y cálido. Si la pregunta es abierta, ofrece un punto de entrada concreto.\n" +
        "- Si conoces nombres exactos del mapa, menciónalos en negrita conceptual (sin asteriscos), para que el usuario sepa qué buscar.\n" +
        "- Si te preguntan algo fuera del corpus, di lo que sepas brevemente y propón por dónde tirar." +
        (ctx ? "\n\nContexto que tienes ahora (úsalo si encaja, no lo expongas):\n" + ctx : "");
      const resp = await window.claude.complete({
        messages: [
          { role: "user", content: sys + "\n\n=== PREGUNTA ===\n" + text }
        ]
      });
      setMessages(prev => [...prev, { role: "assistant", content: resp }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "No he podido responder ahora (" + (e?.message || "error") + "). Inténtalo de nuevo." }]);
    } finally {
      setThinking(false);
    }
  };

  const suggestions = (() => {
    if (selectedNode) {
      const n = selectedNode;
      if (n.type === "person") return [
        `¿Por qué es relevante ${n.name}?`,
        `¿Qué dijo bajo juramento o por escrito?`,
        `¿Qué otros nodos del mapa están relacionados con ${n.name}?`
      ];
      if (n.type === "event") return [
        `Resume ${n.name} en 3 frases`,
        `¿Por qué importa este caso hoy?`,
        `¿Qué testigos lo respaldan?`
      ];
      if (n.type === "program") return [
        `¿Qué hace exactamente ${n.name}?`,
        `¿Quién lo dirige o lo dirigió?`,
        `¿Está activo o se cerró?`
      ];
      if (n.type === "agency") return [
        `¿Qué papel juega ${n.name} en el fenómeno?`,
        `¿Quiénes han trabajado allí en este contexto?`,
        `¿Hay críticas documentadas?`
      ];
      if (n.type === "phenomenon") return [
        `¿Por qué es el centro de todo esto?`,
        `¿Qué nombres ha tenido a lo largo del tiempo?`,
        `¿Por qué los gobiernos lo han ocultado?`
      ];
    }
    return [
      "¿Qué es Redescubriendo?",
      "¿Por dónde empiezo si no sé nada del fenómeno?",
      "¿Cuáles son los 3 eventos más importantes?",
      "¿Quién es David Grusch y por qué importa?"
    ];
  })();

  return (
    <>
      {!open && (
        <button className="chat-fab" onClick={() => setOpen(true)} title="Pregunta a Redescubriendo">
          <span className="chat-fab-orb"><span className="chat-fab-pulse"></span></span>
          <span className="chat-fab-text">Pregunta a Redescubriendo</span>
        </button>
      )}
      {open && (
        <div className="chat-widget">
          <div className="chat-head">
            <span className="chat-head-orb"></span>
            <div className="chat-head-info">
              <div className="chat-head-title">Redescubriendo · IA</div>
              <div className={`chat-head-status ${thinking ? "thinking" : ""}`}>
                {thinking ? "Pensando…" : (selectedNode ? `Centrado en ${selectedNode.name}` : "Conectado al mapa")}
              </div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="chat-body" ref={bodyRef}>
            {messages.length === 0 && (
              <div className="chat-intro">
                <p>Soy una guía interna del mapa. Puedo explicar cualquier nodo que veas o ayudarte a orientarte si no sabes por dónde empezar.</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>
                {m.role === "assistant" && <span className="chat-msg-orb"></span>}
                <div className="chat-msg-text">{m.content}</div>
              </div>
            ))}
            {thinking && (
              <div className="chat-msg assistant">
                <span className="chat-msg-orb"></span>
                <div className="chat-msg-text typing"><span></span><span></span><span></span></div>
              </div>
            )}
          </div>
          {!thinking && (
            <div className="chat-suggestions">
              {suggestions.slice(0, 3).map((s, i) => (
                <button key={i} className="chat-sugg" onClick={() => ask(s)}>{s}</button>
              ))}
            </div>
          )}
          <form className="chat-form" onSubmit={(e) => { e.preventDefault(); ask(input); }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Pregunta sobre lo que ves…"
              disabled={thinking}
            />
            <button type="submit" disabled={thinking || !input.trim()}>→</button>
          </form>
        </div>
      )}
    </>
  );
}

window.ChatWidget = ChatWidget;

// REDESCUBRIENDO — AI chat widget powered by window.claude.complete

const { useState: useStateChat, useEffect: useEffectChat, useRef: useRefChat } = React;

// Render **bold** and line breaks from model output
const renderText = (text) => {
  return text.split('\n').reduce((acc, line, lineIdx) => {
    if (lineIdx > 0) acc.push(React.createElement('br', { key: 'br-' + lineIdx }));
    const parts = line.split(/(\*{1,3}[^*]+\*{1,3})/g);
    parts.forEach((part, i) => {
      const match = part.match(/^\*{1,3}([^*]+)\*{1,3}$/);
      if (match) acc.push(React.createElement('strong', { key: lineIdx + '-' + i }, match[1]));
      else if (part) acc.push(part);
    });
    return acc;
  }, []);
};

function ChatWidget({ data, selectedNode, filters, threadId, onMode, lang }) {
  const { t } = window.useT();
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
      const th = data.threads.find(thr => thr.id === threadId);
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
      const isEN = lang === "en";
      const sys = isEN
        ? "You are Redescubriendo, the internal guide of the podcast of the same name about the UAP/UFO phenomenon. " +
          "You speak with people exploring the map. " +
          "TONE: warm and human, like a knowledgeable friend explaining something fascinating. Neutral in judgment (neither believer nor skeptic), but NOT technical or journalistically distant. " +
          "HARD RULES:\n" +
          "- Do NOT cite corpus statistics (node count, connection count, video count). The user can already see them.\n" +
          "- Do NOT boast about the map or talk about 'the database'. Talk about the phenomenon, not the app.\n" +
          "- Be concise: 2–5 sentences, direct and warm language. If the question is open-ended, offer a concrete entry point.\n" +
          "- If you know exact names from the map, write them between double asterisks like this: **Name**, so they appear in bold.\n" +
          "- If asked something outside the corpus, say what you know briefly and suggest where to look." +
          (ctx ? "\n\nContext you have now (use it if relevant, don't expose it):\n" + ctx : "")
        : "Eres Redescubriendo, la guía interna del podcast del mismo nombre sobre el fenómeno UAP/OVNI. " +
          "Hablas con la gente que está explorando el mapa. " +
          "TONO: cercano y humano, como un amigo bien informado que te explica algo apasionante. Neutral en el juicio (ni creyente ni escéptico), pero NO técnico ni periodístico-distante. " +
          "REGLAS DURAS:\n" +
          "- NO cites cifras del corpus (nº de entidades, conexiones, vídeos). El usuario ya las ve.\n" +
          "- NO presumas del mapa ni hables de 'la base de datos'. Habla del fenómeno, no de la app.\n" +
          "- Sé conciso: 2–5 frases, lenguaje directo y cálido. Si la pregunta es abierta, ofrece un punto de entrada concreto.\n" +
          "- Si conoces nombres exactos del mapa, escríbelos entre dobles asteriscos así: **Nombre**, para que se muestren en negrita.\n" +
          "- Si te preguntan algo fuera del corpus, di lo que sepas brevemente y propón por dónde tirar." +
          (ctx ? "\n\nContexto que tienes ahora (úsalo si encaja, no lo expongas):\n" + ctx : "");

      const res = await fetch("https://rdc-chat.redescubriendopodcast.workers.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: sys + "\n\n=== " + (isEN ? "QUESTION" : "PREGUNTA") + " ===\n" + text }]
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.text }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: t("chat.error").replace("...", e?.message || "error") }]);
    } finally {
      setThinking(false);
    }
  };

  const fillName = (str, name) => str.replace("{name}", name);

  const suggestions = (() => {
    if (selectedNode) {
      const n = selectedNode;
      if (n.type === "person") return [
        fillName(t("chat.sugg.person0"), n.name),
        t("chat.sugg.person1"),
        fillName(t("chat.sugg.person2"), n.name)
      ];
      if (n.type === "event") return [
        fillName(t("chat.sugg.event0"), n.name),
        t("chat.sugg.event1"),
        t("chat.sugg.event2")
      ];
      if (n.type === "program") return [
        fillName(t("chat.sugg.program0"), n.name),
        t("chat.sugg.program1"),
        t("chat.sugg.program2")
      ];
      if (n.type === "agency") return [
        fillName(t("chat.sugg.agency0"), n.name),
        t("chat.sugg.agency1"),
        t("chat.sugg.agency2")
      ];
      if (n.type === "phenomenon") return [
        t("chat.sugg.phenomenon0"),
        t("chat.sugg.phenomenon1"),
        t("chat.sugg.phenomenon2")
      ];
    }
    return [
      t("chat.sugg.g0"),
      t("chat.sugg.g1"),
      t("chat.sugg.g2"),
      t("chat.sugg.g3")
    ];
  })();

  const statusText = thinking
    ? t("chat.thinking")
    : selectedNode
      ? t("chat.focused") + " " + selectedNode.name
      : t("chat.connected");

  return (
    <>
      {!open && (
        <button className="chat-fab" onClick={() => setOpen(true)} title={t("chat.fab")}>
          <span className="chat-fab-orb"><span className="chat-fab-pulse"></span></span>
          <span className="chat-fab-text">{t("chat.fab")}</span>
        </button>
      )}
      {open && (
        <div className="chat-widget">
          <div className="chat-head">
            <span className="chat-head-orb"></span>
            <div className="chat-head-info">
              <div className="chat-head-title">{t("chat.title")}</div>
              <div className={`chat-head-status ${thinking ? "thinking" : ""}`}>
                {statusText}
              </div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="chat-body" ref={bodyRef}>
            {messages.length === 0 && (
              <div className="chat-intro">
                <p>{t("chat.intro")}</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>
                {m.role === "assistant" && <span className="chat-msg-orb"></span>}
                <div className="chat-msg-text">{renderText(m.content)}</div>
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
              placeholder={t("chat.placeholder")}
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

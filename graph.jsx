// REDESCUBRIENDO — 3D galaxy network graph in canvas (pure JS, no library)

const TYPE_COLORS = {
  person:    "#7ee0ff",
  agency:    "#ffb86b",
  event:     "#ff6b9d",
  program:   "#b48cff",
  concept:   "#7cffb8",
  channel:   "#ffe06b",
  phenomenon:"#ffffff"
};

const TYPE_LABEL_ES = {
  person:    "Personas",
  agency:    "Agencias",
  event:     "Eventos",
  program:   "Programas",
  concept:   "Conceptos",
  channel:   "Canales",
  phenomenon:"Fenómeno"
};

function NetworkGraph({ data, selectedId, onSelect, filters, tweaks, focusId, chatMode }) {
  const canvasRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const stateRef = React.useRef({
    nodes: [],
    edges: [],
    rotX: 0.68,
    rotY: 0,
    zoom: 1.5,
    pan: { x: 0, y: 0 },
    galaxyRot: 0,
    convergence: 0,        // 0 = normal galaxy, 1 = fully converged (chat orb mode)
    pulse: 0,              // for the thinking pulse
    drag: null,
    pending: null,
    rotate: null,
    panDrag: null,
    hover: null,
    raf: null,
    lastTime: 0,
    lastInteraction: 0,
    size: { w: 800, h: 600 },
    alpha: 1
  });
  // Sync chatMode into state ref so the render loop reads the latest
  stateRef.current.chatMode = chatMode || "closed";

  // ============== BUILD NODES + HOME POSITIONS (3D) ==============
  React.useEffect(() => {
    const st = stateRef.current;
    if (containerRef.current) {
      const r = containerRef.current.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) st.size = { w: r.width, h: r.height };
    }
    const activeTypes = new Set(Object.keys(filters.types).filter(k => filters.types[k]));
    const activeBlocs = new Set(Object.keys(filters.blocs).filter(k => filters.blocs[k]).map(Number));

    const visibleNodes = data.nodes.filter(n => {
      if (!activeTypes.has(n.type)) return false;
      if (activeBlocs.size && n.blocs && n.blocs.length) {
        if (!n.blocs.some(b => activeBlocs.has(b))) return false;
      }
      return true;
    });
    const idSet = new Set(visibleNodes.map(n => n.id));
    const visibleEdges = data.edges.filter(e => idSet.has(e[0]) && idSet.has(e[1]));

    // Preserve positions for nodes already simulated
    const oldPos = {};
    st.nodes.forEach(n => { oldPos[n.id] = { x: n.x, y: n.y, z: n.z, vx: n.vx, vy: n.vy, vz: n.vz }; });

    // === 3D GALAXY HOME POSITIONS ===
    // Galaxy disk lies in XZ plane; Y is thickness (small).
    // 13 spiral arms, one per canal.
    const minDim = Math.min(st.size.w, st.size.h);
    const maxR = minDim * 0.46;
    const channelR = minDim * 0.32;
    const hubR = minDim * 0.06;
    const thickness = minDim * 0.022; // flatter -> more disc-like
    const NUM_ARMS = 13;
    const SPIRAL_TWIST = 1.25; // more pronounced spiral arms

    let maxDeg = 1;
    for (const n of visibleNodes) maxDeg = Math.max(maxDeg, n.degree || 0);

    const computeHome = (n, i) => {
      const c = n.canal || 0;
      const dn = (n.degree || 0) / maxDeg;
      const phase = (i * 0.6180339) % 1; // golden-ratio jitter
      const yJitter = (Math.sin(i * 12.9898) * 43758.5453 % 1) - 0.5; // deterministic pseudo-random
      let homeR, homeA;
      if (n.type === "channel") {
        const arm = (c - 1) / NUM_ARMS;
        homeA = arm * Math.PI * 2;
        homeR = channelR * 0.95;
      } else if (c === 0) {
        homeA = phase * Math.PI * 2;
        homeR = hubR * (0.4 + phase * 0.7);
      } else {
        const arm = (c - 1) / NUM_ARMS;
        const baseAngle = arm * Math.PI * 2;
        const tRad = 1 - Math.pow(dn, 0.55);
        const minR = channelR * 0.32;
        const baseR = minR + tRad * (maxR - minR);
        const wedge = (Math.PI * 2 / NUM_ARMS) * 0.55;
        const angleJitter = (phase - 0.5) * wedge;
        const spiral = baseR / maxR * SPIRAL_TWIST;
        homeA = baseAngle + angleJitter + spiral;
        homeR = baseR;
      }
      return {
        hx: Math.cos(homeA) * homeR,
        hy: yJitter * thickness * (n.type === "channel" ? 0.3 : 1),
        hz: Math.sin(homeA) * homeR
      };
    };

    st.nodes = visibleNodes.map((n, i) => {
      const prev = oldPos[n.id];
      const home = computeHome(n, i);
      // The phenomenon stays anchored at the galactic center
      if (n.type === "phenomenon") {
        return {
          ...n,
          hx: 0, hy: 0, hz: 0,
          x: 0, y: 0, z: 0,
          vx: 0, vy: 0, vz: 0,
          deg: 0, px: 0, py: 0, scale: 1, depth: 0
        };
      }
      return {
        ...n,
        hx: home.hx, hy: home.hy, hz: home.hz,
        x: prev?.x ?? home.hx + (Math.random() - 0.5) * 20,
        y: prev?.y ?? home.hy + (Math.random() - 0.5) * 10,
        z: prev?.z ?? home.hz + (Math.random() - 0.5) * 20,
        vx: prev?.vx ?? 0,
        vy: prev?.vy ?? 0,
        vz: prev?.vz ?? 0,
        deg: 0,
        px: 0, py: 0, scale: 1, depth: 0
      };
    });
    const nodeById = {};
    st.nodes.forEach(n => { nodeById[n.id] = n; });
    st.edges = visibleEdges.map(e => {
      const s = nodeById[e[0]]; const t = nodeById[e[1]];
      s.deg++; t.deg++;
      return { source: s, target: t, kind: e[2], note: e[3] || "" };
    });

    runSimulation3D(st, 200, 1.0);
    st.alpha = 0.4;
  }, [data, filters]);

  // ============== CANVAS SIZING ==============
  React.useEffect(() => {
    if (!containerRef.current) return;
    const applySize = (w, h) => {
      const cv = canvasRef.current;
      if (!cv) return;
      const dpr = window.devicePixelRatio || 1;
      cv.width = w * dpr;
      cv.height = h * dpr;
      cv.style.width = w + "px";
      cv.style.height = h + "px";
      const ctx = cv.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stateRef.current.size = { w, h };
    };
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applySize(rect.width, rect.height);
    const ro = new ResizeObserver(entries => {
      const e = entries[0];
      applySize(e.contentRect.width, e.contentRect.height);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // ============== FOCUS ON NODE (zoom + center) ==============
  React.useEffect(() => {
    if (!focusId) return;
    const st = stateRef.current;
    const id = focusId.split(":")[0];
    const node = st.nodes.find(n => n.id === id);
    if (!node) return;
    // Re-center pan so node sits in the middle of the VISIBLE area.
    // The detail panel (380px) covers the right side, so shift target left by ~190px.
    const PANEL_W = 380;
    const targetX = (st.size.w - PANEL_W) / 2;
    const proj = projectPoint(node.x, node.y, node.z, st);
    st.pan.x -= (proj.px - targetX);
    st.pan.y -= (proj.py - st.size.h / 2);
    st.alpha = Math.max(st.alpha, 0.3);
  }, [focusId]);

  // ============== RENDER + SIMULATION LOOP ==============
  React.useEffect(() => {
    const cv = canvasRef.current;
    const ctx = cv.getContext("2d");
    const st = stateRef.current;
    st.alpha = 1;

    const step = (t) => {
      const dt = t - (st.lastTime || t);
      st.lastTime = t;
      const W = st.size.w, H = st.size.h;

      // Auto-rotation when idle (galaxy spins around its center; camera stays still)
      const isInteracting = st.drag || st.rotate || st.panDrag || st.pending;
      const idleMs = t - (st.lastInteraction || 0);
      const chatActive = st.chatMode && st.chatMode !== "closed";
      const shouldAutoRotate = !selectedId && !isInteracting && idleMs > 1500 && !chatActive;
      if (shouldAutoRotate) {
        st.galaxyRot += 0.00009 * dt;
      }

      // Convergence ramp: 0 = normal galaxy, 1 = converged into Jarvis orb
      const targetConv = chatActive ? 1 : 0;
      st.convergence += (targetConv - st.convergence) * 0.05;
      if (st.chatMode === "thinking") {
        st.pulse += 0.003 * dt;
      } else {
        st.pulse += 0.0008 * dt;
      }

      // Simulation: pause if user has selected something (so connections don't wiggle when reading)
      const lockedForReading = !!selectedId;
      if ((st.alpha || 0) > 0.001 && !lockedForReading) {
        runSimulation3D(st, 1, tweaks.spread || 1);
        st.alpha = Math.max(0, st.alpha - 0.008);
      } else if (lockedForReading && st.drag) {
        runSimulation3D(st, 1, tweaks.spread || 1);
      }

      // project all nodes (blend between galaxy position and Jarvis sphere)
      const conv = st.convergence;
      const N = st.nodes.length;
      const minDim = Math.min(st.size.w, st.size.h);
      // Sphere radius sized so it sits inside the galaxy disk comfortably
      const baseR = minDim * 0.22;
      // Subtle organic pulse when thinking (breathing effect for the sphere)
      const pulseR = st.chatMode === "thinking"
        ? baseR * (1 + 0.04 * Math.sin(st.pulse) + 0.02 * Math.sin(st.pulse * 2.3))
        : baseR;
      // Independent sphere rotation while in chat mode (slow, hypnotic)
      const sphereRot = st.sphereRot || 0;
      st.sphereRot = sphereRot + 0.00012 * dt * (conv > 0.05 ? 1 : 0);

      for (let i = 0; i < N; i++) {
        const n = st.nodes[i];
        let ex, ey, ez;
        if (n.type === "phenomenon" || conv < 0.001) {
          ex = n.x * (1 - conv);
          ey = n.y * (1 - conv);
          ez = n.z * (1 - conv);
        } else {
          // Fibonacci sphere distribution
          const phi = Math.acos(1 - 2 * (i + 0.5) / N);
          const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5) + st.sphereRot;
          let sx = pulseR * Math.sin(phi) * Math.cos(theta);
          let sy = pulseR * Math.cos(phi);
          let sz = pulseR * Math.sin(phi) * Math.sin(theta);
          // Per-node tiny breathing offset for organic feel during thinking
          if (st.chatMode === "thinking") {
            const j = Math.sin(i * 7.1 + st.pulse * 3) * 4;
            sx += sx * 0.02 * j / 4;
            sy += sy * 0.02 * j / 4;
            sz += sz * 0.02 * j / 4;
          }
          ex = n.x * (1 - conv) + sx * conv;
          ey = n.y * (1 - conv) + sy * conv;
          ez = n.z * (1 - conv) + sz * conv;
        }
        const p = projectPoint(ex, ey, ez, st);
        n.px = p.px; n.py = p.py; n.scale = p.scale; n.depth = p.depth;
      }

      // === RENDER ===
      ctx.clearRect(0, 0, W, H);

      // Galaxy backdrop in 3D — render rings projected
      drawGalaxyBackdrop(ctx, st);

      // Determine highlight set
      const selectedNode = selectedId ? st.nodes.find(n => n.id === selectedId) : null;
      const focus = selectedNode || st.hover;
      const connected = new Set();
      if (focus) {
        connected.add(focus.id);
        for (const e of st.edges) {
          if (e.source === focus) connected.add(e.target.id);
          if (e.target === focus) connected.add(e.source.id);
        }
      }
      const dim = !!focus;

      // === EDGES (z-sorted) ===
      // Sort edges by average depth so back ones draw first
      const sortedEdges = st.edges.slice().sort((a, b) =>
        (b.source.depth + b.target.depth) - (a.source.depth + a.target.depth)
      );
      for (const e of sortedEdges) {
        const isHi = focus && (e.source === focus || e.target === focus);
        const depthAvg = (e.source.depth + e.target.depth) / 2;
        const depthAlpha = Math.max(0.3, Math.min(1, 1 - depthAvg / 1000));
        // During convergence, edges become the bright wireframe of the polyhedron
        const convBoost = st.convergence;
        const baseEdge = isHi ? 0.95 : (dim ? 0.04 : 0.10);
        const wireEdge = 0.55;
        const alphaEdge = baseEdge * (1 - convBoost) + wireEdge * convBoost;
        ctx.globalAlpha = alphaEdge * depthAlpha;
        ctx.strokeStyle = (convBoost > 0.3 || isHi) ? "#bff5ff" : "#7ee0ff";
        ctx.lineWidth = isHi ? 1.4 : (0.5 + convBoost * 0.6);
        if (isHi || convBoost > 0.5) {
          ctx.shadowColor = "#7ee0ff";
          ctx.shadowBlur = isHi ? 10 : (4 + convBoost * 6);
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.beginPath();
        ctx.moveTo(e.source.px, e.source.py);
        ctx.lineTo(e.target.px, e.target.py);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // === NODES (z-sorted: far → near) ===
      // Separate the phenomenon (rendered as a special black-hole below/above based on depth)
      const phenomenonNode = st.nodes.find(n => n.type === "phenomenon");
      const orbitableNodes = st.nodes.filter(n => n.type !== "phenomenon");
      const sortedNodes = orbitableNodes.slice().sort((a, b) => b.depth - a.depth);

      // === FAINT ATTRACTION LINES from orbs toward the phenomenon (the "pull") ===
      if (phenomenonNode) {
        ctx.globalAlpha = 0.06;
        ctx.strokeStyle = "#7ee0ff";
        ctx.lineWidth = 0.3;
        for (const n of orbitableNodes) {
          if (focus && !connected.has(n.id) && n !== focus) continue; // dim non-related when focused
          // gradient line from node to center, but draw simple thin line for perf
          ctx.beginPath();
          ctx.moveTo(n.px, n.py);
          ctx.lineTo(phenomenonNode.px, phenomenonNode.py);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      // === BLACK HOLE (the phenomenon at the galactic center) — draw FIRST so it sits behind orbs ===
      if (phenomenonNode && phenomenonNode.depth > 0) {
        drawBlackHole(ctx, phenomenonNode, focus === phenomenonNode, t);
      }

      for (const n of sortedNodes) {
        const isFocus = focus === n;
        const isHover = st.hover === n && st.hover !== selectedNode;
        const isConn = connected.has(n.id);
        // Size: selected biggest, hovered intermediate, connections smaller, others normal
        const sizeMul = isFocus ? 1.25 : (isHover ? 1.1 : (isConn ? 0.85 : 1));
        const r = Math.max(2.2, nodeRadius(n) * n.scale * sizeMul);
        let color = TYPE_COLORS[n.type] || "#fff";
        // During chat thinking: shift all colors toward cyan with a soft pulse
        if (st.convergence > 0.05) {
          const pulseAmt = st.chatMode === "thinking"
            ? 0.5 + 0.35 * Math.sin(st.pulse)
            : 0.4;
          color = blendColors(color, "#bff5ff", st.convergence * pulseAmt);
        }
        const dimmed = dim && !isConn && !isHover;
        const depthAlpha = Math.max(0.4, Math.min(1, 1 - n.depth / 1200));
        ctx.globalAlpha = (dimmed ? 0.18 : 1) * depthAlpha;

        // === OUTER GLOW (atmospheric halo) ===
        if (!dimmed) {
          const glowR = r * (isFocus ? 5.5 : (isConn ? 2.2 : 2.8));
          const glowAlpha = isFocus ? 0.7 : (isConn ? 0.22 : 0.32);
          const glowGrad = ctx.createRadialGradient(n.px, n.py, r * 0.6, n.px, n.py, glowR);
          glowGrad.addColorStop(0, hexA(color, glowAlpha));
          glowGrad.addColorStop(0.5, hexA(color, glowAlpha * 0.35));
          glowGrad.addColorStop(1, hexA(color, 0));
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(n.px, n.py, glowR, 0, Math.PI * 2);
          ctx.fill();
        }

        // === ORB BODY (3D radial gradient) ===
        const hx = n.px - r * 0.35;
        const hy = n.py - r * 0.35;
        const bodyGrad = ctx.createRadialGradient(hx, hy, 0, n.px, n.py, r * 1.05);
        bodyGrad.addColorStop(0,   "rgba(255,255,255,0.95)");
        bodyGrad.addColorStop(0.18, hexA(lighten(color, 0.5), 0.95));
        bodyGrad.addColorStop(0.5,  hexA(color, 0.9));
        bodyGrad.addColorStop(0.85, hexA(darken(color, 0.4), 0.95));
        bodyGrad.addColorStop(1,   hexA(darken(color, 0.65), 1));
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.arc(n.px, n.py, r, 0, Math.PI * 2);
        ctx.fill();

        // === RIM OUTLINE ===
        ctx.strokeStyle = isFocus ? "rgba(255,255,255,0.98)" : hexA(lighten(color, 0.5), 0.65);
        ctx.lineWidth = isFocus ? 2 : Math.max(0.5, r * 0.08);
        ctx.beginPath();
        ctx.arc(n.px, n.py, r, 0, Math.PI * 2);
        ctx.stroke();

        // === SPECULAR HIGHLIGHT ===
        if (r > 3) {
          ctx.fillStyle = "rgba(255,255,255,0.9)";
          ctx.beginPath();
          ctx.arc(hx, hy, Math.max(0.6, r * 0.18), 0, Math.PI * 2);
          ctx.fill();
        }

        // === FOCUS RING (outside the orb) ===
        if (isFocus) {
          ctx.strokeStyle = "rgba(255,255,255,0.95)";
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(n.px, n.py, r + 7, 0, Math.PI * 2);
          ctx.stroke();
          // Secondary softer ring for extra emphasis
          ctx.strokeStyle = hexA(color, 0.5);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(n.px, n.py, r + 11, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // === BLACK HOLE in foreground if it's closer than camera-facing orbs ===
      if (phenomenonNode && phenomenonNode.depth <= 0) {
        drawBlackHole(ctx, phenomenonNode, focus === phenomenonNode, t);
      }

      // === LABELS (only for focus + connected, anti-collision) ===
      if (focus) {
        // Collect nodes to label: focus + connected, ordered by importance (focus first, then by degree)
        const labelCandidates = sortedNodes
          .filter(n => connected.has(n.id))
          .sort((a, b) => {
            if (a === focus) return -1;
            if (b === focus) return 1;
            return (b.deg || 0) - (a.deg || 0);
          })
          .slice(0, 16);

        // Compute label positions and resolve collisions
        const labels = [];
        for (const n of labelCandidates) {
          const r = nodeRadius(n) * n.scale;
          const labelText = window.nodeDisplayName ? window.nodeDisplayName(n) : n.name;
          const isFocus = focus === n;
          const size = isFocus ? 14 : 12;
          ctx.font = `${isFocus ? 600 : 500} ${size}px ui-sans-serif, system-ui, sans-serif`;
          const w = ctx.measureText(labelText).width;
          const h = size + 6;
          // Initial position: below the node
          let lx = n.px;
          let ly = n.py + r + 8;
          // Find a non-colliding position by scanning candidate offsets (below, above, right, left)
          const offsets = [
            { dx: 0, dy: r + 8, anchor: "center", vy: "top" },
            { dx: 0, dy: -(r + 8 + h), anchor: "center", vy: "top" },
            { dx: r + 8, dy: -h/2, anchor: "left", vy: "top" },
            { dx: -(r + 8), dy: -h/2, anchor: "right", vy: "top" }
          ];
          let placed = null;
          for (const off of offsets) {
            const cx = n.px + off.dx;
            const cy = n.py + off.dy;
            const box = labelBox(cx, cy, w, h, off.anchor);
            if (!labels.some(L => rectOverlap(L.box, box))) {
              placed = { x: cx, y: cy, w, h, box, anchor: off.anchor, text: labelText, isFocus, color: TYPE_COLORS[n.type], scale: n.scale, node: n };
              break;
            }
          }
          if (!placed) {
            // Last resort: shift down progressively until no collision
            let cy = n.py + r + 8;
            for (let tries = 0; tries < 12; tries++) {
              const box = labelBox(n.px, cy, w, h, "center");
              if (!labels.some(L => rectOverlap(L.box, box))) {
                placed = { x: n.px, y: cy, w, h, box, anchor: "center", text: labelText, isFocus, color: TYPE_COLORS[n.type], scale: n.scale, node: n };
                break;
              }
              cy += h + 2;
            }
          }
          if (placed) labels.push(placed);
        }

        // Draw labels (and store hit boxes for click/hover)
        st.labelHits = [];
        for (const L of labels) {
          const isHoverLbl = st.hover === L.node && st.hover !== selectedNode;
          const fsize = L.isFocus ? 14 : (isHoverLbl ? 12.5 : 11);
          const fweight = L.isFocus ? 600 : (isHoverLbl ? 600 : 500);
          ctx.font = `${fweight} ${fsize}px ui-sans-serif, system-ui, sans-serif`;
          const padX = L.isFocus ? 7 : (isHoverLbl ? 6 : 5);
          const padY = L.isFocus ? 4 : (isHoverLbl ? 3.5 : 2.5);
          const boxX = L.box.x, boxY = L.box.y;
          // background pill
          ctx.fillStyle = L.isFocus ? "rgba(8,16,28,0.96)" : (isHoverLbl ? "rgba(8,16,28,0.92)" : "rgba(8,16,28,0.78)");
          roundRect(ctx, boxX - padX, boxY - padY, L.w + padX * 2, L.h + padY * 2, L.isFocus ? 4 : 3);
          ctx.fill();
          // border
          ctx.strokeStyle = L.isFocus
            ? hexA(L.color, 0.9)
            : (isHoverLbl ? hexA(L.color, 0.65) : "rgba(126,224,255,0.14)");
          ctx.lineWidth = L.isFocus ? 1 : (isHoverLbl ? 0.9 : 0.5);
          roundRect(ctx, boxX - padX, boxY - padY, L.w + padX * 2, L.h + padY * 2, L.isFocus ? 4 : 3);
          ctx.stroke();
          // text
          ctx.fillStyle = L.isFocus ? "#ffffff" : (isHoverLbl ? "rgba(255,255,255,0.95)" : "rgba(226,242,255,0.72)");
          ctx.textAlign = L.anchor;
          ctx.textBaseline = "top";
          ctx.fillText(L.text, L.x, L.y);
          // Record hit box (for label clicks)
          st.labelHits.push({
            x: boxX - padX, y: boxY - padY,
            w: L.w + padX * 2, h: L.h + padY * 2,
            node: L.node
          });
        }
      } else {
        st.labelHits = [];
      }

      ctx.restore && ctx.restore();
      st.raf = requestAnimationFrame(step);
    };
    st.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(st.raf);
  }, [data, filters, selectedId, tweaks]);

  // ============== MOUSE/TOUCH HANDLERS ==============
  React.useEffect(() => {
    const cv = canvasRef.current;
    const st = stateRef.current;

    const pickNode = (mx, my) => {
      // First check label hits (labels take priority over orbs behind them)
      const hits = st.labelHits || [];
      for (const L of hits) {
        if (mx >= L.x && mx <= L.x + L.w && my >= L.y && my <= L.y + L.h) {
          return L.node;
        }
      }
      let best = null, bestD = Infinity;
      for (const n of st.nodes) {
        const r = nodeRadius(n) * n.scale + 6;
        const dx = n.px - mx, dy = n.py - my;
        const d = dx*dx + dy*dy;
        if (d < r*r && d < bestD) { best = n; bestD = d; }
      }
      return best;
    };

    const onMove = (e) => {
      const rect = cv.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      // Any movement marks interaction
      if (st.pending || st.drag || st.rotate || st.panDrag) st.lastInteraction = performance.now();
      // Promote pending to drag on movement
      if (st.pending) {
        const d = Math.hypot(mx - st.pending.mx, my - st.pending.my);
        if (d >= 6) {
          st.drag = st.pending.node;
          st.pending = null;
          cv.style.cursor = "grabbing";
        }
      }
      if (st.drag) {
        // Drag node: convert screen delta to world; simplest approach: keep node at cursor in projected XY
        // We adjust node's world position so its projection lands at (mx, my).
        // Approximate by setting screen-aligned drag in inverse rotation space.
        // For simplicity, only modify node's (x, z) along screen axes ignoring perspective scale.
        const target = unprojectScreen(mx - st.pan.x, my - st.pan.y, st.drag.depth, st);
        st.drag.x = target.x; st.drag.y = target.y; st.drag.z = target.z;
        st.drag.vx = st.drag.vy = st.drag.vz = 0;
        st.alpha = Math.max(st.alpha, 0.2);
      } else if (st.rotate) {
        const dx = mx - st.rotate.mx;
        const dy = my - st.rotate.my;
        // Yaw with horizontal drag, pitch with vertical
        st.rotY = st.rotate.startRotY + dx * 0.008;
        st.rotX = clamp(st.rotate.startRotX + dy * 0.008, -Math.PI/2 + 0.05, Math.PI/2 - 0.05);
      } else if (st.panDrag) {
        st.pan.x = st.panDrag.startPanX + (mx - st.panDrag.mx);
        st.pan.y = st.panDrag.startPanY + (my - st.panDrag.my);
      } else {
        st.hover = pickNode(mx, my);
        cv.style.cursor = st.hover ? "pointer" : "grab";
      }
    };
    const onDown = (e) => {
      st.lastInteraction = performance.now();
      const rect = cv.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const h = pickNode(mx, my);
      if (h) {
        st.pending = { node: h, mx, my };
        cv.style.cursor = "grabbing";
      } else {
        // Background drag: shift+drag → pan, plain drag → rotate
        if (e.shiftKey) {
          st.panDrag = { mx, my, startPanX: st.pan.x, startPanY: st.pan.y };
        } else {
          st.rotate = { mx, my, startRotX: st.rotX, startRotY: st.rotY, active: false, lastMx: mx, lastMy: my };
        }
        cv.style.cursor = "grabbing";
      }
    };
    const onUp = () => {
      // Pending without movement → click select
      if (st.pending) {
        onSelect(st.pending.node.id);
        st.pending = null;
      } else if (st.drag) {
        st.drag.vx = st.drag.vy = st.drag.vz = 0;
        st.drag = null;
      } else if (st.rotate) {
        // If rotation was tiny, treat as click on background → deselect
        const movedRotX = Math.abs(st.rotX - st.rotate.startRotX);
        const movedRotY = Math.abs(st.rotY - st.rotate.startRotY);
        if (movedRotX < 0.005 && movedRotY < 0.005) onSelect(null);
        st.rotate = null;
      } else if (st.panDrag) {
        st.panDrag = null;
      }
      cv.style.cursor = st.hover ? "pointer" : "grab";
    };
    const onLeave = () => {
      st.pending = null;
      st.drag = null;
      st.rotate = null;
      st.panDrag = null;
      st.hover = null;
      cv.style.cursor = "grab";
    };
    const onWheel = (e) => {
      e.preventDefault();
      st.lastInteraction = performance.now();
      const factor = e.deltaY > 0 ? 0.88 : 1.14;
      const newZ = clamp(st.zoom * factor, 0.5, 6);
      st.zoom = newZ;
    };

    cv.addEventListener("mousemove", onMove);
    cv.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    cv.addEventListener("mouseleave", onLeave);
    cv.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      cv.removeEventListener("mousemove", onMove);
      cv.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cv.removeEventListener("mouseleave", onLeave);
      cv.removeEventListener("wheel", onWheel);
    };
  }, [onSelect]);

  // ============== EXPOSE API for zoom controls ==============
  React.useEffect(() => {
    const st = stateRef.current;
    window.__rdcGraph = {
      // 1.5 internal = 100% UI baseline
      zoomBy: (f) => { st.zoom = clamp(st.zoom * f, 0.5, 6); },
      reset: () => {
        st.zoom = 1.5;
        st.rotX = 0.68;
        st.rotY = 0;
        st.pan = { x: 0, y: 0 };
        st.alpha = Math.max(st.alpha, 0.4);
      },
      // Display: 1.5 internal => 100% display
      getZoom: () => st.zoom / 1.5
    };
  }, []);

  return (
    <div ref={containerRef} style={{position:"absolute", inset:0, overflow:"hidden", background:"radial-gradient(ellipse at center, #0a1830 0%, #04080f 80%)"}}>
      <canvas ref={canvasRef} style={{display:"block"}} />
      <div className="graph-hint">
        Arrastra · Rotar &nbsp;·&nbsp; Shift+Arrastra · Mover &nbsp;·&nbsp; Scroll · Zoom &nbsp;·&nbsp; Click · Ficha
      </div>
    </div>
  );
}

// ===================================================================
// HELPERS
// ===================================================================

function projectPoint(x, y, z, st) {
  // Galaxy intrinsic rotation: spin world around Y axis before camera transform
  const gr = st.galaxyRot || 0;
  const cosG = Math.cos(gr), sinG = Math.sin(gr);
  const gx = x * cosG + z * sinG;
  const gz = -x * sinG + z * cosG;
  // Camera rotation around origin (Y then X)
  const cosY = Math.cos(st.rotY), sinY = Math.sin(st.rotY);
  const cosX = Math.cos(st.rotX), sinX = Math.sin(st.rotX);
  const x1 = gx * cosY + gz * sinY;
  const z1 = -gx * sinY + gz * cosY;
  const y1 = y;
  const y2 = y1 * cosX - z1 * sinX;
  const z2 = y1 * sinX + z1 * cosX;
  // Perspective
  const fov = 800;
  const depth = fov + z2;
  const scale = (fov / depth) * st.zoom;
  return {
    px: st.size.w / 2 + x1 * scale + st.pan.x,
    py: st.size.h / 2 + y2 * scale + st.pan.y,
    scale,
    depth: z2
  };
}

function unprojectScreen(screenX, screenY, depth, st) {
  // Inverse of projectPoint, including galaxy rotation
  const fov = 800;
  const persp = fov / (fov + depth);
  const scale = persp * st.zoom;
  const x1 = (screenX - st.size.w / 2) / scale;
  const y2 = (screenY - st.size.h / 2) / scale;
  const z2 = depth;
  const cosX = Math.cos(st.rotX), sinX = Math.sin(st.rotX);
  const y1 = y2 * cosX + z2 * sinX;
  const z1 = -y2 * sinX + z2 * cosX;
  const cosY = Math.cos(st.rotY), sinY = Math.sin(st.rotY);
  const gx = x1 * cosY - z1 * sinY;
  const gz = x1 * sinY + z1 * cosY;
  // Inverse of galaxy rotation
  const gr = st.galaxyRot || 0;
  const cosG = Math.cos(gr), sinG = Math.sin(gr);
  const x = gx * cosG - gz * sinG;
  const z = gx * sinG + gz * cosG;
  return { x, y: y1, z };
}

function drawGalaxyBackdrop(ctx, st) {
  const minDim = Math.min(st.size.w, st.size.h);
  // Disk rings (in XZ plane, y=0)
  const ringRadii = [minDim * 0.12, minDim * 0.22, minDim * 0.30, minDim * 0.42];
  for (const r of ringRadii) {
    drawProjectedCircle(ctx, r, st, "rgba(126,224,255,0.055)", 1);
  }
  // Central glow
  const center = projectPoint(0, 0, 0, st);
  const coreR = minDim * 0.4 * center.scale;
  const grad = ctx.createRadialGradient(center.px, center.py, 0, center.px, center.py, coreR);
  grad.addColorStop(0, "rgba(126,224,255,0.08)");
  grad.addColorStop(0.35, "rgba(126,224,255,0.03)");
  grad.addColorStop(1, "rgba(126,224,255,0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(center.px, center.py, coreR, 0, Math.PI*2);
  ctx.fill();
  // Spiral arms (faint)
  const NUM_ARMS = 13;
  const TWIST = 0.6;
  const armR0 = minDim * 0.12;
  const armR1 = minDim * 0.42;
  ctx.strokeStyle = "rgba(126,224,255,0.04)";
  ctx.lineWidth = 1;
  for (let i = 0; i < NUM_ARMS; i++) {
    const baseA = (i / NUM_ARMS) * Math.PI * 2;
    ctx.beginPath();
    let first = true;
    for (let t = 0; t <= 1.001; t += 0.04) {
      const r = armR0 + (armR1 - armR0) * t;
      const a = baseA + t * TWIST;
      const p = projectPoint(Math.cos(a) * r, 0, Math.sin(a) * r, st);
      if (first) { ctx.moveTo(p.px, p.py); first = false; }
      else ctx.lineTo(p.px, p.py);
    }
    ctx.stroke();
  }
}

function drawProjectedCircle(ctx, r, st, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  let first = true;
  const SEGMENTS = 80;
  for (let i = 0; i <= SEGMENTS; i++) {
    const a = (i / SEGMENTS) * Math.PI * 2;
    const p = projectPoint(Math.cos(a) * r, 0, Math.sin(a) * r, st);
    if (first) { ctx.moveTo(p.px, p.py); first = false; }
    else ctx.lineTo(p.px, p.py);
  }
  ctx.stroke();
}

function runSimulation3D(st, iters, spread) {
  const nodes = st.nodes;
  const edges = st.edges;
  const N = nodes.length;
  if (!N) return;
  spread = spread || 1;
  const charge = -140 * spread;

  for (let it = 0; it < iters; it++) {
    // Home gravity in 3D (lighter for gentler motion)
    const g = 0.045;
    for (let i = 0; i < N; i++) {
      const n = nodes[i];
      if (n === st.drag || n.fixed || n.type === "phenomenon") continue;
      n.vx += (n.hx - n.x) * g;
      n.vy += (n.hy - n.y) * g;
      n.vz += (n.hz - n.z) * g;
    }
    // Charge repulsion (smaller cap, cuts off vibration)
    for (let i = 0; i < N; i++) {
      const a = nodes[i];
      if (a.type === "phenomenon") continue; // don't push the black hole
      for (let j = i + 1; j < N; j++) {
        const b = nodes[j];
        if (b.type === "phenomenon") continue;
        const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
        let d2 = dx*dx + dy*dy + dz*dz;
        if (d2 < 1) d2 = 1;
        if (d2 > 30000) continue;
        const d = Math.sqrt(d2);
        const f = charge / d2;
        const fx = (dx/d) * f, fy = (dy/d) * f, fz = (dz/d) * f;
        if (a !== st.drag) { a.vx -= fx; a.vy -= fy; a.vz -= fz; }
        if (b !== st.drag) { b.vx += fx; b.vy += fy; b.vz += fz; }
      }
    }
    // Link forces (weaker)
    const linkStr = 0.022;
    const linkDist = 55 * spread;
    for (const e of edges) {
      if (e.source.type === "phenomenon" || e.target.type === "phenomenon") continue;
      const dx = e.target.x - e.source.x;
      const dy = e.target.y - e.source.y;
      const dz = e.target.z - e.source.z;
      const d = Math.sqrt(dx*dx + dy*dy + dz*dz) || 1;
      const diff = (d - linkDist) * linkStr;
      const fx = (dx/d) * diff, fy = (dy/d) * diff, fz = (dz/d) * diff;
      if (e.source !== st.drag) { e.source.vx += fx; e.source.vy += fy; e.source.vz += fz; }
      if (e.target !== st.drag) { e.target.vx -= fx; e.target.vy -= fy; e.target.vz -= fz; }
    }
    // Integrate with strong damping for elegance
    const damping = 0.84;
    for (let i = 0; i < N; i++) {
      const n = nodes[i];
      if (n.type === "phenomenon") { n.x = n.y = n.z = 0; n.vx = n.vy = n.vz = 0; continue; }
      if (n === st.drag) { n.vx = n.vy = n.vz = 0; continue; }
      n.vx *= damping; n.vy *= damping; n.vz *= damping;
      const speed2 = n.vx*n.vx + n.vy*n.vy + n.vz*n.vz;
      if (speed2 < 0.0009) { n.vx = n.vy = n.vz = 0; }
      n.x += n.vx; n.y += n.vy; n.z += n.vz;
    }
  }
}

function nodeRadius(n) {
  if (n.type === "phenomenon") return 18; // large enough to anchor, but specifically rendered
  const base = { person: 4, agency: 5, event: 4.5, program: 4.5, concept: 4, channel: 6 }[n.type] || 4;
  // Exponential compression: small nodes barely shrink, large nodes shrink much more.
  // Asymptotic cap lowered so the most-connected nodes don't dominate the disc.
  const deg = n.deg || 0;
  return base + (1 - Math.exp(-deg / 18)) * 4.5;
}

// Render the central black hole (the phenomenon).
// Drawn as a dark disc with a luminous accretion ring rotating slowly.
function drawBlackHole(ctx, n, isFocus, t) {
  const r = 22 * n.scale;
  const px = n.px, py = n.py;
  const phase = (t * 0.0002) % (Math.PI * 2);

  // Outer glow (lensing halo)
  const glowR = r * 5;
  const glow = ctx.createRadialGradient(px, py, r * 0.5, px, py, glowR);
  glow.addColorStop(0, "rgba(126,224,255,0.22)");
  glow.addColorStop(0.4, "rgba(126,224,255,0.08)");
  glow.addColorStop(1, "rgba(126,224,255,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(px, py, glowR, 0, Math.PI * 2);
  ctx.fill();

  // Accretion ring (luminous, asymmetric — brighter on one side)
  const ringR = r * 1.55;
  const ringW = r * 0.35;
  for (let i = 0; i < 64; i++) {
    const a0 = (i / 64) * Math.PI * 2 + phase;
    const a1 = ((i + 1) / 64) * Math.PI * 2 + phase;
    // Doppler-style brightness: brighter at the bottom half (closer side)
    const bright = 0.4 + 0.6 * Math.sin(a0 + 0.5);
    const alpha = isFocus ? 0.95 * bright : 0.7 * bright;
    ctx.strokeStyle = `rgba(${Math.round(180 + bright*75)}, ${Math.round(230 + bright*25)}, 255, ${alpha})`;
    ctx.lineWidth = ringW;
    ctx.beginPath();
    ctx.arc(px, py, ringR, a0, a1);
    ctx.stroke();
  }

  // Event horizon (pitch black disc)
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(px, py, r, 0, Math.PI * 2);
  ctx.fill();
  // Sub-thin event horizon rim (Doppler-bright sliver)
  ctx.strokeStyle = isFocus ? "rgba(255,255,255,0.95)" : "rgba(126,224,255,0.7)";
  ctx.lineWidth = isFocus ? 1.6 : 1;
  ctx.beginPath();
  ctx.arc(px, py, r, 0, Math.PI * 2);
  ctx.stroke();

  // Focus ring when selected
  if (isFocus) {
    ctx.strokeStyle = "rgba(255,255,255,0.85)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(px, py, r + 10, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function hexA(hex, a) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0,2), 16);
  const g = parseInt(h.substring(2,4), 16);
  const b = parseInt(h.substring(4,6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function lighten(hex, amount) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0,2), 16);
  const g = parseInt(h.substring(2,4), 16);
  const b = parseInt(h.substring(4,6), 16);
  const nr = Math.round(r + (255 - r) * amount);
  const ng = Math.round(g + (255 - g) * amount);
  const nb = Math.round(b + (255 - b) * amount);
  return "#" + [nr, ng, nb].map(v => v.toString(16).padStart(2, "0")).join("");
}

function darken(hex, amount) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0,2), 16);
  const g = parseInt(h.substring(2,4), 16);
  const b = parseInt(h.substring(4,6), 16);
  const nr = Math.round(r * (1 - amount));
  const ng = Math.round(g * (1 - amount));
  const nb = Math.round(b * (1 - amount));
  return "#" + [nr, ng, nb].map(v => v.toString(16).padStart(2, "0")).join("");
}

function blendColors(a, b, t) {
  t = Math.max(0, Math.min(1, t));
  const pa = parseHex(a), pb = parseHex(b);
  const r = Math.round(pa.r + (pb.r - pa.r) * t);
  const g = Math.round(pa.g + (pb.g - pa.g) * t);
  const bl = Math.round(pa.b + (pb.b - pa.b) * t);
  return "#" + [r, g, bl].map(v => v.toString(16).padStart(2, "0")).join("");
}
function parseHex(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0,2), 16),
    g: parseInt(h.substring(2,4), 16),
    b: parseInt(h.substring(4,6), 16)
  };
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function labelBox(cx, cy, w, h, anchor) {
  let x = cx;
  if (anchor === "center") x = cx - w/2;
  else if (anchor === "right") x = cx - w;
  return { x, y: cy, w, h };
}

function rectOverlap(a, b) {
  return !(a.x + a.w + 6 < b.x || b.x + b.w + 6 < a.x || a.y + a.h + 4 < b.y || b.y + b.h + 4 < a.y);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

window.NetworkGraph = NetworkGraph;
window.TYPE_COLORS = TYPE_COLORS;
window.TYPE_LABEL_ES = TYPE_LABEL_ES;

import { useState, useEffect, useRef } from "react";

// ── CONSTANTS ────────────────────────────────────────────────────────────────
const GOLD  = "#C9A84C";
const BLACK = "#0A0A0A";
const WHITE = "#FAFAFA";

const LINKS = {
  github:         "https://github.com/The-Bedrock-Project/bedrock-program",
  givesendgo:     "https://www.givesendgo.com/Bedrock-Program",
  zenodo:         "https://zenodo.org/records/18345154",
  zenodoDownload: "https://zenodo.org/records/18345154/files/structural_bedrock_v3.1_attributed.pdf?download=1",
  statement:      "https://github.com/The-Bedrock-Project/bedrock-program/raw/main/bedrock%20statement.docx",
  maintenance:    "https://github.com/The-Bedrock-Project/bedrock-program/raw/main/maintenance%20test%20v2.docx",
  amazon:         "https://www.amazon.com/dp/B0GRSNPM4K",
  doi:            "https://doi.org/10.5281/zenodo.18345154",
};

const TEAM = [
  { name: "Christopher Lamarr Brown", role: "Director / Principal Researcher", fn: "Framework integrity, research architecture, core philosophy, final editorial control.",                email: "ChristopherBrown@bedrockprogram.com" },
  { name: "Barbara Reed",             role: "Operations Director",              fn: "Budget, legal, deployment logistics, timeline, donor coordination.",                                  email: "Barbarareed167@bedrockprogram.com"  },
  { name: "Henry Young",              role: "Technical Lead",                   fn: "Measurement systems, data infrastructure, the machine that produces the numbers.",                    email: "HenryLeeYoung@bedrockprogram.com"  },
  { name: "Alex Toal",                role: "Distribution Lead",                fn: "Content, syndication, public packaging, closing the loop between research and reach.",                email: "Alextoal316@bedrockprogram.com"     },
];

const TIERS = [
  { price: "$25",     title: "The Maintenance Test", desc: "The digital Discernment Field Guide. A 3-step lens you can use at your dinner table tonight." },
  { price: "$100",    title: "Program Analyst",      desc: "Access to initial Bedrock Program technical reports. See structural signatures mapped in real time." },
  { price: "$500",    title: "Structural Guard",     desc: "A private video briefing on building Bedrock Systems for your business, home, or ministry." },
  { price: "$1,000+", title: "Program Partner",      desc: "Fund forensic data-gathering for a specific institutional case study. Your selection builds the next layer." },
];

const SIGNATURES = [
  { n: "01", title: "Response Compression",  body: "Every question leads back to the same small set of approved answers. The inquiry space is being compressed. A self-sustaining truth expands under questioning. A maintained narrative contracts." },
  { n: "02", title: "Burden Asymmetry",       body: "You are required to disprove the claim rather than the claim being required to prove itself. The standard of proof is applied asymmetrically. This is not an intellectual error — it is a structural signature of a maintained system." },
  { n: "03", title: "Authority Substitution", body: "Evidence is replaced by the invocation of authority as a terminal endpoint. The authority is not offered as one source among many — it is offered as a reason to stop asking." },
];

// ── HOOKS ────────────────────────────────────────────────────────────────────
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useCounter(target, duration, active) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return count;
}

// ── PRIMITIVES ───────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(30px)",
      transition: `opacity 0.8s ${delay}s cubic-bezier(.16,1,.3,1), transform 0.8s ${delay}s cubic-bezier(.16,1,.3,1)`,
    }}>
      {children}
    </div>
  );
}

function GoldLine({ opacity = 0.45 }) {
  return <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${GOLD} 35%, ${GOLD} 65%, transparent)`, opacity }} />;
}

function Label({ children }) {
  return (
    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: GOLD, textTransform: "uppercase", marginBottom: "1rem" }}>
      {children}
    </p>
  );
}

function SectionTitle({ children, light = false }) {
  return (
    <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.8rem,7vw,5rem)", lineHeight: 0.92, letterSpacing: "0.03em", color: light ? WHITE : BLACK, marginBottom: "1.5rem" }}>
      {children}
    </h2>
  );
}

function BtnPrimary({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      style={{ display: "inline-flex", alignItems: "center", padding: "1rem 2.5rem", background: GOLD, color: BLACK, fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.05rem", letterSpacing: "0.14em", textDecoration: "none", transition: "background .2s, transform .2s, box-shadow .2s" }}
      onMouseEnter={e => { e.currentTarget.style.background = "#dfc06a"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(201,168,76,.3)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {children}
    </a>
  );
}

function BtnOutline({ href, children, dark = false }) {
  const col = dark ? GOLD : "#8a6e2f";
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      style={{ display: "inline-flex", alignItems: "center", padding: "0.9rem 2rem", border: `1px solid ${col}`, color: col, fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.95rem", letterSpacing: "0.12em", textDecoration: "none", transition: "all .2s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.background = "rgba(201,168,76,.06)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = col; e.currentTarget.style.color = col; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "transparent"; }}
    >
      {children}
    </a>
  );
}

// ── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const navLinks = [
    ["#statement", "Statement"],
    ["#test",      "The Test"],
    ["#research",  "Research"],
    ["#support",   "Support"],
    ["#team",      "Team"],
  ];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center",
        background: scrolled ? "rgba(10,10,10,0.96)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(201,168,76,.15)" : "none",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        transition: "all .4s cubic-bezier(.16,1,.3,1)",
      }}>
        <a href="#" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src="/NohMad.png" alt="NohMad LLC" style={{ height: 26, filter: "invert(1)", opacity: 0.85, transition: "opacity .3s" }} />
        </a>

        <ul style={{ display: "flex", gap: "2.5rem", listStyle: "none", margin: 0, padding: 0, alignItems: "center" }} className="desktop-nav">
          {navLinks.map(([href, label]) => (
            <li key={href}>
              <a href={href} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.14em", color: "rgba(250,250,250,.5)", textDecoration: "none", textTransform: "uppercase", transition: "color .2s" }}
                onMouseEnter={e => e.currentTarget.style.color = GOLD}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(250,250,250,.5)"}
              >{label}</a>
            </li>
          ))}
          <li>
            <a href={LINKS.amazon} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.12em", color: GOLD, textDecoration: "none", textTransform: "uppercase", border: "1px solid rgba(201,168,76,.4)", padding: "0.35rem 0.9rem", transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = BLACK; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = GOLD; }}
            >Book →</a>
          </li>
        </ul>

        <button onClick={() => setOpen(true)} className="hamburger" aria-label="Open menu"
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: "0.25rem", flexDirection: "column", gap: "5px" }}>
          <div style={{ width: 22, height: 2, background: GOLD }} />
          <div style={{ width: 16, height: 2, background: GOLD }} />
          <div style={{ width: 22, height: 2, background: GOLD }} />
        </button>
      </nav>

      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: BLACK, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.25rem", animation: "menuIn .3s cubic-bezier(.16,1,.3,1) forwards" }}>
          <button onClick={() => setOpen(false)} aria-label="Close menu"
            style={{ position: "absolute", top: "1.5rem", right: "2rem", background: "none", border: "none", cursor: "pointer", color: "rgba(250,250,250,.35)", fontSize: "1.6rem", lineHeight: 1 }}>✕</button>
          <img src="/NohMad.png" alt="NohMad" style={{ height: 26, filter: "invert(1)", opacity: 0.4, marginBottom: "2.5rem" }} />
          {[...navLinks, [LINKS.amazon, "Book →"]].map(([href, label], i) => (
            <a key={href} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.2rem,8vw,3rem)", letterSpacing: "0.06em", color: i === navLinks.length ? GOLD : WHITE, textDecoration: "none", padding: "0.4rem 0", opacity: 0, animation: `fadeUp .5s ${0.05 * i + 0.1}s cubic-bezier(.16,1,.3,1) forwards`, transition: "color .2s" }}
              onMouseEnter={e => e.currentTarget.style.color = GOLD}
              onMouseLeave={e => e.currentTarget.style.color = i === navLinks.length ? GOLD : WHITE}
            >{label}</a>
          ))}
          <a href="mailto:NohMadllc@journalist.com"
            style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.63rem", letterSpacing: "0.1em", color: "rgba(250,250,250,.25)", textDecoration: "none", marginTop: "2rem", opacity: 0, animation: "fadeUp .5s .45s cubic-bezier(.16,1,.3,1) forwards" }}>
            NohMadllc@journalist.com
          </a>
        </div>
      )}
    </>
  );
}

// ── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ minHeight: "100vh", background: BLACK, display: "flex", flexDirection: "column", justifyContent: "center", padding: "9rem 2rem 6rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: ["radial-gradient(ellipse 80% 60% at 10% 60%, rgba(201,168,76,.07) 0%, transparent 55%)", "radial-gradient(ellipse 50% 40% at 90% 10%, rgba(201,168,76,.04) 0%, transparent 50%)", "radial-gradient(ellipse 30% 30% at 80% 80%, rgba(201,168,76,.03) 0%, transparent 50%)"].join(",") }} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.025, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "128px" }} />

      <div style={{ maxWidth: 820, position: "relative", zIndex: 1 }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.26em", color: GOLD, textTransform: "uppercase", marginBottom: "2.5rem", opacity: 0, animation: "fadeUp .9s .15s cubic-bezier(.16,1,.3,1) forwards" }}>
          The Bedrock Program &nbsp;·&nbsp; NohMad LLC &nbsp;·&nbsp; Est. 2026
        </p>

        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(4.5rem,16vw,11rem)", lineHeight: 0.88, letterSpacing: "0.01em", color: WHITE, marginBottom: "2.5rem", opacity: 0, animation: "fadeUp .9s .3s cubic-bezier(.16,1,.3,1) forwards" }}>
          Does It<br />
          <span style={{ color: GOLD }}>Stay</span>
          <span style={{ color: "rgba(250,250,250,.12)" }}>?</span>
        </h1>

        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.1rem,2.5vw,1.45rem)", fontWeight: 300, lineHeight: 1.65, color: "rgba(250,250,250,.5)", maxWidth: 540, marginBottom: "2.5rem", opacity: 0, animation: "fadeUp .9s .5s cubic-bezier(.16,1,.3,1) forwards" }}>
          Truth is structurally self-sustaining. A manufactured narrative is not. The Bedrock Program gives you the instrument to measure which one you are looking at.
        </p>

        <blockquote style={{ borderLeft: "3px solid rgba(201,168,76,.45)", paddingLeft: "1.25rem", marginBottom: "3.5rem", opacity: 0, animation: "fadeUp .9s .65s cubic-bezier(.16,1,.3,1) forwards" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(.95rem,2vw,1.1rem)", fontStyle: "italic", color: "rgba(240,223,160,.72)", fontWeight: 300, lineHeight: 1.65 }}>
            "Everyone then who hears these words of mine and does them will be like a wise man who built his house on the rock."
          </p>
          <cite style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.12em", color: "rgba(250,250,250,.22)", fontStyle: "normal", display: "block", marginTop: "0.6rem" }}>— Matthew 7:24</cite>
        </blockquote>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", opacity: 0, animation: "fadeUp .9s .8s cubic-bezier(.16,1,.3,1) forwards" }}>
          <BtnPrimary href={LINKS.zenodo}>Read the Research →</BtnPrimary>
          <BtnOutline href={LINKS.amazon} dark>Read the Book</BtnOutline>
          <BtnOutline href={LINKS.givesendgo} dark>Support the Program</BtnOutline>
        </div>

        <div style={{ marginTop: "5rem", display: "flex", alignItems: "center", gap: "0.75rem", opacity: 0, animation: "fadeUp .9s 1.2s cubic-bezier(.16,1,.3,1) forwards" }}>
          <div style={{ width: 1, height: 48, background: `linear-gradient(to bottom, transparent, ${GOLD})` }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.2em", color: "rgba(250,250,250,.22)", textTransform: "uppercase" }}>Scroll</span>
        </div>
      </div>
    </section>
  );
}

// ── STATS STRIP ───────────────────────────────────────────────────────────────
function StatsStrip() {
  const [ref, visible] = useReveal(0.3);
  const c1 = useCounter(3,    1500, visible);
  const c2 = useCounter(21,   1800, visible);
  const c3 = useCounter(2026, 2000, visible);

  const stats = [
    { value: c1,  suffix: "",    label: "Structural Signatures Identified" },
    { value: c2,  suffix: "K+", label: "Lines of Audited Source Code" },
    { value: c3,  suffix: "",    label: "Year of First Publication" },
  ];

  return (
    <div ref={ref} style={{ background: "#0f0f0f", borderTop: "1px solid rgba(201,168,76,.1)", borderBottom: "1px solid rgba(201,168,76,.1)", padding: "3rem 2rem" }}>
      <div style={{ maxWidth: 780, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "2rem" }}>
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem,6vw,4rem)", color: GOLD, letterSpacing: "0.04em", lineHeight: 1, marginBottom: "0.4rem" }}>
              {s.value}{s.suffix}
            </p>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.14em", color: "rgba(250,250,250,.28)", textTransform: "uppercase", lineHeight: 1.5 }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── STATEMENT ────────────────────────────────────────────────────────────────
function Statement() {
  return (
    <section id="statement" style={{ background: WHITE, padding: "7rem 2rem" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <Reveal><Label>The Foundation</Label></Reveal>
        <Reveal delay={0.1}><SectionTitle>The Bedrock<br /><span style={{ color: GOLD }}>Statement</span></SectionTitle></Reveal>

        <Reveal delay={0.15}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem,2vw,1.18rem)", color: "#444", fontWeight: 300, lineHeight: 1.82, marginBottom: "2rem" }}>
            A constraint stated without metaphysics, ideology, or appeal to authority. It applies to everyone — regardless of worldview, domain, or starting position. Before disagreement is possible, something must remain stable long enough to be disagreed about.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div style={{ margin: "2.5rem 0", padding: "2.25rem 2rem", borderLeft: "5px solid #C9A84C", background: "#f7f2e6" }}>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.7rem,4vw,2.6rem)", lineHeight: 1.08, color: BLACK }}>
              Whatever persists must do so<br /><span style={{ color: GOLD }}>without contradicting itself.</span>
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem,2vw,1.18rem)", color: "#444", fontWeight: 300, lineHeight: 1.82, marginBottom: "1.5rem" }}>
            There are exactly two ways for identity to fail. A thing can undermine itself — internal contradiction collapses its boundary. Or a thing can erode — if disturbances accumulate faster than they are corrected, identity dissolves. These are not assumptions. They are failure descriptions.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div style={{ margin: "2.5rem 0", padding: "2rem", border: "1px solid rgba(201,168,76,.3)", textAlign: "center", background: "rgba(201,168,76,.03)" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.1rem,2.5vw,1.45rem)", fontStyle: "italic", color: BLACK, fontWeight: 400, lineHeight: 1.65 }}>
              "Reality consists of whatever can continue being itself without breaking.<br />Everything else is elaboration."
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.33}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.5rem 0", flexWrap: "wrap" }}>
            <a href={LINKS.doi} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.1em", color: "#8a6e2f", textDecoration: "none", border: "1px solid rgba(201,168,76,.35)", padding: "0.3rem 0.8rem", background: "rgba(201,168,76,.05)", transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,168,76,.05)"; }}
            >DOI: 10.5281/zenodo.18345154</a>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.1em", color: "#aaa" }}>Published &amp; timestamped · Independently verifiable</span>
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <BtnPrimary href={LINKS.zenodo}>Read on Zenodo →</BtnPrimary>
            <BtnOutline href={LINKS.zenodoDownload}>Download PDF</BtnOutline>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── MAINTENANCE TEST ──────────────────────────────────────────────────────────
function MaintenanceTest() {
  return (
    <section id="test" style={{ background: BLACK, padding: "7rem 2rem" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <Reveal><Label>The Primary Instrument</Label></Reveal>
        <Reveal delay={0.1}><SectionTitle light>The Maintenance<br /><span style={{ color: GOLD }}>Test</span></SectionTitle></Reveal>

        <Reveal delay={0.15}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem,2vw,1.18rem)", color: "rgba(250,250,250,.48)", fontWeight: 300, lineHeight: 1.82, marginBottom: "2rem" }}>
            The Maintenance Test is a three-step structural field guide for discernment. It is not opinion. It is not persuasion. It is a structural test anyone can apply to any claim, in real time, using no equipment other than a functioning mind.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div style={{ margin: "2rem 0 3.5rem", padding: "1.75rem 2rem", borderLeft: "5px solid #C9A84C", background: "rgba(201,168,76,.06)" }}>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.5rem,4vw,2.2rem)", color: WHITE, lineHeight: 1.1 }}>
              Does this truth <span style={{ color: GOLD }}>stay</span>, or does it have to be <span style={{ color: GOLD }}>held</span>?
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}><Label>Three Signatures of a Maintained Narrative</Label></Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "3rem" }}>
          {SIGNATURES.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div style={{ display: "grid", gridTemplateColumns: "2.5rem 1fr", gap: "1.25rem", border: "1px solid rgba(201,168,76,.15)", padding: "1.75rem", background: "rgba(201,168,76,.02)", transition: "border-color .3s, background .3s", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,.45)"; e.currentTarget.style.background = "rgba(201,168,76,.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,.15)"; e.currentTarget.style.background = "rgba(201,168,76,.02)"; }}
              >
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", color: "rgba(201,168,76,.22)", lineHeight: 1.1 }}>{s.n}</span>
                <div>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem", letterSpacing: "0.08em", color: GOLD, marginBottom: "0.6rem" }}>{s.title}</h3>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "rgba(250,250,250,.44)", fontWeight: 300, lineHeight: 1.78 }}>{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}><Label>The Verdict</Label></Reveal>
        <Reveal delay={0.15}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2.5rem" }}>
            <div style={{ padding: "1.75rem", background: "rgba(12,40,12,.7)", border: "1px solid rgba(80,160,80,.25)" }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", letterSpacing: "0.18em", color: "#7fc87f", marginBottom: "0.5rem", textTransform: "uppercase" }}>Bedrock</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "#8fd48f", fontWeight: 600, lineHeight: 1.65 }}>If the weight of proof is on the Truth — you are standing on Bedrock.</p>
            </div>
            <div style={{ padding: "1.75rem", background: "rgba(45,8,8,.7)", border: "1px solid rgba(160,60,60,.25)" }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", letterSpacing: "0.18em", color: "#c87f7f", marginBottom: "0.5rem", textTransform: "uppercase" }}>Sand</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "#d48f8f", fontWeight: 600, lineHeight: 1.65 }}>If the weight of proof is on You — you are standing in a cage.</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div style={{ padding: "2rem", border: "1px solid rgba(201,168,76,.22)", textAlign: "center", background: "rgba(201,168,76,.03)", marginBottom: "2.5rem" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem,2.5vw,1.35rem)", fontStyle: "italic", color: "rgba(240,223,160,.78)", fontWeight: 300, lineHeight: 1.7 }}>
              Truth is a gift you receive.<br />A narrative is a burden you are forced to carry.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <BtnPrimary href={LINKS.maintenance}>Download the Field Guide →</BtnPrimary>
            <BtnOutline href={LINKS.github} dark>Verify on GitHub</BtnOutline>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── RESEARCH ──────────────────────────────────────────────────────────────────
function Research() {
  const cards = [
    { label: "Zenodo Archive",    desc: "Timestamped research record. Immutable. Publicly accessible.", href: LINKS.zenodo,        cta: "View Record →" },
    { label: "GitHub Repository", desc: "Source documents, license, mission statement. Fully open.",   href: LINKS.github,        cta: "Open Repository →" },
    { label: "Bedrock Statement", desc: "The foundational constraint document. Download directly.",    href: LINKS.zenodoDownload, cta: "Download PDF →" },
    { label: "Maintenance Test",  desc: "The primary public instrument. Three steps. Any domain.",     href: LINKS.maintenance,   cta: "Download →" },
  ];

  return (
    <section id="research" style={{ background: WHITE, padding: "7rem 2rem" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <Reveal><Label>Verification Layer</Label></Reveal>
        <Reveal delay={0.1}><SectionTitle>The Research<br /><span style={{ color: GOLD }}>Is Public</span></SectionTitle></Reveal>

        <Reveal delay={0.15}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem,2vw,1.18rem)", color: "#444", fontWeight: 300, lineHeight: 1.82, marginBottom: "2.5rem" }}>
            We do not ask for trust. We hand you the instrument to verify before we ask for anything. The foundational research is timestamped and publicly archived on Zenodo. The repository is open on GitHub. Every document carries the same structural constraint. Nothing is hidden that can be shown.
          </p>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
          {cards.map((card, i) => (
            <Reveal key={card.label} delay={i * 0.08}>
              <a href={card.href} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", flexDirection: "column", padding: "1.75rem", height: "100%", border: "1px solid rgba(201,168,76,.22)", background: "rgba(201,168,76,.02)", textDecoration: "none", transition: "all .25s cubic-bezier(.16,1,.3,1)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.background = "rgba(201,168,76,.06)"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(201,168,76,.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,.22)"; e.currentTarget.style.background = "rgba(201,168,76,.02)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.08em", color: BLACK, marginBottom: "0.5rem" }}>{card.label}</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.92rem", color: "#666", fontWeight: 300, lineHeight: 1.65, marginBottom: "1.25rem", flex: 1 }}>{card.desc}</p>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", color: GOLD }}>{card.cta}</p>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.35}>
          <div style={{ padding: "1.5rem 1.75rem", borderLeft: "4px solid #C9A84C", background: "#f7f2e6", marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.14em", color: "#8a6e2f", marginBottom: "0.5rem", textTransform: "uppercase" }}>What Is Not Public</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", color: "#444", fontWeight: 300, lineHeight: 1.75 }}>
              The foundational research papers, contraction engine methodology, and empirical datasets are protected intellectual property of NohMad LLC. The public layer is sufficient to confirm the work is real, the results are correct, and the methodology is sound.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <a href={LINKS.amazon} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: "1.5rem", padding: "1.75rem 2rem", border: "1px solid rgba(201,168,76,.35)", background: "linear-gradient(120deg, rgba(201,168,76,.07) 0%, rgba(201,168,76,.02) 100%)", textDecoration: "none", transition: "all .25s cubic-bezier(.16,1,.3,1)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(201,168,76,.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,.35)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ flexShrink: 0, width: 52, height: 52, border: "1px solid rgba(201,168,76,.35)", background: "rgba(201,168,76,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>📖</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.16em", color: "#8a6e2f", marginBottom: "0.3rem", textTransform: "uppercase" }}>Book · Dr. Alex Toal · NohMad LLC · Amazon Kindle</p>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem", letterSpacing: "0.06em", color: BLACK, marginBottom: "0.25rem" }}>The Unmanipulable Man</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", color: "#666", fontWeight: 300, lineHeight: 1.55 }}>A Structural Character Study of Jesus Christ. All proceeds fund The Bedrock Program.</p>
            </div>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", color: GOLD, flexShrink: 0 }}>Read →</p>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

// ── MISSION STRIP ─────────────────────────────────────────────────────────────
function MissionStrip() {
  return (
    <section style={{ background: GOLD, padding: "5.5rem 2rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.05, backgroundImage: "repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)", backgroundSize: "12px 12px" }} />
      <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <Reveal>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.25em", color: "rgba(10,10,10,.5)", textTransform: "uppercase", marginBottom: "1.5rem" }}>Why Faith Led the Research</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.2rem,7vw,4rem)", lineHeight: 0.95, letterSpacing: "0.03em", color: BLACK, marginBottom: "1.75rem" }}>
            We Did Not Find This<br />By Accident
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem,2vw,1.25rem)", color: BLACK, fontWeight: 400, lineHeight: 1.82, maxWidth: 600, margin: "0 auto 1.5rem" }}>
            A worldview that presupposes reality has an Author — that existence is not accidental, that truth is not manufactured — points a researcher in the right direction before the first equation is written. That conviction did not bias the research. It aimed it.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.1rem,2.5vw,1.45rem)", fontStyle: "italic", color: BLACK, fontWeight: 700 }}>
            And what we found confirmed what we already knew in our bones.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ── SUPPORT ───────────────────────────────────────────────────────────────────
function Support() {
  return (
    <section id="support" style={{ background: BLACK, padding: "7rem 2rem" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <Reveal><Label>Fund the Program</Label></Reveal>
        <Reveal delay={0.1}><SectionTitle light>Support<br /><span style={{ color: GOLD }}>This Work</span></SectionTitle></Reveal>
        <Reveal delay={0.15}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem,2vw,1.18rem)", color: "rgba(250,250,250,.44)", fontWeight: 300, lineHeight: 1.82, marginBottom: "3rem" }}>
            The Bedrock Program is independently funded. We do not accept institutional grants or platform funding that would compromise the independence of the research. We are coming to our community because they already know what we proved. Your selection provides the solvency for the next phase.
          </p>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
          {TIERS.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.08}>
              <div style={{ padding: "2rem 1.75rem", border: "1px solid rgba(201,168,76,.18)", background: "rgba(201,168,76,.02)", height: "100%", transition: "border-color .3s, background .3s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,.4)"; e.currentTarget.style.background = "rgba(201,168,76,.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,.18)"; e.currentTarget.style.background = "rgba(201,168,76,.02)"; }}
              >
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.2rem", color: GOLD, letterSpacing: "0.05em", lineHeight: 1, marginBottom: "0.5rem" }}>{t.price}</p>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.08em", color: WHITE, marginBottom: "0.75rem" }}>{t.title}</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.92rem", fontWeight: 300, lineHeight: 1.7, color: "rgba(250,250,250,.38)" }}>{t.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <BtnPrimary href={LINKS.givesendgo}>Donate on GiveSendGo →</BtnPrimary>
            <BtnOutline href={LINKS.amazon} dark>Read the Book</BtnOutline>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── TEAM ──────────────────────────────────────────────────────────────────────
function Team() {
  return (
    <section id="team" style={{ background: WHITE, padding: "7rem 2rem" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <Reveal><Label>Structured for Delivery</Label></Reveal>
        <Reveal delay={0.1}><SectionTitle>The<br /><span style={{ color: GOLD }}>Team</span></SectionTitle></Reveal>
        <Reveal delay={0.15}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem,2vw,1.18rem)", color: "#444", fontWeight: 300, lineHeight: 1.82, marginBottom: "3rem" }}>
            Four integrated functions. Research architecture, technical infrastructure, operational deployment, and public distribution. We are not a committee. We are a unit with specialized function.
          </p>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.1}>
              <div style={{ padding: "2rem 1.75rem", borderTop: `2px solid ${GOLD}`, borderRight: i % 2 === 0 ? "1px solid rgba(201,168,76,.1)" : "none", borderBottom: "1px solid rgba(201,168,76,.07)" }}>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.35rem", letterSpacing: "0.06em", color: BLACK, marginBottom: "0.25rem" }}>{m.name}</p>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.14em", color: GOLD, textTransform: "uppercase", marginBottom: "0.8rem" }}>{m.role}</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.92rem", color: "#666", fontWeight: 300, lineHeight: 1.72, marginBottom: "0.9rem" }}>{m.fn}</p>
                <a href={`mailto:${m.email}`}
                  style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.08em", color: "#8a6e2f", textDecoration: "none", transition: "color .2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = GOLD}
                  onMouseLeave={e => e.currentTarget.style.color = "#8a6e2f"}
                >{m.email}</a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── PRESS STRIP ───────────────────────────────────────────────────────────────
function PressStrip() {
  const contacts = [
    { title: "Media Contact",      value: "NohMadllc@journalist.com",       href: "mailto:NohMadllc@journalist.com" },
    { title: "Research Archive",   value: "zenodo.org/records/18345154",    href: LINKS.zenodo },
    { title: "Source Repository",  value: "github.com/The-Bedrock-Project", href: LINKS.github },
  ];
  return (
    <section style={{ background: "#0c0c0c", padding: "4rem 2rem", borderTop: "1px solid rgba(201,168,76,.08)" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <Reveal>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.22em", color: "rgba(250,250,250,.22)", textTransform: "uppercase", marginBottom: "2rem", textAlign: "center" }}>Press &amp; Media Inquiries</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem 3rem", justifyContent: "center", alignItems: "flex-start" }}>
            {contacts.map((c, i) => (
              <div key={i} style={{ textAlign: "center", minWidth: 160 }}>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.1em", color: "rgba(250,250,250,.35)", marginBottom: "0.35rem" }}>{c.title}</p>
                <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                  style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.08em", color: GOLD, textDecoration: "none", transition: "opacity .2s" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.65"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >{c.value}</a>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    {
      title: "The Program",
      links: [["#statement","Statement"],["#test","The Test"],["#research","Research"],["#support","Support"],["#team","Team"]],
    },
    {
      title: "Research",
      links: [[LINKS.zenodo,"Zenodo Archive"],[LINKS.github,"GitHub Repository"],[LINKS.zenodoDownload,"Download Statement"],[LINKS.maintenance,"Maintenance Test"],[LINKS.doi,"DOI Record"]],
    },
    {
      title: "Connect",
      links: [[LINKS.amazon,"Read the Book"],[LINKS.givesendgo,"Donate"],["mailto:NohMadllc@journalist.com","Media Contact"],["mailto:ChristopherBrown@bedrockprogram.com","Director"],["mailto:Alextoal316@bedrockprogram.com","Distribution"]],
    },
  ];

  return (
    <footer style={{ background: "#050505", borderTop: "1px solid rgba(201,168,76,.08)", padding: "5rem 2rem 3rem" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr repeat(3, 1fr)", gap: "2.5rem", marginBottom: "4rem" }} className="footer-grid">
          <div>
            <img src="/NohMad.png" alt="NohMad LLC" style={{ height: 20, filter: "invert(1)", opacity: 0.4, marginBottom: "1.25rem", display: "block" }} />
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.95rem", letterSpacing: "0.12em", color: GOLD, marginBottom: "0.5rem" }}>The Bedrock Program</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.88rem", color: "rgba(250,250,250,.2)", fontWeight: 300, lineHeight: 1.75, maxWidth: 210 }}>
              An independent research initiative. Structurally sound. Publicly verified.
            </p>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.18em", color: "rgba(250,250,250,.22)", textTransform: "uppercase", marginBottom: "1.2rem" }}>{col.title}</p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {col.links.map(([href, label]) => (
                  <li key={label}>
                    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                      style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.07em", color: "rgba(250,250,250,.27)", textDecoration: "none", transition: "color .2s", display: "block" }}
                      onMouseEnter={e => e.currentTarget.style.color = GOLD}
                      onMouseLeave={e => e.currentTarget.style.color = "rgba(250,250,250,.27)"}
                    >{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <GoldLine opacity={0.08} />

        <div style={{ paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", color: "rgba(250,250,250,.16)", letterSpacing: "0.06em" }}>
            © 2026 NohMad LLC · The Bedrock Research Team · All rights reserved.
          </p>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", letterSpacing: "0.14em", color: "rgba(250,250,250,.12)", textTransform: "uppercase" }}>
            Consistency is Law · Selection is the Closure
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Bebas+Neue&family=DM+Mono:wght@300;400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
        body { background: #0A0A0A; overflow-x: hidden; }
        ::selection { background: rgba(201,168,76,.3); color: #FAFAFA; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes menuIn { from { opacity:0; transform:scale(.98); } to { opacity:1; transform:scale(1); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0A0A0A; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,.3); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(201,168,76,.6); }
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .hamburger   { display: flex !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (min-width: 641px) { .hamburger { display: none !important; } }
      `}</style>

      <Navbar />
      <Hero />
      <StatsStrip />
      <GoldLine />
      <Statement />
      <GoldLine />
      <MaintenanceTest />
      <GoldLine />
      <Research />
      <MissionStrip />
      <Support />
      <GoldLine />
      <Team />
      <PressStrip />
      <Footer />
    </>
  );
}
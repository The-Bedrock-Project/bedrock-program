import { useState, useEffect, useRef } from "react";

const LINKS = {
  github: "https://github.com/The-Bedrock-Project/bedrock-program",
  givesendgo: "https://www.givesendgo.com/Bedrock-Program",
  zenodo: "https://zenodo.org/records/18345154",
  maintenance: "https://github.com/The-Bedrock-Project/bedrock-program/raw/main/maintenance_test%20v2.docx",
  statement: "https://github.com/The-Bedrock-Project/bedrock-program/raw/main/bedrock_statement.docx",
};

const TEAM = [
  { name: "Christopher Lamarr Brown", role: "Director / Principal Researcher", fn: "Framework integrity, research architecture, core philosophy, final editorial control.", email: "ChristopherBrown@bedrockprogram.com" },
  { name: "Barbara Reed", role: "Operations Director", fn: "Budget, legal, deployment logistics, timeline, donor coordination.", email: "Barbarareed167@bedrockprogram.com" },
  { name: "Henry Young", role: "Technical Lead", fn: "Measurement systems, data infrastructure, the machine that produces the numbers.", email: "HenryLeeYoung@bedrockprogram.com" },
  { name: "Alex Toal", role: "Distribution Lead", fn: "Content, syndication, public packaging, closing the loop between research and reach.", email: "Alextoal316@bedrockprogram.com" },
];

const TIERS = [
  { price: "$25", title: "The Maintenance Test", desc: "The digital Discernment Field Guide. A 3-step lens you can use at your dinner table tonight." },
  { price: "$100", title: "Program Analyst", desc: "Access to initial Bedrock Program technical reports. See structural signatures mapped in real time." },
  { price: "$500", title: "Structural Guard", desc: "A private video briefing on building Bedrock Systems for your business, home, or ministry." },
  { price: "$1,000+", title: "Program Partner", desc: "Fund forensic data-gathering for a specific institutional case study. Your selection builds the next layer." },
];

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.75s ${delay}s ease, transform 0.75s ${delay}s ease` }}>
      {children}
    </div>
  );
}

function GoldLine() {
  return <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #C9A84C 40%, #C9A84C 60%, transparent)", margin: "0", opacity: 0.4 }} />;
}

function Label({ children }) {
  return <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.22em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "1rem" }}>{children}</p>;
}

function SectionTitle({ children, light = false }) {
  return <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.6rem,7vw,4.5rem)", lineHeight: 0.95, letterSpacing: "0.03em", color: light ? "#FAFAF7" : "#1A1A2E", marginBottom: "1.5rem" }}>{children}</h2>;
}

function BtnPrimary({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "1rem 2.5rem", background: "#C9A84C", color: "#1A1A2E", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.05rem", letterSpacing: "0.12em", textDecoration: "none", transition: "background 0.2s, transform 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.background = "#f0dfa0"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "#C9A84C"; e.currentTarget.style.transform = "translateY(0)"; }}>
      {children}
    </a>
  );
}

function BtnOutline({ href, children, dark = false }) {
  const base = { display: "inline-block", padding: "0.9rem 2rem", border: `1px solid ${dark ? "#C9A84C" : "#8a6e2f"}`, color: dark ? "#C9A84C" : "#8a6e2f", fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.95rem", letterSpacing: "0.12em", textDecoration: "none", transition: "all 0.2s" };
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={base}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#C9A84C"; e.currentTarget.style.color = "#C9A84C"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = dark ? "#C9A84C" : "#8a6e2f"; e.currentTarget.style.color = dark ? "#C9A84C" : "#8a6e2f"; e.currentTarget.style.transform = "translateY(0)"; }}>
      {children}
    </a>
  );
}

// ── NAVBAR ─────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = [["#statement", "Statement"], ["#test", "The Test"], ["#research", "Research"], ["#support", "Support"], ["#team", "Team"]];
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: scrolled ? "rgba(250,250,247,0.97)" : "transparent", borderBottom: scrolled ? "1px solid rgba(201,168,76,0.2)" : "none", backdropFilter: "blur(8px)", transition: "all 0.3s" }}>
      <a href="#" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.14em", color: "#C9A84C", textDecoration: "none" }}>The Bedrock Program</a>
      <ul style={{ display: "flex", gap: "2rem", listStyle: "none", margin: 0, padding: 0 }} className="desktop-nav">
        {links.map(([href, label]) => (
          <li key={href}><a href={href} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.1em", color: "#6B6B7B", textDecoration: "none", textTransform: "uppercase", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#C9A84C"}
            onMouseLeave={e => e.currentTarget.style.color = "#6B6B7B"}>{label}</a></li>
        ))}
      </ul>
      <button onClick={() => setOpen(!open)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "#C9A84C", fontSize: "1.4rem" }} className="hamburger">☰</button>
      {open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(250,250,247,0.98)", zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2rem" }}>
          <button onClick={() => setOpen(false)} style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", cursor: "pointer", fontSize: "1.5rem", color: "#6B6B7B" }}>✕</button>
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.5rem", letterSpacing: "0.08em", color: "#1A1A2E", textDecoration: "none" }}>{label}</a>
          ))}
        </div>
      )}
    </nav>
  );
}

// ── HERO ───────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ minHeight: "100vh", background: "#1A1A2E", display: "flex", flexDirection: "column", justifyContent: "center", padding: "8rem 1.5rem 5rem", position: "relative", overflow: "hidden" }}>
      {/* Background texture */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.04) 0%, transparent 50%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 780, position: "relative", zIndex: 1 }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.22em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "2rem", opacity: 0, animation: "fadeUp 0.8s 0.2s forwards" }}>
          The Bedrock Program &nbsp;·&nbsp; NohMad LLC &nbsp;·&nbsp; 2026
        </p>

        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(4rem,15vw,10rem)", lineHeight: 0.9, letterSpacing: "0.02em", color: "#FAFAF7", marginBottom: "2rem", opacity: 0, animation: "fadeUp 0.8s 0.4s forwards" }}>
          Does It<br /><span style={{ color: "#C9A84C" }}>Stay</span>?
        </h1>

        <p style={{ fontSize: "clamp(1.1rem,2.5vw,1.4rem)", fontWeight: 300, color: "#b0b0c4", maxWidth: 560, marginBottom: "2rem", opacity: 0, animation: "fadeUp 0.8s 0.6s forwards", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.6 }}>
          Truth is structurally self-sustaining. A manufactured narrative is not. The Bedrock Program gives you the instrument to measure which one you are looking at.
        </p>

        <blockquote style={{ borderLeft: "3px solid #C9A84C", paddingLeft: "1.25rem", marginBottom: "3rem", opacity: 0, animation: "fadeUp 0.8s 0.7s forwards" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(0.95rem,2vw,1.1rem)", fontStyle: "italic", color: "#f0dfa0", fontWeight: 300 }}>
            "Everyone then who hears these words of mine and does them will be like a wise man who built his house on the rock."
          </p>
          <cite style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", color: "#6B6B7B", fontStyle: "normal", display: "block", marginTop: "0.5rem" }}>— Matthew 7:24</cite>
        </blockquote>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", opacity: 0, animation: "fadeUp 0.8s 0.9s forwards" }}>
          <BtnPrimary href={LINKS.github}>Verify the Work →</BtnPrimary>
          <BtnOutline href={LINKS.givesendgo} dark>Support the Program</BtnOutline>
        </div>
      </div>
    </section>
  );
}

// ── STATEMENT ──────────────────────────────────────────────────────────────
function Statement() {
  return (
    <section id="statement" style={{ background: "#FAFAF7", padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <Reveal><Label>The Foundation</Label></Reveal>
        <Reveal delay={0.1}><SectionTitle>The Bedrock<br /><span style={{ color: "#C9A84C" }}>Statement</span></SectionTitle></Reveal>
        <Reveal delay={0.15}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem,2vw,1.15rem)", color: "#4a4a5a", fontWeight: 300, lineHeight: 1.75, marginBottom: "2rem" }}>
            A constraint stated without metaphysics, ideology, or appeal to authority. It applies to everyone — regardless of worldview, domain, or starting position. Before disagreement is possible, something must remain stable long enough to be disagreed about.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div style={{ margin: "2.5rem 0", padding: "2rem", borderLeft: "4px solid #C9A84C", background: "#f5edd6" }}>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.6rem,4vw,2.4rem)", lineHeight: 1.1, color: "#1A1A2E" }}>
              Whatever persists must do so<br /><span style={{ color: "#C9A84C" }}>without contradicting itself.</span>
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem,2vw,1.15rem)", color: "#4a4a5a", fontWeight: 300, lineHeight: 1.75, marginBottom: "1.5rem" }}>
            There are exactly two ways for identity to fail. A thing can undermine itself — internal contradiction collapses its boundary. Or a thing can erode — if disturbances accumulate faster than they are corrected, identity dissolves. These are not assumptions. They are failure descriptions.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div style={{ margin: "2.5rem 0", padding: "2rem", border: "1px solid rgba(201,168,76,0.3)", textAlign: "center", background: "rgba(201,168,76,0.03)" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.1rem,2.5vw,1.4rem)", fontStyle: "italic", color: "#1A1A2E", fontWeight: 400 }}>
              "Reality consists of whatever can continue being itself without breaking.<br />Everything else is elaboration."
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", color: "#6B6B7B", marginBottom: "1.5rem" }}>
            Published and timestamped on Zenodo. Independently verifiable.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <BtnPrimary href={LINKS.zenodo}>Read on Zenodo →</BtnPrimary>
            <BtnOutline href={LINKS.statement}>Download Statement</BtnOutline>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── MAINTENANCE TEST ───────────────────────────────────────────────────────
function MaintenanceTest() {
  const sigs = [
    { n: "01", title: "Response Compression", body: "Every question leads back to the same small set of approved answers. The inquiry space is being compressed. A self-sustaining truth expands under questioning. A maintained narrative contracts." },
    { n: "02", title: "Burden Asymmetry", body: "You are required to disprove the claim rather than the claim being required to prove itself. The standard of proof is applied asymmetrically. This is not an intellectual error — it is a structural signature of a maintained system." },
    { n: "03", title: "Authority Substitution", body: "Evidence is replaced by the invocation of authority as a terminal endpoint. The authority is not offered as one source among many — it is offered as a reason to stop asking." },
  ];

  return (
    <section id="test" style={{ background: "#1A1A2E", padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <Reveal><Label>The Primary Instrument</Label></Reveal>
        <Reveal delay={0.1}><SectionTitle light>The Maintenance<br /><span style={{ color: "#C9A84C" }}>Test</span></SectionTitle></Reveal>

        <Reveal delay={0.15}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem,2vw,1.15rem)", color: "#b0b0c4", fontWeight: 300, lineHeight: 1.75, marginBottom: "2rem" }}>
            The Maintenance Test is a three-step structural field guide for discernment. It is not opinion. It is not persuasion. It is a structural test anyone can apply to any claim, in real time, using no equipment other than a functioning mind.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div style={{ margin: "2rem 0 3rem", padding: "1.5rem", borderLeft: "4px solid #C9A84C", background: "rgba(201,168,76,0.06)" }}>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.4rem,4vw,2rem)", color: "#FAFAF7", lineHeight: 1.1 }}>
              Does this truth <span style={{ color: "#C9A84C" }}>stay</span>, or does it have to be <span style={{ color: "#C9A84C" }}>held</span>?
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}><Label>The Three Signatures of a Maintained Narrative</Label></Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", margin: "1rem 0 3rem" }}>
          {sigs.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div style={{ border: "1px solid rgba(201,168,76,0.2)", padding: "1.75rem", background: "rgba(201,168,76,0.03)", position: "relative", overflow: "hidden", transition: "border-color 0.3s, background 0.3s", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)"; e.currentTarget.style.background = "rgba(201,168,76,0.07)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)"; e.currentTarget.style.background = "rgba(201,168,76,0.03)"; }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.15em", color: "#8a6e2f", marginBottom: "0.6rem" }}>{s.n}</p>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", letterSpacing: "0.08em", color: "#C9A84C", marginBottom: "0.75rem" }}>{s.title}</h3>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "#9090a8", fontWeight: 300, lineHeight: 1.7 }}>{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}><Label>The Verdict</Label></Reveal>
        <Reveal delay={0.15}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", margin: "1rem 0 2.5rem" }}>
            <div style={{ padding: "1.75rem", background: "rgba(30,70,30,0.4)", border: "1px solid rgba(80,160,80,0.25)" }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.15em", color: "#8fd48f", marginBottom: "0.5rem" }}>Bedrock</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "#8fd48f", fontWeight: 600, lineHeight: 1.5 }}>If the weight of proof is on the Truth — you are standing on Bedrock.</p>
            </div>
            <div style={{ padding: "1.75rem", background: "rgba(70,20,20,0.4)", border: "1px solid rgba(160,60,60,0.25)" }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.15em", color: "#d48f8f", marginBottom: "0.5rem" }}>Sand</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "#d48f8f", fontWeight: 600, lineHeight: 1.5 }}>If the weight of proof is on You — you are standing in a cage.</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div style={{ padding: "2rem", border: "1px solid rgba(201,168,76,0.3)", textAlign: "center", background: "rgba(201,168,76,0.04)", marginBottom: "2.5rem" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem,2.5vw,1.3rem)", fontStyle: "italic", color: "#f0dfa0", fontWeight: 300 }}>
              Truth is a gift you receive.<br />A narrative is a burden you are forced to carry.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <BtnOutline href={LINKS.maintenance} dark>Download the Full Field Guide</BtnOutline>
        </Reveal>
      </div>
    </section>
  );
}

// ── RESEARCH ───────────────────────────────────────────────────────────────
function Research() {
  return (
    <section id="research" style={{ background: "#FAFAF7", padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <Reveal><Label>Verification Layer</Label></Reveal>
        <Reveal delay={0.1}><SectionTitle>The Research<br /><span style={{ color: "#C9A84C" }}>Is Public</span></SectionTitle></Reveal>

        <Reveal delay={0.15}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem,2vw,1.15rem)", color: "#4a4a5a", fontWeight: 300, lineHeight: 1.75, marginBottom: "2.5rem" }}>
            We do not ask for trust. We hand you the instrument to verify before we ask for anything. The foundational research is timestamped and publicly archived on Zenodo. The repository is open on GitHub. Every document carries the same structural constraint. Nothing is hidden that can be shown.
          </p>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "3rem" }}>
          {[
            { label: "Zenodo Archive", desc: "Timestamped research record. Immutable. Publicly accessible.", href: LINKS.zenodo, cta: "View Record →" },
            { label: "GitHub Repository", desc: "Source documents, license, mission statement. Fully open.", href: LINKS.github, cta: "Open Repository →" },
            { label: "Bedrock Statement", desc: "The foundational constraint document. Download directly.", href: LINKS.statement, cta: "Download →" },
            { label: "Maintenance Test", desc: "The primary public instrument. Three steps. Any domain.", href: LINKS.maintenance, cta: "Download →" },
          ].map((card, i) => (
            <Reveal key={card.label} delay={i * 0.08}>
              <a href={card.href} target="_blank" rel="noopener noreferrer" style={{ display: "block", padding: "1.5rem", border: "1px solid rgba(201,168,76,0.25)", background: "rgba(201,168,76,0.02)", textDecoration: "none", transition: "all 0.25s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#C9A84C"; e.currentTarget.style.background = "rgba(201,168,76,0.06)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.25)"; e.currentTarget.style.background = "rgba(201,168,76,0.02)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.08em", color: "#1A1A2E", marginBottom: "0.5rem" }}>{card.label}</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", color: "#6B6B7B", fontWeight: 300, lineHeight: 1.6, marginBottom: "1rem" }}>{card.desc}</p>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.1em", color: "#C9A84C" }}>{card.cta}</p>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div style={{ padding: "1.5rem", borderLeft: "3px solid #C9A84C", background: "#f5edd6" }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.12em", color: "#8a6e2f", marginBottom: "0.5rem" }}>WHAT IS NOT PUBLIC</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", color: "#4a4a5a", fontWeight: 300, lineHeight: 1.7 }}>
              The foundational research papers, contraction engine methodology, and empirical datasets are protected intellectual property of NohMad LLC. The public layer is sufficient to confirm the work is real, the results are correct, and the methodology is sound.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── MISSION STRIP ──────────────────────────────────────────────────────────
function MissionStrip() {
  return (
    <section style={{ background: "#C9A84C", padding: "5rem 1.5rem" }}>
      <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.22em", color: "rgba(26,26,46,0.6)", textTransform: "uppercase", marginBottom: "1.5rem" }}>Why Faith Led the Research</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem,6vw,3.5rem)", lineHeight: 1, letterSpacing: "0.03em", color: "#1A1A2E", marginBottom: "1.5rem" }}>
            We Did Not Find This By Accident
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem,2vw,1.2rem)", color: "#1A1A2E", fontWeight: 400, lineHeight: 1.75, maxWidth: 620, margin: "0 auto 1.5rem" }}>
            A worldview that presupposes reality has an Author — that existence is not accidental, that truth is not manufactured — points a researcher in the right direction before the first equation is written. That conviction did not bias the research. It aimed it.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.1rem,2.5vw,1.4rem)", fontStyle: "italic", color: "#1A1A2E", fontWeight: 600 }}>
            And what we found confirmed what we already knew in our bones.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ── SUPPORT ────────────────────────────────────────────────────────────────
function Support() {
  return (
    <section id="support" style={{ background: "#1A1A2E", padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <Reveal><Label>Fund the Program</Label></Reveal>
        <Reveal delay={0.1}><SectionTitle light>Support<br /><span style={{ color: "#C9A84C" }}>This Work</span></SectionTitle></Reveal>
        <Reveal delay={0.15}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem,2vw,1.15rem)", color: "#b0b0c4", fontWeight: 300, lineHeight: 1.75, marginBottom: "3rem" }}>
            The Bedrock Program is independently funded. We do not accept institutional grants or platform funding that would compromise the independence of the research. We are coming to our community because they already know what we proved. Your selection provides the solvency for the next phase.
          </p>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
          {TIERS.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.08}>
              <div style={{ padding: "1.75rem", border: "1px solid rgba(201,168,76,0.2)", background: "rgba(201,168,76,0.03)", height: "100%" }}>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#C9A84C", letterSpacing: "0.05em", lineHeight: 1, marginBottom: "0.5rem" }}>{t.price}</p>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.08em", color: "#FAFAF7", marginBottom: "0.75rem" }}>{t.title}</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", fontWeight: 300, lineHeight: 1.65, color: "#9090a8" }}>{t.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <BtnPrimary href={LINKS.givesendgo}>Donate on GiveSendGo →</BtnPrimary>
            <BtnOutline href={LINKS.github} dark>Verify on GitHub</BtnOutline>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── TEAM ───────────────────────────────────────────────────────────────────
function Team() {
  return (
    <section id="team" style={{ background: "#FAFAF7", padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <Reveal><Label>Structured for Delivery</Label></Reveal>
        <Reveal delay={0.1}><SectionTitle>The<br /><span style={{ color: "#C9A84C" }}>Team</span></SectionTitle></Reveal>
        <Reveal delay={0.15}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem,2vw,1.15rem)", color: "#4a4a5a", fontWeight: 300, lineHeight: 1.75, marginBottom: "3rem" }}>
            Four integrated functions. Research architecture, technical infrastructure, operational deployment, and public distribution. We are not a committee. We are a unit with specialized function.
          </p>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "0" }}>
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.1}>
              <div style={{ padding: "2rem 1.5rem", borderTop: "2px solid #C9A84C", borderRight: i % 2 === 0 ? "1px solid rgba(201,168,76,0.15)" : "none" }}>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", letterSpacing: "0.06em", color: "#1A1A2E", marginBottom: "0.25rem" }}>{m.name}</p>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.75rem" }}>{m.role}</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", color: "#6B6B7B", fontWeight: 300, lineHeight: 1.65, marginBottom: "0.75rem" }}>{m.fn}</p>
                <a href={`mailto:${m.email}`} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.08em", color: "#8a6e2f", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#C9A84C"}
                  onMouseLeave={e => e.currentTarget.style.color = "#8a6e2f"}>{m.email}</a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FOOTER ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "#0e0e18", padding: "3rem 1.5rem", textAlign: "center", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
      <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", letterSpacing: "0.15em", color: "#C9A84C", marginBottom: "0.75rem" }}>The Bedrock Program</p>
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.18em", color: "#3a3a5a", textTransform: "uppercase", marginBottom: "1.5rem" }}>Consistency is Law  ·  Selection is the Closure</p>
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {[["#statement", "Statement"], ["#test", "The Test"], ["#research", "Research"], ["#support", "Support"], ["#team", "Team"], [LINKS.github, "GitHub"], [LINKS.zenodo, "Zenodo"], [LINKS.givesendgo, "Donate"], [`mailto:NohMadllc@journalist.com`, "Contact"]].map(([href, label]) => (
          <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
            style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", color: "#3a3a5a", textDecoration: "none", textTransform: "uppercase", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#C9A84C"}
            onMouseLeave={e => e.currentTarget.style.color = "#3a3a5a"}>{label}</a>
        ))}
      </div>
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: "#2a2a3a", letterSpacing: "0.06em" }}>© 2026 NohMad LLC · The Bedrock Research Team · All rights reserved.</p>
    </footer>
  );
}

// ── APP ────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Bebas+Neue&family=DM+Mono:wght@300;400&display=swap'); *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; } html { scroll-behavior: smooth; } body { background: #1A1A2E; } @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } } @media (max-width: 640px) { .desktop-nav { display: none !important; } .hamburger { display: block !important; } } @media (min-width: 641px) { .hamburger { display: none !important; } }`}</style>
      <Navbar />
      <Hero />
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
      <Footer />
    </>
  );
}
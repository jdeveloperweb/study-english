"use client";
import { useState, useEffect, useRef } from "react";

const SECTIONS = ["intro", "afirmativa", "negativa", "interrogativa", "wh-questions", "contracoes", "artigos", "plurais", "pratica", "pronomes", "quiz"];

const quizQuestions = [
  { q: "I ___ a student.", options: ["am", "is", "are"], correct: 0, tip: "Use 'am' com o pronome I." },
  { q: "She ___ from Brazil.", options: ["are", "am", "is"], correct: 2, tip: "He/She/It sempre usa 'is'." },
  { q: "They ___ happy today.", options: ["is", "are", "am"], correct: 1, tip: "They/We/You sempre usa 'are'." },
  { q: "He ___ not a doctor.", options: ["are", "is", "am"], correct: 1, tip: "He usa 'is', então a negativa é 'is not'." },
  { q: "___ you a teacher?", options: ["Is", "Am", "Are"], correct: 2, tip: "You sempre usa 'are'." },
  { q: "It ___ a beautiful day.", options: ["is", "are", "am"], correct: 0, tip: "It usa 'is'." },
  { q: "We ___ friends.", options: ["am", "is", "are"], correct: 2, tip: "We usa 'are'." },
  { q: "I ___ not tired. (contração)", options: ["amn't", "ain't", "I'm not"], correct: 2, tip: "'Amn't' não existe! A forma correta é 'I'm not'." },
  { q: "She ___ a nurse. (contração)", options: ["she's", "she're", "she am"], correct: 0, tip: "She is = She's." },
  { q: "___ he your brother?", options: ["Are", "Am", "Is"], correct: 2, tip: "He usa 'is', então a pergunta é 'Is he...?'" },
  { q: "The cats ___ on the table.", options: ["is", "am", "are"], correct: 2, tip: "Cats é plural, usa 'are'." },
  { q: "My name ___ Jaime.", options: ["are", "is", "am"], correct: 1, tip: "'My name' equivale a 'it', então usa 'is'." },
  { q: "___ is my sister.", options: ["This", "These", "Those"], correct: 0, tip: "Para singular perto, usamos 'This'." },
  { q: "I like ___ new car.", options: ["your", "you", "he"], correct: 0, tip: "Usamos pronomes possessivos (my, your, his...) antes de substantivos." },
  { q: "___ are her brothers.", options: ["These", "This", "That"], correct: 0, tip: "Para plural perto, usamos 'These'." },
  { q: "He is ___ grandfather.", options: ["our", "we", "they"], correct: 0, tip: "Possessivos: our (nosso), his (dele), her (dela)." },
  { q: "Look at ___ bird way over there.", options: ["that", "this", "these"], correct: 0, tip: "Para singular longe, usamos 'That'." },
  { q: "Are ___ your parents?", options: ["those", "this", "that"], correct: 0, tip: "Para plural longe, usamos 'Those'." },
  { q: "Can you help ___?", options: ["me", "I", "my"], correct: 0, tip: "Depois de verbos, usamos pronomes objeto (me, you, him, her...)." },
  { q: "I love my parents. I live with ___.", options: ["them", "they", "their"], correct: 0, tip: "Pronome objeto para 'they' é 'them'." },
  { q: "___ is your teacher?", options: ["Who", "What", "Where"], correct: 0, tip: "'Who' é usado para pessoas." },
  { q: "___ are you from?", options: ["Where", "When", "Who"], correct: 0, tip: "'Where' é usado para lugares." },
  { q: "___ is your birthday?", options: ["When", "What", "Who"], correct: 1, tip: "'When' é usado para tempo/datas." },
  { q: "She is talking to ___.", options: ["him", "he", "his"], correct: 0, tip: "Depois de preposição (to), usamos o pronome objeto (him)." },
  { q: "I need ___ apple.", options: ["an", "a", "the"], correct: 0, tip: "Usamos 'an' antes de sons de vogais (a, e, i, o, u)." },
  { q: "He is ___ doctor.", options: ["a", "an", "the"], correct: 0, tip: "Usamos 'a' antes de profissões com som de consoante." },
  { q: "Look at ___ moon!", options: ["the", "a", "an"], correct: 0, tip: "Usamos 'the' para coisas únicas." },
  { q: "One child, two ___.", options: ["children", "childs", "childrens"], correct: 0, tip: "'Child' é um plural irregular: altera para 'children'." },
  { q: "I have three ___.", options: ["boxes", "box", "boxs"], correct: 0, tip: "Palavras terminadas em -s, -sh, -ch, -x, -z ganham '-es' no plural." },
];

const conjugationTable = [
  { pronoun: "I", affirmative: "am", negative: "am not", contraction: "I'm / I'm not", interrogative: "Am I...?" },
  { pronoun: "You", affirmative: "are", negative: "are not", contraction: "You're / You aren't", interrogative: "Are you...?" },
  { pronoun: "He", affirmative: "is", negative: "is not", contraction: "He's / He isn't", interrogative: "Is he...?" },
  { pronoun: "She", affirmative: "is", negative: "is not", contraction: "She's / She isn't", interrogative: "Is she...?" },
  { pronoun: "It", affirmative: "is", negative: "is not", contraction: "It's / It isn't", interrogative: "Is it...?" },
  { pronoun: "We", affirmative: "are", negative: "are not", contraction: "We're / We aren't", interrogative: "Are we...?" },
  { pronoun: "They", affirmative: "are", negative: "are not", contraction: "They're / They aren't", interrogative: "Are they...?" },
];

const professionExamples = [
  { en: "I am a doctor.", pt: "Eu sou um médico.", icon: "🩺" },
  { en: "She is a teacher.", pt: "Ela é uma professora.", icon: "👩‍🏫" },
  { en: "He is an engineer.", pt: "Ele é um engenheiro.", icon: "👷" },
  { en: "They are lawyers.", pt: "Eles são advogados.", icon: "⚖️" },
  { en: "We are developers.", pt: "Nós somos desenvolvedores.", icon: "💻" },
  { en: "You are a nurse.", pt: "Você é um(a) enfermeiro(a).", icon: "🏥" },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(30px)",
      transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
    }}>{children}</div>
  );
}

function ProgressBar({ progress }) {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: "4px", background: "rgba(0,0,0,0.06)" }}>
      <div style={{
        height: "100%", width: `${progress * 100}%`,
        background: "linear-gradient(90deg, #D4A04A, #C75B3F)",
        transition: "width 0.4s ease", borderRadius: "0 2px 2px 0",
      }} />
    </div>
  );
}

function NavDots({ activeSection }) {
  const labels = ["Início", "Afirmativa", "Negativa", "Interrogativa", "Wh- Questions", "Contrações", "Artigos", "Plurais", "Prática", "Pronomes", "Quiz"];
  return (
    <nav style={{
      position: "fixed", right: "16px", top: "50%", transform: "translateY(-50%)",
      display: "flex", flexDirection: "column", gap: "10px", zIndex: 90,
    }}>
      {SECTIONS.map((s, i) => (
        <a key={s} href={`#${s}`} title={labels[i]} style={{
          width: activeSection === i ? "28px" : "8px", height: "8px",
          borderRadius: "4px",
          background: activeSection === i ? "#D4A04A" : "rgba(0,0,0,0.15)",
          transition: "all 0.35s ease", border: "none", cursor: "pointer", display: "block",
        }} />
      ))}
    </nav>
  );
}

function FlipCard({ front, back }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div onClick={() => setFlipped(!flipped)} style={{ perspective: "800px", cursor: "pointer", width: "100%", height: "150px" }}>
      <div style={{
        position: "relative", width: "100%", height: "100%",
        transformStyle: "preserve-3d",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0)",
        transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <div style={{
          position: "absolute", inset: 0, backfaceVisibility: "hidden",
          background: "linear-gradient(145deg, #1C2637 0%, #2A3749 100%)",
          borderRadius: "16px", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "20px", color: "#EDE4D3", fontFamily: "'Literata', serif",
          fontSize: "17px", textAlign: "center", lineHeight: 1.5,
          boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
        }}>
          {front}
          <span style={{ position: "absolute", bottom: "10px", fontSize: "11px", opacity: 0.35, fontFamily: "'Outfit', sans-serif" }}>toque para virar</span>
        </div>
        <div style={{
          position: "absolute", inset: 0, backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: "linear-gradient(145deg, #D4A04A 0%, #C75B3F 100%)",
          borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px", color: "#fff", fontFamily: "'Literata', serif",
          fontSize: "17px", textAlign: "center", lineHeight: 1.5,
          boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
        }}>
          {back}
        </div>
      </div>
    </div>
  );
}

function InteractiveDemonstratives() {
  const [selected, setSelected] = useState(0);
  const items = [
    { en: "This", pt: "Este/Esta", desc: "Perto, Singular", ex: "This is my house.", icon: "📍" },
    { en: "That", pt: "Aquele/Aquela", desc: "Longe, Singular", ex: "That is a bird.", icon: "🔭" },
    { en: "These", pt: "Estes/Estas", desc: "Perto, Plural", ex: "These are my keys.", icon: "📍📍" },
    { en: "Those", pt: "Aqueles/Aquelas", desc: "Longe, Plural", ex: "Those are stars.", icon: "🔭🔭" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
        {items.map((item, i) => (
          <button key={i} onClick={() => setSelected(i)} style={{
            padding: "16px", borderRadius: "14px", border: "2px solid",
            borderColor: selected === i ? "#00838F" : "rgba(0,0,0,0.05)",
            background: selected === i ? "#E0F7FA" : "#fff",
            textAlign: "left", cursor: "pointer", transition: "all 0.3s ease",
          }}>
            <div style={{ fontSize: "20px", marginBottom: "4px" }}>{item.icon} {item.en}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>{item.desc}</div>
          </button>
        ))}
      </div>
      <div style={{
        padding: "20px", background: "linear-gradient(135deg, #00838F, #00ACC1)",
        borderRadius: "16px", color: "#fff", animation: "slideUp 0.3s ease",
      }}>
        <div style={{ fontSize: "22px", fontFamily: "'Literata', serif", fontWeight: 700, marginBottom: "4px" }}>{items[selected].en} = {items[selected].pt}</div>
        <div style={{ fontSize: "16px", opacity: 0.9 }}>Exemplo: <strong>{items[selected].ex}</strong></div>
      </div>
    </div>
  );
}

function InteractiveConjugation() {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", margin: "20px 0" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
        {conjugationTable.map((row, i) => (
          <button key={row.pronoun} onClick={() => setSelected(selected === i ? null : i)} style={{
            padding: "10px 22px", borderRadius: "30px", border: "2px solid",
            borderColor: selected === i ? "#D4A04A" : "rgba(0,0,0,0.08)",
            background: selected === i ? "linear-gradient(135deg, #D4A04A, #C75B3F)" : "#fff",
            color: selected === i ? "#fff" : "#1C2637",
            fontFamily: "'Literata', serif", fontSize: "16px",
            cursor: "pointer", transition: "all 0.3s ease",
            fontWeight: selected === i ? 700 : 400,
            boxShadow: selected === i ? "0 4px 16px rgba(212,160,74,0.25)" : "none",
          }}>{row.pronoun}</button>
        ))}
      </div>
      {selected !== null && (
        <div style={{
          width: "100%", padding: "24px",
          background: "linear-gradient(135deg, #FDFAF4 0%, #fff 100%)",
          borderRadius: "18px", border: "1px solid rgba(212,160,74,0.15)",
          animation: "slideUp 0.4s ease",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
            {[
              { label: "✅ Afirmativa", value: `${conjugationTable[selected].pronoun} ${conjugationTable[selected].affirmative}` },
              { label: "❌ Negativa", value: `${conjugationTable[selected].pronoun} ${conjugationTable[selected].negative}` },
              { label: "⚡ Contração", value: conjugationTable[selected].contraction },
              { label: "❓ Interrogativa", value: conjugationTable[selected].interrogative },
            ].map(item => (
              <div key={item.label} style={{
                padding: "14px", background: "#fff", borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}>
                <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.2px", color: "#999", marginBottom: "6px", fontFamily: "'Outfit', sans-serif" }}>{item.label}</div>
                <div style={{ fontSize: "19px", color: "#1C2637", fontFamily: "'Literata', serif", fontWeight: 600 }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FillBlank({ sentence, answer, hint }) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState(null);
  const check = () => {
    setStatus(input.trim().toLowerCase() === answer.toLowerCase() ? "correct" : "wrong");
  };
  return (
    <div style={{
      padding: "18px 20px", background: "#fff", borderRadius: "14px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.04)", marginBottom: "10px",
      borderLeft: status === "correct" ? "4px solid #5A9E6F" : status === "wrong" ? "4px solid #C75B3F" : "4px solid transparent",
      transition: "border-color 0.3s ease",
    }}>
      <div style={{ fontFamily: "'Literata', serif", fontSize: "18px", color: "#1C2637", marginBottom: "10px" }}>
        {sentence.split("___").map((part, i, arr) => (
          <span key={i}>
            {part}
            {i < arr.length - 1 && (
              <input value={input}
                onChange={e => { setInput(e.target.value); setStatus(null); }}
                onKeyDown={e => e.key === "Enter" && check()}
                placeholder={hint || "..."} style={{
                  width: "80px", border: "none", borderBottom: "2px dashed #D4A04A",
                  textAlign: "center", fontSize: "18px", fontFamily: "'Literata', serif",
                  background: "transparent", outline: "none", color: "#D4A04A", fontWeight: 700,
                  padding: "2px 4px", margin: "0 4px",
                }} />
            )}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button onClick={check} style={{
          padding: "7px 18px", borderRadius: "20px", border: "none",
          background: "#1C2637", color: "#EDE4D3", fontSize: "13px",
          cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontWeight: 500,
        }}>Verificar</button>
        {status === "correct" && <span style={{ color: "#5A9E6F", fontWeight: 600, fontSize: "14px" }}>✓ Correto!</span>}
        {status === "wrong" && <span style={{ color: "#C75B3F", fontWeight: 600, fontSize: "14px" }}>✗ Resposta: <strong>{answer}</strong></span>}
      </div>
    </div>
  );
}

function Quiz() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const score = answers.filter((a, i) => a === quizQuestions[i].correct).length;

  const handleSelect = (optIdx) => {
    if (selected !== null) return;
    setSelected(optIdx);
    setAnswers(prev => [...prev, optIdx]);
    setShowResult(true);
    setTimeout(() => {
      if (current < quizQuestions.length - 1) {
        setCurrent(c => c + 1); setSelected(null); setShowResult(false);
      } else { setFinished(true); }
    }, 2200);
  };

  const restart = () => {
    setCurrent(0); setAnswers([]); setSelected(null); setShowResult(false); setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / quizQuestions.length) * 100);
    const emoji = pct >= 80 ? "🏆" : pct >= 60 ? "👏" : "📚";
    const msg = pct >= 80 ? "Excelente! Você dominou o Verb To Be!" : pct >= 60 ? "Bom trabalho! Continue praticando!" : "Continue estudando, você vai conseguir!";
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px", animation: "bounceIn 0.6s ease" }}>{emoji}</div>
        <div style={{ fontFamily: "'Literata', serif", fontSize: "48px", fontWeight: 700, color: "#1C2637", marginBottom: "8px" }}>
          {score}/{quizQuestions.length}
        </div>
        <div style={{ fontSize: "17px", color: "#777", marginBottom: "6px", fontFamily: "'Outfit', sans-serif" }}>{pct}% de acerto</div>
        <div style={{ fontFamily: "'Literata', serif", fontSize: "20px", color: "#1C2637", marginBottom: "32px" }}>{msg}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginBottom: "28px" }}>
          {answers.map((a, i) => (
            <div key={i} style={{
              width: "34px", height: "34px", borderRadius: "50%", display: "flex",
              alignItems: "center", justifyContent: "center",
              background: a === quizQuestions[i].correct ? "#5A9E6F" : "#C75B3F",
              color: "#fff", fontSize: "13px", fontWeight: 700,
            }}>{i + 1}</div>
          ))}
        </div>
        <button onClick={restart} style={{
          padding: "14px 36px", borderRadius: "40px", border: "none",
          background: "linear-gradient(135deg, #D4A04A, #C75B3F)",
          color: "#fff", fontSize: "16px", cursor: "pointer",
          fontFamily: "'Outfit', sans-serif", fontWeight: 600,
          boxShadow: "0 4px 20px rgba(212,160,74,0.25)",
        }}>Tentar Novamente</button>
      </div>
    );
  }

  const q = quizQuestions[current];
  const isCorrect = selected !== null && selected === q.correct;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "14px", color: "#999" }}>
          Questão {current + 1} de {quizQuestions.length}
        </span>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "14px", color: "#5A9E6F", fontWeight: 600 }}>
          {answers.filter((a, i) => a === quizQuestions[i].correct).length} ✓
        </span>
      </div>
      <div style={{ display: "flex", gap: "3px", marginBottom: "28px" }}>
        {quizQuestions.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: "4px", borderRadius: "2px",
            background: i < current ? (answers[i] === quizQuestions[i].correct ? "#5A9E6F" : "#C75B3F") : i === current ? "#D4A04A" : "rgba(0,0,0,0.07)",
            transition: "background 0.3s ease",
          }} />
        ))}
      </div>
      <div style={{
        fontFamily: "'Literata', serif", fontSize: "24px", color: "#1C2637",
        marginBottom: "24px", lineHeight: 1.4, fontWeight: 500,
      }}>
        {q.q}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {q.options.map((opt, oi) => {
          let bg = "#fff"; let border = "1px solid rgba(0,0,0,0.06)"; let color = "#1C2637";
          if (showResult && oi === q.correct) { bg = "#5A9E6F"; border = "1px solid #5A9E6F"; color = "#fff"; }
          else if (showResult && oi === selected && oi !== q.correct) { bg = "#C75B3F"; border = "1px solid #C75B3F"; color = "#fff"; }
          return (
            <button key={oi} onClick={() => handleSelect(oi)} style={{
              padding: "14px 22px", borderRadius: "12px", border, background: bg, color,
              fontFamily: "'Literata', serif", fontSize: "18px",
              cursor: selected === null ? "pointer" : "default",
              textAlign: "left", transition: "all 0.3s ease",
              boxShadow: selected === null ? "0 1px 6px rgba(0,0,0,0.03)" : "none",
            }}>
              <span style={{ fontWeight: 600, marginRight: "12px", opacity: 0.35 }}>{String.fromCharCode(65 + oi)}</span>
              {opt}
            </button>
          );
        })}
      </div>
      {showResult && (
        <div style={{
          marginTop: "16px", padding: "14px 18px", borderRadius: "12px",
          background: isCorrect ? "rgba(90,158,111,0.08)" : "rgba(199,91,63,0.08)",
          border: `1px solid ${isCorrect ? "rgba(90,158,111,0.15)" : "rgba(199,91,63,0.15)"}`,
          fontFamily: "'Literata', serif", fontSize: "15px", color: "#555",
          animation: "slideUp 0.3s ease",
        }}>
          💡 <strong>Dica:</strong> {q.tip}
        </div>
      )}
    </div>
  );
}

export default function VerbToBeStudy() {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? window.scrollY / total : 0);
      const sectionEls = SECTIONS.map(s => document.getElementById(s));
      for (let i = sectionEls.length - 1; i >= 0; i--) {
        if (sectionEls[i] && sectionEls[i].getBoundingClientRect().top < 300) {
          setActiveSection(i); break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#F8F4EC", color: "#1C2637", fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Literata:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; scroll-behavior: smooth; }
        ::selection { background: #D4A04A; color: #fff; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounceIn { 0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
      `}</style>

      <ProgressBar progress={scrollProgress} />
      <NavDots activeSection={activeSection} />

      {/* ============ HERO ============ */}
      <section id="intro" style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        padding: "40px 20px", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: "radial-gradient(circle at 1px 1px, #1C2637 1px, transparent 0)",
          backgroundSize: "36px 36px",
        }} />
        <div style={{
          position: "absolute", top: "-80px", right: "-60px",
          width: "380px", height: "380px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,160,74,0.12), transparent 70%)",
          animation: "float 7s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "-40px", left: "-40px",
          width: "280px", height: "280px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(199,91,63,0.08), transparent 70%)",
          animation: "float 9s ease-in-out infinite 2s",
        }} />

        <div style={{
          display: "inline-block", padding: "8px 20px", borderRadius: "30px",
          background: "rgba(212,160,74,0.1)", border: "1px solid rgba(212,160,74,0.2)",
          fontSize: "12px", letterSpacing: "2.5px", textTransform: "uppercase",
          color: "#D4A04A", fontWeight: 600, marginBottom: "28px",
          animation: "slideUp 0.6s ease 0.2s both",
        }}>
          Semana 1 · Gramática do Inglês
        </div>

        <h1 style={{
          fontFamily: "'Literata', serif", fontSize: "clamp(44px, 8vw, 88px)",
          fontWeight: 700, lineHeight: 1.05, marginBottom: "20px",
          animation: "slideUp 0.6s ease 0.4s both",
        }}>
          <span style={{ color: "#1C2637" }}>Verbo </span>
          <span style={{
            background: "linear-gradient(135deg, #D4A04A, #C75B3F, #D4A04A)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "shimmer 4s linear infinite",
          }}>To Be</span>
        </h1>

        <p style={{
          fontFamily: "'Literata', serif", fontSize: "clamp(17px, 2.5vw, 22px)",
          color: "#777", maxWidth: "560px", lineHeight: 1.7, marginBottom: "44px",
          animation: "slideUp 0.6s ease 0.6s both",
        }}>
          Aprenda a usar <strong style={{ color: "#1C2637" }}>am</strong>, <strong style={{ color: "#1C2637" }}>is</strong> e <strong style={{ color: "#1C2637" }}>are</strong> nas formas
          afirmativa, negativa, interrogativa e com contrações.
        </p>

        <a href="#afirmativa" style={{
          padding: "16px 40px", borderRadius: "40px",
          background: "linear-gradient(135deg, #1C2637 0%, #2A3749 100%)",
          color: "#EDE4D3", fontSize: "15px", textDecoration: "none",
          fontWeight: 600, letterSpacing: "0.5px",
          boxShadow: "0 8px 28px rgba(28,38,55,0.25)",
          animation: "slideUp 0.6s ease 0.8s both",
        }}>
          Começar o Estudo →
        </a>

        <div style={{
          position: "absolute", bottom: "36px",
          animation: "float 2s ease-in-out infinite",
          fontSize: "22px", opacity: 0.25,
        }}>↓</div>
      </section>

      {/* ============ CONTENT ============ */}
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "0 20px" }}>

        {/* === AFIRMATIVA === */}
        <section id="afirmativa" style={{ paddingTop: "80px", paddingBottom: "60px" }}>
          <FadeIn>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
              <div style={{
                width: "42px", height: "42px", borderRadius: "12px",
                background: "linear-gradient(135deg, #5A9E6F, #6DB87F)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: "18px", fontWeight: 700,
              }}>✓</div>
              <h2 style={{ fontFamily: "'Literata', serif", fontSize: "34px", fontWeight: 700 }}>Forma Afirmativa</h2>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div style={{
              padding: "30px", background: "#fff", borderRadius: "20px",
              boxShadow: "0 3px 16px rgba(0,0,0,0.04)", marginBottom: "20px",
            }}>
              <p style={{ fontFamily: "'Literata', serif", fontSize: "18px", lineHeight: 1.85, color: "#444", marginBottom: "24px" }}>
                O verbo <strong>"to be"</strong> é o mais importante do inglês. Ele equivale aos verbos
                <strong> "ser"</strong> e <strong>"estar"</strong> em português. No presente simples, ele tem <strong>três formas</strong>:
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", textAlign: "center" }}>
                {[
                  { form: "AM", pronouns: "I (eu)", color: "#D4A04A", desc: "Só com I" },
                  { form: "IS", pronouns: "He / She / It", color: "#C75B3F", desc: "Ele, ela, isso" },
                  { form: "ARE", pronouns: "You / We / They", color: "#5A9E6F", desc: "Você, nós, eles" },
                ].map(item => (
                  <div key={item.form} style={{
                    padding: "22px 16px", borderRadius: "16px",
                    background: `${item.color}0D`, border: `2px solid ${item.color}25`,
                  }}>
                    <div style={{ fontFamily: "'Literata', serif", fontSize: "34px", fontWeight: 700, color: item.color }}>{item.form}</div>
                    <div style={{ fontSize: "14px", color: "#555", marginTop: "4px", fontWeight: 500 }}>{item.pronouns}</div>
                    <div style={{ fontSize: "12px", color: "#999", marginTop: "2px" }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div style={{
              padding: "28px", background: "linear-gradient(145deg, #1C2637, #2A3749)",
              borderRadius: "20px", color: "#EDE4D3",
            }}>
              <div style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", opacity: 0.4, marginBottom: "16px" }}>
                📖 Material de Estudo
              </div>
              <p style={{ fontFamily: "'Literata', serif", fontSize: "17px", lineHeight: 1.9, opacity: 0.92 }}>
                <strong>Estrutura:</strong> Sujeito + am/is/are + complemento<br /><br />
                <span style={{ color: "#D4A04A" }}>I am</span> happy. → <em>Eu estou feliz.</em><br />
                <span style={{ color: "#C75B3F" }}>She is</span> a doctor. → <em>Ela é uma médica.</em><br />
                <span style={{ color: "#5A9E6F" }}>They are</span> at home. → <em>Eles estão em casa.</em><br /><br />
                <strong>🇧🇷 Atenção:</strong> Em português, podemos omitir o pronome ("Sou médico"), mas em inglês o pronome é <strong>obrigatório</strong>. Sempre diga "<strong>I am</strong> a doctor", nunca apenas "Am a doctor".
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div style={{
              marginTop: "20px", padding: "22px", borderRadius: "16px",
              background: "rgba(90,158,111,0.06)", border: "1px solid rgba(90,158,111,0.12)",
            }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "20px" }}>💡</span>
                <div style={{ fontFamily: "'Literata', serif", fontSize: "16px", lineHeight: 1.75, color: "#555" }}>
                  <strong>Dica importante:</strong> Em inglês, usamos o artigo <strong>"a"</strong> (ou <strong>"an"</strong> antes de vogais) antes de profissões.
                  "Eu sou médico" → "I am <strong>a</strong> doctor". "Ela é engenheira" → "She is <strong>an</strong> engineer".
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* === NEGATIVA === */}
        <section id="negativa" style={{ paddingBottom: "60px" }}>
          <FadeIn>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
              <div style={{
                width: "42px", height: "42px", borderRadius: "12px",
                background: "linear-gradient(135deg, #C75B3F, #D46A50)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: "18px", fontWeight: 700,
              }}>✗</div>
              <h2 style={{ fontFamily: "'Literata', serif", fontSize: "34px", fontWeight: 700 }}>Forma Negativa</h2>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div style={{
              padding: "30px", background: "#fff", borderRadius: "20px",
              boxShadow: "0 3px 16px rgba(0,0,0,0.04)", marginBottom: "20px",
            }}>
              <p style={{ fontFamily: "'Literata', serif", fontSize: "18px", lineHeight: 1.85, color: "#444", marginBottom: "24px" }}>
                Para negar com o verbo "to be", basta adicionar <strong style={{ color: "#C75B3F" }}>not</strong> logo depois do verbo.
                Diferente de outros verbos em inglês, o "to be" <strong>não precisa</strong> de auxiliar (do/does) para formar a negativa.
              </p>

              <div style={{
                fontFamily: "'Literata', serif", fontSize: "18px", lineHeight: 2.2,
                padding: "20px 24px", background: "#FFF6F4", borderRadius: "14px",
                borderLeft: "4px solid #C75B3F",
              }}>
                I <strong>am not</strong> tired. → <em>Eu não estou cansado.</em><br />
                He <strong>is not</strong> a teacher. → <em>Ele não é professor.</em><br />
                We <strong>are not</strong> late. → <em>Nós não estamos atrasados.</em><br />
                She <strong>is not</strong> Brazilian. → <em>Ela não é brasileira.</em><br />
                It <strong>is not</strong> cold today. → <em>Não está frio hoje.</em>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div style={{
              padding: "22px", background: "rgba(199,91,63,0.06)", borderRadius: "16px",
              border: "1px solid rgba(199,91,63,0.12)",
            }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "20px" }}>🇧🇷</span>
                <div style={{ fontFamily: "'Literata', serif", fontSize: "16px", lineHeight: 1.75, color: "#555" }}>
                  <strong>Diferença do português:</strong> Em inglês, a negação <strong>nunca</strong> usa "no" antes do verbo.
                  O <em>"not"</em> sempre vem <strong>depois</strong> do verbo "to be".<br />
                  ❌ "I no am a doctor" → ✅ "I am <strong>not</strong> a doctor"<br />
                  Compare: <em>"Não sou médico"</em> → <em>"I am not a doctor"</em>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div style={{
              marginTop: "20px", padding: "28px",
              background: "linear-gradient(145deg, #1C2637, #2A3749)",
              borderRadius: "20px", color: "#EDE4D3",
            }}>
              <div style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", opacity: 0.4, marginBottom: "16px" }}>
                📐 Estrutura da Negativa
              </div>
              <div style={{ fontFamily: "'Literata', serif", fontSize: "17px", lineHeight: 2, opacity: 0.92 }}>
                <strong>Sujeito + am/is/are + NOT + complemento</strong><br /><br />
                <span style={{ color: "#D4A04A" }}>I</span> + am + not + happy → <em>Eu não estou feliz</em><br />
                <span style={{ color: "#C75B3F" }}>She</span> + is + not + here → <em>Ela não está aqui</em><br />
                <span style={{ color: "#5A9E6F" }}>They</span> + are + not + ready → <em>Eles não estão prontos</em>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* === INTERROGATIVA === */}
        <section id="interrogativa" style={{ paddingBottom: "60px" }}>
          <FadeIn>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
              <div style={{
                width: "42px", height: "42px", borderRadius: "12px",
                background: "linear-gradient(135deg, #5C6BC0, #7986CB)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: "20px", fontWeight: 700,
              }}>?</div>
              <h2 style={{ fontFamily: "'Literata', serif", fontSize: "34px", fontWeight: 700 }}>Forma Interrogativa</h2>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div style={{
              padding: "30px", background: "#fff", borderRadius: "20px",
              boxShadow: "0 3px 16px rgba(0,0,0,0.04)", marginBottom: "20px",
            }}>
              <p style={{ fontFamily: "'Literata', serif", fontSize: "18px", lineHeight: 1.85, color: "#444", marginBottom: "24px" }}>
                Para fazer perguntas com "to be", basta <strong>inverter</strong> a posição do verbo e do sujeito —
                o verbo vai <strong>antes</strong> do sujeito. Não é necessário usar auxiliar (do/does).
              </p>

              <div style={{
                display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "14px",
                alignItems: "center", textAlign: "center", marginBottom: "24px",
              }}>
                <div style={{ padding: "18px", background: "#F7F6FF", borderRadius: "14px" }}>
                  <div style={{ fontSize: "11px", color: "#999", marginBottom: "6px", letterSpacing: "1px", textTransform: "uppercase" }}>Afirmação</div>
                  <div style={{ fontFamily: "'Literata', serif", fontSize: "17px" }}>
                    <span style={{ color: "#D4A04A", fontWeight: 600 }}>She</span>{" "}
                    <span style={{ color: "#5C6BC0", fontWeight: 600 }}>is</span> a nurse.
                  </div>
                </div>
                <div style={{ fontSize: "22px", color: "#ccc" }}>→</div>
                <div style={{ padding: "18px", background: "#EEEEFF", borderRadius: "14px", border: "2px solid rgba(92,107,192,0.15)" }}>
                  <div style={{ fontSize: "11px", color: "#999", marginBottom: "6px", letterSpacing: "1px", textTransform: "uppercase" }}>Pergunta</div>
                  <div style={{ fontFamily: "'Literata', serif", fontSize: "17px" }}>
                    <span style={{ color: "#5C6BC0", fontWeight: 600 }}>Is</span>{" "}
                    <span style={{ color: "#D4A04A", fontWeight: 600 }}>she</span> a nurse?
                  </div>
                </div>
              </div>

              <div style={{
                fontFamily: "'Literata', serif", fontSize: "18px", lineHeight: 2.2,
                padding: "20px 24px", background: "#F5F4FF", borderRadius: "14px",
                borderLeft: "4px solid #5C6BC0",
              }}>
                <strong>Am</strong> I late? → <em>Eu estou atrasado?</em><br />
                <strong>Is</strong> he your friend? → <em>Ele é seu amigo?</em><br />
                <strong>Are</strong> you happy? → <em>Você está feliz?</em><br />
                <strong>Are</strong> they Brazilian? → <em>Eles são brasileiros?</em>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div style={{
              padding: "22px", background: "rgba(92,107,192,0.06)", borderRadius: "16px",
              border: "1px solid rgba(92,107,192,0.12)",
            }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "20px" }}>🗣️</span>
                <div style={{ fontFamily: "'Literata', serif", fontSize: "16px", lineHeight: 1.75, color: "#555" }}>
                  <strong>Respostas curtas (Short Answers):</strong> Em inglês, costumamos responder perguntas de sim/não com respostas curtas:<br /><br />
                  "Are you a student?" → "<strong>Yes, I am.</strong>" ou "<strong>No, I'm not.</strong>"<br />
                  "Is she Brazilian?" → "<strong>Yes, she is.</strong>" ou "<strong>No, she isn't.</strong>"<br /><br />
                  ⚠️ Nunca diga "Yes, I'm" (com contração) na resposta afirmativa curta. O correto é "<strong>Yes, I am.</strong>"
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* === WH- QUESTIONS === */}
        <section id="wh-questions" style={{ paddingBottom: "60px" }}>
          <FadeIn>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
              <div style={{
                width: "42px", height: "42px", borderRadius: "12px",
                background: "linear-gradient(135deg, #1976D2, #42A5F5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: "18px", fontWeight: 700,
              }}>💡</div>
              <h2 style={{ fontFamily: "'Literata', serif", fontSize: "34px", fontWeight: 700 }}>Wh- Questions</h2>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div style={{
              padding: "30px", background: "#fff", borderRadius: "20px",
              boxShadow: "0 3px 16px rgba(0,0,0,0.04)", marginBottom: "20px",
            }}>
              <p style={{ fontFamily: "'Literata', serif", fontSize: "18px", lineHeight: 1.85, color: "#444", marginBottom: "24px" }}>
                Além de perguntas de "Sim ou Não", usamos palavras especiais para obter informações específicas.
                A estrutura é: <strong>Wh- word + am/is/are + sujeito?</strong>
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                {[
                  { wh: "Who", mean: "Quem", ex: "Who is that girl?", exPt: "Quem é aquela garota?" },
                  { wh: "What", mean: "O que / Qual", ex: "What is your name?", exPt: "Qual é o seu nome?" },
                  { wh: "Where", mean: "Onde", ex: "Where are you from?", exPt: "De onde você é?" },
                  { wh: "When", mean: "Quando", ex: "When is the party?", exPt: "Quando é a festa?" },
                  { wh: "Why", mean: "Por que", ex: "Why are you sad?", exPt: "Por que você está triste?" },
                  { wh: "How", mean: "Como", ex: "How are you?", exPt: "Como você está?" },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "16px", background: "#E3F2FD", borderRadius: "14px", border: "1px solid #BBDEFB" }}>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: "#1565C0" }}>{item.wh}</div>
                    <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>{item.mean}</div>
                    <div style={{ fontSize: "14px", fontStyle: "italic", color: "#333" }}>"{item.ex}"</div>
                    <div style={{ fontSize: "12px", color: "#999" }}>{item.exPt}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </section>

        {/* === CONTRAÇÕES === */}
        <section id="contracoes" style={{ paddingBottom: "60px" }}>
          <FadeIn>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
              <div style={{
                width: "42px", height: "42px", borderRadius: "12px",
                background: "linear-gradient(135deg, #D4A04A, #E8B85A)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: "18px",
              }}>⚡</div>
              <h2 style={{ fontFamily: "'Literata', serif", fontSize: "34px", fontWeight: 700 }}>Contrações</h2>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div style={{
              padding: "30px", background: "#fff", borderRadius: "20px",
              boxShadow: "0 3px 16px rgba(0,0,0,0.04)", marginBottom: "20px",
            }}>
              <p style={{ fontFamily: "'Literata', serif", fontSize: "18px", lineHeight: 1.85, color: "#444", marginBottom: "24px" }}>
                No inglês falado e informal, quase sempre usamos <strong>contrações</strong>. Elas tornam a fala mais natural e fluente.
                É <strong>essencial</strong> aprendê-las para entender nativos.
              </p>

              <div style={{
                display: "grid", gridTemplateColumns: "1.2fr 1fr 1.2fr 2fr",
                gap: "12px", padding: "10px 16px", marginBottom: "4px",
                fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px",
                color: "#aaa", fontWeight: 600,
              }}>
                <span>Forma completa</span><span>Contração ✅</span><span>Negativa ❌</span><span>Exemplo</span>
              </div>

              <div style={{ display: "grid", gap: "4px" }}>
                {[
                  { full: "I am", short: "I'm", neg: "I'm not", ex: "I'm a developer.", exPt: "Eu sou desenvolvedor." },
                  { full: "You are", short: "You're", neg: "You aren't", ex: "You're welcome.", exPt: "De nada." },
                  { full: "He is", short: "He's", neg: "He isn't", ex: "He's from São Paulo.", exPt: "Ele é de São Paulo." },
                  { full: "She is", short: "She's", neg: "She isn't", ex: "She's not here.", exPt: "Ela não está aqui." },
                  { full: "It is", short: "It's", neg: "It isn't", ex: "It's raining.", exPt: "Está chovendo." },
                  { full: "We are", short: "We're", neg: "We aren't", ex: "We're ready.", exPt: "Nós estamos prontos." },
                  { full: "They are", short: "They're", neg: "They aren't", ex: "They're Brazilian.", exPt: "Eles são brasileiros." },
                ].map((row, i) => (
                  <div key={i} style={{
                    display: "grid", gridTemplateColumns: "1.2fr 1fr 1.2fr 2fr",
                    gap: "12px", padding: "12px 16px", borderRadius: "10px",
                    background: i % 2 === 0 ? "#FDFAF4" : "#fff",
                    fontFamily: "'Literata', serif", fontSize: "16px",
                    alignItems: "center",
                  }}>
                    <span style={{ color: "#999" }}>{row.full}</span>
                    <span style={{ color: "#D4A04A", fontWeight: 700 }}>{row.short}</span>
                    <span style={{ color: "#C75B3F", fontWeight: 600 }}>{row.neg}</span>
                    <div>
                      <div style={{ color: "#444" }}>{row.ex}</div>
                      <div style={{ color: "#aaa", fontSize: "13px", fontStyle: "italic" }}>{row.exPt}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div style={{
              padding: "22px", background: "rgba(212,160,74,0.06)", borderRadius: "16px",
              border: "1px solid rgba(212,160,74,0.12)", marginBottom: "20px",
            }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "20px" }}>⚠️</span>
                <div style={{ fontFamily: "'Literata', serif", fontSize: "16px", lineHeight: 1.75, color: "#555" }}>
                  <strong>Cuidado!</strong><br />
                  ❌ <strong>"I amn't"</strong> → não existe! Use sempre <strong>"I'm not"</strong>.<br />
                  ❌ <strong>"it's"</strong> (it is) ≠ <strong>"its"</strong> (possessivo). Erro muito comum!<br />
                  ❌ <strong>"they're"</strong> (they are) ≠ <strong>"their"</strong> (deles) ≠ <strong>"there"</strong> (lá).
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div style={{
              padding: "28px", background: "#fff", borderRadius: "20px",
              boxShadow: "0 3px 16px rgba(0,0,0,0.04)",
            }}>
              <h3 style={{ fontFamily: "'Literata', serif", fontSize: "22px", marginBottom: "6px", textAlign: "center" }}>
                Explorador Interativo de Conjugação
              </h3>
              <p style={{ textAlign: "center", fontSize: "13px", color: "#999", marginBottom: "8px" }}>
                Clique em um pronome para ver todas as formas
              </p>
              <InteractiveConjugation />
            </div>
          </FadeIn>
        </section>

        {/* === ARTIGOS === */}
        <section id="artigos" style={{ paddingBottom: "60px" }}>
          <FadeIn>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
              <div style={{
                width: "42px", height: "42px", borderRadius: "12px",
                background: "linear-gradient(135deg, #FF7043, #FF8A65)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: "18px", fontWeight: 700,
              }}>A</div>
              <h2 style={{ fontFamily: "'Literata', serif", fontSize: "34px", fontWeight: 700 }}>Artigos: A, An, The</h2>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div style={{
              padding: "30px", background: "#fff", borderRadius: "20px",
              boxShadow: "0 3px 16px rgba(0,0,0,0.04)", marginBottom: "20px",
            }}>
              <p style={{ fontFamily: "'Literata', serif", fontSize: "18px", lineHeight: 1.85, color: "#444", marginBottom: "24px" }}>
                Os artigos acompanham os substantivos indicando se estamos falando de algo genérico ou específico. Eles são divididos em <strong>Indefinidos (Um/Uma)</strong> e <strong>Definidos (O/A/Os/As)</strong>.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div>
                  <h3 style={{ fontFamily: "'Literata', serif", fontSize: "20px", color: "#E64A19", marginBottom: "12px" }}>A vs An (Artigos Indefinidos)</h3>
                  <p style={{ fontSize: "15px", color: "#555", marginBottom: "12px" }}>Significam "um" ou "uma". A regra depende do <strong>SOM</strong> da letra seguinte, não apenas da escrita.</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                    <div style={{ padding: "16px", background: "#FBE9E7", borderRadius: "12px", border: "1px solid #FFCCBC" }}>
                      <div style={{ fontWeight: 700, fontSize: "20px", color: "#BF360C", marginBottom: "8px" }}>A</div>
                      <div style={{ fontSize: "14px", color: "#D84315", marginBottom: "8px" }}>Antes de som de CONSOSANTE</div>
                      <div style={{ fontFamily: "'Literata', serif", fontSize: "16px", lineHeight: 1.6 }}>
                        • <strong>A</strong> car (um carro)<br />
                        • <strong>A</strong> dog (um cachorro)<br />
                        • <strong>A</strong> university (<span style={{ opacity: 0.7 }}>som de "yoo"</span>)
                      </div>
                    </div>
                    <div style={{ padding: "16px", background: "#E8F5E9", borderRadius: "12px", border: "1px solid #C8E6C9" }}>
                      <div style={{ fontWeight: 700, fontSize: "20px", color: "#2E7D32", marginBottom: "8px" }}>An</div>
                      <div style={{ fontSize: "14px", color: "#388E3C", marginBottom: "8px" }}>Antes de som de VOGAL</div>
                      <div style={{ fontFamily: "'Literata', serif", fontSize: "16px", lineHeight: 1.6 }}>
                        • <strong>An</strong> apple (uma maçã)<br />
                        • <strong>An</strong> elephant (um elefante)<br />
                        • <strong>An</strong> hour (<span style={{ opacity: 0.7 }}>o 'h' é mudo</span>)
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontFamily: "'Literata', serif", fontSize: "20px", color: "#1976D2", marginBottom: "12px" }}>The (Artigo Definido)</h3>
                  <p style={{ fontSize: "15px", color: "#555", marginBottom: "12px" }}>Significa "o, a, os, as". Usado para coisas <strong>específicas</strong> e coisas <strong>únicas no mundo</strong>.</p>
                  <div style={{ padding: "16px", background: "#E3F2FD", borderRadius: "12px", border: "1px solid #BBDEFB" }}>
                    <div style={{ fontFamily: "'Literata', serif", fontSize: "16px", lineHeight: 1.8 }}>
                      • Específico: Give me <strong>the</strong> book. <span style={{ opacity: 0.6 }}>(o livro que nós conhecemos)</span><br />
                      • Único: <strong>The</strong> sun is hot. <span style={{ opacity: 0.6 }}>(só existe um sol)</span><br />
                      • Plural: <strong>The</strong> cars are new. <span style={{ opacity: 0.6 }}>(os carros específicos)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* === PLURAIS === */}
        <section id="plurais" style={{ paddingBottom: "60px" }}>
          <FadeIn>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
              <div style={{
                width: "42px", height: "42px", borderRadius: "12px",
                background: "linear-gradient(135deg, #00BCD4, #26C6DA)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: "18px", fontWeight: 700,
              }}>S</div>
              <h2 style={{ fontFamily: "'Literata', serif", fontSize: "34px", fontWeight: 700 }}>Plurals (Os Plurais)</h2>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div style={{
              padding: "30px", background: "#fff", borderRadius: "20px",
              boxShadow: "0 3px 16px rgba(0,0,0,0.04)", marginBottom: "20px",
            }}>
              <p style={{ fontFamily: "'Literata', serif", fontSize: "18px", lineHeight: 1.85, color: "#444", marginBottom: "24px" }}>
                A maioria das palavras em inglês ganha um <strong>-s</strong> no plural (ex: car → cars). Mas existem algumas regras importantes para terminações diferentes e plurais irregulares.
              </p>

              <div style={{ display: "grid", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px", padding: "16px", background: "#F5F5F5", borderRadius: "12px", alignItems: "center" }}>
                  <div style={{ fontWeight: 600, color: "#333", fontSize: "16px" }}>Regra Geral ( +s )</div>
                  <div style={{ fontFamily: "'Literata', serif", fontSize: "16px" }}>book → book<strong>s</strong> | dog → dog<strong>s</strong></div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px", padding: "16px", background: "#E0F7FA", borderRadius: "12px", alignItems: "center", border: "1px solid #B2EBF2" }}>
                  <div style={{ fontWeight: 600, color: "#006064", fontSize: "16px" }}>Terminados em -s, -sh, -ch, -x, -z ( +es )</div>
                  <div style={{ fontFamily: "'Literata', serif", fontSize: "16px", color: "#004D40" }}>bus → bus<strong>es</strong> | box → box<strong>es</strong> | watch → watch<strong>es</strong></div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px", padding: "16px", background: "#FFF8E1", borderRadius: "12px", alignItems: "center", border: "1px solid #FFECB3" }}>
                  <div style={{ fontWeight: 600, color: "#F57F17", fontSize: "16px" }}>Consonante + Y ( Troca -y por -ies )</div>
                  <div style={{ fontFamily: "'Literata', serif", fontSize: "16px", color: "#E65100" }}>city → cit<strong>ies</strong> | baby → bab<strong>ies</strong> <br /> <span style={{ fontSize: "13px", opacity: 0.7 }}>(Vogal+y apenas adiciona S: boy → boys)</span></div>
                </div>

                <div>
                  <h3 style={{ fontFamily: "'Literata', serif", fontSize: "18px", color: "#D32F2F", marginTop: "12px", marginBottom: "12px" }}>⚠️ Plurais Irregulares Comuns</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px" }}>
                    {[
                      { s: "Man (homem)", p: "Men" },
                      { s: "Woman (mulher)", p: "Women" },
                      { s: "Child (criança)", p: "Children" },
                      { s: "Person (pessoa)", p: "People" },
                      { s: "Tooth (dente)", p: "Teeth" },
                      { s: "Foot (pé)", p: "Feet" },
                    ].map((irr, idx) => (
                      <div key={idx} style={{ padding: "12px", background: "#FFEBEE", borderRadius: "10px", textAlign: "center", border: "1px solid #FFCDD2" }}>
                        <div style={{ fontSize: "13px", color: "#C62828", marginBottom: "4px" }}>{irr.s}</div>
                        <div style={{ fontFamily: "'Literata', serif", fontSize: "18px", fontWeight: 600, color: "#B71C1C" }}>{irr.p}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* === PRÁTICA: NOMES E PROFISSÕES === */}
        <section id="pratica" style={{ paddingBottom: "60px" }}>
          <FadeIn>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
              <div style={{
                width: "42px", height: "42px", borderRadius: "12px",
                background: "linear-gradient(135deg, #26A69A, #4DB6AC)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: "18px",
              }}>💼</div>
              <h2 style={{ fontFamily: "'Literata', serif", fontSize: "34px", fontWeight: 700 }}>Nomes e Profissões</h2>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div style={{
              padding: "30px", background: "#fff", borderRadius: "20px",
              boxShadow: "0 3px 16px rgba(0,0,0,0.04)", marginBottom: "20px",
            }}>
              <p style={{ fontFamily: "'Literata', serif", fontSize: "18px", lineHeight: 1.85, color: "#444", marginBottom: "24px" }}>
                Um dos usos mais comuns do "to be" é para se <strong>apresentar</strong> e falar sobre <strong>profissões</strong> e <strong>nomes</strong>.
                Veja os exemplos abaixo — <strong>toque nos cards</strong> para ver a tradução!
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
                {professionExamples.map((ex, i) => (
                  <FlipCard key={i} front={<span>{ex.icon} {ex.en}</span>} back={<span>🇧🇷 {ex.pt}</span>} />
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div style={{
              padding: "28px", background: "linear-gradient(145deg, #1C2637, #2A3749)",
              borderRadius: "20px", color: "#EDE4D3", marginBottom: "20px",
            }}>
              <div style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", opacity: 0.4, marginBottom: "16px" }}>
                📝 Padrões Comuns do Dia a Dia
              </div>
              <div style={{ fontFamily: "'Literata', serif", fontSize: "17px", lineHeight: 2.1 }}>
                <span style={{ color: "#D4A04A", fontWeight: 600 }}>My name is</span> + nome → "My name is Jaime." <span style={{ opacity: 0.5 }}>→ Meu nome é Jaime.</span><br />
                <span style={{ color: "#D4A04A", fontWeight: 600 }}>I am</span> + profissão → "I am a software architect." <span style={{ opacity: 0.5 }}>→ Eu sou arquiteto de software.</span><br />
                <span style={{ color: "#D4A04A", fontWeight: 600 }}>I am from</span> + lugar → "I am from Brazil." <span style={{ opacity: 0.5 }}>→ Eu sou do Brasil.</span><br />
                <span style={{ color: "#D4A04A", fontWeight: 600 }}>I am</span> + idade → "I am 30 years old." <span style={{ opacity: 0.5 }}>→ Eu tenho 30 anos.</span><br />
                <span style={{ color: "#D4A04A", fontWeight: 600 }}>I am</span> + adjetivo → "I am married." <span style={{ opacity: 0.5 }}>→ Eu sou casado.</span>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.25}>
            <div style={{
              padding: "22px", background: "rgba(38,166,154,0.06)", borderRadius: "16px",
              border: "1px solid rgba(38,166,154,0.12)", marginBottom: "20px",
            }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "20px" }}>🇧🇷</span>
                <div style={{ fontFamily: "'Literata', serif", fontSize: "16px", lineHeight: 1.75, color: "#555" }}>
                  <strong>Pegadinha para brasileiros:</strong> Em inglês, idade usa "to be" (I <strong>am</strong> 30),
                  mas em português usamos "ter" (Eu <strong>tenho</strong> 30 anos). Não diga "I have 30 years"!
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontFamily: "'Literata', serif", fontSize: "22px", marginBottom: "14px" }}>
                ✏️ Exercício — Complete as frases
              </h3>
              <FillBlank sentence="She ___ a teacher." answer="is" hint="am/is/are" />
              <FillBlank sentence="I ___ from Brazil." answer="am" hint="am/is/are" />
              <FillBlank sentence="They ___ engineers." answer="are" hint="am/is/are" />
              <FillBlank sentence="My name ___ Maria." answer="is" hint="am/is/are" />
              <FillBlank sentence="We ___ not late." answer="are" hint="am/is/are" />
              <FillBlank sentence="___ you a developer?" answer="Are" hint="Am/Is/Are" />
              <FillBlank sentence="He ___ married." answer="is" hint="am/is/are" />
              <FillBlank sentence="It ___ a good day." answer="is" hint="am/is/are" />
            </div>
          </FadeIn>
        </section>

        {/* === PRONOMES === */}
        <section id="pronomes" style={{ paddingBottom: "60px" }}>
          <FadeIn>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
              <div style={{
                width: "42px", height: "42px", borderRadius: "12px",
                background: "linear-gradient(135deg, #8E24AA, #AB47BC)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: "18px",
              }}>👥</div>
              <h2 style={{ fontFamily: "'Literata', serif", fontSize: "34px", fontWeight: 700 }}>Pronomes & Família</h2>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div style={{
              padding: "30px", background: "#fff", borderRadius: "20px",
              boxShadow: "0 3px 16px rgba(0,0,0,0.04)", marginBottom: "20px",
            }}>
              <p style={{ fontFamily: "'Literata', serif", fontSize: "18px", lineHeight: 1.85, color: "#444", marginBottom: "24px" }}>
                Os pronomes substituem os nomes e indicam posse ou posição. Vamos estudar três tipos importantes:
                <strong> Pessoais</strong> (quem faz a ação), <strong>Possessivos</strong> (de quem é) e
                <strong> Demonstrativos</strong> (onde está).
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div>
                  <h3 style={{ fontFamily: "'Literata', serif", fontSize: "20px", color: "#8E24AA", marginBottom: "12px" }}>1. Pronomes Pessoais, Possessivos & Objeto</h3>
                  <p style={{ fontSize: "16px", color: "#444", marginBottom: "20px", lineHeight: 1.6 }}>
                    Entender a diferença entre esses três tipos é fundamental para montar frases corretas em inglês. Veja como cada um funciona:
                  </p>

                  {/* Detalhamento por Tipo */}
                  <div style={{ display: "grid", gap: "16px", marginBottom: "24px" }}>
                    <div style={{ padding: "20px", background: "#F3E5F5", borderRadius: "14px", borderLeft: "4px solid #8E24AA" }}>
                      <div style={{ fontSize: "18px", fontWeight: 700, color: "#4A148C", marginBottom: "8px" }}>Sujeito (Subject Pronouns)</div>
                      <div style={{ fontSize: "15px", color: "#555", marginBottom: "8px" }}>👉 <em>Quem pratica a ação.</em> Vêm <strong>antes</strong> do verbo.</div>
                      <div style={{ fontFamily: "'Literata', serif", fontSize: "16px", color: "#4A148C" }}>
                        <strong style={{ background: "rgba(142, 36, 170, 0.2)", padding: "2px 6px", borderRadius: "4px" }}>I</strong> work here. (<strong>Eu</strong> trabalho aqui.)<br />
                        <strong style={{ background: "rgba(142, 36, 170, 0.2)", padding: "2px 6px", borderRadius: "4px" }}>She</strong> is my friend. (<strong>Ela</strong> é minha amiga.)
                      </div>
                    </div>

                    <div style={{ padding: "20px", background: "#E8EAF6", borderRadius: "14px", borderLeft: "4px solid #3F51B5" }}>
                      <div style={{ fontSize: "18px", fontWeight: 700, color: "#1A237E", marginBottom: "8px" }}>Possessivo (Possessive Adjectives)</div>
                      <div style={{ fontSize: "15px", color: "#555", marginBottom: "8px" }}>👉 <em>De quem é algo.</em> Vêm <strong>sempre antes de um substantivo</strong> (coisa/pessoa).</div>
                      <div style={{ fontFamily: "'Literata', serif", fontSize: "16px", color: "#1A237E" }}>
                        This is <strong style={{ background: "rgba(63, 81, 181, 0.2)", padding: "2px 6px", borderRadius: "4px" }}>my</strong> car. (Este é o <strong>meu</strong> carro.)<br />
                        Where is <strong style={{ background: "rgba(63, 81, 181, 0.2)", padding: "2px 6px", borderRadius: "4px" }}>his</strong> book? (Onde está o livro <strong>dele</strong>?)
                      </div>
                    </div>

                    <div style={{ padding: "20px", background: "#E0F2F1", borderRadius: "14px", borderLeft: "4px solid #009688" }}>
                      <div style={{ fontSize: "18px", fontWeight: 700, color: "#004D40", marginBottom: "8px" }}>Objeto (Object Pronouns)</div>
                      <div style={{ fontSize: "15px", color: "#555", marginBottom: "8px" }}>👉 <em>Quem recebe a ação.</em> Vêm <strong>depois</strong> do verbo ou de preposições (to, with, for). <br />⚠️ <em>Brasileiros erram muito aqui! Dizer "Call she" está errado. O certo é "Call her".</em></div>
                      <div style={{ fontFamily: "'Literata', serif", fontSize: "16px", color: "#004D40" }}>
                        I love <strong style={{ background: "rgba(0, 150, 136, 0.2)", padding: "2px 6px", borderRadius: "4px" }}>her</strong>. (Eu <strong>a</strong> amo / Eu amo <strong>ela</strong>.)<br />
                        Talk to <strong style={{ background: "rgba(0, 150, 136, 0.2)", padding: "2px 6px", borderRadius: "4px" }}>them</strong>. (Fale com <strong>eles</strong>.)
                      </div>
                    </div>
                  </div>

                  {/* Tabela Comparativa */}
                  <div style={{ overflowX: "auto", background: "#fff", borderRadius: "12px", border: "1px solid #eee", padding: "16px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#999", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "1px" }}>Tabela de Referência</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Literata', serif", fontSize: "15px", textAlign: "left" }}>
                      <thead>
                        <tr style={{ color: "#444", borderBottom: "2px solid #ddd" }}>
                          <th style={{ padding: "12px 10px" }}>Pessoa (PT)</th>
                          <th style={{ padding: "12px 10px", color: "#8E24AA" }}>Sujeito (Antes do Verbo)</th>
                          <th style={{ padding: "12px 10px", color: "#3F51B5" }}>Possessivo (Antes de Coisas)</th>
                          <th style={{ padding: "12px 10px", color: "#009688" }}>Objeto (Depois do Verbo/Prep)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { pt: "Eu", s: "I", p: "My (meu/minha)", o: "Me (me/mim)" },
                          { pt: "Você / Vocês", s: "You", p: "Your (seu/sua)", o: "You (te/ti)" },
                          { pt: "Ele", s: "He", p: "His (dele)", o: "Him (o/ele)" },
                          { pt: "Ela", s: "She", p: "Her (dela)", o: "Her (a/ela)" },
                          { pt: "Ele/Ela (coisas)", s: "It", p: "Its (dele/dela)", o: "It (o/a)" },
                          { pt: "Nós", s: "We", p: "Our (nosso/nossa)", o: "Us (nos)" },
                          { pt: "Eles / Elas", s: "They", p: "Their (deles/delas)", o: "Them (os/as/eles/elas)" },
                        ].map((row, idx) => (
                          <tr key={idx} style={{ borderBottom: "1px solid #f5f5f5" }}>
                            <td style={{ padding: "12px 10px", color: "#777", fontSize: "13px" }}>{row.pt}</td>
                            <td style={{ padding: "12px 10px", fontWeight: 600 }}>{row.s}</td>
                            <td style={{ padding: "12px 10px" }}>{row.p}</td>
                            <td style={{ padding: "12px 10px", fontWeight: 600 }}>{row.o}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontFamily: "'Literata', serif", fontSize: "20px", color: "#00838F", marginBottom: "12px" }}>2. Pronomes Demonstrativos</h3>
                  <InteractiveDemonstratives />
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div style={{
              padding: "28px", background: "linear-gradient(145deg, #1C2637, #2A3749)",
              borderRadius: "20px", color: "#EDE4D3", marginBottom: "20px"
            }}>
              <div style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", opacity: 0.4, marginBottom: "16px" }}>
                👨‍👩‍👧‍👦 Membros da Família
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
                {[
                  { en: "Mother", pt: "Mãe", icon: "👩" },
                  { en: "Father", pt: "Pai", icon: "👨" },
                  { en: "Son", pt: "Filho", icon: "👦" },
                  { en: "Daughter", pt: "Filha", icon: "👧" },
                  { en: "Brother", pt: "Irmão", icon: "👱‍♂️" },
                  { en: "Sister", pt: "Irmã", icon: "👱‍♀️" },
                  { en: "Grandfather", pt: "Avô", icon: "👴" },
                  { en: "Grandmother", pt: "Avó", icon: "👵" },
                  { en: "Parents", pt: "Pais", icon: "👨‍👩‍👦" },
                ].map((member, i) => (
                  <div key={i} style={{ padding: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <div style={{ fontSize: "24px", marginBottom: "4px" }}>{member.icon}</div>
                    <div style={{ fontWeight: 600, color: "#D4A04A" }}>{member.en}</div>
                    <div style={{ fontSize: "12px", opacity: 0.5 }}>{member.pt}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.25}>
            <div style={{
              padding: "28px", background: "#fff", border: "1px solid rgba(0,0,0,0.05)",
              borderRadius: "20px", marginBottom: "20px"
            }}>
              <div style={{ fontSize: "12px", color: "#999", textTransform: "uppercase", marginBottom: "16px" }}>
                � Exemplos Descrevendo a Família
              </div>
              <div style={{ display: "grid", gap: "12px" }}>
                {[
                  { en: "This is my mother. Her name is Sarah.", pt: "Esta é a minha mãe. O nome dela é Sarah." },
                  { en: "That is your father. He is a doctor.", pt: "Aquele é o seu pai. Ele é um médico." },
                  { en: "These are his brothers. They are students.", pt: "Estes são os irmãos dele. Eles são estudantes." },
                  { en: "Those are her sisters. They are young.", pt: "Aquelas são as irmãs dela. Elas são jovens." },
                  { en: "John is our grandfather.", pt: "John é nosso avô." },
                  { en: "My parents are from Brazil.", pt: "Meus pais são do Brasil." },
                ].map((ex, i) => (
                  <div key={i} style={{ fontFamily: "'Literata', serif", fontSize: "17px", lineHeight: 1.6 }}>
                    <span style={{ color: "#1C2637", fontWeight: 600 }}>{ex.en}</span> <br />
                    <span style={{ color: "#777", fontSize: "15px" }}>→ {ex.pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontFamily: "'Literata', serif", fontSize: "22px", marginBottom: "14px" }}>
                ✏️ Exercício — Complete as frases
              </h3>
              <FillBlank sentence="___ is my sister. (Esta)" answer="This" hint="This/That" />
              <FillBlank sentence="Where is ___ book? (seu)" answer="your" hint="your/my" />
              <FillBlank sentence="___ are his cars. (Aqueles)" answer="Those" hint="These/Those" />
              <FillBlank sentence="She loves ___ dog. (dela)" answer="her" hint="her/his" />
            </div>
          </FadeIn>
        </section>

        {/* === QUIZ === */}
        <section id="quiz" style={{ paddingTop: "40px", paddingBottom: "120px" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: "36px" }}>
              <div style={{
                display: "inline-block", padding: "8px 20px", borderRadius: "30px",
                background: "rgba(212,160,74,0.1)", border: "1px solid rgba(212,160,74,0.2)",
                fontSize: "12px", letterSpacing: "2.5px", textTransform: "uppercase",
                color: "#D4A04A", fontWeight: 600, marginBottom: "16px",
              }}>
                Desafio Final
              </div>
              <h2 style={{ fontFamily: "'Literata', serif", fontSize: "40px", fontWeight: 700, marginBottom: "8px" }}>
                Hora do Quiz! 🎯
              </h2>
              <p style={{ fontFamily: "'Literata', serif", fontSize: "17px", color: "#999" }}>
                {quizQuestions.length} questões para testar tudo o que você aprendeu
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div style={{
              padding: "32px", background: "#fff", borderRadius: "22px",
              boxShadow: "0 6px 32px rgba(0,0,0,0.06)",
            }}>
              <Quiz />
            </div>
          </FadeIn>
        </section>

        <div style={{
          textAlign: "center", padding: "40px 0 60px", opacity: 0.3,
          fontFamily: "'Literata', serif", fontSize: "13px",
        }}>
          Semana 1 · Verbo To Be · Gramática do Inglês
        </div>
      </div>
    </div>
  );
}

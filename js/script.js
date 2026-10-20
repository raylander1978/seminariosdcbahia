/* ========= CONFIGURAÇÃO (edite aqui) ========= */
const CONFIG = {
  emailjs: { publicKey: "", serviceId: "", templateId: "" }, // veja README
  endereco: "R. Beta - Santa Helena, Dias d'Ávila - BA, 42850-000",
  mapaEmbedUrl: "https://www.google.com/maps?q=-12.582758415798896%2C-38.33219980224168&t=k&z=17&output=embed",
  mapaLinkUrl: "https://www.google.com/maps/search/?api=1&query=-12.582758415798896%2C-38.33219980224168",
  redes: [],         // ex.: [{ nome: "Instagram", url: "https://instagram.com/..." }]
  autoplayCarrossel: false
};

/* ========= CONTEÚDO EDITÁVEL ========= */
const SLIDES_SOBRE = [
  { icone: "✝", titulo: "Quem somos", texto: "Somos uma instituição de formação teológica e missionária no modelo de internato e comprometida com o ensino das Escrituras, o desenvolvimento do caráter cristão e a preparação de homens e mulheres para o serviço no Reino de Deus.", provisorio: false },
  { icone: "◎", titulo: "Nossa missão", texto: "Nossa missão é recrutar, preparar e enviar homens e mulheres comprometidos com Deus e com a Sua Palavra para anunciar o Evangelho de Jesus Cristo em todas as nações.", citacao: "Ide por todo o mundo, pregai o evangelho a toda criatura.", referencia: "Marcos 16:15", provisorio: false },
  { icone: "◉", titulo: "Nossa visão", texto: "Nossa visão é formar uma geração de missionários que compreenda que o chamado de Deus para anunciar o Evangelho não está restrito a uma profissão, condição financeira ou estrutura de sustento. Cremos que cada cristão pode servir ao Senhor com os dons, as habilidades e os recursos que Ele lhe concedeu.", provisorio: false },
  { icone: "♡", titulo: "Nossos valores", texto: "Cremos firmemente que a Bíblia é a Palavra de Deus, nossa única e suficiente regra de fé e prática, e a autoridade que orienta nossa doutrina, nosso caráter e nossa maneira de viver. Por isso, buscamos fundamentar todo o nosso ensino e ministério nas Escrituras, reconhecendo que a verdadeira formação cristã não se limita ao conhecimento, mas deve produzir transformação de vida.", provisorio: false },
  { icone: "✎", titulo: "A importância da formação teológica", texto: "A formação teológica é fundamental para o desenvolvimento de obreiros comprometidos com a verdade bíblica, firmes na fé e preparados para enfrentar os desafios do ministério. Compreendemos que as igrejas locais desempenham um papel indispensável na formação espiritual dos cristãos e na expansão do Evangelho. Por isso, não nos vemos como substitutos da igreja local, mas como parceiros em sua missão, oferecendo suporte bíblico, teológico e missionário para o preparo de seus obreiros.", provisorio: false }
].map(s => ({ ...s, provisorio: s.provisorio ?? true })); // remova "provisorio" quando os textos forem oficiais

const DIFERENCIAIS = [
  { icone: "📖", titulo: "Aprofundamento bíblico", texto: "Estudo das Escrituras para fortalecer a fé e ampliar o conhecimento da Palavra de Deus." },
  { icone: "🎓", titulo: "Estudo teológico", texto: "Conhecimento teológico para compreender melhor a fé cristã e seus fundamentos." },
  { icone: "🤝", titulo: "Desenvolvimento ministerial", texto: "Preparação para servir à igreja e à comunidade com dedicação e responsabilidade." },
  { icone: "🕊️", titulo: "Conhecimento cristão", texto: "Ensino fundamentado nos princípios cristãos, promovendo fé, sabedoria e compromisso." }
];

/* ========= UTILIDADES ========= */
const $ = (s, el = document) => el.querySelector(s);
const el = (tag, attrs = {}, text) => {
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
  if (text) n.textContent = text;
  return n;
};

/* ========= MENU MOBILE ========= */
function initMenu() {
  const btn = $("#menuToggle"), nav = $("#menuPrincipal");
  const set = open => {
    nav.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open);
    btn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };
  btn.addEventListener("click", () => set(!nav.classList.contains("open")));
  nav.addEventListener("click", e => { if (e.target.closest("a")) set(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") set(false); });
}

/* ========= CARROSSEL ========= */
function initCarousel() {
  const root = $("#carousel"), track = $("#carouselTrack"), dots = $("#carouselDots"), count = $("#carouselCount");
  let i = 0, timer = null;
  SLIDES_SOBRE.forEach((s, n) => {
    const slide = el("article", { class: "slide", role: "group", "aria-roledescription": "slide", "aria-label": `${n + 1} de ${SLIDES_SOBRE.length}` });
    slide.append(el("span", { class: "slide-icon", "aria-hidden": "true" }, s.icone), el("h3", {}, s.titulo), el("p", {}, s.texto));
    if (s.citacao) {
      const quote = el("blockquote");
      quote.append(el("p", {}, `“${s.citacao}”`), el("cite", {}, `— ${s.referencia}`));
      slide.append(quote);
    }
    if (s.provisorio) slide.append(el("span", { class: "tag" }, "[Texto provisório]"));
    track.append(slide);
    const d = el("button", { type: "button", class: "dot", "aria-label": `Ir para o slide ${n + 1}: ${s.titulo}` });
    d.addEventListener("click", () => { stop(); go(n); });
    dots.append(d);
  });
  function go(n) {
    i = (n + SLIDES_SOBRE.length) % SLIDES_SOBRE.length;
    track.style.transform = `translateX(-${i * 100}%)`;
    [...track.children].forEach((s, k) => s.setAttribute("aria-hidden", k !== i));
    [...dots.children].forEach((d, k) => d.setAttribute("aria-current", k === i));
    count.textContent = `Slide ${i + 1} de ${SLIDES_SOBRE.length}`;
  }
  const stop = () => { clearInterval(timer); timer = null; };
  $("#prevSlide").addEventListener("click", () => { stop(); go(i - 1); });
  $("#nextSlide").addEventListener("click", () => { stop(); go(i + 1); });
  root.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") { stop(); go(i - 1); }
    if (e.key === "ArrowRight") { stop(); go(i + 1); }
  });
  let x0 = null;
  root.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
  root.addEventListener("touchend", e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) { stop(); go(i + (dx < 0 ? 1 : -1)); }
    x0 = null;
  });
  if (CONFIG.autoplayCarrossel && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    timer = setInterval(() => go(i + 1), 7000);
  }
  go(0);
}

/* ========= DIFERENCIAIS ========= */
function renderDiferenciais() {
  const box = $("#cardsDiferenciais");
  DIFERENCIAIS.forEach(d => {
    const c = el("article", { class: "card reveal" });
    c.append(el("span", { class: "ico", "aria-hidden": "true" }, d.icone), el("h3", {}, d.titulo), el("p", {}, d.texto));
    box.append(c);
  });
}

/* ========= MAPA ========= */
function initMap() {
  const box = $("#mapBox"), addr = $("#enderecoTexto"), link = $("#mapLink");
  if (CONFIG.endereco) addr.textContent = CONFIG.endereco;
  else addr.textContent = "Endereço a ser informado pelo seminário.";
  if (CONFIG.mapaEmbedUrl) {
    box.textContent = "";
    box.append(el("iframe", { src: CONFIG.mapaEmbedUrl, title: "Mapa com a localização do seminário", loading: "lazy", referrerpolicy: "no-referrer-when-downgrade", allowfullscreen: "" }));
  } else {
    box.append(el("p", {}, "O mapa será exibido aqui quando a localização oficial for configurada."));
  }
  const url = CONFIG.mapaLinkUrl || (CONFIG.endereco ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.endereco) : "");
  if (url) link.href = url;
  else { link.removeAttribute("href"); link.setAttribute("aria-disabled", "true"); link.textContent = "Localização em breve"; }
}

/* ========= FORMULÁRIO ========= */
function initForm() {
  const form = $("#contactForm"), status = $("#formStatus"), btn = $("#enviarBtn");
  const rules = {
    nome: v => v.trim().split(/\s+/).filter(Boolean).length >= 2 ? "" : "Informe seu nome completo.",
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Informe um e-mail válido, como nome@exemplo.com.",
    assunto: v => v.trim().length >= 3 ? "" : "Informe o assunto da mensagem.",
    mensagem: v => v.trim().length >= 10 ? "" : "Escreva uma mensagem com pelo menos 10 caracteres."
  };
  const check = name => {
    const f = form.elements[name], msg = rules[name](f.value);
    $(`#${name}-erro`).textContent = msg;
    f.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  };
  Object.keys(rules).forEach(n => form.elements[n].addEventListener("blur", () => check(n)));
  const setStatus = (t, cls) => { status.textContent = t; status.className = "form-status " + (cls || ""); };
  const loadedAt = Date.now();
  const COOLDOWN = 60000;

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const valid = Object.keys(rules).map(check).every(Boolean);
    if (!valid) { setStatus("Corrija os campos indicados e tente novamente.", "fail"); form.querySelector('[aria-invalid="true"]').focus(); return; }
    if (form.elements.empresa.value) return; // honeypot: robôs
    if (Date.now() - loadedAt < 3000) { setStatus("Aguarde alguns segundos e envie novamente.", "fail"); return; }
    const last = Number(sessionStorage.getItem("sdc_last_send") || 0);
    if (Date.now() - last < COOLDOWN) { setStatus("Você enviou uma mensagem há pouco. Aguarde um minuto para enviar outra.", "fail"); return; }
    const c = CONFIG.emailjs;
    if (!c.publicKey || !c.serviceId || !c.templateId || !window.emailjs) {
      setStatus("O envio ainda não foi configurado. Escreva diretamente para sdcteologia@gmail.com.", "fail"); return;
    }
    btn.disabled = true; setStatus("Enviando…");
    try {
      const res = await emailjs.send(c.serviceId, c.templateId, {
        from_name: form.elements.nome.value.trim(),
        reply_to: form.elements.email.value.trim(),
        subject: form.elements.assunto.value.trim(),
        message: form.elements.mensagem.value.trim(),
        to_email: "sdcteologia@gmail.com"
      }, { publicKey: c.publicKey });
      if (res.status !== 200) throw new Error("status " + res.status);
      sessionStorage.setItem("sdc_last_send", Date.now());
      form.reset(); setStatus("Mensagem enviada com sucesso. Obrigado pelo contato!", "ok");
    } catch (err) {
      console.warn("Falha no envio:", err);
      setStatus("Não foi possível enviar agora. Tente novamente ou escreva para sdcteologia@gmail.com.", "fail");
    } finally { btn.disabled = false; }
  });
}

/* ========= RODAPÉ E ANIMAÇÕES ========= */
function initFooter() {
  $("#ano").textContent = new Date().getFullYear();
  const ul = $("#redesSociais");
  CONFIG.redes.forEach(r => {
    const li = el("li"), a = el("a", { href: r.url, target: "_blank", rel: "noopener noreferrer" }, r.nome);
    li.append(a); ul.append(li);
  });
}
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { items.forEach(i => i.classList.add("in")); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 });
  items.forEach(i => io.observe(i));
}

document.addEventListener("DOMContentLoaded", () => {
  initMenu(); initCarousel(); renderDiferenciais(); initMap(); initForm(); initFooter(); initReveal();
});

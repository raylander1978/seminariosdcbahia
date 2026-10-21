/* ========= CONFIGURAÇÃO (edite aqui) ========= */
const CONFIG = {
  endereco: "R. Beta - Santa Helena, Dias d'Ávila - BA, 42850-000",
  mapaEmbedUrl: "https://www.google.com/maps?q=-12.582758415798896%2C-38.33219980224168&t=k&z=17&output=embed",
  mapaLinkUrl: "https://www.google.com/maps/search/?api=1&query=-12.582758415798896%2C-38.33219980224168",
  autoplayCarrossel: false
};

/* ========= CONTEÚDO EDITÁVEL ========= */
const SLIDES_SOBRE = [
  { icone: "✝", titulo: "Quem somos", texto: "Somos uma instituição de formação teológica e missionária no modelo de internato e comprometida com o ensino das Escrituras, o desenvolvimento do caráter cristão e a preparação de homens e mulheres para o serviço no Reino de Deus.", provisorio: false },
  { icone: "◎", titulo: "Nossa missão", texto: "Nossa missão é recrutar, preparar e enviar homens e mulheres comprometidos com Deus e com a Sua Palavra para anunciar o Evangelho de Jesus Cristo em todas as nações.", citacao: "Ide por todo o mundo, pregai o evangelho a toda criatura.", referencia: "Marcos 16:15", provisorio: false },
  { icone: "◉", titulo: "Nossa visão", texto: "Nossa visão é formar uma geração de missionários que compreenda que o chamado de Deus para anunciar o Evangelho não está restrito a uma profissão, condição financeira ou estrutura de sustento. Cremos que cada cristão pode servir ao Senhor com os dons, as habilidades e os recursos que Ele lhe concedeu.", provisorio: false },
  { icone: "♡", titulo: "Nossos valores", texto: "Cremos firmemente que a Bíblia é a Palavra de Deus, nossa única e suficiente regra de fé e prática, e a autoridade que orienta nossa doutrina, nosso caráter e nossa maneira de viver. Por isso, buscamos fundamentar todo o nosso ensino e ministério nas Escrituras, reconhecendo que a verdadeira formação cristã não se limita ao conhecimento, mas deve produzir transformação de vida.", provisorio: false },
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

/* ========= CARROSSEL DE FOTOS ========= */
function initPhotoCarousel() {
  const root = $("#photoCarousel"), slides = [...root.querySelectorAll(".photo-slide")];
  const dots = [...$("#photoDots").children], toggle = $("#photoToggle");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let current = 0, timer = null, isPlaying = !reducedMotion, isHovered = false, isFocused = false;

  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
      dots[i].setAttribute("aria-current", String(active));
    });
  }
  function stop() {
    clearInterval(timer);
    timer = null;
  }
  function start() {
    stop();
    if (isPlaying && !isHovered && !isFocused) timer = setInterval(() => show(current + 1), 2000);
  }
  function updateToggle() {
    toggle.textContent = isPlaying ? "Pausar" : "Reproduzir";
    toggle.setAttribute("aria-label", isPlaying ? "Pausar apresentação" : "Reproduzir apresentação");
  }

  $("#photoPrev").addEventListener("click", () => { show(current - 1); start(); });
  $("#photoNext").addEventListener("click", () => { show(current + 1); start(); });
  dots.forEach((dot, index) => dot.addEventListener("click", () => { show(index); start(); }));
  toggle.addEventListener("click", () => {
    isPlaying = !isPlaying;
    updateToggle();
    start();
  });
  root.addEventListener("mouseenter", () => { isHovered = true; stop(); });
  root.addEventListener("mouseleave", () => { isHovered = false; start(); });
  root.addEventListener("focusin", () => { isFocused = true; stop(); });
  root.addEventListener("focusout", event => {
    if (!root.contains(event.relatedTarget)) { isFocused = false; start(); }
  });

  updateToggle();
  start();
}

/* ========= CARROSSEL DO INSTAGRAM ========= */
function initInstagramCarousel() {
  const root = $("#instagramCarousel");
  if (!root) return;

  const track = $("#instagramTrack"), posts = [...track.children];
  const count = $("#instagramCount"), toggle = $("#instagramToggle");
  const embedScript = $("#instagramEmbedScript");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let current = 0, timer = null, isPlaying = !reducedMotion, isHovered = false, isFocused = false;

  function visibleCount() {
    if (matchMedia("(max-width: 560px)").matches) return 1;
    if (matchMedia("(max-width: 860px)").matches) return 2;
    return 3;
  }
  function processEmbeds() {
    if (window.instgrm && window.instgrm.Embeds) window.instgrm.Embeds.process();
  }
  function createPostLink(post) {
    return el("a", { href: post.dataset.postUrl, target: "_blank", rel: "noopener noreferrer" }, "Ver publicação no Instagram");
  }
  function renderPosts() {
    const visible = visibleCount();
    posts.forEach((post, index) => {
      const active = index >= current && index < current + visible;
      post.setAttribute("aria-hidden", String(!active));
      post.inert = !active;
      if (active && post.dataset.embedReady !== "true") {
        const embed = el("blockquote", {
          class: "instagram-media",
          "data-instgrm-permalink": post.dataset.postUrl,
          "data-instgrm-version": "14"
        });
        embed.append(createPostLink(post));
        post.replaceChildren(embed);
        post.dataset.embedReady = "true";
      }
    });

    const step = posts[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap);
    track.style.transform = `translateX(-${current * step}px)`;
    count.textContent = `Publicações ${current + 1} a ${current + visible} de ${posts.length}`;
    processEmbeds();
    setTimeout(() => {
      const currentVisible = visibleCount();
      posts.forEach((post, index) => {
        const active = index >= current && index < current + currentVisible;
        if (!active && post.dataset.embedReady === "true") {
          post.replaceChildren(createPostLink(post));
          delete post.dataset.embedReady;
        }
      });
    }, 650);
  }
  function show(index) {
    const maxStart = posts.length - visibleCount();
    current = (index + maxStart + 1) % (maxStart + 1);
    renderPosts();
  }
  function stop() {
    clearInterval(timer);
    timer = null;
  }
  function start() {
    stop();
    if (isPlaying && !isHovered && !isFocused) timer = setInterval(() => show(current + 1), 5000);
  }
  function updateToggle() {
    toggle.textContent = isPlaying ? "Pausar" : "Reproduzir";
    toggle.setAttribute("aria-label", isPlaying ? "Pausar carrossel do Instagram" : "Reproduzir carrossel do Instagram");
  }

  $("#instagramPrev").addEventListener("click", () => { show(current - 1); start(); });
  $("#instagramNext").addEventListener("click", () => { show(current + 1); start(); });
  toggle.addEventListener("click", () => { isPlaying = !isPlaying; updateToggle(); start(); });
  root.addEventListener("mouseenter", () => { isHovered = true; stop(); });
  root.addEventListener("mouseleave", () => { isHovered = false; start(); });
  root.addEventListener("focusin", () => { isFocused = true; stop(); });
  root.addEventListener("focusout", event => {
    if (!root.contains(event.relatedTarget)) { isFocused = false; start(); }
  });
  window.addEventListener("resize", () => show(current), { passive: true });
  if (embedScript) embedScript.addEventListener("load", processEmbeds, { once: true });

  updateToggle();
  renderPosts();
  start();
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

/* ========= RODAPÉ E ANIMAÇÕES ========= */
function initFooter() {
  $("#ano").textContent = new Date().getFullYear();
}
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { items.forEach(i => i.classList.add("in")); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 });
  items.forEach(i => io.observe(i));
}

document.addEventListener("DOMContentLoaded", () => {
  initMenu(); initCarousel(); initPhotoCarousel(); initInstagramCarousel(); renderDiferenciais(); initMap(); initFooter(); initReveal();
});

/* =========================================================
   Davi Oliveira — Gestor de Tráfego
   main.js
   ---------------------------------------------------------
   CONFIGURAÇÃO RÁPIDA: altere apenas o bloco CONFIG abaixo.
   ========================================================= */

const CONFIG = {
  // Número do WhatsApp com código do país, só dígitos.
  whatsapp: '5582996788351',

  // Mensagem padrão dos botões de WhatsApp (fora do formulário).
  msgPadrao: 'Ola Davi! Quero implementar tráfego pago para o meu negócio.',

  // Anexa a origem do visitante (utm_source, fbclid, gclid) na mensagem
  // enviada pelo formulário — assim você sabe de qual anúncio veio o lead.
  rastrearOrigem: true
};

/* ---------------------------------------------------------
   1. Utilitários
   --------------------------------------------------------- */
const $  = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

const linkWhats = (texto) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;

/** Lê os parâmetros de campanha da URL para saber de onde o lead veio. */
function origemDoVisitante() {
  if (!CONFIG.rastrearOrigem) return '';
  const p = new URLSearchParams(location.search);
  const partes = [];
  const src = p.get('utm_source');
  const mid = p.get('utm_medium');
  const cmp = p.get('utm_campaign');
  const cnt = p.get('utm_content');

  if (src) partes.push(src);
  if (mid) partes.push(mid);
  if (cmp) partes.push(cmp);
  if (cnt) partes.push(cnt);
  if (p.get('gclid')) partes.push('google-ads');
  if (p.get('fbclid')) partes.push('meta-ads');

  return partes.length ? partes.join(' / ') : 'acesso direto';
}

/* ---------------------------------------------------------
   2. Ano no rodapé
   --------------------------------------------------------- */
const elAno = $('#year');
if (elAno) elAno.textContent = new Date().getFullYear();

/* ---------------------------------------------------------
   3. Aplica o número configurado em todos os links de WhatsApp
   --------------------------------------------------------- */
$$('[data-wa]').forEach((a) => {
  a.href = linkWhats(CONFIG.msgPadrao);
});

/* ---------------------------------------------------------
   4. Header: sombra ao rolar
   --------------------------------------------------------- */
const header = $('#header');
const onScrollHeader = () => {
  header.classList.toggle('is-stuck', window.scrollY > 8);
};
onScrollHeader();
window.addEventListener('scroll', onScrollHeader, { passive: true });

/* ---------------------------------------------------------
   5. Menu mobile
   --------------------------------------------------------- */
const burger = $('#burger');
const nav = $('#nav');

if (burger && nav) {
  const fecharMenu = () => {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menu');
  };

  burger.addEventListener('click', () => {
    const aberto = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(aberto));
    burger.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  });

  $$('a', nav).forEach((a) => a.addEventListener('click', fecharMenu));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharMenu();
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !burger.contains(e.target)) fecharMenu();
  });
}

/* ---------------------------------------------------------
   6. Revelar seções ao rolar
   --------------------------------------------------------- */
const alvosReveal = $$('.reveal');

if ('IntersectionObserver' in window) {
  const obsReveal = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          obsReveal.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  alvosReveal.forEach((el) => obsReveal.observe(el));
} else {
  alvosReveal.forEach((el) => el.classList.add('is-in'));
}

/* ---------------------------------------------------------
   7. Contadores animados
   --------------------------------------------------------- */
function animarContador(el) {
  const alvo = parseInt(el.dataset.to, 10) || 0;
  const prefixo = el.dataset.prefix || '';
  const sufixo = el.dataset.suffix || '';
  const duracao = 1500;
  const inicio = performance.now();

  const passo = (agora) => {
    const t = Math.min((agora - inicio) / duracao, 1);
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
    el.textContent = prefixo + Math.round(alvo * eased) + sufixo;
    if (t < 1) requestAnimationFrame(passo);
  };

  requestAnimationFrame(passo);
}

const contadores = $$('.count');
const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (semAnimacao || !('IntersectionObserver' in window)) {
  contadores.forEach((el) => {
    el.textContent = (el.dataset.prefix || '') + el.dataset.to + (el.dataset.suffix || '');
  });
} else {
  const obsCount = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          animarContador(e.target);
          obsCount.unobserve(e.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  contadores.forEach((el) => obsCount.observe(el));
}

/* ---------------------------------------------------------
   8. Link ativo na navegação
   --------------------------------------------------------- */
const linksNav = $$('#nav a[href^="#"]');
const secoes = linksNav
  .map((a) => document.getElementById(a.getAttribute('href').slice(1)))
  .filter(Boolean);

if (secoes.length && 'IntersectionObserver' in window) {
  const obsNav = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        linksNav.forEach((a) =>
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id)
        );
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  secoes.forEach((s) => obsNav.observe(s));
}

/* ---------------------------------------------------------
   9. FAQ: abre um por vez
   --------------------------------------------------------- */
const itensFaq = $$('.faq__item');
itensFaq.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    itensFaq.forEach((outro) => {
      if (outro !== item) outro.open = false;
    });
  });
});

/* ---------------------------------------------------------
   10. Esconde o botão flutuante quando o formulário está visível
   --------------------------------------------------------- */
const waFloat = $('#wa-float');
const secDiagnostico = $('#diagnostico');

if (waFloat && secDiagnostico && 'IntersectionObserver' in window) {
  const obsWa = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => waFloat.classList.toggle('is-hidden', e.isIntersecting));
    },
    { threshold: 0.25 }
  );
  obsWa.observe(secDiagnostico);
}

/* ---------------------------------------------------------
   11. Máscara de telefone
   --------------------------------------------------------- */
const campoWhats = $('#f-whats');

if (campoWhats) {
  campoWhats.addEventListener('input', () => {
    const d = campoWhats.value.replace(/\D/g, '').slice(0, 11);
    let saida = d;

    if (d.length > 2 && d.length <= 6) {
      saida = `(${d.slice(0, 2)}) ${d.slice(2)}`;
    } else if (d.length > 6 && d.length <= 10) {
      saida = `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    } else if (d.length > 10) {
      saida = `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    }

    campoWhats.value = saida;
  });
}

/* ---------------------------------------------------------
   12. Envio do formulário → WhatsApp
   --------------------------------------------------------- */
const form = $('#lead-form');

if (form) {
  const erroEl = $('#form-error');

  const marcarErro = (campo, temErro) => {
    const wrapper = campo.closest('.field');
    if (wrapper) wrapper.classList.toggle('has-error', temErro);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Armadilha de spam: se o campo oculto foi preenchido, ignora o envio.
    if (form.site.value.trim() !== '') return;

    const obrigatorios = ['nome', 'whatsapp', 'empresa', 'segmento', 'faturamento', 'verba'];
    let primeiroInvalido = null;

    obrigatorios.forEach((nome) => {
      const campo = form.elements[nome];
      const vazio = !campo.value.trim();
      marcarErro(campo, vazio);
      if (vazio && !primeiroInvalido) primeiroInvalido = campo;
    });

    // Valida se o telefone tem DDD + número
    const digitosTel = form.elements.whatsapp.value.replace(/\D/g, '');
    const telInvalido = digitosTel.length < 10;
    if (telInvalido) {
      marcarErro(form.elements.whatsapp, true);
      if (!primeiroInvalido) primeiroInvalido = form.elements.whatsapp;
    }

    if (primeiroInvalido) {
      erroEl.textContent = telInvalido && digitosTel.length > 0
        ? 'Confira o WhatsApp: informe DDD e número completo.'
        : 'Preencha os campos destacados para continuar.';
      erroEl.hidden = false;
      primeiroInvalido.focus();
      return;
    }

    erroEl.hidden = true;

    const d = Object.fromEntries(new FormData(form).entries());

    const linhas = [
      'Olá Davi! Quero minha análise gratuita.',
      '',
      `*Nome:* ${d.nome}`,
      `*WhatsApp:* ${d.whatsapp}`,
      `*Empresa:* ${d.empresa}`,
      `*Segmento:* ${d.segmento}`,
      `*Faturamento mensal:* ${d.faturamento}`,
      `*Verba para anúncios:* ${d.verba}`
    ];

    if (d.mensagem && d.mensagem.trim()) {
      linhas.push('', `*Principal dificuldade:* ${d.mensagem.trim()}`);
    }

    const origem = origemDoVisitante();
    if (origem) linhas.push('', `_Origem: ${origem}_`);

    // Abre o WhatsApp já com o resumo preenchido.
    window.open(linkWhats(linhas.join('\n')), '_blank', 'noopener');

    // Estado de sucesso.
    form.classList.add('is-sent');
    form.innerHTML = `
      <div class="form__done">
        <span class="tick" aria-hidden="true">&#10003;</span>
        <h3>Tudo certo, ${d.nome.split(' ')[0]}!</h3>
        <p>Abri o WhatsApp com o seu resumo já preenchido. É só tocar em enviar que eu respondo.</p>
        <a class="btn btn--gold" href="${linkWhats(linhas.join('\n'))}" target="_blank" rel="noopener">
          Não abriu? Clique aqui <span aria-hidden="true">&rarr;</span>
        </a>
      </div>`;
  });

  // Remove o destaque de erro assim que o usuário corrige
  $$('input, select, textarea', form).forEach((campo) => {
    campo.addEventListener('input', () => marcarErro(campo, false));
    campo.addEventListener('change', () => marcarErro(campo, false));
  });
}
